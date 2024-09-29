import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fiudining from '../pantherdining.png';

const Signup = ({setIsLoggedIn, setUserName}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            // Placeholder for login logic
            const response = await axios.post('http://127.0.0.1:5000/signup', { username, password });
            if (response.status === 200) {
                setIsLoggedIn(true);
                setUserName(username);
                navigate('/dashboard');
            } else {
                console.error('Error logging in');
            }
            
            console.log('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="flex justify-center text-gray-700 text-left items-center min-h-screen bg-gradient-to-r from-[#081E3F] to-[#B6862C]">
            <div className="bg-white shadow-md border-2 border-[#081E3F] rounded-md w-3/4 flex">
                {/* Left side (Sign In form) */}
                <div className="w-1/2 p-10">
                    <h2 className="text-3xl font-bold mb-8">Sign Up</h2>

                    <div className="mb-6">
                        <label className="block text-left font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Username"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-left font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Password"
                        />
                    </div>

                    {/* Retype password */}
                    {/* <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Password"
                        />
                    </div> */}

                    <button
                        onClick={handleSignUp}
                        className="w-full bg-[#081E3F] text-white py-3 rounded-full font-semibold hover:bg-blue-950 transition"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Right side (Welcome section) */}
                <div className="w-1/2 bg-[#081E3F] bg-opacity-90 rounded-r text-white flex flex-col justify-center items-center p-10">
                    <img
                        src={fiudining}
                        alt="Welcome"
                        className="rounded-lg mb-4 w-full h-40 object-cover"
                    />
                    <h1 className="text-4xl font-bold mb-5">Sign up</h1>

                    <p className="text-lg mb-1">Already have an account?</p>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[#B6862C] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#a67723] transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
