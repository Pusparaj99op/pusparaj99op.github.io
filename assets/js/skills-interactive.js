/**
 * Skills Interactive Effect
 * Adds 3D Tilt and Spotlight Glow
 */
function initSkillsInteractive() {
    // Select all skill cards
    const cards = document.querySelectorAll('.skill-card');

    if (!cards.length) return;

    cards.forEach(card => {
        // Init GSAP set for performance
        gsap.set(card, { transformStyle: "preserve-3d" });

        // Add Floating effect to icons
        const icon = card.querySelector('.skill-icon');
        if (icon) {
            gsap.to(icon, {
                y: -5,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        }

        // Mouse Move Event
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation
            // Center of card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Rotate values (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply 3D Tilt
            gsap.to(card, {
                duration: 0.4,
                rotateX: rotateX,
                rotateY: rotateY,
                z: 20, // Lift effect
                scale: 1.02, // Subtle scale
                transformPerspective: 1000,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            // Set CSS variables for spotlight effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Mouse Leave Event
        card.addEventListener('mouseleave', () => {
            // Reset rotation
            gsap.to(card, {
                duration: 0.6,
                rotateX: 0,
                rotateY: 0,
                z: 0,
                scale: 1,
                ease: 'elastic.out(1, 0.5)',
                overwrite: 'auto'
            });
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkillsInteractive);
} else {
    initSkillsInteractive();
}
