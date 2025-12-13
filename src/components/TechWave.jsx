import React from 'react';
import { motion } from 'framer-motion';
import { FiTerminal, FiGitBranch, FiDatabase, FiSearch, FiBox, FiSettings, FiCode, FiFolder, FiCommand, FiCpu, FiGlobe, FiLayers } from 'react-icons/fi';

const icons = [
    { Icon: FiTerminal, label: 'Terminal' },
    { Icon: FiCode, label: 'Code' },
    { Icon: FiCommand, label: 'Command' },
    { Icon: FiSearch, label: 'Search' },
    { Icon: FiTerminal, label: 'Console' }, // Placeholder for specific console icon
    { Icon: FiBox, label: 'Packages' },
    { Icon: FiGitBranch, label: 'Git' },
    { Icon: FiCode, label: 'Syntax' }, // Placeholder
    { Icon: FiGlobe, label: 'Web' },
    { Icon: FiLayers, label: 'Stack' },
    { Icon: FiSettings, label: 'Config' },
    { Icon: FiDatabase, label: 'Data' },
    { Icon: FiFolder, label: 'Files' },
    { Icon: FiCpu, label: 'Compute' },
    { Icon: FiGlobe, label: 'Deploy' },
];

const TechWave = () => {
    return (
        <div className="relative w-full h-40 overflow-hidden flex items-center justify-center my-12 mask-image-linear-gradient" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex gap-4 md:gap-8 px-4 min-w-max">
                {icons.map((item, index) => {
                    // Calculate sine wave position
                    // y = Amplitude * sin(Frequency * index)
                    const yOffset = Math.sin(index * 0.8) * 30; // 0.5 -> 0.8 for more curves

                    return (
                        <motion.div
                            key={index}
                            initial={{ y: yOffset, opacity: 0 }}
                            whileInView={{ opacity: 1, transition: { duration: 0.8, delay: (icons.length - index) * 0.05, ease: 'easeOut' } }}
                            viewport={{ once: true }}
                            style={{ y: yOffset }} // Maintain static Y position for the container
                        >
                            <motion.div
                                animate={{
                                    y: [-5, 5, -5],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5 + Math.random() * 1,
                                    ease: "easeInOut",
                                    delay: Math.random() * 1 // Reduced random delay
                                }}
                                className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm text-gray-600 dark:text-gray-300"
                            >
                                <item.Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default TechWave;
