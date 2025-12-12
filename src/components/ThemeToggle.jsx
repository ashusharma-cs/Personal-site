import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
    // Check local storage or system preference
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-transform hover:scale-110 active:scale-90 relative overflow-hidden focus:outline-none"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center text-purple-500"
            >
                <FiMoon size={20} />
            </motion.div>

            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? -180 : 0, scale: theme === 'dark' ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center text-yellow-500"
            >
                <FiSun size={20} />
            </motion.div>

            {/* Invisible placeholder to maintain size */}
            <div className="opacity-0"><FiSun size={20} /></div>
        </button>
    );
};

export default ThemeToggle;
