"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Plus, Sparkles } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { VideoSummary } from "@/components/video-summary"
import { CircularProgress } from "@/components/circular-progress"
import Link from "next/link"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState<null | {
    title: string
    summary: string
    keyPoints: string[]
  }>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 1
        })
      }, 30)

      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
  
    setIsLoading(true)
    setProgress(0)
  
    try {
      const response = await fetch('http://127.0.0.1:8000/youtube/summarize/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_url: url }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch summary")
      }
      const result = await response.json()
      setSummary(result)
      setProgress(100)
    } catch (error) {
      console.error("Failed to summarize video:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewSummary = () => {
    setSummary(null)
    setUrl("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      <header className="w-full p-4 flex justify-end">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full">
        <div className={`mb-12 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="relative inline-block mb-6">
            <h1 className="text-6xl md:text-7xl font-bold relative">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x">
                Bite
              </span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x">
                Cast
              </span>
              <Sparkles className="absolute -top-6 -right-6 w-6 h-6 text-yellow-400 animate-twinkle" />
              <Sparkles className="absolute -bottom-2 -left-4 w-4 h-4 text-yellow-400 animate-twinkle-delayed" />
            </h1>
          </div>
          <div className="relative inline-block">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 font-medium max-w-xl mx-auto leading-relaxed animate-fade-in">
              <span className="text-purple-600 dark:text-purple-400 font-semibold animate-highlight">Transform</span>{" "}
              hours of video into
              <span className="relative mx-2 px-2 inline-block animate-bounce-subtle">
                <span className="relative z-10 text-white dark:text-gray-900 font-bold">bite-sized</span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-md -rotate-1"></span>
              </span>
              insights in seconds
            </p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-width"></div>
          </div>
        </div>

        {!summary ? (
          <form onSubmit={handleSubmit} className={`w-full max-w-xl flex gap-2 mb-12 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Input type="text" placeholder="Paste YouTube URL here..." value={url} onChange={(e) => setUrl(e.target.value)} className="pr-10 py-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700" />
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 transition-transform duration-300 hover:scale-105" disabled={isLoading || !url}>
              Summarize
              <Send className="ml-2 h-4 w-4 animate-slide-right" />
            </Button>
          </form>
        ) : (
          <div className="w-full mb-8 flex justify-end animate-fade-in">
            <Button onClick={handleNewSummary} variant="outline" className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md">
              <Plus className="h-4 w-4" />
              New Summary
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-6 animate-fade-in">
            <CircularProgress progress={progress} />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Processing your video
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress < 30 ? "Extracting transcript..." : 
               progress < 60 ? "Analyzing content..." : 
               progress < 90 ? "Generating insights..." : 
               "Almost done..."}
              </p>
            </div>
          </div>
        )}
        
        {summary && !isLoading && <VideoSummary summary={summary} />}
      </main>

      <footer className="w-full p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
       &copy; {new Date().getFullYear()} Made with 💜 by <Link href="https://www.linkedin.com/in/henriquecmachado/" className="text-purple-500 hover:underline" target="_blank">Henrique</Link>. All rights reserved.
      </footer>
    </div>
  )
}