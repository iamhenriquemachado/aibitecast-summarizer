"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { formatSummaryForCopy } from "@/lib/format-summary"

interface VideoSummaryProps {
  summary: {
    title: string
    summary: string
    keyPoints: string[]
  }
}

export function VideoSummary({ summary }: VideoSummaryProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const formattedText = formatSummaryForCopy(summary)
    await navigator.clipboard.writeText(formattedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  

  return (
    <div className="w-full animate-fade-in-up">
      <Card className="overflow-hidden border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
          <div>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x">
              {summary.title}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                AI-Generated Summary
              </span>
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-purple-200 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 hover:scale-105"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Summary
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-medium text-lg mb-2">Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary.summary}</p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-medium text-lg mb-2">Key Points</h3>
            <ul className="space-y-2">
              {summary.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 animate-fade-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <Badge variant="outline" className="mt-1 shrink-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                    {index + 1}
                  </Badge>
                  <span className="text-gray-700 dark:text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

