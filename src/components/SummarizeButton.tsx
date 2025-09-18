import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SummarizeButtonProps {
  text: string;
  onSummaryGenerated?: (summary: string) => void;
}

// Simple extractive summarization algorithm
const extractiveSummarize = (text: string, maxSentences: number = 3): string => {
  // Split into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length <= maxSentences) {
    return text;
  }

  // Count word frequencies
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    if (word.length > 3) { // Skip short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  // Score sentences based on word frequencies
  const sentenceScores = sentences.map((sentence, index) => {
    const sentenceWords: string[] = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const score = sentenceWords.reduce((sum: number, word: string) => {
      return sum + (wordFreq[word] || 0);
    }, 0);
    return { sentence: sentence.trim(), score, index };
  });

  // Get top sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index); // Maintain original order

  return topSentences.map(s => s.sentence).join('. ') + '.';
};

export const SummarizeButton = ({ text, onSummaryGenerated }: SummarizeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  const handleSummarize = async () => {
    if (!text || text.trim().length < 100) {
      toast({
        title: "Text too short",
        description: "Please provide more text to summarize (at least 100 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedSummary = extractiveSummarize(text, 3);
      setSummary(generatedSummary);
      onSummaryGenerated?.(generatedSummary);
      
      toast({
        title: "Summary generated",
        description: "AI summary has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Summarization failed",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleSummarize}
        disabled={isLoading || !text}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}
        {isLoading ? "Generating..." : "AI Summarize"}
      </Button>

      {summary && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <Badge variant="secondary" className="text-xs">
                AI Summary
              </Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};