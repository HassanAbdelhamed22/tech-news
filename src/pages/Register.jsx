import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { validateField } from "../utils/validate";
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Rocket } from "lucide-react";

import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "#e2e8f0", width: "0%" };
    let score = 0;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { label: "Weak", color: "#ef4444", width: "25%" };
      case 2:
        return { label: "Fair", color: "#f59e0b", width: "50%" };
      case 3:
        return { label: "Good", color: "#10b981", width: "75%" };
      case 4:
        return { label: "Strong", color: "#059669", width: "100%" };
      default:
        return { label: "", color: "#e2e8f0", width: "0%" };
    }
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: formData.password !== formData.confirmPassword ? "Passwords do not match" : "",
    };

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:5000/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        joinedAt: new Date().toISOString(),
      });

      const { user, accessToken } = response.data;
      login(user, accessToken);
      toast.success("Welcome to TechNews!");
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.status === 400) {
        toast.error("Email already exists or invalid data");
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
          <h1 className="visual-title">Start your journey in tech.</h1>
          <p className="visual-text">
            Join thousands of developers sharing ideas and insights. Get curated news, share your projects, and connect with peers.
          </p>
          
          <div className="trending-tags">
            <div className="tag-pill">#AIAgenticWorkflows</div>
            <div className="tag-pill">#React19</div>
            <div className="tag-pill">#RustEnterprise</div>
            <div className="tag-pill">#WebAssembly</div>
          </div>

          <div className="trust-signal" style={{marginTop: '3rem', justifyContent: 'flex-start', color: 'rgba(255, 255, 255, 0.8)'}}>
            <ShieldCheck size={20} />
            <span style={{fontSize: '0.875rem', marginLeft: '0.5rem'}}>We never share your data. Ever.</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Create your account and start shaping the future of tech.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="auth-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  className="auth-input"
                  value={formData.fullName}
                  placeholder="John Doe"
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>

            <div className="auth-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Mail size={18} />
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
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="auth-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={18} />
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-meter">
                    <div 
                      className="strength-bar" 
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: strength.color }}>
                    Password Strength: {strength.label}
                  </span>
                </div>
              )}
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-cta" disabled={isSubmitting} style={{marginTop: '1rem'}}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Join the Conversation"
              )}
            </button>
          </form>

          <p className="privacy-notice">
            By creating an account, you agree to our Terms of Service and Privacy Policy. We'll send you occasional product updates.
          </p>

          <div className="auth-footer">
            Already have an account?
            <Link to="/login" className="auth-link">Sign in instead</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
