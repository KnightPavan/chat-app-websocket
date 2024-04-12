import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext.jsx'

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const { authUser, setAuthUser } = useAuthContext()

  const signup = async ({
    fullName,
    userName,
    password,
    confirmPassword,
    gender
  }) => {
    // console.log({
    //   fullName,
    //   userName,
    //   password,
    //   confirmPassword,
    //   gender
    // })
    const success = handleInputErrors({
      fullName,
      userName,
      password,
      confirmPassword,
      gender
    })

    if (!success) return
    setLoading(true)

    try {
      const userData = {
        fullName,
        userName,
        password,
        confirmPassword,
        gender
      }
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await res.json()
      console.log(data)

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

  return { loading, signup }
}

export default useSignup

function handleInputErrors ({
  fullName,
  userName,
  password,
  confirmPassword,
  gender
}) {
  if (!fullName || !userName || !password || !confirmPassword || !gender) {
    toast.error('Enter  all fields')
    return false
  }

  if (password !== confirmPassword) {
    toast.error('Passwords do not match')
    return false
  }

  if (password.length < 6) {
    toast.error('Password must be atleast 6 characters')
    return false
  }

  return true
}
