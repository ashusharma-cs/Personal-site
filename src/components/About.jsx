import React from 'react';
import AlgoExplorer from './AlgoExplorer';

const About = () => {
    return (
        <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold text-black dark:text-white mb-12">
                <span className="text-black dark:text-purple-500 font-mono mr-4">01.</span>
                Engineering Journey
                <span className="h-px bg-lightBorder dark:bg-gray-800 flex-grow ml-6"></span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div className="text-gray-700 dark:text-gray-400 leading-relaxed text-base space-y-4 tracking-wide">
                    <p>
                        I am an aspiring software engineer with a deep passion for **algorithmic problem solving** and system design.
                        Currently, I am dedicating my time to mastering Data Structures and Algorithms to prepare for technical roles at top-tier technology companies.
                    </p>
                    <p>
                        My focus is on understanding the fundamental patterns that drive efficient software, from **optimizing time complexity** to architecting scalable solutions.
                    </p>
                </div>

                <div className="relative group flex justify-center items-center">
                    <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-lightNavy w-full">
                        <h3 className="font-mono text-black dark:text-purple-500 mb-4 text-xs font-bold tracking-widest">CURRENT STATUS</h3>
                        <ul className="space-y-3 font-mono text-xs text-gray-600 dark:text-slate tracking-wide">
                            <li className="flex justify-between">
                                <span>&gt; FOCUS:</span>
                                <span className="text-black dark:text-white">Data Structures & Algorithms</span>
                            </li>
                            <li className="flex justify-between">
                                <span>&gt; PRACTICE:</span>
                                <span className="text-black dark:text-white">LeetCode</span>
                            </li>
                            <li className="flex justify-between">
                                <span>&gt; GOAL:</span>
                                <span className="text-black dark:text-white">Software Engineer Role</span>
                            </li>
                            <li className="flex justify-between">
                                <span>&gt; STATE:</span>
                                <span className="text-green-600 dark:text-green-400">Open to Work</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

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
