import { useApi } from './useApi';

export function useTeamWorkload() {
  return useApi('/team/workload');
}
