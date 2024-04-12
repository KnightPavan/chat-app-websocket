import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { authUser, setAuthUser } = useAuthContext()

  const login = async ({ userName, password }) => {
    if (!handleInputErrors({ userName, password })) return false

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName, password })
      })

      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }

      localStorage.setItem('chat-user', JSON.stringify(data))
      setAuthUser(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin

function handleInputErrors ({ userName, password }) {
  if (!userName || !password) {
    toast.error('Enter  all fields')
    return false
  }

  if (password.length < 6) {
    toast.error('Password must be atleast 6 characters')
    return false
  }

  return true
}
