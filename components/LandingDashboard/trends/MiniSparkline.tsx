import React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: Array<{ timestamp: string; volume: number }>;
  color?: string;
  className?: string;
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  color = '#10b981',
  className = ''
}) => {
  if (!data || data.length === 0) {
    return <div className={`w-12 h-6 bg-gray-700 rounded ${className}`} />;
  }

  // Transform data for recharts
  const chartData = data.slice(-7).map((point, index) => ({
    index,
    value: point.volume
  }));

  return (
    <div className={`w-12 h-6 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniSparkline;
