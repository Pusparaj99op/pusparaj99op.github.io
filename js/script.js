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

            // Initialize all app components
            initApp();

        }, 800);
    });

    // Initialize all components
    function initApp() {
        // Initialize all animations
        if (window.animations && typeof window.animations.init === 'function') {
            window.animations.init();
        }
        
        // Initialize psychological enhancements
        if (window.psychology && typeof window.psychology.init === 'function') {
            window.psychology.init();
        }
        
        // Initialize particle background
        initParticleBackground();
        
        // Initialize 3D cards
        enable3DCards();
        
        // Initialize magnetic buttons
        initMagneticButtons();
        
        // Initialize WebGL projects if available
        initWebGLProjects();
        
        // Initialize skills chart
        initSkillsChart();
        
        // Initialize blog functionality
        initBlog();
        
        // Initialize testimonial slider
        initTestimonialSlider();
        
        // Initialize enhanced forms
        initEnhancedForms();
        
        // Initialize countdown functionality
        initCountdowns();
        
        // Initialize contact switcher
        initContactSwitcher();
        
        // Initialize chat functionality
        initChatInterface();
        
        // Initialize AOS library if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
    }

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('mousemove', (e) => {
            // Only apply expensive parallax on desktop/high-end devices
            if (window.innerWidth < 768 || !isHighEndDevice()) return;

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

    // Check if device is high-end enough for advanced animations
    function isHighEndDevice() {
        // Check for hardware concurrency (CPU cores)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) {
            return true;
        }

        // If we can't detect hardware specs, use rough heuristics
        const isHighResDpi = window.devicePixelRatio >= 2;
        const isRecentBrowser = 'IntersectionObserver' in window && 'requestIdleCallback' in window;

        return isHighResDpi && isRecentBrowser;
    }

    // Theme toggler with enhanced animation
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            body.classList.add('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }

        themeToggle.addEventListener('click', () => {
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

            // Trigger reward for changing theme - psychology enhancement
            if (window.psychology && typeof window.psychology.reward === 'function') {
                window.psychology.reward('interaction', 5, 'Theme Changed!');
            }
        });
    }

    // Enhanced Sticky Header with backdrop-filter dynamically adjusted
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        const blurIntensity = Math.min(scrollPosition / 100, 10);

        if (scrollPosition > 50) {
            if (!header.classList.contains('sticky')) {
                header.classList.add('sticky');
                header.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    header.style.transform = 'translateY(0)';
                }, 150);
            } else {
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

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

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

        if (navbar.classList.contains('active')) {
            body.style.overflow = 'hidden';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.webkitBackdropFilter = 'blur(10px)';
        } else {
            body.style.overflow = '';
            setTimeout(() => {
                navbar.style.backdropFilter = '';
                navbar.style.webkitBackdropFilter = '';
            }, 300);
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            setTimeout(() => {
                navbar.classList.remove('active');
                body.style.overflow = '';
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
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            btn.classList.add('active');
            createRipple(btn);

            const filterValue = btn.getAttribute('data-filter');

            const positions = Array.from(projectItems).map(item => {
                const rect = item.getBoundingClientRect();
                return { left: rect.left, top: rect.top };
            });

            projectItems.forEach((item, index) => {
                const delay = index * 50;

                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    item.style.transform = 'scale(0.8) translateY(50px)';
                    item.style.opacity = '0';

                    setTimeout(() => {
                        item.style.transform = '';
                        item.style.opacity = '1';

                        // Psychology enhancement - reward for discovering content
                        if (filterValue !== 'all' && window.psychology && typeof window.psychology.reward === 'function') {
                            window.psychology.reward('exploration', 2);
                        }
                    }, 50 + delay);
                } else {
                    item.style.transform = 'scale(0.8) translateY(50px)';
                    item.style.opacity = '0';

                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300 + delay);
                }
            });
        });
    });

    // Initialize Enhanced Contact Form with validation and effects
    function initEnhancedForms() {
        // Get all the enhanced form elements
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        const messageArea = contactForm.querySelector('textarea[name="message"]');
        const characterCount = document.getElementById('current-chars');
        const maxChars = document.getElementById('max-chars');
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressConnectors = document.querySelectorAll('.progress-connector-fill');

        // Character counter for message textarea
        if (messageArea && characterCount && maxChars) {
            // Set the max characters
            const maxLength = 500;
            messageArea.maxLength = maxLength;
            maxChars.textContent = maxLength;

            // Update character count while typing
            messageArea.addEventListener('input', () => {
                const currentLength = messageArea.value.length;
                characterCount.textContent = currentLength;

                // Change color when approaching limit
                if (currentLength > maxLength * 0.8) {
                    characterCount.style.color = 'var(--accent-tertiary)';
                } else {
                    characterCount.style.color = '';
                }
            });
        }

        // Track form progress and update step indicators
        formInputs.forEach(input => {
            // Listen for focus and input events
            input.addEventListener('focus', () => {
                // Update the progress steps when an input is focused
                updateProgressSteps(input.getAttribute('name'));
            });

            input.addEventListener('input', () => {
                validateInput(input);
            });
        });

        // Function to validate a single input field
        function validateInput(input) {
            // Get the parent wrapper
            let wrapper;
            if (input.closest('.input-wrapper')) {
                wrapper = input.closest('.input-wrapper');
            } else if (input.closest('.textarea-wrapper')) {
                wrapper = input.closest('.textarea-wrapper');
            } else if (input.closest('.select-wrapper')) {
                wrapper = input.closest('.select-wrapper');
            } else {
                return;
            }

            // Clear previous validation classes
            wrapper.classList.remove('valid', 'error');

            // Check if the input has a value
            if (input.value.trim() !== '') {
                if (input.type === 'email') {
                    // Validate email format
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailPattern.test(input.value)) {
                        wrapper.classList.add('valid');
                    } else {
                        wrapper.classList.add('error');
                    }
                } else {
                    // Mark as valid if it has a value
                    wrapper.classList.add('valid');
                }
            }
        }

        // Update progress steps when focusing on a field
        function updateProgressSteps(inputName) {
            // Map input names to step indicators
            const stepMap = {
                'name': 0,
                'email': 1,
                'subject': 2,
                'message': 3
            };

            const stepIndex = stepMap[inputName];
            
            if (stepIndex !== undefined) {
                // Update active step
                progressSteps.forEach((step, index) => {
                    if (index <= stepIndex) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active', 'complete');
                    }
                    
                    if (index < stepIndex) {
                        step.classList.add('complete');
                    }
                });
                
                // Update progress connectors
                progressConnectors.forEach((connector, index) => {
                    if (index < stepIndex) {
                        connector.style.width = '100%';
                    } else {
                        connector.style.width = '0';
                    }
                });
                
                // Trigger reward for progress - psychology enhancement
                if (window.psychology && typeof window.psychology.reward === 'function') {
                    window.psychology.reward('exploration', 1);
                }
            }
        }

        // Enhanced form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const subjectSelect = contactForm.querySelector('select[name="subject"]');
            const messageInput = contactForm.querySelector('textarea[name="message"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectSelect.value;
            const message = messageInput.value.trim();

            // Reset all validation states
            const inputWrappers = contactForm.querySelectorAll('.input-wrapper, .textarea-wrapper, .select-wrapper');
            inputWrappers.forEach(wrapper => {
                wrapper.classList.remove('error');
            });

            // Validate inputs
            let isValid = true;

            if (!name) {
                showInputError(nameInput, 'Please enter your name');
                isValid = false;
            }

            if (!email) {
                showInputError(emailInput, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            if (!subject || subject === '') {
                showInputError(subjectSelect, 'Please select a subject');
                isValid = false;
            }

            if (!message) {
                showInputError(messageInput, 'Please enter your message');
                isValid = false;
            }

            if (!isValid) return;

            showFormStatus('loading', 'Sending your message...');

            // Simulate form submission with delay for demonstration
            setTimeout(() => {
                showFormStatus('success', 'Thank you! Your message has been sent successfully.');

                // Mark all progress steps as complete
                progressSteps.forEach(step => {
                    step.classList.add('active', 'complete');
                });
                
                progressConnectors.forEach(connector => {
                    connector.style.width = '100%';
                });

                // Add animation to form
                contactForm.classList.add('submitted');

                // Reset the form fields
                contactForm.reset();

                // Reset validation classes
                inputWrappers.forEach(wrapper => {
                    wrapper.classList.remove('valid', 'error');
                });

                // Clear the status message after a delay
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.style.opacity = '1';
                    }, 500);
                }, 5000);

                // Psychology enhancement - reward for completing contact form
                if (window.psychology && typeof window.psychology.reward === 'function') {
                    window.psychology.reward('completion', 25, 'Message Sent!');
                }
            }, 1500);
        });
    }

    function showInputError(inputElement, message) {
        let wrapper;
        if (inputElement.closest('.input-wrapper')) {
            wrapper = inputElement.closest('.input-wrapper');
        } else if (inputElement.closest('.textarea-wrapper')) {
            wrapper = inputElement.closest('.textarea-wrapper');
        } else if (inputElement.closest('.select-wrapper')) {
            wrapper = inputElement.closest('.select-wrapper');
        }

        if (wrapper) {
            wrapper.classList.add('error');
            inputElement.focus();
            showFormStatus('error', message);

            // Add shake animation
            wrapper.classList.add('shake');
            setTimeout(() => {
                wrapper.classList.remove('shake');
            }, 500);
        }
    }

    function showFormStatus(type, message) {
        if (!formStatus) return;
        
        formStatus.className = 'form-status ' + type;
        
        if (type === 'loading') {
            formStatus.innerHTML = `<div class="spinner"></div> ${message}`;
        } else if (type === 'success') {
            formStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        } else if (type === 'error') {
            formStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        }

        formStatus.style.display = 'flex';

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

    // Initialize Contact Interface Switcher
    function initContactSwitcher() {
        const switcherBtns = document.querySelectorAll('.switcher-btn');
        if (!switcherBtns.length) return;

        const formMode = document.getElementById('contact-form-mode');
        const chatMode = document.getElementById('contact-chat-mode');

        switcherBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                switcherBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to current button
                btn.classList.add('active');
                
                // Get the mode to activate
                const mode = btn.getAttribute('data-contact-mode');
                
                // Toggle interface visibility
                if (mode === 'form' && formMode && chatMode) {
                    formMode.classList.add('active-mode');
                    chatMode.classList.remove('active-mode');
                    
                    // Psychology enhancement - reward for exploring interface
                    if (window.psychology && typeof window.psychology.reward === 'function') {
                        window.psychology.reward('interaction', 2);
                    }
                } else if (mode === 'chat' && formMode && chatMode) {
                    chatMode.classList.add('active-mode');
                    formMode.classList.remove('active-mode');
                    
                    // Psychology enhancement - reward for discovering chat
                    if (window.psychology && typeof window.psychology.reward === 'function') {
                        window.psychology.reward('exploration', 5, 'Chat Discovered!');
                    }
                }
            });
        });
    }

    // Initialize Chat Interface
    function initChatInterface() {
        const chatContainer = document.querySelector('.chat-container');
        if (!chatContainer) return;

        const messagesContainer = chatContainer.querySelector('.chat-messages');
        const messageChoices = chatContainer.querySelectorAll('.message-choice');
        const textarea = chatContainer.querySelector('textarea');
        const sendButton = chatContainer.querySelector('.chat-send-btn');

        // Function to add a message to the chat
        function addMessage(text, isSent = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${isSent ? 'sent' : 'received'}`;
            
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    <p>${text}</p>
                </div>
                <div class="message-time">${timeString}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Psychology enhancement - reward for interaction
            if (window.psychology && typeof window.psychology.reward === 'function') {
                window.psychology.reward('interaction', 3);
            }
        }

        // Function to add assistant response based on user message
        function addAssistantResponse(userMessage) {
            // Map of possible responses based on user input keywords
            const responses = {
                'project': 'That sounds interesting! I specialize in game development and cybersecurity projects. Could you please provide more details about what you have in mind?',
                'game': 'Great! I love working on games using Unreal Engine 5. What type of game are you thinking about?',
                'cyber': 'I have experience in ethical hacking and cybersecurity. Do you need help with penetration testing or security assessment?',
                'security': 'Security is crucial in today\'s digital world. I can help with vulnerability assessments and secure coding practices.',
                'connect': 'I\'d be happy to connect! You can find me on LinkedIn, Twitter, or send me an email directly.',
                'hello': 'Hello there! How can I assist you today?',
                'hi': 'Hi! How can I help you?'
            };
            
            // Find a matching response or use default
            const lowerUserMessage = userMessage.toLowerCase();
            let responseText = 'Thanks for your message! I'll get back to you as soon as possible. For a quicker response, please use the contact form.';
            
            for (const [keyword, response] of Object.entries(responses)) {
                if (lowerUserMessage.includes(keyword)) {
                    responseText = response;
                    break;
                }
            }
            
            // Add a slight delay before assistant responds
            setTimeout(() => {
                addMessage(responseText, false);
                
                // For most responses, add follow-up prompt choices
                if (!lowerUserMessage.includes('hello') && !lowerUserMessage.includes('hi')) {
                    setTimeout(() => {
                        const choicesDiv = document.createElement('div');
                        choicesDiv.className = 'chat-message choices';
                        choicesDiv.innerHTML = `
                            <div class="message-choice" data-response="Can you tell me more about yourself?">Can you tell me more about yourself?</div>
                            <div class="message-choice" data-response="What's the best way to contact you?">What's the best way to contact you?</div>
                        `;
                        messagesContainer.appendChild(choicesDiv);
                        
                        // Add event listeners to new choices
                        choicesDiv.querySelectorAll('.message-choice').forEach(choice => {
                            choice.addEventListener('click', function() {
                                const responseText = this.getAttribute('data-response');
                                handleUserMessage(responseText);
                            });
                        });
                        
                        // Scroll to bottom
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }, 1000);
                }
            }, 1000);
        }

        // Function to handle user messages
        function handleUserMessage(text) {
            // Add user message to chat
            addMessage(text, true);
            
            // Generate and add assistant response
            addAssistantResponse(text);
        }

        // Event listeners for chat interactions
        messageChoices.forEach(choice => {
            choice.addEventListener('click', function() {
                const responseText = this.getAttribute('data-response');
                handleUserMessage(responseText);
                
                // Remove the initial choices after selection
                const choicesContainer = this.parentElement;
                choicesContainer.style.opacity = '0';
                setTimeout(() => {
                    choicesContainer.remove();
                }, 300);
            });
        });

        // Handle sending messages via the input field
        function sendMessage() {
            const text = textarea.value.trim();
            if (text) {
                handleUserMessage(text);
                textarea.value = '';
            }
        }

        // Send button click event
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }

        // Enter key press in textarea
        if (textarea) {
            textarea.addEventListener('keypress', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }

    // Initialize countdowns for scarcity elements
    function initCountdowns() {
        const countdownElements = document.querySelectorAll('.countdown');
        
        countdownElements.forEach(countdown => {
            // Get the target end date (e.g., 14 days from now for demonstration)
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 14);
            
            // Update the countdown every second
            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 1000);
            
            function updateCountdown() {
                // Get current date and calculate difference
                const now = new Date();
                const diff = targetDate - now;
                
                // If countdown is finished
                if (diff <= 0) {
                    clearInterval(countdownInterval);
                    countdown.innerHTML = `<div class="countdown-finished">Just Released!</div>`;
                    return;
                }
                
                // Calculate remaining time
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
                
                // Update countdown values in DOM
                const daysElement = document.getElementById('days-value');
                const hoursElement = document.getElementById('hours-value');
                const minsElement = document.getElementById('mins-value');
                const secsElement = document.getElementById('secs-value');
                
                if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
                if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
                if (minsElement) minsElement.textContent = mins.toString().padStart(2, '0');
                if (secsElement) secsElement.textContent = secs.toString().padStart(2, '0');
                
                // Add pulse animation when seconds change
                if (secsElement) {
                    secsElement.classList.add('pulse');
                    setTimeout(() => {
                        secsElement.classList.remove('pulse');
                    }, 500);
                }
            }
        });
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
        // Use the advanced particle system from animations.js if available
        if (window.animations && typeof window.animations.particles === 'function') {
            return window.animations.particles();
        }

        // Fallback to basic particles if animations module isn't loaded
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

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

            const ctx = canvas.getContext('2d');
            let particles = [];

            function resizeCanvas() {
                canvas.width = heroSection.offsetWidth;
                canvas.height = heroSection.offsetHeight;
            }

            function createParticles() {
                particles = [];
                const particleCount = Math.min(window.innerWidth / 10, 100);

                for (let i = 0; i < particleCount; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 2 + 1,
                        speedX: (Math.random() - 0.5) * 0.5,
                        speedY: (Math.random() - 0.5) * 0.5,
                        color: `rgba(108, 99, 255, ${Math.random() * 0.5 + 0.2})`
                    });
                }
            }

            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(particle => {
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    if (particle.x < 0 || particle.x > canvas.width) {
                        particle.speedX *= -1;
                    }

                    if (particle.y < 0 || particle.y > canvas.height) {
                        particle.speedY *= -1;
                    }

                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                });

                particles.forEach((particle, i) => {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particle.x - particles[j].x;
                        const dy = particle.y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(108, 99, 255, ${(1 - distance / 100) * 0.15})`;
                            ctx.stroke();
                        }
                    }
                });

                requestAnimationFrame(drawParticles);
            }

            resizeCanvas();
            createParticles();
            drawParticles();

            window.addEventListener('resize', () => {
                resizeCanvas();
                createParticles();
            });

            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                particles.forEach(particle => {
                    const dx = x - particle.x;
                    const dy = y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const angle = Math.atan2(dy, dx);
                        const force = 0.1 * (1 - distance / 100);

                        particle.speedX -= Math.cos(angle) * force;
                        particle.speedY -= Math.sin(angle) * force;
                    }
                });
            });
        }
    }

    // Create a custom cursor with interactive effects
    if (!('ontouchstart' in window)) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');

        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');

        cursor.appendChild(cursorDot);
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother movement
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });

            setTimeout(() => {
                cursor.classList.add('active');
            }, 100);
        });

        const interactiveElements = document.querySelectorAll('a, button, .hover-card, .project-item, .achievement-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // 3D Card effect for elements with card-3d class
    function enable3DCards() {
        // Delegate to the advanced animations module if available
        if (window.animations && typeof window.animations.perspective === 'function') {
            return window.animations.perspective();
        }

        // Fallback implementation if animations module isn't loaded
        const cards = document.querySelectorAll('.card-3d');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                // Skip on mobile or low-end devices
                if (window.innerWidth < 768 || !isHighEndDevice()) return;
                
                const cardRect = card.getBoundingClientRect();

                const mouseX = e.clientX - cardRect.left;
                const mouseY = e.clientY - cardRect.top;

                const percentX = mouseX / cardRect.width;
                const percentY = mouseY / cardRect.height;

                const rotateY = (percentX - 0.5) * 20;
                const rotateX = (0.5 - percentY) * 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

                const content = card.querySelectorAll('.card-3d-content');
                content.forEach(el => {
                    el.style.transform = `translateZ(30px)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;

                const content = card.querySelectorAll('.card-3d-content');
                content.forEach(el => {
                    el.style.transform = 'translateZ(0)';
                });
            });
        });
    }

    // Magnetic button effect for elements with magnetic-btn class
    function initMagneticButtons() {
        const btns = document.querySelectorAll('.magnetic-btn');

        btns.forEach(btn => {
            // Skip on mobile or low-end devices
            if (window.innerWidth < 768 || !isHighEndDevice()) return;
            
            btn.addEventListener('mousemove', (e) => {
                const btnRect = btn.getBoundingClientRect();
                const btnCenterX = btnRect.left + btnRect.width / 2;
                const btnCenterY = btnRect.top + btnRect.height / 2;

                const mouseX = e.clientX - btnCenterX;
                const mouseY = e.clientY - btnCenterY;

                const moveX = mouseX * 0.3;
                const moveY = mouseY * 0.3;

                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
            
            // Add ripple effect on click
            btn.addEventListener('click', (e) => {
                createRipple(btn);
            });
        });
    }

    // Enhanced project showcase with WebGL effects
    function initWebGLProjects() {
        // Skip if mobile device to save resources
        if (window.innerWidth < 768 && !isHighEndDevice()) return;

        const webglProjects = document.querySelectorAll('.webgl-project');

        if (webglProjects.length === 0) return;

        if (typeof THREE !== 'undefined') {
            webglProjects.forEach((container, idx) => {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                container.appendChild(renderer.domElement);

                // Create content based on index
                let geometry, material, mesh;

                switch (idx % 3) {
                    case 0:
                        geometry = new THREE.SphereGeometry(2, 32, 32);
                        material = new THREE.MeshStandardMaterial({
                            color: 0x6C63FF,
                            wireframe: true,
                            emissive: 0x6C63FF,
                            emissiveIntensity: 0.2
                        });
                        break;
                    case 1:
                        geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
                        material = new THREE.MeshStandardMaterial({
                            color: 0x00E0FF,
                            wireframe: true,
                            emissive: 0x00E0FF,
                            emissiveIntensity: 0.2
                        });
                        break;
                    case 2:
                        geometry = new THREE.IcosahedronGeometry(2, 0);
                        material = new THREE.MeshStandardMaterial({
                            color: 0xFF6B6B,
                            wireframe: true,
                            emissive: 0xFF6B6B,
                            emissiveIntensity: 0.2
                        });
                        break;
                }

                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(0, 0, 5);
                scene.add(light);

                const ambientLight = new THREE.AmbientLight(0x404040);
                scene.add(ambientLight);

                camera.position.z = 5;

                function animate() {
                    requestAnimationFrame(animate);

                    mesh.rotation.x += 0.005;
                    mesh.rotation.y += 0.01;

                    renderer.render(scene, camera);
                }

                animate();

                window.addEventListener('resize', () => {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                });

                container.addEventListener('mousemove', e => {
                    const rect = container.getBoundingClientRect();
                    const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
                    const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

                    mesh.rotation.x = mouseY * 0.5;
                    mesh.rotation.y = mouseX * 0.5;
                });
            });
        }
    }

    // Interactive Skills Chart
    function initSkillsChart() {
        const skillsChart = document.querySelector('.skills-chart');

        if (!skillsChart) return;

        const skills = [
            { name: 'Unreal Engine', level: 0.85, x: 0.2, y: 0.3 },
            { name: 'C++', level: 0.75, x: 0.5, y: 0.2 },
            { name: 'Ethical Hacking', level: 0.9, x: 0.8, y: 0.3 },
            { name: 'Python', level: 0.8, x: 0.15, y: 0.6 },
            { name: 'Game Design', level: 0.85, x: 0.4, y: 0.5 },
            { name: 'Web Dev', level: 0.7, x: 0.6, y: 0.7 },
            { name: 'Problem Solving', level: 0.95, x: 0.85, y: 0.6 }
        ];

        skillsChart.innerHTML = '';

        const canvas = document.createElement('canvas');
        canvas.classList.add('skill-connections');
        canvas.width = skillsChart.clientWidth;
        canvas.height = skillsChart.clientHeight;
        skillsChart.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        skills.forEach(skill => {
            const point = document.createElement('div');
            point.classList.add('skill-point');

            const size = 20 + (skill.level * 20);
            point.style.width = `${size}px`;
            point.style.height = `${size}px`;

            const left = skill.x * 100;
            const top = skill.y * 100;
            point.style.left = `${left}%`;
            point.style.top = `${top}%`;

            const name = document.createElement('div');
            name.classList.add('skill-name');
            name.textContent = `${skill.name} (${Math.round(skill.level * 100)}%)`;

            if (skill.x < 0.5) {
                name.style.left = '100%';
                name.style.marginLeft = '15px';
                name.style.transform = 'translateY(-50%)';
            } else {
                name.style.right = '100%';
                name.style.marginRight = '15px';
                name.style.transform = 'translateY(-50%)';
            }

            point.appendChild(name);
            skillsChart.appendChild(point);

            skill.posX = left / 100 * canvas.width;
            skill.posY = top / 100 * canvas.height;
        });

        ctx.strokeStyle = 'rgba(108, 99, 255, 0.2)';
        ctx.lineWidth = 1;

        for (let i = 0; i < skills.length; i++) {
            for (let j = i + 1; j < skills.length; j++) {
                ctx.beginPath();
                ctx.moveTo(skills[i].posX, skills[i].posY);
                ctx.lineTo(skills[j].posX, skills[j].posY);
                ctx.stroke();
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = skillsChart.clientWidth;
            canvas.height = skillsChart.clientHeight;

            skills.forEach(skill => {
                const left = skill.x * 100;
                const top = skill.y * 100;
                skill.posX = left / 100 * canvas.width;
                skill.posY = top / 100 * canvas.height;
            });

            ctx.strokeStyle = 'rgba(108, 99, 255, 0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < skills.length; i++) {
                for (let j = i + 1; j < skills.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(skills[i].posX, skills[i].posY);
                    ctx.lineTo(skills[j].posX, skills[j].posY);
                    ctx.stroke();
                }
            }
        });
    }

    // Blog functionality
    function initBlog() {
        const blogContainer = document.querySelector('.blog-grid');

        if (!blogContainer) return;

        const blogPosts = [
            {
                title: "Getting Started with Unreal Engine 5",
                excerpt: "Explore the new features of Unreal Engine 5 and how to create your first project with Nanite and Lumen technologies.",
                category: "Game Dev",
                date: "April 10, 2025",
                thumbnail: "https://cdn2.unrealengine.com/unreal-engine-5-1-features-for-fortnite-chapter-4-header-1920x1080-2e96869442d6.jpg"
            },
            {
                title: "Ethical Hacking: Protecting Digital Assets",
                excerpt: "Learn the fundamentals of ethical hacking and how to secure your applications against common vulnerabilities.",
                category: "Cybersecurity",
                date: "March 25, 2025",
                thumbnail: "https://img.freepik.com/free-vector/hacker-operating-laptop-cartoon-icon-illustration-technology-icon-concept-isolated-flat-cartoon-style_138676-2387.jpg"
            },
            {
                title: "Modern UI/UX Principles for Game Developers",
                excerpt: "Discover how to apply modern UI/UX design principles to create more engaging and intuitive game interfaces.",
                category: "Design",
                date: "March 15, 2025",
                thumbnail: "https://cdn.dribbble.com/users/1615584/screenshots/16163398/media/5b3b41644d99b5f1ce1d14bca47f1f68.jpg"
            }
        ];

        blogPosts.forEach(post => {
            const blogCard = document.createElement('article');
            blogCard.classList.add('blog-card', 'animate-on-scroll');
            blogCard.setAttribute('data-animation', 'fade-up');

            blogCard.innerHTML = `
                <div class="blog-thumbnail">
                    <img src="${post.thumbnail}" alt="${post.title}">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-content">
                    <div class="blog-date">${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="blog/${post.title.toLowerCase().replace(/\s+/g, '-')}" class="blog-read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;

            blogContainer.appendChild(blogCard);
        });
    }

    // Testimonial slider
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');

        if (!slider) return;

        const dots = document.querySelectorAll('.testimonial-dot');
        const testimonials = document.querySelectorAll('.testimonial-card');
        let currentSlide = 0;

        dots[0].classList.add('active');

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                currentSlide = idx;
                updateSlider();

                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Psychology enhancement - reward for interaction
                if (window.psychology && typeof window.psychology.reward === 'function') {
                    window.psychology.reward('interaction', 2);
                }
            });
        });

        const autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateSlider();

            dots.forEach(d => d.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }, 5000);

        function updateSlider() {
            const slideWidth = testimonials[0].offsetWidth + 32; // Add margin
            slider.scrollTo({
                left: currentSlide * slideWidth,
                behavior: 'smooth'
            });
        }

        slider.addEventListener('mouseover', () => {
            clearInterval(autoSlide);
        });
    }

    // Initialize 3D model viewer if present
    const modelViewer = document.querySelector('model-viewer');

    if (modelViewer) {
        const rotateBtn = document.querySelector('.model-btn[data-action="rotate"]');
        const resetBtn = document.querySelector('.model-btn[data-action="reset"]');

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                if (modelViewer.hasAttribute('auto-rotate')) {
                    modelViewer.removeAttribute('auto-rotate');
                    rotateBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
                } else {
                    modelViewer.setAttribute('auto-rotate', '');
                    rotateBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                modelViewer.cameraOrbit = '0deg 75deg 105%';
                modelViewer.cameraTarget = '0m 0m 0m';
                modelViewer.fieldOfView = '30deg';
                
                // Add subtle animation to show reset
                modelViewer.setAttribute('animation', 'true');
                setTimeout(() => {
                    modelViewer.removeAttribute('animation');
                }, 500);
            });
        }
    }
});
