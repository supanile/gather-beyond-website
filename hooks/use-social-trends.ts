import { useState, useEffect } from 'react';
import { SocialPlatform, SocialTrendsState, SocialTrendsData } from '@/types/social-trends';
import { mockSocialTrendsData } from '@/data/mock-social-trends';

interface UseSocialTrendsOptions {
  platform?: SocialPlatform;
  useMockData?: boolean;
}

export const useSocialTrends = ({ 
  platform, 
  useMockData = true 
}: UseSocialTrendsOptions = {}) => {
  const [state, setState] = useState<SocialTrendsState>({
    google: null,
    tiktok: null,
    x: null,
    gather: null,
    loading: true,
    error: null,
  });

  const loadTrendsData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (platform) {
          // Load specific platform data
          const platformData = mockSocialTrendsData[platform];
          setState(prev => ({
            ...prev,
            [platform]: platformData,
            loading: false,
          }));
        } else {
          // Load all platforms data
          setState(prev => ({
            ...prev,
            ...mockSocialTrendsData,
            loading: false,
          }));
        }
      } else {
        // TODO: Implement real API calls when backend is ready
        throw new Error('Real API not implemented yet');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const refetch = () => {
    loadTrendsData();
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (useMockData) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (platform) {
            // Load specific platform data
            const platformData = mockSocialTrendsData[platform];
            setState(prev => ({
              ...prev,
              [platform]: platformData,
              loading: false,
            }));
          } else {
            // Load all platforms data
            setState(prev => ({
              ...prev,
              ...mockSocialTrendsData,
              loading: false,
            }));
          }
        } else {
          // TODO: Implement real API calls when backend is ready
          throw new Error('Real API not implemented yet');
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    };

    loadData();
  }, [platform, useMockData]);

  const getCurrentPlatformData = (): SocialTrendsData | null => {
    if (!platform) return null;
    return state[platform];
  };

  return {
    ...state,
    currentPlatform: platform ? getCurrentPlatformData() : null,
    refetch,
  };
};
