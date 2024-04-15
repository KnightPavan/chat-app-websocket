import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from './AuthContext'
import io from 'socket.io-client'
const SocketContext = createContext()

export const useSocketContext = () => {
  return useContext(SocketContext)
}
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUser] = useState([])
  const { authUser } = useAuthContext()

  useEffect(() => {
    if (authUser) {
      const socket = io('http://localhost:3000', {
        query: {
          userId: authUser._id
        }
      })
      setSocket(socket)

      // socket.on() is used to listen to the events. can be used on client and server side
      socket.on('getOnlineUsers', users => {
        setOnlineUser(users)
      })
      return () => socket.close()
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [authUser])
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}
