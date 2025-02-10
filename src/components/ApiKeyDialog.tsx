import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

interface ApiKeyDialogProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export function ApiKeyDialog({ onApiKeySubmit }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    
    // Basic validation
    if (!trimmedKey) {
      setError("API key is required");
      return;
    }
    
    if (!trimmedKey.startsWith('sk-')) {
      setError("Invalid API key format. Key should start with 'sk-'");
      return;
    }

    setError("");
    localStorage.setItem("OPENAI_API_KEY", trimmedKey);
    onApiKeySubmit(trimmedKey);
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter OpenAI API Key</DialogTitle>
          <DialogDescription>
            To use the emotion detection feature, please enter your OpenAI API key.
            Your key will be stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <KeyRound className="w-4 h-4 opacity-50" />
              <Input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError(""); // Clear error when user types
                }}
                className="flex-1"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <p>Don't have an API key?</p>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Get one from OpenAI
            </a>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!apiKey.trim()}>
              Save API Key
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 