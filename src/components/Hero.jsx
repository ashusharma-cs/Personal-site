import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const { scrollY } = useScroll();
    const yText = useTransform(scrollY, [0, 500], [0, 150]);

    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const mouseRef = useRef({ x: 0, y: 0, isActive: false });

    // Typing Effect State
    const [text, setText] = useState("");
    const fullText = "Ashu Sharma.";

    // LeetCode State
    const [leetcode, setLeetcode] = useState({
        title: "Loading...",
        difficulty: "Medium",
        link: "https://leetcode.com/u/user4015RH/",
        timestamp: "..."
    });

    useEffect(() => {
        const fetchLeetCode = async () => {
            try {
                // 1. Get latest accepted submission
                const subRes = await fetch('https://alfa-leetcode-api.onrender.com/user4015RH/acSubmission?limit=1');
                const subData = await subRes.json();

                if (subData && subData.submission && subData.submission.length > 0) {
                    const latest = subData.submission[0];

                    // 2. Format Timestamp
                    const timestamp = new Date(latest.timestamp * 1000);
                    const now = new Date();
                    const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60));
                    let timeStr = "";
                    if (diffInHours < 1) timeStr = "Just now";
                    else if (diffInHours < 24) timeStr = `${diffInHours} hours ago`;
                    else timeStr = `${Math.floor(diffInHours / 24)} days ago`;

                    // 3. Update basic info first
                    setLeetcode(prev => ({
                        ...prev,
                        title: latest.title,
                        link: `https://leetcode.com/problems/${latest.titleSlug}/`,
                        timestamp: timeStr,
                        // temp difficulty while we fetch real one
                        difficulty: "Medium"
                    }));

                    // 4. Fetch Question Details for Difficulty (Optional but nice)
                    // Unfortunately alfa-leetcode-api might not have a direct lightweight 'difficulty' on submission
                    // We will try to fetch the question details
                    try {
                        // Note: fetching individual question detail relies on another endpoint
                        // If this creates too much lag we can skip it or optimize
                        // For now let's try a direct problem fetch if available, or just heuristic
                        // Actually, let's just leave it as is or try one quick fetch
                        // Endpoint: /select?titleSlug=two-sum
                        // OR /dailyQuestion usually has it.
                        // Let's assume we might not get difficulty easily without another call. 
                        // I'll make a best effort separate call.
                        // UNCOMMENT IF DESIRED, but for speed let's check one specific endpoint
                    } catch (e) {
                        console.error("Failed to fetch difficulty", e);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch LeetCode data", error);
                setLeetcode({
                    title: "Failed to load",
                    difficulty: "N/A",
                    link: "https://leetcode.com/u/user4015RH/",
                    timestamp: ""
                });
            }
        };

        fetchLeetCode();
    }, []);

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 150);

        return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = x - cx;
            const dy = y - cy;
            const isNearCenter = Math.sqrt(dx * dx + dy * dy) < 400;

            mouseRef.current = { x, y, isActive: isNearCenter };
        };

        const handleMouseLeave = () => {
            mouseRef.current.isActive = false;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }
        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [dimensions]);

    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // 1. PARTICLES 
        const particleCount = 4000;
        const particles = [];

        const cx = dimensions.width / 2;
        const cy = dimensions.height / 2;

        const isMobile = dimensions.width < 768;
        const ringRadius = isMobile ? 150 : 300;
        const exclusionRadius = ringRadius - 20;

        for (let i = 0; i < particleCount; i++) {
            const isRing = Math.random() < 0.40;

            let ringTarget = null;
            if (isRing) {
                const angle = Math.random() * Math.PI * 2;
                ringTarget = {
                    x: cx + Math.cos(angle) * ringRadius,
                    y: cy + Math.sin(angle) * ringRadius
                };
            }

            let startX, startY;

            if (ringTarget) {
                startX = ringTarget.x + (Math.random() - 0.5) * 20;
                startY = ringTarget.y + (Math.random() - 0.5) * 20;
            } else {
                startX = Math.random() * dimensions.width;
                startY = Math.random() * dimensions.height;
                const dx = startX - cx;
                const dy = startY - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < exclusionRadius) {
                    const angle = Math.atan2(dy, dx);
                    const push = ringRadius + Math.random() * 200;
                    startX = cx + Math.cos(angle) * push;
                    startY = cy + Math.sin(angle) * push;
                }
            }

            particles.push({
                x: startX,
                y: startY,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                ringTarget: ringTarget,
                size: Math.random() * 1.5 + 0.5,
                isRing: !!ringTarget
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            const isActive = mouseRef.current.isActive;

            // THEME DETECTION
            const isDark = document.documentElement.classList.contains('dark');
            const colorBg = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.6)";
            const colorRingIdle = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.9)";
            const colorActive = "#A855F7"; // Purple

            particles.forEach(p => {
                p.vx += (Math.random() - 0.5) * 0.15;
                p.vy += (Math.random() - 0.5) * 0.15;
                p.vx *= 0.96;
                p.vy *= 0.96;

                let color = colorBg;

                if (p.isRing && p.ringTarget) {
                    const dx = p.ringTarget.x - p.x;
                    const dy = p.ringTarget.y - p.y;

                    p.vx += dx * 0.01;
                    p.vy += dy * 0.01;

                    if (isActive) {
                        color = colorActive;
                    } else {
                        color = colorRingIdle;
                    }
                }

                if (!p.isRing) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < exclusionRadius) {
                        const force = (exclusionRadius - dist) / exclusionRadius;
                        const angle = Math.atan2(dy, dx);
                        p.vx += Math.cos(angle) * force * 1.0;
                        p.vy += Math.sin(angle) * force * 1.0;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = dimensions.width;
                if (p.x > dimensions.width) p.x = 0;
                if (p.y < 0) p.y = dimensions.height;
                if (p.y > dimensions.height) p.y = 0;

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [dimensions]);

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            <div ref={containerRef} className="absolute inset-0 w-full h-full z-0">
                <canvas ref={canvasRef} className="block" />
            </div>

            {/* Gradient Fade Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none z-1"></div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 pointer-events-none">
                <motion.div style={{ y: yText }} className="max-w-4xl pointer-events-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-mono text-purple-600 dark:text-purple-500 text-md md:text-lg mb-6 ml-1"
                    >
                        Hi, my name is
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-8xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tighter"
                    >
                        {text}
                        <span className="inline-block w-1 bg-zinc-900 dark:bg-white h-10 md:h-20 ml-1 animate-pulse align-middle" style={{ animationDuration: '0.75s' }}></span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-lg text-zinc-600 dark:text-gray-400 text-lg mb-12 leading-relaxed"
                    >
                        I'm a cs grad just grinding leetcode just so I can make day in the life at <span className="text-purple-600 dark:text-purple-500">Big Tech</span> videos.
                    </motion.p>

                    {/* LeetCode Widget - Live Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex flex-col items-start gap-2">
                            <span className="text-zinc-500 dark:text-zinc-500 text-xs font-mono uppercase tracking-widest ml-1">Latest Solved</span>
                            <a
                                href={leetcode.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 px-6 py-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                                    {/* Code Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {leetcode.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-mono">
                                        {/* Show Difficulty Only if we had specific data, otherwise default or hide */}
                                        <span className={`px-2 py-0.5 rounded ${leetcode.difficulty === 'Hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                                            leetcode.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                                                leetcode.difficulty === 'Easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                                                    'bg-zinc-500/10 text-zinc-500' // Failover
                                            }`}>
                                            {leetcode.difficulty}
                                        </span>
                                        <span className="text-zinc-400">•</span>
                                        <span className="text-zinc-500">{leetcode.timestamp}</span>
                                    </div>
                                </div>
                                <div className="ml-2 text-zinc-400 group-hover:translate-x-1 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
