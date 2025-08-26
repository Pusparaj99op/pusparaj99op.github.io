/**
 * Parallax Scrolling Effect
 * Creates depth effect with layered movement on scroll
 * Version: 1.0
 * Last Modified: August 26, 2025
 */

// Initialize variables
let parallaxItems;
let scrollY = 0;
const depth = 0.2; // Depth factor for parallax effect

// Function to update parallax positions
function updateParallax() {
    scrollY = window.scrollY;

    // Apply parallax effect to each element
    parallaxItems.forEach(element => {
        const speed = element.dataset.speed || 0.1;
        const offset = scrollY * speed;

        element.style.transform = `translateY(${offset}px)`;
    });
}

// Initialize parallax scrolling
function initParallax() {
    // Get all elements with parallax attribute
    parallaxItems = document.querySelectorAll('[data-parallax]');

    // Add event listeners
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateParallax);
    });

    // Initial update
    updateParallax();
}

// Initialize 3D parallax effect for background
function init3DParallaxBackground() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (!hero || !heroContent) return;

    // Create parallax layers
    const layers = [];
    const layerCount = 5;

    for (let i = 0; i < layerCount; i++) {
        const layer = document.createElement('div');
        layer.className = `parallax-bg-layer layer-${i}`;
        layer.style.zIndex = -10 - i;

        // Create random stars/particles for each layer
        const particleCount = 20 - i * 3; // Fewer particles in deeper layers

        for (let j = 0; j < particleCount; j++) {
            const particle = document.createElement('div');
            particle.className = 'parallax-particle';

            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Size based on layer (smaller = further away)
            const size = 2 + (layerCount - i) * 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Opacity based on layer
            particle.style.opacity = 0.3 + (layerCount - i) * 0.1;

            layer.appendChild(particle);
        }

        hero.insertBefore(layer, hero.firstChild);
        layers.push(layer);
    }

    // Add mouse move parallax effect
    hero.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        layers.forEach((layer, index) => {
            const depth = (index + 1) * 0.05;
            const translateX = (mouseX - 0.5) * depth * 100;
            const translateY = (mouseY - 0.5) * depth * 100;

            layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });

        // Slight movement for hero content
        heroContent.style.transform = `translate3d(${(mouseX - 0.5) * -20}px, ${(mouseY - 0.5) * -20}px, 0)`;
    });
}

// Initialize section parallax effect
function initSectionParallax() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        // Add parallax attribute to section headers
        const header = section.querySelector('.section-header');
        if (header) {
            header.setAttribute('data-parallax', '');
            header.setAttribute('data-speed', '0.05');
        }

        // Add parallax with different speeds to other elements
        const animationElements = section.querySelectorAll('[data-animation]');
        animationElements.forEach((el, index) => {
            el.setAttribute('data-parallax', '');
            el.setAttribute('data-speed', `${0.1 + (index % 3) * 0.02}`);
        });
    });
}

// Initialize all parallax effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    init3DParallaxBackground();
    initSectionParallax();
});
