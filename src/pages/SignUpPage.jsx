import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner.jsx";


const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const REGISTER_API_BASE_URL = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_LOCAL_BASE_URL
        : import.meta.env.VITE_PROD_BASE_URL;

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${REGISTER_API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Sign up failed. Please try again.');
            }

            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Sign-up Box */}
            <div className="relative z-10 bg-black p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Enter your name"
                        />
                    </div>
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
                        className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-600 transition duration-300 font-bold flex justify-center items-center"
                    >
                        {isLoading ? <Spinner /> : "Sign up"}
                    </button>
                </form>
                <p className="mt-4 text-gray-300">
                    Already have an account?{' '}
                    <Link to="/login" className="text-yellow-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
