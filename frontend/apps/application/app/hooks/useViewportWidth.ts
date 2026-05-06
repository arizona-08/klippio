'use client'
import { useEffect } from 'react'
import { useSidebarStore } from '@/stores/SidebarStore'

export default function useViewportWidth() {
  const setViewportWidth = useSidebarStore((state) => state.setViewportWidth)

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setViewportWidth])
}
