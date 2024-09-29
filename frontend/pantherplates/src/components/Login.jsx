import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({setIsLoggedIn, setUserName}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Simulate login logic or implement actual login using axios
            // Example of real login (if you have an API):
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUserName(username);
                navigate('/dashboard');
            } else {
                console.error('Error logging in');
            }
            
            // Simulate successful login
            console.log('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex justify-center text-gray-700 items-center min-h-screen bg-gradient-to-r from-[#081E3F] to-[#B6862C]">
            <div className="bg-white border-2 border-[#081E3F] rounded-md w-3/4 flex">
                {/* Left side (Sign In form) */}
                <div className="w-1/2 p-10">
                    <h2 className="text-3xl font-bold mb-8  text-left rounded-md">Sign in</h2>

                    <div className="mb-6">
                        <label className="block text-left font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
                            placeholder="Username"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-left font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#081E3F]"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-[#081E3F] text-white py-3 rounded-full font-semibold hover:bg-blue-950 transition"
                    >
                        Sign In
                    </button>
                </div>

                {/* Right side (Welcome section) */}
                <div className="w-1/2 bg-[#081E3F] rounded-r text-white flex flex-col justify-center items-center p-10">
                    <h1 className="text-4xl font-bold mb-4">Welcome,</h1>
                    <h1 className="text-4xl font-bold mb-8">Login Here</h1>

                    <p className="text-lg mb-6">Don’t have an account?</p>
                    
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-[#B6862C] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#a67723] transition"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
