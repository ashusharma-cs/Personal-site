import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    // Static navbar, so scrolling logic is less relevant for the bar itself, 
    // but we can keep it simple. Navbar will just be absolute or relative at the top.

    return (
        <nav className="absolute top-0 left-0 w-full z-50 py-6 bg-transparent">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold tracking-tighter text-black dark:text-purple-500 transition-colors">AS</a>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-300">
                        {/* <a href="#work" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Work</a> */}
                        <a href="#about" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</a>
                        <a href="#contact" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact</a>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
