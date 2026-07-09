import { useState, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit Form Fields
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const localUserStr = localStorage.getItem("user");
      if (!localUserStr) {
        throw new Error("No user session found. Please log in.");
      }

      const cachedUser = JSON.parse(localUserStr);
      const userId = cachedUser.id;

      if (!userId) {
        throw new Error("Invalid user session. User ID missing.");
      }

      const res = await fetch(`http://localhost:8006/api/users/${userId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.statusText}`);
      }

      const data = await res.json();
      setUserData(data);

      // Initialize form fields
      setUsername(data.username || "");
      setEmail(data.email || "");
      setMobile(data.mobile || "");
      setPassword(data.password || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData || !userData.id) return;

    try {
      setSubmitting(true);
      setError("");
      setSuccessMsg("");

      const res = await fetch(`http://localhost:8006/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          mobile,
          password
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMsg("Profile updated successfully!");
        setUserData(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        setIsEditing(false);
        // Dispatch custom event to let navbar know that the user data changed
        window.dispatchEvent(new Event("user-updated"));
      } else {
        throw new Error(result.error || result.message || "Failed to update profile.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error updating credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("isloggedIn");
      localStorage.removeItem("user");
      // Trigger a window event to notify other components (like navbar) of the logout
      window.dispatchEvent(new Event("storage"));
      navigate("/login");
      window.location.reload();
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={centerContainerStyle}>
        <div style={spinnerStyle}></div>
        <p style={{ marginTop: 16, color: "#696969", fontFamily: "Inter, sans-serif", fontSize: 16 }}>
          Fetching credentials from the database...
        </p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div style={centerContainerStyle}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1c1c1c" }}>Error Loading Profile</h3>
        <p style={{ color: "#d32f2f", margin: "8px 0 24px", maxWidth: 400, textAlign: "center" }}>{error}</p>
        <button onClick={fetchProfile} style={retryBtnStyle}>
          Retry Fetching
        </button>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <div style={profileCardStyle}>
        {/* Banner area */}
        <div style={bannerStyle}>
          <div style={avatarStyle}>
            {getInitials(userData?.username)}
          </div>
        </div>

        {/* User profile content */}
        <div style={contentStyle}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: "48px 0 4px" }}>
              {userData?.username}
            </h2>
            <p style={{ color: "#9e9e9e", fontSize: 14, margin: 0, fontFamily: "Inter, sans-serif" }}>
              Member since: {formatDate(userData?.createdAt)}
            </p>
          </div>

          {successMsg && <div style={successAlertStyle}>✨ {successMsg}</div>}
          {error && <div style={errorAlertStyle}>❌ {error}</div>}

          {!isEditing ? (
            <div style={detailsGridStyle}>
              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Username</label>
                <div style={fieldValueStyle}>{userData?.username || "—"}</div>
              </div>

              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Email Address</label>
                <div style={fieldValueStyle}>{userData?.email || "—"}</div>
              </div>

              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Mobile Number</label>
                <div style={fieldValueStyle}>{userData?.mobile || "—"}</div>
              </div>

              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Password</label>
                <div style={{ ...fieldValueStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{showPassword ? userData?.password : "••••••••••••"}</span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={textLinkBtnStyle}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div style={actionsRowStyle}>
                <button onClick={() => setIsEditing(true)} style={editBtnStyle}>
                  ✏️ Edit Profile
                </button>
                <button onClick={handleLogout} style={logoutBtnStyle}>
                  🚪 Sign Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} style={detailsGridStyle}>
              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter username"
                />
              </div>

              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter email address"
                />
              </div>

              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Mobile Number</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter mobile number"
                />
              </div>

              <div style={fieldBlockStyle}>
                <label style={fieldLabelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 60 }}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeButtonStyle}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div style={actionsRowStyle}>
                <button type="submit" disabled={submitting} style={submitBtnStyle}>
                  {submitting ? "Saving..." : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset field values to matching database ones
                    setUsername(userData?.username || "");
                    setEmail(userData?.email || "");
                    setMobile(userData?.mobile || "");
                    setPassword(userData?.password || "");
                  }}
                  style={cancelBtnStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Styling definitions to give high quality Zomato-themed dashboard look
const pageContainerStyle: CSSProperties = {
  background: "#f8f8f8",
  minHeight: "calc(100vh - 120px)",
  padding: "48px 24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Inter, sans-serif",
};

const profileCardStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
  width: "100%",
  maxWidth: 520,
  overflow: "hidden",
  position: "relative",
  border: "1px solid #f0f0f0",
};

const bannerStyle: CSSProperties = {
  background: "linear-gradient(135deg, #e23744 0%, #ff6b7a 100%)",
  height: 120,
  position: "relative",
  display: "flex",
  justifyContent: "center",
};

const avatarStyle: CSSProperties = {
  width: 96,
  height: 96,
  borderRadius: "50%",
  background: "#ffffff",
  color: "#e23744",
  border: "4px solid #ffffff",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  position: "absolute",
  bottom: -48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 40,
  fontWeight: 800,
  fontFamily: "Poppins, sans-serif",
};

const contentStyle: CSSProperties = {
  padding: "24px 32px 32px",
};

const detailsGridStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const fieldBlockStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const fieldLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#9e9e9e",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const fieldValueStyle: CSSProperties = {
  fontSize: 15,
  color: "#1c1c1c",
  padding: "12px 16px",
  backgroundColor: "#f9f9f9",
  borderRadius: 10,
  border: "1px solid #f0f0f0",
  fontWeight: 500,
};

const inputStyle: CSSProperties = {
  fontSize: 15,
  color: "#1c1c1c",
  padding: "12px 16px",
  backgroundColor: "#ffffff",
  borderRadius: 10,
  border: "1.5px solid #e8e8e8",
  fontWeight: 500,
  outline: "none",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
};

const textLinkBtnStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "#e23744",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
  padding: 0,
};

const eyeButtonStyle: CSSProperties = {
  position: "absolute",
  right: 16,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "#9e9e9e",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 13,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 16,
  marginTop: 12,
};

const editBtnStyle: CSSProperties = {
  flex: 1,
  background: "#1c1c1c",
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.2s",
};

const logoutBtnStyle: CSSProperties = {
  background: "none",
  color: "#e23744",
  border: "1.5px solid #e23744",
  borderRadius: 10,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const submitBtnStyle: CSSProperties = {
  flex: 1,
  background: "#e23744",
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const cancelBtnStyle: CSSProperties = {
  background: "#f0f0f0",
  color: "#1c1c1c",
  border: "none",
  borderRadius: 10,
  padding: "12px 20px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const successAlertStyle: CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#edf7ed",
  color: "#2e7d32",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 20,
  textAlign: "center",
};

const errorAlertStyle: CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#fdeded",
  color: "#d32f2f",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 20,
  textAlign: "center",
};

const centerContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 120px)",
  padding: 24,
};

const spinnerStyle: CSSProperties = {
  width: 48,
  height: 48,
  border: "4px solid #f0f0f0",
  borderTop: "4px solid #e23744",
  borderRadius: "50%",
};

const retryBtnStyle: CSSProperties = {
  background: "#e23744",
  color: "#ffffff",
  border: "none",
  borderRadius: 10,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
