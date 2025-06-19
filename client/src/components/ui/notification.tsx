"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, CheckCircle, XCircle, Info, AlertTriangle, Bell, Zap, Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NotificationProps {
  id: string
  type: "success" | "error" | "info" | "warning" | "notification" | "premium" | "love" | "achievement"
  message: string
  duration?: number
  index: number 
  onClose?: (id: string) => void
}

export const Notification: React.FC<NotificationProps> = ({ id, type, message, duration = 2500, index, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const decrement = (100 / duration) * 50 // Update every 50ms
        return Math.max(0, prev - decrement)
      })
    }, 50)

    // Auto close timer
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.(id)
    }, 300) // Animation duration
  }

  if (!isVisible) return null

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    notification: <Bell className="w-5 h-5 text-purple-500" />,
    premium: <Zap className="w-5 h-5 text-yellow-500" />,
    love: <Heart className="w-5 h-5 text-pink-500 fill-current" />,
    achievement: <Star className="w-5 h-5 text-orange-500 fill-current" />,
  }

  const baseStyles = cn(
    "fixed right-4 flex flex-col rounded-xl shadow-2xl max-w-sm z-50 overflow-hidden border backdrop-blur-sm transition-all duration-300 ease-in-out",
    isExiting ? "translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100 scale-100",
  )

  const typeStyles = {
    success:
      "bg-emerald-50/95 text-emerald-900 border-emerald-200 dark:bg-emerald-950/95 dark:text-emerald-100 dark:border-emerald-800",
    error: "bg-red-50/95 text-red-900 border-red-200 dark:bg-red-950/95 dark:text-red-100 dark:border-red-800",
    info: "bg-blue-50/95 text-blue-900 border-blue-200 dark:bg-blue-950/95 dark:text-blue-100 dark:border-blue-800",
    warning:
      "bg-amber-50/95 text-amber-900 border-amber-200 dark:bg-amber-950/95 dark:text-amber-100 dark:border-amber-800",
    notification:
      "bg-purple-50/95 text-purple-900 border-purple-200 dark:bg-purple-950/95 dark:text-purple-100 dark:border-purple-800",
    premium:
      "bg-gradient-to-br from-yellow-50/95 to-orange-50/95 text-yellow-900 border-yellow-200 dark:from-yellow-950/95 dark:to-orange-950/95 dark:text-yellow-100 dark:border-yellow-800",
    love: "bg-gradient-to-br from-pink-50/95 to-rose-50/95 text-pink-900 border-pink-200 dark:from-pink-950/95 dark:to-rose-950/95 dark:text-pink-100 dark:border-pink-800",
    achievement:
      "bg-gradient-to-br from-orange-50/95 to-amber-50/95 text-orange-900 border-orange-200 dark:from-orange-950/95 dark:to-amber-950/95 dark:text-orange-100 dark:border-orange-800",
  }

  const progressBarColors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
    notification: "bg-purple-500",
    premium: "bg-gradient-to-r from-yellow-500 to-orange-500",
    love: "bg-gradient-to-r from-pink-500 to-rose-500",
    achievement: "bg-gradient-to-r from-orange-500 to-amber-500",
  }

  // Calculate position based on index (stacking from bottom)
  const bottomPosition = 16 + index * 80 // 16px base + 80px per notification

  return (
    <div className={cn(baseStyles, typeStyles[type])} style={{ bottom: `${bottomPosition}px` }}>
      {/* Progress Bar */}
      <div className="h-1 w-full bg-black/10 dark:bg-white/10">
        <div
          className={cn("h-full transition-all duration-75 ease-linear", progressBarColors[type])}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">{icons[type]}</div>
        <div className="flex-1 mr-2 font-medium">{message}</div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
