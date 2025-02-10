import React, { useState, useCallback } from "react";
import VideoFeed from "./dashboard/VideoFeed";
import EmotionBarChart from "./dashboard/EmotionBarChart";
import EmotionTimeline from "./dashboard/EmotionTimeline";
import StatisticsPanel from "./dashboard/StatisticsPanel";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";

interface EmotionTimelineData {
  timestamp: string;
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  fearful: number;
  disgusted: number;
  neutral: number;
}

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [currentEmotions, setCurrentEmotions] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<EmotionTimelineData[]>([]);
  const [sessionStart] = useState(new Date());
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("OPENAI_API_KEY")
  );

  const handleEmotionUpdate = useCallback((emotionData: any) => {
    setCurrentEmotions(emotionData);
    setCurrentEmotion(emotionData.dominantEmotion);

    const newTimelineEntry = {
      timestamp: new Date().toLocaleTimeString(),
      ...emotionData.emotions,
    };

    setTimelineData(prev => {
      const newData = [...prev, newTimelineEntry];
      if (newData.length > 60) {
        newData.shift();
      }
      return newData;
    });
  }, []);

  const getSessionDuration = () => {
    const diff = new Date().getTime() - sessionStart.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  // If no API key is set, show the dialog
  if (!apiKey) {
    return <ApiKeyDialog onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Emotion Analysis Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("OPENAI_API_KEY");
                setApiKey(null);
              }}
            >
              Change API Key
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video feed section - spans 2 columns */}
          <div className="lg:col-span-2">
            <VideoFeed
              isStreaming={isStreaming}
              isCameraEnabled={isCameraEnabled}
              onStreamToggle={() => setIsStreaming(!isStreaming)}
              onCameraToggle={() => setIsCameraEnabled(!isCameraEnabled)}
              onEmotionUpdate={handleEmotionUpdate}
              currentEmotion={currentEmotion}
            />
          </div>

          {/* Emotion bar chart section */}
          <div className="lg:col-span-1">
            <EmotionBarChart
              data={currentEmotions?.emotions ? Object.entries(currentEmotions.emotions).map(([emotion, percentage]) => ({
                emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                percentage: percentage as number,
                color: `bg-${getEmotionColor(emotion)}-500`,
              })) : undefined}
            />
          </div>

          {/* Timeline section - spans 2 columns */}
          <div className="lg:col-span-2">
            <EmotionTimeline data={timelineData} />
          </div>

          {/* Statistics panel section */}
          <div className="lg:col-span-1">
            <StatisticsPanel
              dominantEmotion={currentEmotions?.dominantEmotion}
              sessionDuration={getSessionDuration()}
              confidenceScore={currentEmotions?.confidenceScore}
              emotionChanges={timelineData.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    happy: 'green',
    sad: 'blue',
    angry: 'red',
    surprised: 'yellow',
    fearful: 'purple',
    disgusted: 'orange',
    neutral: 'gray'
  };
  return colors[emotion] || 'gray';
}

export default Home;
