import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { validateField } from "../utils/validate";
import { Mail, Lock, Eye, EyeOff, Rocket, ShieldCheck } from "lucide-react";
import API from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user, accessToken } = response.data;
      login(user, accessToken);
      toast.success(`Welcome back, ${user.fullName || user.email}!`);
      navigate("/");
    } catch (err) {
      console.error("Auth error:", err);
      if (err.response?.status === 400) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Branding Side */}
      <div className="auth-visual">
        <div className="visual-content">
          <div className="visual-logo">
            <Rocket size={32} strokeWidth={2.5} />
            TechNews
          </div>
          <h1 className="visual-title">
            Join the conversation shaping the future.
          </h1>
          <p className="visual-text">
            The world's most innovative engineers and designers share their
            insights here. Don't just watch the future happen—be part of it.
          </p>

          <div className="trending-tags">
            <div className="tag-pill">#AIAgenticWorkflows</div>
            <div className="tag-pill">#React19</div>
            <div className="tag-pill">#RustEnterprise</div>
            <div className="tag-pill">#WebAssembly</div>
          </div>

          <div
            className="trust-signal"
            style={{
              marginTop: "3rem",
              justifyContent: "flex-start",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <ShieldCheck size={20} />
            <span style={{ fontSize: "0.875rem", marginLeft: "0.5rem" }}>
              Your data is encrypted and secure.
            </span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Welcome back. Let's get you into the conversation.</p>
          </div>

          <div className="social-buttons">
            <button className="social-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="divider">or sign in with email</div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="auth-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  value={formData.email}
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <span className="error-msg">{errors.email}</span>
              )}
            </div>

            <div className="auth-group">
              <div className="label-row">
                <label className="form-label">Password</label>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={20} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-input"
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-msg">{errors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  className="checkbox-custom"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <Link to="#" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-cta"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                "Enter TechNews"
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?
            <Link to="/register" className="auth-link">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
