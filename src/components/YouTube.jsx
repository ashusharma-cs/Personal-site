import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiYoutube, FiExternalLink } from 'react-icons/fi';

const YouTube = () => {
    // API KEY REQUIRED for real-time stats
    // The previous key was invalid/quota-limited. Please add a valid key here for live Subscriber/View counts.
    const YOUTUBE_API_KEY = "";
    const CHANNEL_HANDLE = "@voidtomain";

    // Correct Channel ID for 'Void to Main'
    const [channelId, setChannelId] = React.useState("UCr-CnBMlidO8KnKSdM-4cfQ");

    const [video, setVideo] = React.useState({
        title: "Loading latest video...",
        thumbnail: "",
        link: "https://www.youtube.com/@voidtomain",
        views: "Fetching...",
        date: ""
    });

    const [stats, setStats] = React.useState({
        subscribers: "40.2K", // Fallback/Placeholder
        views: "2.9M"        // Fallback/Placeholder
    });

    useEffect(() => {

        // 1. Resolve Channel ID (if Key exists)
        const resolveChannelId = async () => {
            if (!YOUTUBE_API_KEY) return channelId;

            try {
                // Search for channel by handle/name
                const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(CHANNEL_HANDLE)}&key=${YOUTUBE_API_KEY}`;

                const response = await fetch(searchUrl);
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    const foundId = data.items[0].id.channelId;
                    setChannelId(foundId); // Update state to trigger other fetches
                    return foundId;
                } else {
                    return channelId; // Return default
                }
            } catch (error) {
                console.error("Channel Resolution Error:", error);
                return channelId;
            }
        };

        // Initialize Fetch Sequence
        const initData = async () => {
            const activeChannelId = await resolveChannelId();
            fetchLatestVideo(activeChannelId);
            fetchStats(activeChannelId);
        };

        initData();
    }, []); // Run once on mount

    // 2. Fetch Video (RSS)
    const fetchLatestVideo = async (id) => {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        try {
            const response = await fetch(apiUrl);
            // Note: rss2json returns 422 if channel_id is invalid
            if (!response.ok) throw new Error(`Status ${response.status}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const latest = data.items[0];
                const videoId = latest.guid.split(':')[2];
                setVideo({
                    title: latest.title,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                    link: latest.link,
                    views: "Latest Upload",
                    date: new Date(latest.pubDate).toLocaleDateString()
                });
            }
        } catch (error) {
            // Fallback
            setVideo({
                title: "My journey to become a Software Engineer: Why I'm Learning DSA in Public",
                thumbnail: "https://img.youtube.com/vi/InLAnoEpM7c/maxresdefault.jpg",
                link: "https://www.youtube.com/watch?v=InLAnoEpM7c",
                views: "Featured Video",
                date: "Recent"
            });
        }
    };

    // 3. Fetch Real-Time Stats
    const fetchStats = async (id) => {
        if (!YOUTUBE_API_KEY) return;

        try {
            const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${YOUTUBE_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const s = data.items[0].statistics;

                const formatCount = (n) => {
                    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
                    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
                    return n;
                };

                setStats({
                    subscribers: formatCount(s.subscriberCount),
                    views: parseInt(s.viewCount).toLocaleString()
                });
            }
        } catch (error) {
            console.error("Stats Fetch Error:", error);
        }
    };

    return (
        <section id="youtube" className="py-24 px-6 max-w-5xl mx-auto">
            <h2 className="flex items-center text-3xl font-bold text-black dark:text-white mb-12 tracking-tight">
                <span className="text-purple-600 font-mono mr-5">03.</span>
                Latest Content
                <span className="h-px bg-gray-200 dark:bg-white/10 flex-grow ml-8"></span>
            </h2>

            {/* Cinematic Card Container */}
            <div className="relative group rounded-3xl">
                <div className="relative rounded-[22px] overflow-hidden bg-white dark:bg-[#050505]">

                    {/* Video Player - Pure & Unobstructed */}
                    <div className="relative aspect-video bg-black group-hover:brightness-110 transition-all duration-700">
                        {video.link ? (
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${video.link.split('v=')[1]}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1`}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-4">
                                <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span className="text-sm font-mono tracking-widest">LOADING CONTENT...</span>
                            </div>
                        )}
                        {/* Subtle inner shadow for depth */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                    </div>

                    {/* Footer - Content & Branding Combined */}
                    <div className="bg-white dark:bg-[#0A0A0A] px-6 py-5 border-t border-gray-100 dark:border-white/5 relative z-10 grid md:grid-cols-[1fr_auto] gap-6 items-center transition-colors duration-300">

                        {/* Left: Video Info */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-gray-900 dark:text-white text-lg md:text-xl font-bold leading-tight tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                                {video.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-500 tracking-wider uppercase">
                                <span className="flex items-center gap-1.5">
                                    <FiYoutube className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                                    Latest Upload
                                </span>
                                <span className="text-gray-300 dark:text-white/20">•</span>
                                <span>{video.date}</span>
                            </div>
                        </div>

                        {/* Right: Channel Branding & Action */}
                        <div className="flex items-center justify-between md:justify-end gap-5 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5 md:border-none">
                            <a href="https://www.youtube.com/@voidtomain" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group/channel">
                                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-black dark:text-white font-bold text-sm">V</div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover/channel:text-purple-600 dark:group-hover/channel:text-purple-400 transition-colors">Void to Main</span>
                                    <span className="text-[10px] text-gray-500 tracking-widest uppercase">@voidtomain</span>
                                </div>
                            </a>

                            <a href="https://www.youtube.com/@voidtomain" target="_blank" rel="noopener noreferrer"
                                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors shrink-0">
                                Subscribe
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default YouTube;
