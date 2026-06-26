import { createContext, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

export const NotifContext = createContext()

export const NotifProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchNotifications()
  }, [user])

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications')
      setNotifications(data)
      const unread = data.filter(n => !n.isRead).length
      setUnreadCount(unread)
    } catch (error) {
      console.error('Failed to fetch notifications')
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark as read')
    }
  }

  return (
    <NotifContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
      {children}
    </NotifContext.Provider>
  )
}