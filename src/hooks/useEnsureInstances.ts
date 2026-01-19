import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { addMonths } from 'date-fns';

export const useEnsureInstances = () => {
  const ensureInstancesForRange = useAppStore((state) => state.ensureInstancesForRange);

  useEffect(() => {
    const endDate = addMonths(new Date(), 3);
    ensureInstancesForRange(endDate);
  }, [ensureInstancesForRange]);
};
