import { useState, useEffect, useMemo } from 'react';
import { GatherProject, GatherDashboardData, DashboardFilters, DashboardSort, BlockchainNetwork, ProjectCategory } from '@/types/gatherDashboard';
import { 
  generateGatherScore, 
  generateTokenHealth, 
  generateSocialSignals, 
  generateSuperScore, 
  generateAIAssessment, 
  generateProjectActions 
} from '@/data/mockGatherData';

export function useGatherDashboardData() {
  const [projects, setProjects] = useState<GatherProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Use known project IDs - you can adjust these based on your actual data
        const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        const projectPromises = projectIds.map(async (id) => {
          try {
            const response = await fetch(`/api/project/${id}/overview`);
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch {
            return null;
          }
        });

        const projectResults = await Promise.all(projectPromises);
        const validProjects = projectResults.filter(project => project !== null);
        
        console.log('Valid projects found:', validProjects.length, validProjects);
        
        if (validProjects.length === 0) {
          throw new Error('No projects found');
        }
        
        setProjects(validProjects);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}

export function useProjectDetails(projectId: string) {
  const [projectData, setProjectData] = useState<GatherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/project/${projectId}/overview`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        
        const project = await response.json();
        
        // Generate enhanced data using mock functions
        const gatherScore = generateGatherScore(project.id);
        const tokenHealth = generateTokenHealth(project.id);
        const socialSignals = generateSocialSignals(project.id);
        const superScore = generateSuperScore(project.id);
        const aiAssessment = generateAIAssessment(gatherScore);
        const actions = generateProjectActions(project.id);
        
        const dashboardData: GatherDashboardData = {
          project,
          gatherScore,
          tokenHealth,
          socialSignals,
          superScore,
          aiAssessment,
          actions,
          lastUpdated: new Date().toISOString()
        };
        
        setProjectData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  return { projectData, isLoading, error };
}

export function useFilteredProjects(
  projects: GatherProject[], 
  filters: DashboardFilters,
  sort: DashboardSort
) {
  return useMemo(() => {
    let filtered = [...projects];

    // Apply filters
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.categories.some(cat => cat.toLowerCase().includes(term))
      );
    }

    if (filters.chain && filters.chain.length > 0) {
      filtered = filtered.filter(project => 
        filters.chain!.includes(project.chain as BlockchainNetwork)
      );
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(project =>
        project.categories.some(cat => 
          filters.category!.includes(cat as ProjectCategory)
        )
      );
    }

    if (filters.scoreRange) {
      filtered = filtered.filter(project => {
        const score = generateGatherScore(project.id).overall;
        return score >= filters.scoreRange![0] && score <= filters.scoreRange![1];
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sort.field) {
        case 'score':
          aValue = generateGatherScore(a.id).overall;
          bValue = generateGatherScore(b.id).overall;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'community':
          aValue = generateSuperScore(a.id).totalUsers;
          bValue = generateSuperScore(b.id).totalUsers;
          break;
        default:
          aValue = a.manualSort || 0;
          bValue = b.manualSort || 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const numA = aValue as number;
      const numB = bValue as number;
      return sort.direction === 'asc' ? numA - numB : numB - numA;
    });

    return filtered;
  }, [projects, filters, sort]);
}
