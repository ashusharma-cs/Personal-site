import React from 'react';
import AlgoExplorer from './AlgoExplorer';
import TechWave from './TechWave';

const About = () => {
    return (
        <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold text-black dark:text-white mb-12">
                <span className="text-black dark:text-purple-500 font-mono mr-4">01.</span>
                Engineering Journey
                <span className="h-px bg-lightBorder dark:bg-gray-800 flex-grow ml-6"></span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
                <div className="text-gray-700 dark:text-gray-400 leading-relaxed text-base space-y-4 tracking-wide">
                    <p>
                        I am an aspiring software engineer with a deep passion for **algorithmic problem solving** and system design.
                        Currently, I am dedicating my time to mastering Data Structures and Algorithms to prepare for technical roles at top-tier technology companies.
                    </p>
                    <p>
                        My focus is on understanding the fundamental patterns that drive efficient software, from **optimizing time complexity** to architecting scalable solutions.
                    </p>
                </div>

                {/* Interactive Photo Column */}
                <div className="relative group w-full max-w-md mx-auto md:max-w-full">
                    <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-xl border-2 border-gray-200 dark:border-white/10 group-hover:border-purple-500 transition-colors duration-300 bg-black">
                        {/* Glitch Overlay Base */}
                        <div className="absolute inset-0 bg-purple-500 mix-blend-color opacity-0 group-hover:opacity-20 transition-opacity z-10 pointer-events-none"></div>

                        {/* Main Image */}
                        <img
                            src="/profile.jpg"
                            alt="Ashu Sharma"
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300 scale-100 group-hover:scale-105"
                        />

                        {/* Glitch Layers (Hidden by default, visible on hover) */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-50 mix-blend-screen animate-pulse hidden group-hover:block pointer-events-none"
                            style={{ backgroundImage: 'url("/profile.jpg")', transform: 'translateX(4px)' }}></div>
                        <div className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-50 mix-blend-multiply animate-pulse hidden group-hover:block pointer-events-none"
                            style={{ backgroundImage: 'url("/profile.jpg")', transform: 'translateX(-4px)' }}></div>

                        {/* Status Overlay Card */}
                        <div className="absolute bottom-4 left-4 right-4 p-4 border border-white/20 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-lg z-20">
                            <h3 className="font-mono text-black dark:text-purple-400 mb-2 text-[10px] font-bold tracking-widest uppercase">CURRENT STATUS</h3>
                            <ul className="space-y-1.5 font-mono text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 tracking-wide">
                                <li className="flex justify-between">
                                    <span className="opacity-70">&gt; FOCUS:</span>
                                    <span className="font-semibold text-black dark:text-white">Data Structures & Algorithms</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="opacity-70">&gt; PRACTICE:</span>
                                    <span className="text-black dark:text-white">LeetCode</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="opacity-70">&gt; GOAL:</span>
                                    <span className="text-black dark:text-white">Software Engineer Role</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="opacity-70">&gt; STATE:</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold animate-pulse">Open to Work</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Wave Visualization */}
            <TechWave />

            {/* Interactive Algo Explorer */}
            <div className="mt-12">
                <h3 className="text-center text-xl font-bold text-black dark:text-white mb-8">
                    <span className="font-mono text-purple-500 text-sm block mb-2">My Tech Stack</span>
                    Algorithmic Knowledge Base
                </h3>
                <AlgoExplorer />
            </div>
        </section>
    );
};

export default About;
