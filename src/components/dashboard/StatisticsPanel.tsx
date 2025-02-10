import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Clock, Brain, Activity, BarChart2 } from "lucide-react";

interface StatisticsPanelProps {
  dominantEmotion?: string;
  sessionDuration?: string;
  confidenceScore?: number;
  emotionChanges?: number;
}

const StatisticsPanel = ({
  dominantEmotion = "Happy",
  sessionDuration = "00:00:00",
  confidenceScore = 85,
  emotionChanges = 12,
}: StatisticsPanelProps) => {
  return (
    <Card className="w-full max-w-[500px] h-[380px] p-6 bg-background">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Statistics</h2>
          <Badge variant="secondary">{sessionDuration}</Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dominant Emotion</p>
              <p className="text-lg font-medium">{dominantEmotion}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Duration</p>
              <p className="text-lg font-medium">{sessionDuration}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <p className="text-lg font-medium">{confidenceScore}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BarChart2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emotion Changes</p>
              <p className="text-lg font-medium">{emotionChanges}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatisticsPanel;
