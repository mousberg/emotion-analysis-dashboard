import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EmotionTimelineProps {
  data?: Array<{
    timestamp: string;
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    fearful: number;
    disgusted: number;
    neutral: number;
  }>;
}

const EmotionTimeline = ({
  data = generateDefaultData(),
}: EmotionTimelineProps) => {
  return (
    <Card className="w-full h-[200px] p-4 bg-background">
      <h3 className="text-lg font-semibold mb-2">
        Emotion Timeline (Last 60 Seconds)
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="happy" stroke="#4CAF50" />
          <Line type="monotone" dataKey="sad" stroke="#2196F3" />
          <Line type="monotone" dataKey="angry" stroke="#F44336" />
          <Line type="monotone" dataKey="surprised" stroke="#FF9800" />
          <Line type="monotone" dataKey="fearful" stroke="#9C27B0" />
          <Line type="monotone" dataKey="disgusted" stroke="#795548" />
          <Line type="monotone" dataKey="neutral" stroke="#9E9E9E" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

function generateDefaultData() {
  const data = [];
  for (let i = 0; i < 60; i++) {
    data.push({
      timestamp: `${i}s`,
      happy: Math.random() * 100,
      sad: Math.random() * 100,
      angry: Math.random() * 100,
      surprised: Math.random() * 100,
      fearful: Math.random() * 100,
      disgusted: Math.random() * 100,
      neutral: Math.random() * 100,
    });
  }
  return data;
}

export default EmotionTimeline;
