import { NextResponse } from 'next/server';

// ==========================================
// OPTIMIZED CACHE SETTINGS
// ==========================================
interface OEmbedData {
  html: string;
  author_name: string;
  width: number;
  height?: number | null;
  type: string;
  cache_age: string;
  provider_name: string;
  provider_url: string;
  version: string;
}

const timelineCache = new Map<string, { data: string[]; timestamp: number }>();
const TIMELINE_CACHE_DURATION = 5 * 60 * 1000; // 5 นาที (ให้ refresh บ่อยขึ้น แต่ไม่ติด rate limit)

const oembedCache = new Map<string, { data: OEmbedData; timestamp: number }>();
const OEMBED_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ชั่วโมง (embed HTML ไม่ค่อยเปลี่ยน)

// 🔄 PERSISTENT FALLBACK CACHE (ไม่หมดอายุ - ใช้เมื่อติด rate limit)
// จะเก็บ tweets ล่าสุดที่ดึงได้จาก API และใช้เป็น fallback เมื่อติด rate limit
const persistentFallbackCache = new Map<string, string[]>();

// ==========================================
// HARDCODED TWEET URLs (MOCKUP/FALLBACK)
// ==========================================
// 🎯 STRATEGY: Always show tweets! API first, then fallback to latest known tweets
// 🔧 รับประกันว่าผู้ใช้จะเห็น tweets เสมอ - ไม่มี "Coming Soon" อีกต่อไป!

// ✅ GUARANTEED FALLBACK URLs (อัปเดต: Nov 17, 2025)
// URLs เหล่านี้จะถูกใช้เมื่อ:
// 1. API ติด rate limit
// 2. TWITTER_BEARER_TOKEN ไม่ได้ตั้งค่า
// 3. เกิด error จาก Twitter API
const FALLBACK_TWEET_URLS: string[] = [
  'https://x.com/gatherbeyond/status/1858055776051359790',
  'https://x.com/gatherbeyond/status/1858054646477660267',
];

