import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, type = 'default', duration = 2500) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), duration)
  }, [])

  return { toast, showToast }
}
