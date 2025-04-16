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
    
    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        preloader.classList.add('preloader-finish');
        
        setTimeout(() => {
            // Initialize AOS animations after preloader is gone
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
            
            // Run the typing animation after page load
            if (document.querySelector('.typing-text')) {
                runTypingAnimation();
            }
        }, 1000);
    });
    
    // Theme toggler
    if (themeToggle) {
        // Check for saved theme preference or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            body.classList.add('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
        
        themeToggle.addEventListener('click', () => {
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

    // Sticky Header with improved behavior
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Only add sticky class when scrolling down past threshold
        if (scrollPosition > 50) {
            if (!header.classList.contains('sticky')) {
                header.classList.add('sticky');
                header.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    header.style.transform = 'translateY(0)';
                }, 150);
            }
            goTopBtn.classList.add('active');
        } else {
            header.classList.remove('sticky');
            header.style.transform = '';
            goTopBtn.classList.remove('active');
        }
        
        // Active nav link based on scroll position with improved accuracy
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust the offset value to better match when section is in view
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
    
    // Improved Mobile Navigation with better transition
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navbar.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
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
            }, 300);
        });
    });
    
    // Enhanced Project Filtering with smoother animations
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Use FLIP animation technique for smooth filtering
            // Get initial positions
            const positions = Array.from(projectItems).map(item => {
                const rect = item.getBoundingClientRect();
                return { left: rect.left, top: rect.top };
            });
            
            // Apply filters
            projectItems.forEach((item, index) => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
    
    // Animate skill bars on scroll with improved animation
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
                
                // Stagger the animations
                setTimeout(() => {
                    bar.style.width = width;
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
        
        // Show loading status
        showFormStatus('loading', 'Sending your message...');
        
        // Simulate form submission (replace with actual API call in production)
        setTimeout(() => {
            // Show success message
            showFormStatus('success', 'Thank you! Your message has been sent successfully.');
            
            // Reset form
            contactForm.reset();
            
            // Hide message after delay
            setTimeout(() => {
                const formStatus = document.getElementById('form-status');
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.style.opacity = '1';
                }, 500);
            }, 5000);
        }, 1500);
    });
    
    // Form helper functions
    function showInputError(inputElement, message) {
        inputElement.classList.add('error');
        inputElement.focus();
        showFormStatus('error', message);
    }
    
    function showFormStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        if (type === 'loading') {
            formStatus.innerHTML = `<div class="spinner"></div> ${message}`;
        }
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
                // Implement custom smooth scroll with easing
                const targetPosition = target.offsetTop - 80;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const easeInOutCubic = progress => {
                        return progress < 0.5
                            ? 4 * progress * progress * progress
                            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    };
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(progress / duration, 1)));
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
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    // Initialize animations
    animateOnScroll();
    
    // Implement typing animation for the hero section
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
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        type();
    }
    
    // Project hover effects
    const projectCards = document.querySelectorAll('.project-item');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const imgElement = card.querySelector('.project-img img');
            if (imgElement) {
                imgElement.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const imgElement = card.querySelector('.project-img img');
            if (imgElement) {
                imgElement.style.transform = 'scale(1)';
            }
        });
    });
    
    // Update footer copyright year
    document.querySelector('.copyright p').innerHTML = 
        `&copy; ${new Date().getFullYear()} Kalvin Shah. All Rights Reserved.`;
});
