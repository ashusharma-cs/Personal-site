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
        <section id="youtube" className="py-20 px-6 max-w-5xl mx-auto">
            <h2 className="flex items-center text-2xl md:text-3xl font-bold text-black dark:text-lightestSlate mb-8">
                <span className="text-black dark:text-green font-mono mr-4">03.</span>
                Latest Video
                <span className="h-px bg-lightBorder dark:bg-lightestNavy flex-grow ml-6"></span>
            </h2>

            <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-transparent transition-colors duration-300">
                {/* Header Bar */}
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-transparent transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <a href="https://www.youtube.com/@voidtomain" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg">V</div>
                            <div>
                                <h3 className="text-black dark:text-white font-bold text-sm tracking-wide leading-tight group-hover:underline">Void to Main</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs tracking-wider">@voidtomain</p>
                            </div>
                        </a>
                    </div>

                    {/* Stats Display */}
                    <div className="flex items-center gap-4 md:gap-6 text-xs text-gray-600 dark:text-gray-400 font-mono tracking-wide hidden sm:flex">
                        {/* <div className="flex items-center gap-1.5">
                            <span className="text-black dark:text-white font-bold">{stats.subscribers}</span> subscribers
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-black dark:text-white font-bold">{stats.views}</span> views
                        </div> */}
                        <a href="https://www.youtube.com/@voidtomain" target="_blank" rel="noopener noreferrer" className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors tracking-widest uppercase">
                            Subscribe
                        </a>
                    </div>
                </div>

                {/* Video Player */}
                <div className="relative pt-[56.25%] bg-black">
                    {video.link ? (
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${video.link.split('v=')[1]}?autoplay=1&mute=1&controls=1&rel=0`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">Loading Video...</div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-6 py-4 border-t border-gray-200 dark:border-transparent transition-colors duration-300">
                    <h3 className="text-black dark:text-white text-base font-medium mb-2 line-clamp-1 tracking-wide">{video.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                        <span>{video.date} • {video.views !== "Featured Video" ? video.views : "Latest Upload"}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default YouTube;
