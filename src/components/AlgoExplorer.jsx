import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFolder, FiFileText, FiChevronRight, FiChevronDown, FiCode, FiCpu, FiDatabase } from 'react-icons/fi';

const dsData = [
    {
        id: 'arrays',
        name: 'src/arrays',
        type: 'folder',
        children: [
            { id: 'two-pointers', name: 'two_pointers.cpp', type: 'file', complexity: 'O(n)', space: 'O(1)', desc: 'Efficiently traverse arrays from both ends.' },
            { id: 'sliding-window', name: 'sliding_window.cpp', type: 'file', complexity: 'O(n)', space: 'O(1)', desc: 'Subarray optimization technique.' },
            { id: 'prefix-sum', name: 'prefix_sum.cpp', type: 'file', complexity: 'O(1)', space: 'O(n)', desc: 'Fast range sum queries.' },
        ]
    },
    {
        id: 'trees',
        name: 'src/trees',
        type: 'folder',
        children: [
            { id: 'bfs', name: 'bfs_traversal.cpp', type: 'file', complexity: 'O(V+E)', space: 'O(w)', desc: 'Level-order traversal.' },
            { id: 'dfs', name: 'dfs_recursion.cpp', type: 'file', complexity: 'O(V+E)', space: 'O(h)', desc: 'Depth-first exploration.' },
            { id: 'invert', name: 'invert_tree.cpp', type: 'file', complexity: 'O(n)', space: 'O(h)', desc: 'Classic interview problem.' },
        ]
    },
    {
        id: 'dp',
        name: 'src/dynamic_programming',
        type: 'folder',
        children: [
            { id: 'memo', name: 'memoization.cpp', type: 'file', complexity: 'O(n)', space: 'O(n)', desc: 'Caching recursive results.' },
            { id: 'tabulation', name: '2d_grid_dp.cpp', type: 'file', complexity: 'O(m*n)', space: 'O(m*n)', desc: 'Bottom-up optimization.' },
        ]
    }
];

const FileIcon = () => {
    return <span className="text-blue-500 mr-2 text-xs font-bold">C++</span>;
};

const AlgoExplorer = () => {
    const [expanded, setExpanded] = useState(['arrays', 'trees']); // Default open
    const [selected, setSelected] = useState(dsData[0].children[0]); // Default first item

    const toggleFolder = (id) => {
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-full flex flex-col md:flex-row gap-0 md:gap-6 h-[500px] md:h-[400px] font-mono text-sm border border-black/10 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-[#0a192f] shadow-xl">
            {/* Sidebar (Explorer) */}
            <div className="w-full md:w-1/3 bg-gray-50 dark:bg-[#112240] flex flex-col border-b md:border-b-0 md:border-r border-black/10 dark:border-white/5 overflow-hidden">
                <div className="p-3 text-xs font-bold text-gray-400 border-b border-black/5 dark:border-white/5 tracking-widest shrink-0">
                    EXPLORER
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-1 p-2">
                    {dsData.map((folder) => (
                        <div key={folder.id} className="mb-1">
                            {/* Folder Header */}
                            <div
                                onClick={() => toggleFolder(folder.id)}
                                className="flex items-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 py-1 px-2 rounded text-gray-700 dark:text-gray-300 select-none whitespace-nowrap"
                            >
                                <span className="mr-1 text-gray-400 shrink-0">
                                    {expanded.includes(folder.id) ? <FiChevronDown /> : <FiChevronRight />}
                                </span>
                                <FiFolder className="mr-2 text-purple-500 fill-current/20 shrink-0" />
                                <span className="font-bold truncate">{folder.name}</span>
                            </div>

                            {/* Folder Contents */}
                            <AnimatePresence>
                                {expanded.includes(folder.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden ml-4 pl-2 border-l border-black/5 dark:border-white/5"
                                    >
                                        {folder.children.map((file) => (
                                            <div
                                                key={file.id}
                                                onClick={() => setSelected(file)}
                                                className={`flex items-center cursor-pointer py-1 px-2 rounded mt-0.5 transition-colors whitespace-nowrap ${selected?.id === file.id ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                                            >
                                                <div className="shrink-0"><FileIcon /></div>
                                                <span className="truncate">{file.name}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content (Code/Details View) */}
            <div className="flex-1 bg-white dark:bg-[#0a192f] p-6 flex flex-col relative overflow-hidden">
                {selected ? (
                    <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                    >
                        {/* Tab Bar look */}
                        <div className="flex items-center space-x-2 mb-6 border-b border-black/5 dark:border-white/5 pb-2 shrink-0">
                            <FileIcon />
                            <span className="text-lg font-bold text-black dark:text-white truncate">{selected.name}</span>
                        </div>

                        {/* Scrollable Content Container */}
                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                            <div>
                                <h4 className="text-purple-500 text-xs font-bold mb-1 uppercase tracking-wider">Description</h4>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                                    // {selected.desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-[#112240] rounded border border-black/5 dark:border-white/5">
                                    <h4 className="flex items-center text-gray-500 text-xs font-bold mb-2 uppercase">
                                        <FiCpu className="mr-2" /> Time Complexity
                                    </h4>
                                    <span className="text-xl font-mono text-black dark:text-green-400">{selected.complexity}</span>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-[#112240] rounded border border-black/5 dark:border-white/5">
                                    <h4 className="flex items-center text-gray-500 text-xs font-bold mb-2 uppercase">
                                        <FiDatabase className="mr-2" /> Space Complexity
                                    </h4>
                                    <span className="text-xl font-mono text-black dark:text-green-400">{selected.space}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 md:pt-0">
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span>Compiling... Status: READY</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select a file to view details
                    </div>
                )}

                {/* Background decoration */}
                <FiCode className="absolute bottom-[-20px] right-[-20px] text-[150px] text-black/5 dark:text-white/5 -rotate-12 pointer-events-none" />
            </div>
        </div>
    );
};

export default AlgoExplorer;
