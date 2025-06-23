
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginUser, createUser } from '../services/userService'; // Import the functions
import { toast } from 'react-toastify'; // Optional: for better error/success messages

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To redirect after successful login/signup

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = { email, password };
    
    try {
      const data = await loginUser(credentials);
      localStorage.setItem('token', data.token); // Save token to localStorage
      toast.success('Login successful');
      window.location.reload()
      // navigate('/dashboard'); // Redirect to the dashboard
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Something went wrong during login');
    }
  };

  // Function to handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const userData = { email, password, name };

    try {
      const data = await createUser(userData);
      toast.success('Signup successful');
      setLoading(false)
      setIsLogin(true); // Switch to login after successful signup
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Something went wrong during signup');
    }
  };

  return (
    <div className="bg-gray-100 h-screen w-full flex flex-col justify-start items-center">
      <div className='w-full flex justify-start px-3 py-2'>
        <NavLink to="/home" className="px-4 py-1">KMS</NavLink>
      </div>

      {/* Auth Section */}
      <section className="flex justify-center py-6 min-w-[90%] max-h-[98vh] border-t-2 overflow-auto">
        <div className="bg-white p-6 pt-4 rounded-lg shadow-lg w-full max-w-md h-full">
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-3">
            {isLogin ? "Login" : "Signup"}
          </h2>

          {/* Toggle between Login and Signup */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-md text-xs font-medium ${isLogin ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-md text-xs font-medium ${!isLogin ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Signup
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-1">
          <div>
              <label htmlFor="name" className="block text-xs text-gray-700">Name</label>
              <input
                id="name"
                type="name"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs text-gray-700">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-sm text-md hover:bg-indigo-400 transition"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Auth;
