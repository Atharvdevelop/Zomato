import { useState, FormEvent, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (res.ok) {
        if (!result.user || !result.user.isAdmin) {
          setMessage("Access Denied: You do not have administrator privileges.");
          setIsError(true);
          setLoading(false);
          return;
        }

        setMessage("Authentication successful! Loading dashboard...");
        setIsError(false);
        localStorage.setItem("isloggedIn", "true");
        localStorage.setItem("user", JSON.stringify(result.user));

        // Dispatch storage/user-updated event to let navbar update
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("user-updated"));

        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setMessage(result.error || result.message || "Invalid Admin email or password.");
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setMessage("Network error. Please make sure the backend is running.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginCardStyle}>
        <div style={headerStyle}>
          <div style={badgeStyle}>SYSTEM CONTROL</div>
          <h2 style={titleStyle}>Zomato Admin</h2>
          <p style={subtitleStyle}>Sign in to access manual controls & analytics</p>
        </div>

        {message && (
          <div style={{
            ...alertStyle,
            color: isError ? "#f87171" : "#34d399",
            backgroundColor: isError ? "rgba(239, 68, 68, 0.1)" : "rgba(52, 211, 153, 0.1)",
            border: `1px solid ${isError ? "rgba(239, 68, 68, 0.2)" : "rgba(52, 211, 153, 0.2)"}`
          }}>
            {isError ? "⚠️ " : "🛡️ "}{message}
          </div>
        )}

        <form onSubmit={handleAdminLogin} style={formStyle}>
          <div>
            <label style={labelStyle}>Admin Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@zomato.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Security Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? (
              <span style={spinnerStyle}></span>
            ) : "Authenticate Access 🛡️"}
          </button>
        </form>

        <div style={footerStyle}>
          <a href="/" style={linkStyle}>← Back to Main Website</a>
        </div>
      </div>
    </div>
  );
}

// Styling definitions
const containerStyle: CSSProperties = {
  minHeight: "calc(100vh - 120px)",
  backgroundColor: "#0d0e12",
  backgroundImage: "radial-gradient(circle at 50% 50%, #1e1e24 0%, #0d0e12 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Inter, sans-serif",
  padding: 24,
};

const loginCardStyle: CSSProperties = {
  backgroundColor: "rgba(22, 24, 30, 0.95)",
  border: "1px solid #2a2d37",
  borderRadius: 24,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
  width: "100%",
  maxWidth: 440,
  padding: 40,
  boxSizing: "border-box",
  backdropFilter: "blur(12px)",
};

const headerStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: 28,
};

const badgeStyle: CSSProperties = {
  display: "inline-block",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: 2,
  color: "#e23744",
  backgroundColor: "rgba(226, 55, 68, 0.15)",
  border: "1px solid rgba(226, 55, 68, 0.3)",
  padding: "4px 12px",
  borderRadius: 20,
  marginBottom: 12,
};

const titleStyle: CSSProperties = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 900,
  fontSize: 28,
  color: "#ffffff",
  margin: "0 0 6px",
};

const subtitleStyle: CSSProperties = {
  fontSize: 14,
  color: "#8a90a2",
  margin: 0,
};

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#a0a6b5",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  backgroundColor: "#16181f",
  border: "1.5px solid #2a2d37",
  borderRadius: 12,
  color: "#ffffff",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
};

const buttonStyle: CSSProperties = {
  width: "100%",
  backgroundColor: "#e23744",
  color: "#ffffff",
  border: "none",
  borderRadius: 12,
  padding: "16px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 8,
  boxShadow: "0 8px 24px rgba(226, 55, 68, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const alertStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.5,
  marginBottom: 24,
};

const spinnerStyle: CSSProperties = {
  display: "inline-block",
  width: 20,
  height: 20,
  border: "2.5px solid rgba(255,255,255,0.3)",
  borderTopColor: "#ffffff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const footerStyle: CSSProperties = {
  textAlign: "center",
  marginTop: 28,
  paddingTop: 24,
  borderTop: "1px solid #2a2d37",
};

const linkStyle: CSSProperties = {
  color: "#8a90a2",
  fontSize: 13,
  textDecoration: "none",
  fontWeight: 500,
  transition: "color 0.2s",
};
