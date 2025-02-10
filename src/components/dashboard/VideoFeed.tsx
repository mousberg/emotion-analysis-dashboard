import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Camera, CameraOff } from "lucide-react";
import { analyzeEmotion } from "@/lib/openai";
import { motion, AnimatePresence } from "framer-motion";

const emotionEmojis: Record<string, { emoji: string, size: string }> = {
  happy: { emoji: "😊", size: "text-6xl" },
  sad: { emoji: "😢", size: "text-6xl" },
  angry: { emoji: "😠", size: "text-6xl" },
  surprised: { emoji: "😲", size: "text-6xl" },
  fearful: { emoji: "😨", size: "text-6xl" },
  disgusted: { emoji: "🤢", size: "text-6xl" },
  neutral: { emoji: "😐", size: "text-6xl" }
};

interface VideoFeedProps {
  isStreaming?: boolean;
  onStreamToggle?: () => void;
  onCameraToggle?: () => void;
  isCameraEnabled?: boolean;
  onEmotionUpdate?: (emotionData: any) => void;
  currentEmotion?: string;
}

const VideoFeed = ({
  isStreaming = true,
  onStreamToggle = () => {},
  onCameraToggle = () => {},
  isCameraEnabled = true,
  onEmotionUpdate = () => {},
  currentEmotion = "neutral"
}: VideoFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyzeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isCameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraEnabled]);

  useEffect(() => {
    if (isStreaming && isCameraEnabled) {
      startAnalysis();
    } else {
      stopAnalysis();
    }
  }, [isStreaming, isCameraEnabled]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Reduced canvas size to 256x256 for faster processing
    canvas.width = 256;
    canvas.height = 256;

    // Draw the video frame to canvas, scaling if necessary
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data with slightly lower quality for faster transfer
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  const startAnalysis = () => {
    if (analyzeIntervalRef.current) return;

    const runAnalysis = async () => {
      const frame = captureFrame();
      if (frame) {
        try {
          const emotionData = await analyzeEmotion(frame);
          if (emotionData) {
            console.log('New emotion data:', emotionData);
            onEmotionUpdate(emotionData);
          }
        } catch (error) {
          console.error('Analysis error:', error);
          stopAnalysis();
        }
      }
    };

    // Initial analysis
    runAnalysis();

    // Reduced interval to 3 seconds
    analyzeIntervalRef.current = window.setInterval(runAnalysis, 3000);
  };

  const stopAnalysis = () => {
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
      analyzeIntervalRef.current = null;
    }
  };

  return (
    <Card className="w-full max-w-[854px] bg-background border rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transform scale-x-[-1] ${!isCameraEnabled || !isStreaming ? 'hidden' : ''}`}
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        <AnimatePresence mode="wait">
          {isStreaming && isCameraEnabled && currentEmotion && (
            <motion.div
              key={currentEmotion}
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -50 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
              className="absolute top-4 left-4 z-10 transform scale-x-[-1]"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [-5, 5, -5, 5, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className={`${emotionEmojis[currentEmotion.toLowerCase()]?.size || 'text-6xl'} filter drop-shadow-lg`}
              >
                {emotionEmojis[currentEmotion.toLowerCase()]?.emoji || "😐"}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isCameraEnabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center gap-4">
              <CameraOff size={48} />
              <span>Camera is disabled</span>
            </div>
          </div>
        ) : !isStreaming ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground flex flex-col items-center gap-4">
              <VideoOff size={48} />
              <span>Stream is paused</span>
            </div>
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={isStreaming ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {isStreaming ? (
                  <>
                    <Video size={14} />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <VideoOff size={14} />
                    <span>Paused</span>
                  </>
                )}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onCameraToggle}
                className="flex items-center gap-2"
              >
                {isCameraEnabled ? (
                  <>
                    <Camera size={14} />
                    <span>Disable Camera</span>
                  </>
                ) : (
                  <>
                    <CameraOff size={14} />
                    <span>Enable Camera</span>
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onStreamToggle}
                className="flex items-center gap-2"
              >
                {isStreaming ? (
                  <>
                    <VideoOff size={14} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Video size={14} />
                    <span>Resume</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoFeed;
