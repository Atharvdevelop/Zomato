import { useState, FormEvent, CSSProperties } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

interface LoginProps {
  setIsLogin: (val: boolean) => void;
}

function Login({ setIsLogin }: LoginProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setIsError(false)

    try {
      const res = await fetch('http://localhost:8006/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobile, password })
      })

      const result = await res.json()

      if (res.ok) {
        setMessage("Login successful! Redirecting...")
        setIsError(false)
        localStorage.setItem("isloggedIn", "true")
        localStorage.setItem("user", JSON.stringify(result.user))
        setIsLogin(true)

        const origin = (location.state as any)?.from?.pathname || '/'
        setTimeout(() => {
          navigate(origin)
        }, 1500)
      } else {
        setMessage(result.error || result.message || "Invalid mobile number or password.")
        setIsError(true)
      }
    } catch (error) {
      console.error(error)
      setMessage("Network error. Please make sure the backend is running.")
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 24, color: "#1c1c1c", marginBottom: 24, textAlign: 'center' }}>Login</h2>
      
      {message && (
        <div style={{ 
          color: isError ? "#d32f2f" : "#2e7d32", 
          backgroundColor: isError ? "#fdeded" : "#edf7ed", 
          padding: "12px 14px", 
          borderRadius: 8, 
          marginBottom: 16, 
          fontSize: 14,
          textAlign: 'center',
          fontWeight: 500
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <label style={labelStyle}>Mobile Number</label>
        <input
          type='text'
          placeholder="Enter mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          required 
          style={inputStyle}
        />
        <label style={labelStyle}>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={loading ? disabledBtnStyle : btnStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#696969' }}>
        Not registered yet? <Link to="/signup" style={{ color: '#e23744', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
      </div>
    </div>
  )
}

const containerStyle: CSSProperties = {
  maxWidth: '400px',
  margin: '80px auto',
  padding: '32px',
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  margin: '8px 0',
  border: '1.5px solid #e8e8e8',
  borderRadius: '8px',
  boxSizing: 'border-box',
  fontSize: '14px',
  fontFamily: 'inherit',
}

const btnStyle: CSSProperties = {
  width: '100%',
  backgroundColor: '#e23744',
  color: 'white',
  padding: '12px',
  margin: '16px 0 8px 0',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: 'inherit',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#696969',
  marginTop: '12px',
  marginBottom: '4px',
}

const disabledBtnStyle: CSSProperties = {
  ...btnStyle,
  backgroundColor: '#f3b5ba',
  cursor: 'not-allowed',
}

export default Login;