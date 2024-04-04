import { useState } from 'react'
import toast from 'react-hot-toast'

const useSignup = () => {
  const [loading, setLoading] = useState(false)

  const signup = async (
    fullName,
    userName,
    password,
    confirmPassword,
    gender
  ) => {
    console.log({
      fullName,
      userName,
      password,
      confirmPassword,
      gender
    })
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
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          fullName,
          userName,
          password,
          confirmPassword,
          gender
        })
      })

      const data = await res.json()
      console.log(data)
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
  }

  return true
}
