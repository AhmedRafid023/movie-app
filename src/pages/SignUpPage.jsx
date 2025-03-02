import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const REGISTER_API_BASE_URL = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_LOCAL_BASE_URL
        : import.meta.env.VITE_PROD_BASE_URL;
    const API_OPTIONS = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password })
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Simulate sign-up (replace with actual API call)
        try {
            const response = await fetch(`${REGISTER_API_BASE_URL}/auth/register`, API_OPTIONS);

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Sign up failed. Please try again.');
            }

            // Redirect to login page on successful sign-up
            navigate('/login');


        }catch(err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen pattern flex items-center justify-center p-4">
            <div className="bg-dark-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-light-200 mb-6">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-light-200 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-dark-700 text-light-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-100"
                            placeholder="Enter your name"
                        />
                    </div>
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
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-light-200">
                    Already have an account?{' '}
                    <Link to="/login" className="text-light-100 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;