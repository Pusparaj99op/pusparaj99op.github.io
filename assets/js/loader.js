document.addEventListener("DOMContentLoaded", () => {
    const loaderWrapper = document.getElementById("loader-wrapper");
    const loadingNumber = document.getElementById("loading-number");
    const path = document.querySelector(".transition-path");

    // Exit if elements not found
    if (!loaderWrapper || !loadingNumber || !path) {
        console.error("Loader elements not found");
        return;
    }

    // ========================================
    // Create Enhanced Loading Elements
    // ========================================

    // Progress Line
    const progressLine = document.createElement("div");
    progressLine.className = "loading-progress-line";
    loaderWrapper.appendChild(progressLine);

    // Particles Container
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "loading-particles";
    loaderWrapper.appendChild(particlesContainer);

    // ========================================
    // Curved Loop Marquee Animation
    // ========================================
    const curvedLoopWrapper = document.getElementById("curved-loop");
    const textPath = document.getElementById("curved-loop-textpath");

    if (curvedLoopWrapper && textPath) {
        const marqueeText = "CEO ✦ Founder ✦ Of ✦ Black Obsidian ✦ co. ✦ ";
        const speed = 2;
        let direction = "left";
        let offset = 0;
        let textWidth = 0;
        let isDragging = false;
        let lastX = 0;
        let velocity = 0;
        let animationId = null;

        // Create measure text element
        const svg = curvedLoopWrapper.querySelector("svg");
        const measureText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        measureText.setAttribute("xml:space", "preserve");
        measureText.style.visibility = "hidden";
        measureText.style.opacity = "0";
        measureText.style.pointerEvents = "none";
        measureText.textContent = marqueeText;
        svg.appendChild(measureText);

        // Measure text width and set up
        setTimeout(() => {
            textWidth = measureText.getComputedTextLength();
            if (textWidth > 0) {
                // Create repeated text to fill the path
                const repeatCount = Math.ceil(1800 / textWidth) + 2;
                const fullText = Array(repeatCount).fill(marqueeText).join("");
                textPath.textContent = fullText;
                offset = -textWidth;
                textPath.setAttribute("startOffset", offset + "px");

                // Start animation
                animate();
            }
        }, 100);

        function animate() {
            if (!isDragging && textPath) {
                const delta = direction === "right" ? speed : -speed;
                offset += delta;

                // Wrap around
                if (offset <= -textWidth) offset += textWidth;
                if (offset > 0) offset -= textWidth;

                textPath.setAttribute("startOffset", offset + "px");
            }
            animationId = requestAnimationFrame(animate);
        }

        // Drag interaction
        curvedLoopWrapper.addEventListener("pointerdown", (e) => {
            isDragging = true;
            lastX = e.clientX;
            velocity = 0;
            curvedLoopWrapper.setPointerCapture(e.pointerId);
        });

        curvedLoopWrapper.addEventListener("pointermove", (e) => {
            if (!isDragging || !textPath) return;
            const dx = e.clientX - lastX;
            lastX = e.clientX;
            velocity = dx;

            offset += dx;

            // Wrap around
            if (textWidth > 0) {
                if (offset <= -textWidth) offset += textWidth;
                if (offset > 0) offset -= textWidth;
            }

            textPath.setAttribute("startOffset", offset + "px");
        });

        const endDrag = () => {
            isDragging = false;
            direction = velocity > 0 ? "right" : "left";
        };

        curvedLoopWrapper.addEventListener("pointerup", endDrag);
        curvedLoopWrapper.addEventListener("pointerleave", endDrag);
        curvedLoopWrapper.addEventListener("pointercancel", endDrag);
    }

    // Lock scroll during loading
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // ========================================
    // Particle Burst Function
    // ========================================
    function createParticleBurst(centerX, centerY, count = 12) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement("div");
            particle.className = "loader-particle";
            particle.style.left = centerX + "px";
            particle.style.top = centerY + "px";
            particlesContainer.appendChild(particle);

            const angle = (i / count) * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            const duration = 0.8 + Math.random() * 0.4;

            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0,
                duration: duration,
                ease: "power2.out",
                onComplete: () => particle.remove()
            });
        }
    }

    // ========================================
    // SVG Paths for MorphSVG
    // ========================================
    const startPath = "M 0 100 V 50 Q 50 0 100 50 V 100 z"; // Wave rising
    const endPath = "M 0 100 V 0 Q 50 0 100 0 V 100 z";    // Full screen

    // Create the transition timeline (paused initially)
    const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
            // The screen is now fully covered by the gradient wave.

            // 1. Hide the black loader background & numbers
            loaderWrapper.style.display = "none";

            // 2. Reveal the Navbar
            const nav = document.getElementById('nav');
            if (nav) nav.classList.add('revealed');

            // 3. Unlock scroll so user can interact after reveal
            document.body.style.overflow = "";

            // 4. Reverse the animation to reveal the home page
            tl.reverse();
        }
    });

    // Define the timeline steps
    tl.to(path, {
        morphSVG: startPath,
        duration: 0.6,
        ease: "power2.in"
    })
        .to(path, {
            morphSVG: endPath,
            duration: 0.6,
            ease: "power2.out"
        });

    // ========================================
    // Enhanced Loading Counter Logic
    // ========================================
    let progress = { value: 0 };
    let lastValue = 0;
    const milestones = [25, 50, 75, 100];
    const triggeredMilestones = new Set();

    // Loading text entrance animation - slide up from bottom
    const loadingText = loadingNumber.parentElement;
    gsap.fromTo(loadingText,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    // Animate counter from 0 to 100
    gsap.to(progress, {
        value: 100,
        duration: 3.5,
        ease: "power4.inOut",
        onUpdate: () => {
            const currentValue = Math.round(progress.value);

            // Only update if value changed
            if (currentValue !== lastValue) {
                loadingNumber.textContent = currentValue;

                // Update progress line smoothly
                gsap.to(progressLine, {
                    width: progress.value + "%",
                    duration: 0.1,
                    ease: "none",
                    overwrite: true
                });


                // Check for milestones
                for (const milestone of milestones) {
                    if (currentValue >= milestone && !triggeredMilestones.has(milestone)) {
                        triggeredMilestones.add(milestone);

                        // Get center of loader for particle burst
                        const rect = loadingNumber.getBoundingClientRect();
                        const loaderRect = loaderWrapper.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2 - loaderRect.left;
                        const centerY = rect.top + rect.height / 2 - loaderRect.top;

                        createParticleBurst(centerX, centerY, milestone === 100 ? 24 : 12);
                    }
                }

                lastValue = currentValue;
            }
        },
        onComplete: () => {
            // Fade out loading text and progress line
            gsap.to([loadingText, progressLine], {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: "power2.in",
                stagger: 0.05,
                onComplete: () => {
                    // Start the transition
                    tl.play();
                }
            });
        }
    });
});
