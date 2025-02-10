import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmotionData {
  emotion: string;
  percentage: number;
  color: string;
}

interface EmotionBarChartProps {
  data?: EmotionData[];
}

const defaultEmotions: EmotionData[] = [
  { emotion: "Happy", percentage: 65, color: "bg-green-500" },
  { emotion: "Sad", percentage: 10, color: "bg-blue-500" },
  { emotion: "Angry", percentage: 5, color: "bg-red-500" },
  { emotion: "Surprised", percentage: 8, color: "bg-yellow-500" },
  { emotion: "Fearful", percentage: 4, color: "bg-purple-500" },
  { emotion: "Disgusted", percentage: 3, color: "bg-orange-500" },
  { emotion: "Neutral", percentage: 5, color: "bg-gray-500" },
];

const EmotionBarChart = ({ data = defaultEmotions }: EmotionBarChartProps) => {
  return (
    <Card className="p-6 w-full h-full bg-background">
      <h2 className="text-xl font-semibold mb-4">Emotion Analysis</h2>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.emotion} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.emotion}</span>
              <span className="text-sm text-muted-foreground">
                {item.percentage}%
              </span>
            </div>
            <Progress value={item.percentage} className={`h-2 ${item.color}`} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmotionBarChart;
