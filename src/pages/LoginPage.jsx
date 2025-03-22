import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {setLoggedIn, setUserName, setUserId} = useContext(AuthContext);

    const LOGIN_API_BASE_URL = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_LOCAL_BASE_URL
        : import.meta.env.VITE_PROD_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            const response = await fetch(`${LOGIN_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed.');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setLoggedIn(true);
            setUserName(data.user.name);
            setUserId(data.user.id);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Right Side - Login Form */}
            <div className="relative z-10 bg-black p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">Login</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600 transition duration-300 font-bold"
                        >
                            Login
                        </button>
                    </form>
                    <p className="mt-4 text-gray-300">
                        Don’t have an account?{' '}
                        <Link to="/register" className="text-yellow-400 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
