import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TOPOLOGY from 'vanta/dist/vanta.topology.min';
import p5 from 'p5';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);
    const vantaRef = useRef(null);
    const vantaEffect = useRef(null);

    useEffect(() => {
        if (!vantaEffect.current) {
            vantaEffect.current = TOPOLOGY({
                el: vantaRef.current,
                p5: p5,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0xc2a0c2,
                backgroundColor: 0x0a0a1a
            });
        }
        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container" ref={vantaRef}>
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="logo">
                            <span className="logo-icon">🌊</span>
                            <h1>AquaNova</h1>
                        </div>
                        <p className="subtitle">Marine Data Intelligence Platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <h2>Welcome Back</h2>
                        <p className="form-subtitle">Sign in to access your marine data dashboard</p>

                        {successMessage && (
                            <div className="success-message">
                                <span>✅</span> {successMessage}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="form-extras">
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/signup" className="auth-link">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="auth-info">
                    <h3>Access Real-Time Marine Data</h3>
                    <ul>
                        <li>
                            <span className="info-icon">📊</span>
                            <div>
                                <strong>156 Active Datasets</strong>
                                <p>From Copernicus Marine & INCOIS</p>
                            </div>
                        </li>
                        <li>
                            <span className="info-icon">🐟</span>
                            <div>
                                <strong>1,247 Species Monitored</strong>
                                <p>Comprehensive biodiversity tracking</p>
                            </div>
                        </li>
                        <li>
                            <span className="info-icon">🤖</span>
                            <div>
                                <strong>AI-Powered Insights</strong>
                                <p>Chat with our marine data assistant</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
