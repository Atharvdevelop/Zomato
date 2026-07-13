import { useState, FormEvent, CSSProperties } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '../config'
interface SignupProps {
    setData: React.Dispatch<React.SetStateAction<any[]>>;
}
function Signup({ setData }: SignupProps) {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setIsError(false)

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, mobile, password })
            })

            const result = await res.json()

            if (res.ok) {
                setMessage("Registration successful! Redirecting to login...")
                setIsError(false)
                setData(prev => [...prev, result])
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            } else {
                setMessage(result.error || result.message || "Failed to sign up. Please try again.")
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
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 24, color: "#1c1c1c", marginBottom: 24, textAlign: 'center' }}>Sign Up</h2>

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

            <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />

                <label style={labelStyle}>Mobile Number</label>
                <input
                    type="text"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    required
                    style={inputStyle}
                />
                

                <label style={labelStyle}>Password</label>
                <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />

                <button type="submit" disabled={loading} style={loading ? disabledBtnStyle : btnStyle}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#696969' }}>
                Already have an account? <Link to="/login" style={{ color: '#e23744', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
            </div>
        </div>
    )
}

const containerStyle: CSSProperties = {
    maxWidth: '400px',
    margin: '60px auto',
    padding: '32px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}

const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#696969',
    marginTop: '12px',
    marginBottom: '4px',
}

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e8e8e8',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
}

const btnStyle: CSSProperties = {
    width: '100%',
    backgroundColor: '#e23744',
    color: 'white',
    padding: '12px',
    marginTop: '24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: 'inherit',
}

const disabledBtnStyle: CSSProperties = {
    ...btnStyle,
    backgroundColor: '#f3b5ba',
    cursor: 'not-allowed',
}

export default Signup
