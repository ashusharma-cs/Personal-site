import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPlus, FiMoreHorizontal } from 'react-icons/fi';

// Audio Visualizer Component
const AudioVisualizer = () => {
    const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return (
        <div className="flex items-end justify-center space-x-1 h-12 w-full">
            {bars.map((bar) => (
                <motion.div
                    key={bar}
                    className="w-1 bg-black dark:bg-purple-500 rounded-t-sm"
                    animate={{
                        height: [
                            Math.random() * 40 + 5,
                            Math.random() * 40 + 5,
                            Math.random() * 40 + 5,
                        ],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: bar * 0.1,
                    }}
                />
            ))}
        </div>
    );
};

// Spotify Data
const tracks = [
    {
        id: "playlist-main",
        type: "playlist",
        title: "My Rotations",
        artist: "Ashu's Picks",
        duration: "24h+",
        color: "bg-white dark:bg-[#111]", // White in Light Mode, Black in Dark Mode
        cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=100&auto=format&fit=crop", // Abstract Record/Music
        // YOUR PLAYLIST ID: 7CJOzxS0TGTvDY4h9OJsBQ
        embedUrl: "https://open.spotify.com/embed/playlist/7CJOzxS0TGTvDY4h9OJsBQ?utm_source=generator&theme=0"
    },
    {
        id: "track-1",
        type: "album",
        title: "Coding Mode",
        artist: "Focus Flow",
        duration: "Album",
        color: "bg-white dark:bg-[#111]",
        cover: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=100&auto=format&fit=crop", // Code/Screen
        // User provided album: https://open.spotify.com/album/52FJKyr5sAqiA6nZah9dLz
        embedUrl: "https://open.spotify.com/embed/album/52FJKyr5sAqiA6nZah9dLz?utm_source=generator"
    },
    {
        id: "track-2",
        type: "track",
        title: "Late Night",
        artist: "Synthwave",
        duration: "3:12",
        color: "bg-white dark:bg-[#111]",
        cover: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=100&auto=format&fit=crop", // Neon Night
        // User provided track: https://open.spotify.com/track/1bMkimTb47umgNP6xCi4A1
        embedUrl: "https://open.spotify.com/embed/track/1bMkimTb47umgNP6xCi4A1?utm_source=generator"
    },
    {
        id: "track-3",
        type: "track",
        title: "Deep Work",
        artist: "Ambient",
        duration: "4:01",
        color: "bg-white dark:bg-[#111]",
        cover: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=100&auto=format&fit=crop", // Typing/Laptop
        // User provided track: https://open.spotify.com/track/1nK1EbZNymcKExc01JavKR
        embedUrl: "https://open.spotify.com/embed/track/1nK1EbZNymcKExc01JavKR?utm_source=generator"
    }
];

const TrackCard = ({ track, index, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
                group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300
                ${isActive
                    ? 'bg-gray-100 dark:bg-white/5 shadow-sm scale-[1.01]'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5 hover:translate-x-1'}
            `}
        >
            <div className="flex items-center gap-5">
                {/* Minimal Index / Play Icon */}
                <div className="w-8 flex justify-center text-sm font-mono text-gray-400 dark:text-gray-500">
                    {isActive ? (
                        <FiPlay className="fill-purple-500 text-purple-500 animate-pulse" />
                    ) : (
                        <span className="group-hover:hidden">{String(index + 1).padStart(2, '0')}</span>
                    )}
                    <FiPlay className={`fill-black dark:fill-white hidden ${!isActive && 'group-hover:block'}`} />
                </div>

                {/* Info */}
                <div>
                    <h4 className={`font-bold text-sm leading-tight transition-colors ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-black dark:text-white'}`}>
                        {track.title}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] tracking-wide mt-1 uppercase">{track.artist}</p>
                </div>
            </div>

            {/* Right Side: Duration or Active Visualizer */}
            <div className="flex items-center gap-4">
                {isActive ? (
                    <div className="flex gap-[3px] items-end h-3">
                        <motion.div
                            animate={{ height: [4, 12, 6, 12, 4] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className="w-0.5 bg-purple-500 rounded-full"
                        />
                        <motion.div
                            animate={{ height: [8, 4, 12, 6, 10] }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                            className="w-0.5 bg-purple-500 rounded-full"
                        />
                        <motion.div
                            animate={{ height: [4, 10, 4, 10, 6] }}
                            transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
                            className="w-0.5 bg-purple-500 rounded-full"
                        />
                    </div>
                ) : (
                    <span className="text-xs font-mono text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors">{track.duration}</span>
                )}
            </div>
        </div>
    );
};

const Spotify = () => {
    const [activeTrack, setActiveTrack] = useState(tracks[0]);

    return (
        <section id="spotify" className="py-24 px-6 max-w-5xl mx-auto">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold text-black dark:text-lightestSlate mb-16">
                <span className="text-black dark:text-purple-500 font-mono mr-4">03.</span>
                On Repeat
                <span className="h-px bg-lightBorder dark:bg-lightestNavy flex-grow ml-6"></span>
            </h2>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Left: Player / Visualizer Card */}
                {/* Dynamically renders the Embed for the Active Track */}
                <div className="w-full md:w-1/3 bg-white dark:bg-black border border-lightBorder dark:border-transparent rounded-xl p-0 shadow-lg dark:shadow-xl grid grid-cols-1 relative overflow-hidden h-fit md:self-center">
                    {/* The Embed Player - PERSISTENT STACK for instant switching */}
                    {tracks.map((track) => {
                        const isCurrent = activeTrack.id === track.id;
                        return (
                            <motion.div
                                key={track.id}
                                initial={false}
                                animate={{
                                    opacity: isCurrent ? 1 : 0,
                                    scale: isCurrent ? 1 : 0.98,
                                    zIndex: isCurrent ? 10 : 0,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    mass: 1
                                }}
                                style={{ pointerEvents: isCurrent ? "auto" : "none" }}
                                className="w-full col-start-1 row-start-1"
                            >
                                <iframe
                                    src={track.embedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ minHeight: '352px' }}
                                    frameBorder="0"
                                    allowFullScreen=""
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    title={`Spotify Player - ${track.title}`}
                                    className="bg-white dark:bg-black"
                                ></iframe>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right: Individual Song Cards List */}
                <div className="w-full md:w-2/3 flex flex-col gap-4">
                    <div className="flex justify-between items-end mb-2">
                        <p className="font-mono text-black dark:text-purple-500 text-xs tracking-widest">SELECT A VIBE</p>
                    </div>

                    {tracks.map((track, index) => (
                        <TrackCard
                            key={track.id}
                            index={index}
                            track={track}
                            isActive={activeTrack.id === track.id}
                            onClick={() => setActiveTrack(track)}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Spotify;
