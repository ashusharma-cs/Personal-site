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
    const ringRadius = toInternal(isMobile ? 150 : 300);
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
            // Chase the mouse directly
            targetBhX = mouseX;
            targetBhY = mouseY;
        } else {
            // Floating Idle Animation (Lissajous Figure-8ish)
            const floatAmp = isMobile ? 20 : 50;
            targetBhX = initialCx + Math.cos(time * 0.5) * floatAmp;
            targetBhY = initialCy + Math.sin(time * 1.0) * (floatAmp * 0.5);
        }

        // Smooth Lerp (Physics "Heavy" feel)
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

        // LENSING CONSTANTS
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
                // DYNAMIC TARGET: Rebuild target based on new Black Hole Position
                const targetX = bhX + Math.cos(p.relativeAngle) * p.relativeDist;
                const targetY = bhY + Math.sin(p.relativeAngle) * p.relativeDist;

                const dx = targetX - p.x;
                const dy = targetY - p.y;

                // Spring physics to snap to ring
                p.vx += dx * 0.01;
                p.vy += dy * 0.01;

                currentType = isActive ? 2 : 1;
            }

            if (!p.isRing) {
                // No specific logic, just float
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = internalWidth;
            if (p.x > internalWidth) p.x = 0;
            if (p.y < 0) p.y = internalHeight;
            if (p.y > internalHeight) p.y = 0;

            // Push to appropriate batch
            if (currentType === 0) batchBg.push(p);
            else if (currentType === 1) batchRingIdle.push(p);
            else batchRingActive.push(p);
        }

        // RENDER BATCHES (DRAW CALLS: 3)

        // 1. Background Particles with Dynamic Lensing
        ctx.fillStyle = colorBg;
        ctx.beginPath();
        for (let i = 0; i < batchBg.length; i++) {
            const p = batchBg[i];

            // MATH: Gravitational Lensing relative to MOVING Black Hole (bhX, bhY)
            const dx = p.x - bhX;
            const dy = p.y - bhY;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            let lx = p.x;
            let ly = p.y;

            if (dist > 10) {
                const force = (lensRadius * lensStrength) / dist;
                const shiftFactor = 1 + (force / dist);
                lx = bhX + dx * shiftFactor;
                ly = bhY + dy * shiftFactor;
            }

            ctx.rect(lx, ly, p.size, p.size);
        }
        ctx.fill();

        // 2. Ring Idle Particles
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
