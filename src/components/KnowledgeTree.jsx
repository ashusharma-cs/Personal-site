import React from 'react';
import { motion } from 'framer-motion';

const TreeNode = ({ label, children, delay = 0 }) => {
    return (
        <div className="flex flex-col items-center relative">
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay }}
                className="z-10"
            >
                <div className="bg-white dark:bg-lightNavy border-2 border-purple-500 rounded-lg px-4 py-2 shadow-lg hover:shadow-purple-500/20 transition-all cursor-default">
                    <span className="text-black dark:text-lightestSlate font-mono text-xs md:text-sm font-bold block text-center min-w-[80px]">
                        {label}
                    </span>
                </div>
            </motion.div>

            {children && (
                <>
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: 24 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: delay + 0.2 }}
                        className="w-0.5 bg-purple-500/30"
                    ></motion.div>

                    <div className="flex gap-4 md:gap-8 relative pt-4 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-2rem)] before:h-0.5 before:bg-purple-500/30">
                        {children}
                    </div>
                </>
            )}
        </div>
    );
};

const LeafNode = ({ label, delay = 0 }) => {
    return (
        <div className="flex flex-col items-center relative pt-4 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:h-4 before:bg-purple-500/30">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: delay }}
                className="bg-purple-50 dark:bg-navy border border-purple-200 dark:border-purple-900 rounded px-3 py-1 hover:-translate-y-1 transition-transform"
            >
                <span className="text-purple-700 dark:text-purple-300 text-[10px] md:text-xs font-mono">
                    {label}
                </span>
            </motion.div>
        </div>
    );
};

const KnowledgeTree = () => {
    return (
        <div className="w-full overflow-x-auto py-8 text-center">
            <div className="inline-flex flex-col items-center min-w-max px-8">
                {/* Root */}
                <TreeNode label="DSA Mastery" delay={0}>
                    {/* Branch 1: Arrays/Strings */}
                    <TreeNode label="Arrays & Hashing" delay={0.2}>
                        <div className="flex gap-2">
                            <LeafNode label="Two Pointers" delay={0.4} />
                            <LeafNode label="Sliding Window" delay={0.5} />
                            <LeafNode label="Prefix Sum" delay={0.6} />
                        </div>
                    </TreeNode>

                    {/* Branch 2: Trees/Graphs */}
                    <TreeNode label="Trees & Graphs" delay={0.3}>
                        <div className="flex gap-2">
                            <LeafNode label="BFS / DFS" delay={0.5} />
                            <LeafNode label="Invert Binary Tree" delay={0.6} />
                            <LeafNode label="Recursion" delay={0.7} />
                        </div>
                    </TreeNode>

                    {/* Branch 3: DP */}
                    <TreeNode label="Dynamic Prog." delay={0.4}>
                        <div className="flex gap-2">
                            <LeafNode label="Memoization" delay={0.6} />
                            <LeafNode label="1D / 2D DP" delay={0.7} />
                        </div>
                    </TreeNode>
                </TreeNode>

                <p className="mt-8 text-xs font-mono text-gray-400 dark:text-gray-500 animate-pulse">
                    &gt; CURRENTLY PARSING: BINARY SEARCH...
                </p>
            </div>
        </div>
    );
};

export default KnowledgeTree;