// ==========================================
// 📦 FETCH OEMBED WITH BETTER ERROR HANDLING
// ==========================================
async function fetchOEmbed(url: string, retries = 3): Promise<OEmbedData | null> {
  const cached = oembedCache.get(url);
  if (cached && Date.now() - cached.timestamp < OEMBED_CACHE_DURATION) {
    console.log('💾 [oEmbed] Using cached data (24-hour cache)');
    return cached.data;
  }

  const twitterUrl = url.replace('x.com', 'twitter.com');
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(twitterUrl)}&theme=light&dnt=true&omit_script=true`;
      
      console.log(`🔄 [oEmbed] Attempt ${attempt}/${retries}`);
      console.log(`   Tweet URL: ${twitterUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(oembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log(`   Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        console.error(`❌ [oEmbed] HTTP ${response.status}:`, errorBody.substring(0, 200));
        
        if (attempt === retries && cached) {
          console.log('💾 [oEmbed] Using expired cache');
          return cached.data;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        continue;
      }
      
      const responseText = await response.text();
      console.log(`   Body size: ${responseText.length} bytes`);
      
      let data: OEmbedData;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error('❌ [oEmbed] JSON parse failed');
        console.error('   Response preview:', responseText.substring(0, 300));
        if (attempt === retries && cached) return cached.data;
        continue;
      }
      
      if (!data.html || data.html.length < 50) {
        console.warn('⚠️ [oEmbed] Invalid/empty HTML in response');
        console.warn('   Fields:', Object.keys(data));
        console.warn('   HTML length:', data.html?.length || 0);
        if (attempt === retries && cached) return cached.data;
        continue;
      }
      
      console.log('✅ [oEmbed] Success!');
      console.log('   Author:', data.author_name);
      console.log('   HTML length:', data.html.length);
      
      oembedCache.set(url, { data, timestamp: Date.now() });
      return data;
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ [oEmbed] Error (attempt ${attempt}/${retries}):`, errorMsg);
      
      if (attempt === retries && cached) {
        console.log('💾 [oEmbed] Using expired cache due to error');
        return cached.data;
      }
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
  
  console.error('❌ [oEmbed] All attempts failed, returning null');
  return null;
}

// ==========================================
// 🐦 FETCH USER TIMELINE (5 MIN CACHE)
// ==========================================
async function fetchUserTimeline(username: string) {
  console.log('🔄 [Timeline] Attempting to fetch from Twitter API...');

  const cacheKey = `timeline_${username}`;
  const cached = timelineCache.get(cacheKey);
  
  // ถ้ามี cache ที่ยังไม่หมดอายุ ใช้เลย
  if (cached && Date.now() - cached.timestamp < TIMELINE_CACHE_DURATION) {
    const minutesRemaining = Math.ceil((TIMELINE_CACHE_DURATION - (Date.now() - cached.timestamp)) / 1000 / 60);
    console.log(`💾 [Timeline] Using cached data (${minutesRemaining} minutes remaining)`);
    return { urls: cached.data, source: 'cache' };
  }

  const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  
  if (!TWITTER_BEARER_TOKEN) {
    console.error('❌ [Timeline] TWITTER_BEARER_TOKEN not found');
    
    // ใช้ persistent fallback ถ้ามี
    const fallback = persistentFallbackCache.get(cacheKey);
    if (fallback && fallback.length > 0) {
      console.log('💾 [Timeline] Using persistent fallback (no token)');
      console.log(`   📦 Fallback tweets: ${fallback.length}`);
      return { urls: fallback, source: 'fallback_no_token' };
    }
    
    // ใช้ initial fallback ถ้าไม่มี persistent
    if (FALLBACK_TWEET_URLS.length > 0) {
      console.log('💾 [Timeline] Using initial fallback URLs');
      return { urls: FALLBACK_TWEET_URLS, source: 'initial_fallback' };
    }
    
    console.log('⚠️ [Timeline] No tweets available');
    return { urls: [], source: 'no_token' };
  }

  console.log('✅ [Timeline] Bearer token found, length:', TWITTER_BEARER_TOKEN.length);

  try {
    console.log(`🔍 [Timeline] Step 1: Fetching user ID for @${username}`);
    
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: { 
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'User-Agent': 'v2TweetLookupJS'
        },
      }
    );

    console.log(`   Response: ${userResponse.status} ${userResponse.statusText}`);

    if (!userResponse.ok) {
      const errorBody = await userResponse.text().catch(() => 'Unknown');
      
      if (userResponse.status === 429) {
        console.error('⚠️ [Timeline] Rate limit hit (429)');
        console.error('   Twitter API Free Plan: 1 request per 15 minutes');
        console.error('   🎭 Using fallback tweets...');
        
        // ใช้ persistent fallback ก่อน (tweets ล่าสุดที่เคยดึงมาได้)
        const fallback = persistentFallbackCache.get(cacheKey);
        if (fallback && fallback.length > 0) {
          console.log(`✅ [Timeline] Using persistent fallback (${fallback.length} tweets)`);
          fallback.forEach((url: string, idx: number) => {
            console.log(`   ${idx + 1}. ${url}`);
          });
          
          // Cache เพื่อไม่ให้เรียก API บ่อย
          timelineCache.set(cacheKey, {
            data: fallback,
            timestamp: Date.now()
          });
          
          return { urls: fallback, source: 'fallback_rate_limit' };
        }
        
        // ถ้าไม่มี persistent fallback ใช้ initial fallback
        if (FALLBACK_TWEET_URLS.length > 0) {
          console.log(`✅ [Timeline] Using initial fallback (${FALLBACK_TWEET_URLS.length} tweets)`);
          
          timelineCache.set(cacheKey, {
            data: FALLBACK_TWEET_URLS,
            timestamp: Date.now()
          });
          
          return { urls: FALLBACK_TWEET_URLS, source: 'initial_fallback_rate_limit' };
        }
      } else {
        console.error('❌ [Timeline] User lookup failed');
        console.error('   Status:', userResponse.status);
        console.error('   Body:', errorBody.substring(0, 200));
      }
      
      // ใช้ expired cache ถ้ามี
      if (cached) {
        console.log('💾 [Timeline] Using expired cache');
        return { urls: cached.data, source: 'expired_cache' };
      }
      
      // ใช้ persistent fallback
      const fallback = persistentFallbackCache.get(cacheKey);
      if (fallback && fallback.length > 0) {
        console.log('💾 [Timeline] Using persistent fallback');
        return { urls: fallback, source: 'fallback_error' };
      }
      
      return { urls: [], source: 'api_error' };
    }
    
    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      console.error('❌ [Timeline] User ID not found in response');
      
      const fallback = persistentFallbackCache.get(cacheKey);
      if (fallback && fallback.length > 0) {
        return { urls: fallback, source: 'fallback_no_user_id' };
      }
      
      if (cached) return { urls: cached.data, source: 'expired_cache' };
      return { urls: [], source: 'no_user_id' };
    }

    console.log(`✅ [Timeline] User ID: ${userId}`);
    console.log(`🔍 [Timeline] Step 2: Fetching latest 5 tweets (will use first 2)`);

    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&exclude=retweets,replies&tweet.fields=created_at`,
      {
        headers: { 
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'User-Agent': 'v2TweetLookupJS'
        },
      }
    );

    console.log(`   Response: ${tweetsResponse.status} ${tweetsResponse.statusText}`);

    if (!tweetsResponse.ok) {
      const errorBody = await tweetsResponse.text().catch(() => 'Unknown');
      
      if (tweetsResponse.status === 429) {
        console.error('⚠️ [Timeline] Rate limit hit on tweets endpoint');
        console.error('   🎭 Using fallback tweets...');
        
        // ใช้ persistent fallback
        const fallback = persistentFallbackCache.get(cacheKey);
        if (fallback && fallback.length > 0) {
          console.log(`✅ [Timeline] Using persistent fallback (${fallback.length} tweets)`);
          
          timelineCache.set(cacheKey, {
            data: fallback,
            timestamp: Date.now()
          });
          
          return { urls: fallback, source: 'fallback_rate_limit' };
        }
        
        // ใช้ initial fallback
        if (FALLBACK_TWEET_URLS.length > 0) {
          timelineCache.set(cacheKey, {
            data: FALLBACK_TWEET_URLS,
            timestamp: Date.now()
          });
          
          return { urls: FALLBACK_TWEET_URLS, source: 'initial_fallback_rate_limit' };
        }
      } else {
        console.error('❌ [Timeline] Tweets fetch failed');
        console.error('   Status:', tweetsResponse.status);
        console.error('   Body:', errorBody.substring(0, 200));
      }
      
      const fallback = persistentFallbackCache.get(cacheKey);
      if (fallback && fallback.length > 0) {
        return { urls: fallback, source: 'fallback_error' };
      }
      
      if (cached) {
        console.log('💾 [Timeline] Using expired cache');
        return { urls: cached.data, source: 'expired_cache' };
      }
      
      return { urls: [], source: 'api_error' };
    }

    const tweetsData = await tweetsResponse.json();
    
    if (!tweetsData.data || tweetsData.data.length === 0) {
      console.warn('⚠️ [Timeline] No tweets found for this user');
      
      const fallback = persistentFallbackCache.get(cacheKey);
      if (fallback && fallback.length > 0) {
        return { urls: fallback, source: 'fallback_no_tweets' };
      }
      
      if (cached) return { urls: cached.data, source: 'expired_cache' };
      return { urls: [], source: 'no_tweets' };
    }

    const tweetUrls = tweetsData.data.map((tweet: { id: string }) => 
      `https://twitter.com/${username}/status/${tweet.id}`
    );

    console.log(`✅ [Timeline] Found ${tweetUrls.length} tweets from API:`);
    tweetUrls.forEach((url: string, idx: number) => {
      console.log(`   ${idx + 1}. ${url}`);
    });
    
    // 💾 บันทึกลง persistent fallback cache (in-memory)
    persistentFallbackCache.set(cacheKey, tweetUrls);
    console.log('💾 [Timeline] Saved to persistent fallback cache');
    
    // บันทึกลง timeline cache (5 นาที)
    timelineCache.set(cacheKey, {
      data: tweetUrls,
      timestamp: Date.now()
    });
    
    console.log('💾 [Timeline] Cached for 5 minutes (will auto-refresh)');
    
    return { urls: tweetUrls, source: 'api' };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ [Timeline] Exception:', errorMsg);
    
    // ใช้ persistent fallback ก่อน
    const fallback = persistentFallbackCache.get(cacheKey);
    if (fallback && fallback.length > 0) {
      console.log('💾 [Timeline] Using persistent fallback due to exception');
      return { urls: fallback, source: 'fallback_exception' };
    }
    
    // ใช้ expired cache
    if (cached) {
      console.log('💾 [Timeline] Using expired cache due to exception');
      return { urls: cached.data, source: 'expired_cache' };
    }
    
    return { urls: [], source: 'exception' };
  }
}

