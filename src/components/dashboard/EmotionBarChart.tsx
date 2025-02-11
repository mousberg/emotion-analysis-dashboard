import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmotionData {
  emotion: string;
  percentage: number;
  color: string;
}

interface EmotionBarChartProps {
  data?: { emotion: string; percentage: number; color: string }[];
}

const EmotionBarChart = ({ data }: EmotionBarChartProps) => {
  // Use empty data if none provided
  const chartData = data || [
    { emotion: 'Happy', percentage: 0, color: 'bg-green-500' },
    { emotion: 'Sad', percentage: 0, color: 'bg-blue-500' },
    { emotion: 'Angry', percentage: 0, color: 'bg-red-500' },
    { emotion: 'Surprised', percentage: 0, color: 'bg-yellow-500' },
    { emotion: 'Fearful', percentage: 0, color: 'bg-purple-500' },
    { emotion: 'Disgusted', percentage: 0, color: 'bg-orange-500' },
    { emotion: 'Neutral', percentage: 0, color: 'bg-gray-500' }
  ];

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Emotion Distribution</h2>
      <div className="space-y-4">
        {chartData.map(({ emotion, percentage, color }) => (
          <div key={emotion} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{emotion}</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionBarChart;
