import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {setLoggedIn, setUserName, setUserId} = useContext(AuthContext);

    const LOGIN_API_BASE_URL = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_LOCAL_BASE_URL
        : import.meta.env.VITE_PROD_BASE_URL;
    const API_OPTIONS = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Simulate login (replace with actual API call)
        try {
            const response = await fetch(`${LOGIN_API_BASE_URL}/auth/login`, API_OPTIONS);

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed. Please try again.');
            }

            if (data.token) {
                localStorage.setItem('token', data.token); // Store the token in localStorage
            }

            if(data.user){
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            setLoggedIn(true);
            setUserName(data.user.name);
            setUserId(data.user.id);

            // Redirect to the home page or dashboard on successful login
            navigate('/');
        }catch (error){
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen pattern flex items-center justify-center p-4">
            <div className="bg-black-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-light-200 mb-6">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-light-200 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-700 text-light-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-100"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-light-200 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-700 text-light-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-100"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-light-100/20 text-light-200 py-2 rounded-lg hover:bg-light-100/30 transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-light-200">
                    Don&#39;t have an account?{' '}
                    <Link to="/register" className="text-light-100 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
