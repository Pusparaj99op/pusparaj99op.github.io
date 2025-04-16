// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar li a');
    const goTopBtn = document.querySelector('.go-top');
    const sections = document.querySelectorAll('section');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Advanced Preloader with smoother transitions
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        
        // Add a small delay for better perceived loading experience
        setTimeout(() => {
            preloader.classList.add('preloader-finish');
            
            // Add page entrance animation
            document.querySelectorAll('.animate-on-load').forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, 300 + (i * 100));
            });
            
            // Initialize AOS animations with enhanced settings
            AOS.init({
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                once: false,
                mirror: true,
                anchorPlacement: 'center-bottom',
                disable: 'mobile'
            });
            
            // Run the typing animation after page load
            if (document.querySelector('.typing-text')) {
                runTypingAnimation();
            }
            
            // Initialize particle background if exists
            initParticleBackground();
        }, 800);
    });
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (mouseX - centerX) * 0.03;
            const moveY = (mouseY - centerY) * 0.03;
            
            const heroContent = heroSection.querySelector('.hero-content');
            const heroImage = heroSection.querySelector('.hero-image');
            
            if (heroContent) {
                heroContent.style.transform = `translate(${moveX * -0.5}px, ${moveY * -0.5}px)`;
            }
            
            if (heroImage) {
                heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    }
    
    // Theme toggler with enhanced animation
    if (themeToggle) {
        // Check for saved theme preference or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            body.classList.add('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
        
        themeToggle.addEventListener('click', () => {
            // Add toggle animation
            themeToggle.classList.add('animate-toggle');
            setTimeout(() => themeToggle.classList.remove('animate-toggle'), 500);
            
            body.classList.toggle('light-mode');
            
            const icon = themeToggle.querySelector('i');
            if (body.classList.contains('light-mode')) {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Enhanced Sticky Header with backdrop-filter dynamically adjusted
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Dynamic blur intensity based on scroll position (more blur as you scroll further)
        const blurIntensity = Math.min(scrollPosition / 100, 10); // Max 10px blur
        
        // Only add sticky class when scrolling down past threshold
        if (scrollPosition > 50) {
            if (!header.classList.contains('sticky')) {
                header.classList.add('sticky');
                header.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    header.style.transform = 'translateY(0)';
                    
                    // Apply dynamic blur intensity
                    header.style.backdropFilter = `blur(${blurIntensity}px)`;
                    header.style.webkitBackdropFilter = `blur(${blurIntensity}px)`;
                }, 150);
            } else {
                // Update blur intensity as you scroll
                header.style.backdropFilter = `blur(${blurIntensity}px)`;
                header.style.webkitBackdropFilter = `blur(${blurIntensity}px)`;
            }
            goTopBtn.classList.add('active');
        } else {
            header.classList.remove('sticky');
            header.style.transform = '';
            header.style.backdropFilter = '';
            header.style.webkitBackdropFilter = '';
            goTopBtn.classList.remove('active');
        }
        
        // Active nav link based on scroll position with improved accuracy
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust the offset value for better section detection
            if (scrollPosition >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Improved Mobile Navigation with glass effect
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
        
        // Add glass effect when menu is open
        if (navbar.classList.contains('active')) {
            body.style.overflow = 'hidden';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.webkitBackdropFilter = 'blur(10px)';
        } else {
            body.style.overflow = '';
            
            // Small delay before removing blur effect for smoother transition
            setTimeout(() => {
                navbar.style.backdropFilter = '';
                navbar.style.webkitBackdropFilter = '';
            }, 300);
        }
    });
    
    // Close mobile nav when clicking a nav link with smooth transition
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            
            // Add a slight delay before hiding the menu for better UX
            setTimeout(() => {
                navbar.classList.remove('active');
                body.style.overflow = '';
                
                // Small delay before removing blur effect for smoother transition
                setTimeout(() => {
                    navbar.style.backdropFilter = '';
                    navbar.style.webkitBackdropFilter = '';
                }, 300);
            }, 300);
        });
    });
    
    // Enhanced Project Filtering with GSAP-like animations
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            
            // Add active class to clicked button with ripple effect
            btn.classList.add('active');
            createRipple(btn);
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Store initial positions for smooth animation
            const positions = Array.from(projectItems).map(item => {
                const rect = item.getBoundingClientRect();
                return { left: rect.left, top: rect.top };
            });
            
            // Apply filters with staggered animation
            projectItems.forEach((item, index) => {
                // Staggered timing for more natural feel
                const delay = index * 50;
                
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                    }, delay);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300 + delay);
                }
            });
        });
    });
    
    // Animate skill bars on scroll with improved glowing animation
    const skillSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-percent');
    
    const animateSkills = () => {
        if (!skillSection) return;
        
        const skillSectionPos = skillSection.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        if (skillSectionPos < screenHeight * 0.75) {
            skillBars.forEach((bar, index) => {
                const width = bar.dataset.width || bar.style.width;
                bar.style.width = '0';
                
                // Add glow effect before animation starts
                bar.style.boxShadow = '0 0 10px rgba(108, 99, 255, 0.5)';
                
                // Stagger the animations with easing
                setTimeout(() => {
                    bar.style.width = width;
                    // Increase glow during animation
                    bar.style.boxShadow = '0 0 20px rgba(108, 99, 255, 0.8)';
                    
                    // Return to normal glow after animation completes
                    setTimeout(() => {
                        bar.style.boxShadow = '0 0 10px rgba(108, 99, 255, 0.5)';
                    }, 1000);
                }, 300 + (index * 100));
            });
            
            window.removeEventListener('scroll', animateSkills);
        }
    };
    
    window.addEventListener('scroll', animateSkills);
    
    // Improved Form Submission with enhanced validation and user feedback
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form inputs
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const subjectInput = contactForm.querySelector('input[name="subject"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();
        
        // Reset previous error state
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.classList.remove('error');
        });
        
        // Enhanced validation with specific error messages
        if (!name) {
            showInputError(nameInput, 'Please enter your name');
            return;
        }
        
        if (!email) {
            showInputError(emailInput, 'Please enter your email');
            return;
        }
        
        if (!isValidEmail(email)) {
            showInputError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        if (!subject) {
            showInputError(subjectInput, 'Please enter a subject');
            return;
        }
        
        if (!message) {
            showInputError(messageInput, 'Please enter your message');
            return;
        }
        
        // Show loading status with animated spinner
        showFormStatus('loading', 'Sending your message...');
        
        // Simulate form submission (replace with actual API call in production)
        setTimeout(() => {
            // Show success message with animated checkmark
            showFormStatus('success', 'Thank you! Your message has been sent successfully.');
            
            // Add success animation
            const formElement = contactForm.querySelector('form');
            formElement.classList.add('submitted');
            
            // Reset form
            contactForm.reset();
            
            // Hide message after delay with fade out
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.style.opacity = '1';
                    formElement.classList.remove('submitted');
                }, 500);
            }, 5000);
        }, 1500);
    });
    
    // Form helper functions
    function showInputError(inputElement, message) {
        inputElement.classList.add('error');
        inputElement.focus();
        showFormStatus('error', message);
        
        // Add shake animation
        inputElement.addEventListener('animationend', () => {
            inputElement.classList.remove('error');
        });
    }
    
    function showFormStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.innerHTML = message;
        
        if (type === 'loading') {
            formStatus.innerHTML = `<div class="spinner"></div> ${message}`;
        } else if (type === 'success') {
            formStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        } else if (type === 'error') {
            formStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        }
        
        formStatus.style.display = 'block';
        
        // Add entrance animation
        formStatus.style.opacity = '0';
        formStatus.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            formStatus.style.opacity = '1';
            formStatus.style.transform = 'translateY(0)';
        }, 10);
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    // Improved smooth scrolling with better easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Create ripple effect on click
                createRipple(this);
                
                // Implement custom smooth scroll with advanced easing
                const targetPosition = target.offsetTop - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    
                    // Enhanced easing function for smoother movement
                    const easeOutExpo = progress => {
                        return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    };
                    
                    window.scrollTo(0, startPosition + distance * easeOutExpo(Math.min(progress / duration, 1)));
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        });
    });
    
    // Enhanced animation on scroll with intersection observer for better performance
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get animation type from data attribute
                    const animation = entry.target.dataset.animation || 'fade-up';
                    entry.target.classList.add('animated', animation);
                    
                    // Only unobserve if animation shouldn't repeat
                    if (!entry.target.dataset.repeat) {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.repeat) {
                    // Remove animation class if should repeat
                    entry.target.classList.remove('animated', entry.target.dataset.animation);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Initialize animations
    animateOnScroll();
    
    // Implement typing animation for the hero section with better timing
    function runTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        const words = JSON.parse(typingElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 30; // Faster deletion
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100; // Normal typing speed
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 1500; // Longer pause at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        type();
    }
    
    // Project hover effects with enhanced interactions
    const projectCards = document.querySelectorAll('.project-item');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const imgElement = card.querySelector('.project-img img');
            if (imgElement) {
                imgElement.style.transform = 'scale(1.1)';
            }
            
            // Add shine effect
            addShineEffect(card);
        });
        
        card.addEventListener('mouseleave', () => {
            const imgElement = card.querySelector('.project-img img');
            if (imgElement) {
                imgElement.style.transform = 'scale(1)';
            }
            
            // Remove shine effect
            removeShineEffect(card);
        });
        
        // Add mouse move effect for 3D tilt
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation based on mouse position
            const rotateY = 10 * mouseX / (cardRect.width / 2);
            const rotateX = -10 * mouseY / (cardRect.height / 2);
            
            // Apply subtle 3D rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // Add shine effect to elements
    function addShineEffect(element) {
        // Create shine overlay if it doesn't exist
        if (!element.querySelector('.shine-effect')) {
            const shineElement = document.createElement('div');
            shineElement.classList.add('shine-effect');
            element.appendChild(shineElement);
            
            // Add mousemove event for shine position
            element.addEventListener('mousemove', moveShine);
        }
    }
    
    // Remove shine effect
    function removeShineEffect(element) {
        const shineElement = element.querySelector('.shine-effect');
        if (shineElement) {
            element.removeEventListener('mousemove', moveShine);
            shineElement.remove();
        }
    }
    
    // Move shine based on cursor position
    function moveShine(e) {
        const shine = this.querySelector('.shine-effect');
        if (!shine) return;
        
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`;
    }
    
    // Create ripple effect on click
    function createRipple(element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Initialize particle background for hero section
    function initParticleBackground() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // Create canvas for particles if it doesn't exist
        if (!document.getElementById('particles-canvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'particles-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0';
            canvas.style.pointerEvents = 'none';
            heroSection.appendChild(canvas);
            
            // Initialize particles
            const ctx = canvas.getContext('2d');
            let particles = [];
            
            function resizeCanvas() {
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
            }
            
            function createParticles() {
                particles = [];
                const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive particle count
                
                for (let i = 0; i < particleCount; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 2 + 1,
                        speedX: Math.random() * 0.5 - 0.25,
                        speedY: Math.random() * 0.5 - 0.25,
                        opacity: Math.random() * 0.5 + 0.1
                    });
                }
            }
            
            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(108, 99, 255, ${particle.opacity})`;
                    ctx.fill();
                    
                    // Update position
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    // Check boundaries
                    if (particle.x < 0 || particle.x > canvas.width) {
                        particle.speedX *= -1;
                    }
                    
                    if (particle.y < 0 || particle.y > canvas.height) {
                        particle.speedY *= -1;
                    }
                });
                
                // Draw connecting lines between nearby particles
                particles.forEach((particle, i) => {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particle.x - particles[j].x;
                        const dy = particle.y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(108, 99, 255, ${0.2 * (1 - distance / 100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                });
                
                requestAnimationFrame(drawParticles);
            }
            
            // Initialize
            resizeCanvas();
            createParticles();
            drawParticles();
            
            // Resize handler
            window.addEventListener('resize', () => {
                resizeCanvas();
                createParticles();
            });
            
            // Update particles on mousemove
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Move particles slightly towards mouse
                particles.forEach(particle => {
                    const dx = x - particle.x;
                    const dy = y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 200) {
                        const angle = Math.atan2(dy, dx);
                        const force = 0.1 * (1 - distance / 200);
                        
                        particle.speedX += Math.cos(angle) * force;
                        particle.speedY += Math.sin(angle) * force;
                        
                        // Limit speed
                        const maxSpeed = 2;
                        const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                        
                        if (currentSpeed > maxSpeed) {
                            particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                            particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
                        }
                    }
                });
            });
        }
    }
    
    // Update footer copyright year
    document.querySelector('.copyright p').innerHTML = 
        `&copy; ${new Date().getFullYear()} Kalvin Shah. All Rights Reserved.`;
});
