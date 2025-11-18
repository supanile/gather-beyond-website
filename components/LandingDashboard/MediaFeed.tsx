"use client";

import { useEffect, useState, useRef } from "react";

// Extend Window interface to include Twitter's twttr object
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface Tweet {
  url: string;
  html: string;
  author_name: string;
  author_url: string;
}

const XFeed = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) {
      console.log("✅ Twitter script already loaded");
      return;
    }

    console.log("🔄 Loading Twitter widgets script...");
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";

    script.onload = () => {
      console.log("✅ Twitter widgets script loaded successfully");
      scriptLoadedRef.current = true;
      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
    };

    script.onerror = () => {
      console.error("❌ Failed to load Twitter widgets script");
    };

    if (
      !document.querySelector(
        'script[src="https://platform.twitter.com/widgets.js"]'
      )
    ) {
      document.body.appendChild(script);
      console.log("📝 Twitter script added to document");
    } else {
      scriptLoadedRef.current = true;
      console.log("✅ Twitter script already in document");
    }
  }, []);

  useEffect(() => {
    const fetchTweets = async () => {
      // 🎯 FALLBACK URLs - รับประกันว่าจะมี tweets แสดงเสมอ
      const fallbackUrls = [
        'https://x.com/gatherbeyond/status/1858055776051359790',
        'https://x.com/gatherbeyond/status/1858054646477660267'
      ];

      const loadFallbackTweets = async () => {
        console.log("🔄 XFeed: Loading fallback tweets...");
        try {
          const fallbackTweets = await Promise.all(
            fallbackUrls.map(async (url) => {
              try {
                const twitterUrl = url.replace('x.com', 'twitter.com');
                const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(twitterUrl)}&theme=light&dnt=true&omit_script=true`;
                const response = await fetch(oembedUrl);
                if (response.ok) {
                  const data = await response.json();
                  return {
                    url,
                    html: data.html,
                    author_name: data.author_name || '@gatherbeyond',
                    author_url: 'https://twitter.com/gatherbeyond'
                  };
                }
              } catch (error) {
                console.error("Failed to fetch fallback tweet:", url, error);
              }
              return null;
            })
          );
          
          const validFallbackTweets = fallbackTweets.filter(t => t !== null) as Tweet[];
          if (validFallbackTweets.length > 0) {
            console.log("✅ XFeed: Loaded", validFallbackTweets.length, "fallback tweets");
            setTweets(validFallbackTweets);
            
            setTimeout(() => {
              if (window.twttr && window.twttr.widgets) {
                window.twttr.widgets.load();
              }
            }, 100);
          }
        } catch (error) {
          console.error("❌ XFeed: Fallback loading failed:", error);
        }
      };

      try {
        console.log("🔄 XFeed: Fetching tweets from API...");
        const cacheBuster = Date.now();
        const response = await fetch(`/api/tweets?t=${cacheBuster}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        console.log("📡 XFeed: Response status:", response.status, response.statusText);
        
        if (!response.ok) {
          console.error("❌ XFeed: API returned error status:", response.status);
          await loadFallbackTweets();
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();

        console.log("📦 XFeed: API Response:", data);
        console.log("📊 XFeed: Tweets count:", data.tweets?.length || 0);

        // ✅ ถ้า API ส่ง tweets มา ใช้เลย
        if (data.tweets && Array.isArray(data.tweets) && data.tweets.length > 0) {
          console.log("✨ XFeed: Setting tweets from API:", data.tweets.length);
          setTweets(data.tweets);

          setTimeout(() => {
            console.log("🔄 XFeed: Reloading Twitter widgets...");
            if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load();
              console.log("✅ XFeed: Twitter widgets loaded");
            }
          }, 100);
        } else {
          // ⚠️ ถ้า API ไม่ส่ง tweets มา ใช้ fallback
          console.warn("⚠️ XFeed: API returned no tweets, loading fallback...");
          await loadFallbackTweets();
        }
      } catch (error) {
        console.error("❌ XFeed: Error fetching tweets:", error);
        // 🔥 ถ้าเกิด error ใช้ fallback
        await loadFallbackTweets();
      } finally {
        setIsLoading(false);
        console.log("✅ XFeed: Loading complete");
      }
    };

    fetchTweets();
  }, []);

  return (
    <section className="scroll-fade scroll-fade-delay-6 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background/50 via-background/30 to-background/50 relative overflow-hidden">
      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center mb-4 sm:mb-5 md:mb-6 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-foreground/5 rounded-full border border-border/50 backdrop-blur-sm">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-foreground mr-1.5 sm:mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="font-semibold text-foreground text-xs sm:text-sm tracking-wide">
              LIVE FROM X
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-background/80 via-background/60 to-background/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 border border-border/50 hover:border-border transition-all duration-500 shadow-xl sm:shadow-2xl backdrop-blur-xl">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-7 md:mb-8 gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-start">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-full flex items-center justify-center ring-2 ring-border hover:ring-border/40 transition-all duration-300">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-foreground"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-foreground text-base sm:text-lg md:text-xl leading-tight">
                    @gatherbeyond
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Updates
                  </p>
                </div>
              </div>

              <a
                href="https://x.com/intent/follow?screen_name=gatherbeyond"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center space-x-1.5 sm:space-x-2 bg-foreground hover:bg-foreground/90 text-background px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span className="whitespace-nowrap">Follow @gatherbeyond</span>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>

            {/* Tweets Container */}
            <div
              ref={containerRef}
              className="rounded-lg sm:rounded-xl overflow-hidden bg-muted/30 backdrop-blur-sm border border-border/30"
            >
              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center py-16 sm:py-20 md:py-24 min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
                  <div className="text-center px-4">
                    <div className="relative mb-4 sm:mb-5 md:mb-6">
                      <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-3 sm:border-4 border-border border-t-foreground mx-auto"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium">
                      Loading latest posts...
                    </p>
                  </div>
                </div>
              )}

              {/* Tweets Grid - 2 columns on desktop */}
              {!isLoading && tweets.length > 0 && (
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
                    {tweets.slice(0, 2).map((tweet, index) => (
                      <div
                        key={index}
                        className="w-full"
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                          opacity: 0,
                        }}
                      >
                        <div
                          className="tweet-embed-container w-full min-h-[400px] sm:min-h-[450px] flex items-start justify-center"
                          dangerouslySetInnerHTML={{ __html: tweet.html }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 text-center">
                    <a
                      href="https://x.com/gatherbeyond"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 sm:space-x-2 text-muted-foreground hover:text-foreground transition-all duration-300 text-xs sm:text-sm group"
                    >
                      <span>View all posts</span>
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && tweets.length === 0 && (
                <div className="flex items-center justify-center py-16 sm:py-20 md:py-24 min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
                  <div className="text-center max-w-md px-4 sm:px-6">
                    <div className="mb-6 sm:mb-7 md:mb-8 inline-flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-foreground/20 to-foreground/5 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
                      <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-full flex items-center justify-center ring-2 ring-border">
                        <svg
                          className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-foreground text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                      Coming Soon
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-1.5 sm:mb-2 leading-relaxed">
                      We&apos;re preparing amazing content for you.
                    </p>
                    <p className="text-muted-foreground/80 text-xs sm:text-sm mb-8 sm:mb-9 md:mb-10 leading-relaxed">
                      Follow us to get notified when we share new updates!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
                      <a
                        href="https://x.com/intent/follow?screen_name=gatherbeyond"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center space-x-1.5 sm:space-x-2 bg-foreground text-background px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <span>Follow Now</span>
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </a>
                      <a
                        href="https://x.com/gatherbeyond"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2 bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 border border-border hover:border-border/40"
                      >
                        <span>View Profile</span>
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-7 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 text-center sm:text-left">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Follow us for updates and announcements
                  </p>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <a
                    href="https://x.com/gatherbeyond"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                    aria-label="Follow us on X"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute top-1/4 left-4 sm:left-6 md:left-10 transform -translate-y-1/2 opacity-10 pointer-events-none">
          <div className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-gradient-to-br from-foreground/20 to-foreground/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/4 right-4 sm:right-6 md:right-10 transform translate-y-1/2 opacity-10 pointer-events-none">
          <div
            className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-gradient-to-br from-foreground/10 to-foreground/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Twitter Embed Styling */
        :global(.tweet-embed-container) {
          width: 100% !important;
          max-width: 100% !important;
        }

        :global(.tweet-embed-container .twitter-tweet) {
          margin: 0 auto !important;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          width: 100% !important;
          max-width: 550px !important;
        }

        :global(.tweet-embed-container blockquote.twitter-tweet) {
          display: block !important;
          width: 100% !important;
          max-width: 550px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          border: none !important;
          background: transparent !important;
        }

        :global(.tweet-embed-container .twitter-tweet-rendered) {
          margin: 0 auto !important;
          max-width: 550px !important;
          width: 100% !important;
        }

        :global(.tweet-embed-container iframe) {
          max-width: 550px !important;
          width: 100% !important;
          margin: 0 auto !important;
        }

        /* Ensure tweets are visible on mobile */
        @media (max-width: 640px) {
          :global(.tweet-embed-container .twitter-tweet),
          :global(.tweet-embed-container blockquote.twitter-tweet),
          :global(.tweet-embed-container iframe) {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default XFeed;