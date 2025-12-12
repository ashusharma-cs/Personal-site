import React from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ title, category, image }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden rounded-lg bg-gray-900 aspect-[4/3]"
    >
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
            {/* If we had images, an <img> tag would go here */}
            <div className="w-full h-full flex items-center justify-center text-gray-600 font-mono text-4xl">
                {image ? <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" /> : 'IMG'}
            </div>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h3 className="text-lg font-bold text-white mb-1 tracking-wide">{title}</h3>
            <p className="text-xs text-green-400 font-mono tracking-wider">{category}</p>
        </div>
    </motion.div>
);

const Projects = () => {
    // Placeholder projects
    const projects = [
        { id: 1, title: 'Project One', category: 'Web App' },
        { id: 2, title: 'Project Two', category: 'Mobile App' },
        { id: 3, title: 'Project Three', category: 'Design System' },
        { id: 4, title: 'Project Four', category: 'E-commerce' },
        { id: 5, title: 'Project Five', category: 'Dashboard' },
        { id: 6, title: 'Project Six', category: 'Portfolio' },
    ];

    return (
        <section id="work" className="py-20 px-6">
            <div className="container mx-auto">
                <h2 className="flex items-center text-2xl md:text-3xl font-bold text-black dark:text-white mb-12">
                    <span className="text-black dark:text-purple-500 font-mono mr-4">02.</span>
                    Some Things I've Built
                    <span className="h-px bg-lightBorder dark:bg-gray-800 flex-grow ml-6"></span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
