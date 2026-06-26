import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './useAuth'

export const useSocket = () => {
  const { user } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (user) {
      socketRef.current = io('http://localhost:5000')
      socketRef.current.emit('join', user._id)
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [user])

  return socketRef.current
}