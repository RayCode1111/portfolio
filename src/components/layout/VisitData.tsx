'use client';

import { useEffect, useState } from 'react';
import { Eye } from '@phosphor-icons/react';

type VisitStats = {
  totalUV: string | number;
  dailyUV: string | number;
};

export default function VisitData() {
  const [stats, setStats] = useState<VisitStats>({
    totalUV: '-',
    dailyUV: '-',
  });

  useEffect(() => {
    const fetchVisitStats = async () => {
      try {
        const response = await fetch('/api/visit-stats');
        if (!response.ok) return;
        const data = await response.json();
        if (data && (data.totalUV !== undefined || data.dailyUV !== undefined)) {
          setStats({
            totalUV: data.totalUV ?? '-',
            dailyUV: data.dailyUV ?? '-',
          });
        }
      } catch (error) {
        console.error('Error fetching visit stats:', error);
      }
    };

    fetchVisitStats();
    const interval = setInterval(fetchVisitStats, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row items-center justify-center gap-2 text-sm text-gray-500 mt-2">
      <Eye size={16} weight="duotone" />
      Total Visits: {stats.totalUV} / Today Visits: {stats.dailyUV}
    </div>
  );
}