// ==========================================
// 🚀 MAIN API HANDLER
// ==========================================
export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 TWEETS API REQUEST');
    console.log('⏰ Time:', new Date().toISOString());
    console.log('📍 Env Check: TWITTER_BEARER_TOKEN =', process.env.TWITTER_BEARER_TOKEN ? `✅ Set (${process.env.TWITTER_BEARER_TOKEN.length} chars)` : '❌ Not set');
    console.log('='.repeat(60) + '\n');
    
    const { urls: tweetUrls, source: timelineSource } = await fetchUserTimeline('gatherbeyond');

    console.log(`\n📋 Timeline Result:`);
    console.log(`   Source: ${timelineSource}`);
    console.log(`   URLs count: ${tweetUrls.length}`);

    // ถ้าไม่มี tweet URLs เลย ส่ง fallback URLs กลับไป (ไม่ใช้ empty array)
    if (tweetUrls.length === 0) {
      console.log('\n⚠️ No tweet URLs from API, using hardcoded fallback');
      
      // ถ้ามี fallback URLs ให้ใช้แทน
      if (FALLBACK_TWEET_URLS.length > 0) {
        console.log('✅ Using FALLBACK_TWEET_URLS:', FALLBACK_TWEET_URLS.length, 'tweets');
        tweetUrls.push(...FALLBACK_TWEET_URLS);
      } else {
        // ถ้าไม่มี fallback เลยจริงๆ ค่อยส่ง empty
        const duration = Date.now() - startTime;
        
        return NextResponse.json({ 
          tweets: [],
          success: true,
          count: 0,
          duration_ms: duration,
          source: 'no_tweets',
          cached: false,
          message: 'No tweets available. Please configure Twitter API or add fallback URLs.',
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        });
      }
    }

    tweetUrls.forEach((url: string, idx: number) => {
      console.log(`   ${idx + 1}. ${url}`);
    });

    console.log('\n🔥 Fetching oEmbed data for all tweets...\n');
    
    const tweetsRaw = await Promise.all(
      tweetUrls.map((url: string, idx: number) => {
        console.log(`\n--- Tweet ${idx + 1}/${tweetUrls.length} ---`);
        return fetchOEmbed(url);
      })
    );

    console.log('\n📊 oEmbed Results:');
    tweetsRaw.forEach((result, idx) => {
      if (result) {
        console.log(`   ✅ Tweet ${idx + 1}: Success (HTML: ${result.html?.length || 0} chars)`);
      } else {
        console.log(`   ❌ Tweet ${idx + 1}: Failed`);
      }
    });

    const tweets = tweetsRaw
      .map((tweet, idx) => {
        if (!tweet) {
          console.warn(`⚠️ Skipping tweet ${idx + 1}: No data`);
          return null;
        }
        
        if (!tweet.html || tweet.html.length < 50) {
          console.warn(`⚠️ Skipping tweet ${idx + 1}: Invalid HTML`);
          return null;
        }
        
        const url = tweetUrls[idx];
        const match = url.match(/twitter.com\/(.*?)\/status/);
        const username = match ? match[1] : 'gatherbeyond';
        
        return {
          url,
          author_name: tweet.author_name || `@${username}`,
          author_url: `https://twitter.com/${username}`,
          html: tweet.html,
          width: tweet.width,
          height: tweet.height || null,
          type: tweet.type,
          cache_age: tweet.cache_age,
          provider_name: tweet.provider_name,
          provider_url: tweet.provider_url,
          version: tweet.version
        };
      })
      .filter(tweet => tweet !== null);

    console.log(`\n✅ Valid tweets: ${tweets.length}/${tweetUrls.length}`);

    const duration = Date.now() - startTime;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ API Response Ready`);
    console.log(`   Tweets: ${tweets.length}`);
    console.log(`   Source: ${timelineSource}`);
    console.log(`   Duration: ${duration}ms`);
    console.log('='.repeat(60) + '\n');

    return NextResponse.json({ 
      tweets,
      success: true,
      count: tweets.length,
      duration_ms: duration,
      source: timelineSource,
      cached: timelineSource !== 'api',
      debug: {
        bearer_token_set: !!process.env.TWITTER_BEARER_TOKEN,
        bearer_token_length: process.env.TWITTER_BEARER_TOKEN?.length || 0,
        timeline_source: timelineSource,
        oembed_success_rate: `${tweets.length}/${tweetUrls.length}`
      }
    }, {
      headers: {
        // Cache for 5 minutes in CDN to match timeline cache (avoid rate limit)
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('\n' + '='.repeat(60));
    console.error('❌ CRITICAL ERROR');
    console.error('Message:', errorMsg);
    console.error('Stack:', errorStack);
    console.error('Duration:', duration, 'ms');
    console.error('='.repeat(60) + '\n');
    
    return NextResponse.json({ 
      tweets: [],
      success: false,
      count: 0,
      source: 'error',
      cached: false,
      error: errorMsg
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    });
  }
}
