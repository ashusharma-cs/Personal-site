import React from 'react';
import { FiGithub, FiInstagram, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer id="contact" className="py-10 text-center text-gray-500 dark:text-gray-400">
            <div className="flex justify-center space-x-6 mb-8">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-purple-500 hover:-translate-y-1 transition-all"><FiGithub size={20} /></a>
                <a href="https://www.linkedin.com/in/ashusharma20/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-purple-500 hover:-translate-y-1 transition-all"><FiLinkedin size={20} /></a>
                {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-purple-500 hover:-translate-y-1 transition-all"><FiTwitter size={20} /></a> */}
                <a href="mailto:ashusharma20@gmail.com" className="hover:text-black dark:hover:text-purple-500 hover:-translate-y-1 transition-all"><FiMail size={20} /></a>
            </div>
            <p className="font-mono text-xs">
                <a href="https://github.com/bchiang7/v4" target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-purple-500 transition-colors">
                    © {new Date().getFullYear()} Ashu Sharma. All rights reserved.
                </a>
            </p>
        </footer>
    );
};

export default Footer;
