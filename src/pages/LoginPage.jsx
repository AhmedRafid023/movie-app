import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Simulate login (replace with actual API call)
        if (email === 'user@example.com' && password === 'password') {
            setError('');
            alert('Login successful!');
            navigate('/'); // Redirect to home page after login
        } else {
            setError('Invalid email or password.');
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
