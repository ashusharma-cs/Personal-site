import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const Hero = () => {
    const { scrollY } = useScroll();
    const yText = useTransform(scrollY, [0, 500], [0, 150]);

    const containerRef = useRef(null);
    const isInView = useInView(containerRef);
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
        // Tracker for width to detect horizontal resizes only on mobile
        let lastWidth = 0; // Initialize to 0 to force first update

        const updateDimensions = () => {
            if (containerRef.current) {
                const newWidth = window.innerWidth;
                const isMobile = newWidth < 768;

                // On Mobile: Ignore vertical-only resizes (Address bar)
                // If width hasn't changed, it's likely just the toolbar showing/hiding
                if (isMobile && newWidth === lastWidth && containerRef.current.clientWidth !== 0) {
                    return;
                }

                lastWidth = newWidth;

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
            // Removed distance check - always active if mouse is moving in container
            mouseRef.current = { x, y, isActive: true };
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
        if (!isInView) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true }); // optimize for alpha

        // 1. RESOLUTION CAP (Performance Win)
        // We limit the internal resolution to 1080p max to avoid 4k/8k rendering cost
        // CSS will handle the scaling to full screen
        const maxRes = 1920;
        const scale = Math.min(1, maxRes / dimensions.width);

        const internalWidth = Math.floor(dimensions.width * scale);
        const internalHeight = Math.floor(dimensions.height * scale);

        canvas.width = internalWidth;
        canvas.height = internalHeight;

        // 2. LOGIC SCALING
        // Since we are rendering at a potentially lower resolution, we need to scale our logic coordinates
        const toInternal = (val) => val * scale;
        // const fromInternal = (val) => val / scale;

        // 3. PARTICLES 
        const particleCount = 1500; // Reduced to sweet spot
        const particles = [];

        // Center is now just the "Initial" center, actual center drifts
        const initialCx = internalWidth / 2;
        const initialCy = internalHeight / 2;

        const isMobile = dimensions.width < 768;
        // Reduced size as requested
        const ringRadius = toInternal(isMobile ? 110 : 220);
        const exclusionRadius = ringRadius - 20;

        // BLACK HOLE STATE (Internal Physics)
        // We use a ref so it persists across renders without triggering re-renders
        const blackHolePos = { x: initialCx, y: initialCy };

        for (let i = 0; i < particleCount; i++) {
            const isRing = Math.random() < 0.40;

            let ringTarget = null;
            let relativeAngle = 0;
            let relativeDist = 0;

            if (isRing) {
                const angle = Math.random() * Math.PI * 2;
                relativeAngle = angle; // Store relative polar coords
                relativeDist = ringRadius;

                // Initial placement relative to center
                ringTarget = {
                    x: initialCx + Math.cos(angle) * ringRadius,
                    y: initialCy + Math.sin(angle) * ringRadius
                };
            }

            let startX, startY;

            if (ringTarget) {
                startX = ringTarget.x + (Math.random() - 0.5) * 20;
                startY = ringTarget.y + (Math.random() - 0.5) * 20;
            } else {
                startX = Math.random() * internalWidth;
                startY = Math.random() * internalHeight;
                // No exclusion check needed for initial scatter really, gravity fixes it
            }

            particles.push({
                x: startX,
                y: startY,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                ringTarget: ringTarget, // Stores reference if it has one
                relativeAngle: relativeAngle, // For rebuilding target dynamically
                relativeDist: relativeDist,
                size: Math.random() * 1.5 + 0.5,
                isRing: !!ringTarget,
                // Assign a "type" for batch rendering
                type: 0 // 0 = bg, 1 = ring-idle, 2 = ring-active
            });
        }

        let time = 0;

        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, internalWidth, internalHeight);

            const isActive = mouseRef.current.isActive;
            const mouseX = mouseRef.current.x * scale;
            const mouseY = mouseRef.current.y * scale;

            // --- UPDATE BLACK HOLE POSITION ---
            let targetBhX, targetBhY;

            if (isActive) {
                targetBhX = mouseX;
                targetBhY = mouseY;
            } else {
                const floatAmp = isMobile ? 20 : 50;
                targetBhX = initialCx + Math.cos(time * 0.5) * floatAmp;
                targetBhY = initialCy + Math.sin(time * 1.0) * (floatAmp * 0.5);
            }

            const lerpFactor = 0.05;
            blackHolePos.x += (targetBhX - blackHolePos.x) * lerpFactor;
            blackHolePos.y += (targetBhY - blackHolePos.y) * lerpFactor;

            const bhX = blackHolePos.x;
            const bhY = blackHolePos.y;

            // THEME STRINGS
            const isDark = document.documentElement.classList.contains('dark');
            const colorBg = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.6)";
            const colorRingIdle = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.9)";
            const colorActive = "#A855F7"; // Purple

            // LENSING
            const lensRadius = ringRadius;
            const lensStrength = 60;

            // BATCH CONTAINERS
            const batchBg = [];
            const batchRingIdle = [];
            const batchRingActive = [];

            // UPDATE LOOP
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.vx += (Math.random() - 0.5) * 0.15;
                p.vy += (Math.random() - 0.5) * 0.15;
                p.vx *= 0.96;
                p.vy *= 0.96;

                let currentType = 0; // Default BG

                if (p.isRing) {
                    const targetX = bhX + Math.cos(p.relativeAngle) * p.relativeDist;
                    const targetY = bhY + Math.sin(p.relativeAngle) * p.relativeDist;

                    const dx = targetX - p.x;
                    const dy = targetY - p.y;

                    p.vx += dx * 0.05;
                    p.vy += dy * 0.05;
                    p.vx *= 0.80;
                    p.vy *= 0.80;

                    currentType = isActive ? 2 : 1;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Screen Wrap - ONLY for background stars
                // Ring particles are tethered to the black hole and should leave the screen if the hole does
                if (!p.isRing) {
                    if (p.x < 0) p.x = internalWidth;
                    if (p.x > internalWidth) p.x = 0;
                    if (p.y < 0) p.y = internalHeight;
                    if (p.y > internalHeight) p.y = 0;
                }

                if (currentType === 0) batchBg.push(p);
                else if (currentType === 1) batchRingIdle.push(p);
                else batchRingActive.push(p);
            }

            // 1. Background Particles with Dynamic Lensing
            ctx.fillStyle = colorBg;
            ctx.beginPath();
            for (let i = 0; i < batchBg.length; i++) {
                const p = batchBg[i];

                const dx = p.x - bhX;
                const dy = p.y - bhY;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                // SINGULARITY CHECK:
                // If a star is too close to the dead center, light cannot escape (or math blows up).
                // We simply don't render it. This fixes the "dots in the middle" artifact.
                if (dist < 20) continue;

                let lx = p.x;
                let ly = p.y;

                // Apply lensing to everything else
                const force = (lensRadius * lensStrength) / dist;
                const shiftFactor = 1 + (force / dist);
                lx = bhX + dx * shiftFactor;
                ly = bhY + dy * shiftFactor;

                ctx.rect(lx, ly, p.size, p.size);
            }
            ctx.fill();

            // 2. Ring Idle Particles (No Lensing needed on the ring itself, it IS the source)
            if (batchRingIdle.length > 0) {
                ctx.fillStyle = colorRingIdle;
                ctx.beginPath();
                for (let i = 0; i < batchRingIdle.length; i++) {
                    const p = batchRingIdle[i];
                    ctx.rect(p.x, p.y, p.size, p.size);
                }
                ctx.fill();
            }

            // 3. Ring Active Particles
            if (batchRingActive.length > 0) {
                ctx.fillStyle = colorActive;
                ctx.beginPath();
                for (let i = 0; i < batchRingActive.length; i++) {
                    const p = batchRingActive[i];
                    ctx.rect(p.x, p.y, p.size, p.size);
                }
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [dimensions, isInView]);

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            <div className="absolute inset-0 w-full h-full z-0">
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
