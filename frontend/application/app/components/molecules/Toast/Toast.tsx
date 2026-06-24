'use client'
import React, { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  durationMs?: number
  autoDismiss?: boolean
  showProgress?: boolean
  onClose?: () => void
}

function Toast({
  message,
  type = 'success',
  durationMs = 5000,
  autoDismiss = true,
  showProgress = true,
  onClose
}: ToastProps) {
  const [progress, setProgress] = React.useState(0)

  useEffect(() => {
    if (!autoDismiss) {
      setProgress(0)
      return
    }

    const intervalMs = 100
    const steps = Math.max(1, Math.floor(durationMs / intervalMs))
    let currentStep = 0

    setProgress(0)

    const intervalId = window.setInterval(() => {
      currentStep += 1
      const nextProgress = Math.min((currentStep / steps) * 100, 100)
      setProgress(nextProgress)
    }, intervalMs)

    const timeoutId = window.setTimeout(() => {
      if (onClose) {
        onClose()
      }
    }, durationMs)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [autoDismiss, durationMs, onClose])

  const baseClasses = 'rounded-md border p-4'
  const typeClasses = {
    success: 'border-green-200 bg-green-100 text-green-800',
    error: 'border-red-200 bg-red-100 text-red-800',
    info: 'border-blue-200 bg-blue-100 text-blue-800'
  }

  const progressTrackClasses = {
    success: 'bg-green-200',
    error: 'bg-red-200',
    info: 'bg-blue-200'
  }

  const progressBarClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="status" aria-live="polite">
      <p className="text-sm font-medium">{message}</p>
      {showProgress && autoDismiss && (
        <div className={`mt-3 h-1 w-full overflow-hidden rounded-full ${progressTrackClasses[type]}`}>
          <div
            className={`h-full transition-[width] duration-100 ease-linear ${progressBarClasses[type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default Toast
