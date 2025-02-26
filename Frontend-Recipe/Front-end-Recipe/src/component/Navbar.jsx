import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setIsAuthenticated({
            isLoggedIn: false,
            user: null
        });
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-gray-800">
                            Recipe App
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        {isAuthenticated.isLoggedIn ? (
                            <>
                                <Link to="/recipes" className="text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-sm font-medium">
                                    Favourate Recipes
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-rose-500 border-2 border-rose-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-500 hover:text-white">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-600">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                    <Link to="/" className="block text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-base font-medium">
                        Home
                    </Link>
                    {isAuthenticated.isLoggedIn ? (
                        <>
                            <Link to="/recipes" className="block text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-base font-medium">
                                Recipes
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-base font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-base font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="block text-gray-700 hover:text-rose-500 px-3 py-2 rounded-md text-base font-medium">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;