"use client"

import { useEffect, useState } from "react"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({ value, size = 120, strokeWidth = 8, className = "" }: CircularProgressProps) {
  const [offset, setOffset] = useState(0)

  // Calculate circle properties
  const center = size / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const progressOffset = ((100 - value) / 100) * circumference
    setOffset(progressOffset)
  }, [value, circumference])

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle with gradient */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />

        {/* Animated dots along the circle */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const dotX = center + radius * Math.cos(angle)
          const dotY = center + radius * Math.sin(angle)
          const delay = i * 0.125

          return (
            <circle
              key={i}
              cx={dotX}
              cy={dotY}
              r={2}
              fill="white"
              className="animate-pulse-dots"
              style={{
                animationDelay: `${delay}s`,
                opacity: value > i * 12.5 ? 1 : 0.3,
                filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.7))",
              }}
            />
          )
        })}

        {/* Define gradient */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner spinning circle */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transform: `scale(${0.6})` }}
      >
        <div className="w-full h-full rounded-full border-4 border-transparent border-t-pink-500 border-r-purple-500 animate-spin-slow"></div>
      </div>
    </div>
  )
}

