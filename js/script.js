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
                    header.style.backdropFilter = `blur(${blurIntensity}px)`;
                    header.style.webkitBackdropFilter = `blur(${blurIntensity}px)`;
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

    // Improved Form Submission with enhanced validation and user feedback
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const subjectInput = contactForm.querySelector('input[name="subject"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.classList.remove('error');
        });

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

        showFormStatus('loading', 'Sending your message...');

        setTimeout(() => {
            showFormStatus('success', 'Thank you! Your message has been sent successfully.');

            const formElement = contactForm.querySelector('form');
            formElement.classList.add('submitted');

            contactForm.reset();

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

    function showInputError(inputElement, message) {
        inputElement.classList.add('error');
        inputElement.focus();
        showFormStatus('error', message);

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

                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    if (particle.x < 0 || particle.x > canvas.width) {
                        particle.speedX *= -1;
                    }

                    if (particle.y < 0 || particle.y > canvas.height) {
                        particle.speedY *= -1;
                    }
                });

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

                    if (distance < 200) {
                        const angle = Math.atan2(dy, dx);
                        const force = 0.3 * (1 - distance / 200);

                        particle.speedX += Math.cos(angle) * force;
                        particle.speedY += Math.sin(angle) * force;

                        const maxSpeed = 4;
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

    // NEW: Custom cursor effect for modern interactive feel
    const createCustomCursor = () => {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');

        const cursorDot = document.createElement('div');
        cursorDot.classList.add('cursor-dot');

        cursor.appendChild(cursorDot);
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;

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
    };

    if (!('ontouchstart' in window)) {
        createCustomCursor();
    }

    // NEW: 3D Card effect
    const enable3DCards = () => {
        const cards = document.querySelectorAll('.card-3d');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();

                const mouseX = e.clientX - cardRect.left;
                const mouseY = e.clientY - cardRect.top;

                const percentX = mouseX / cardRect.width;
                const percentY = mouseY / cardRect.height;

                const rotateY = (percentX - 0.5) * 30;
                const rotateX = (0.5 - percentY) * 30;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

                const content = card.querySelectorAll('.card-3d-content');
                content.forEach(el => {
                    el.style.transform = `translateZ(50px)`;
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
    };

    // NEW: Magnetic button effect
    const initMagneticButtons = () => {
        const btns = document.querySelectorAll('.magnetic-btn');

        btns.forEach(btn => {
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
        });
    };

    // NEW: Enhanced project showcase with WebGL effects
    const initWebGLProjects = () => {
        const webglProjects = document.querySelectorAll('.webgl-project');

        if (webglProjects.length === 0) return;

        if (typeof THREE !== 'undefined') {
            webglProjects.forEach((container, idx) => {
                const scene = new THREE.Scene();

                const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                camera.position.z = 5;

                const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true
                });

                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                container.appendChild(renderer.domElement);

                let geometry, material, mesh;

                switch (idx % 3) {
                    case 0:
                        geometry = new THREE.SphereGeometry(2, 32, 32);
                        material = new THREE.MeshStandardMaterial({
                            color: 0x6C63FF,
                            wireframe: true
                        });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case 1:
                        geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
                        material = new THREE.MeshStandardMaterial({
                            color: 0x00E0FF,
                            wireframe: true
                        });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                    case 2:
                        geometry = new THREE.IcosahedronGeometry(2, 0);
                        material = new THREE.MeshStandardMaterial({
                            color: 0xFF6B6B,
                            wireframe: true
                        });
                        mesh = new THREE.Mesh(geometry, material);
                        break;
                }

                scene.add(mesh);

                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(0, 0, 5);
                scene.add(light);

                const ambientLight = new THREE.AmbientLight(0x404040);
                scene.add(ambientLight);

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

                container.addEventListener('mousemove', (e) => {
                    const rect = container.getBoundingClientRect();
                    const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
                    const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

                    mesh.rotation.x = mouseY * 0.5;
                    mesh.rotation.y = mouseX * 0.5;
                });
            });
        }
    };

    // NEW: Interactive Skills Chart
    const initSkillsChart = () => {
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
                name.style.marginLeft = '10px';
            } else {
                name.style.right = '100%';
                name.style.marginRight = '10px';
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
                skill.posX = skill.x * canvas.width;
                skill.posY = skill.y * canvas.height;
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
    };

    // NEW: Blog functionality
    const initBlog = () => {
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
    };

    // NEW: Testimonial slider
    const initTestimonialSlider = () => {
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
            });
        });

        const autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateSlider();

            dots.forEach(d => d.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }, 5000);

        function updateSlider() {
            const slideWidth = testimonials[0].offsetWidth + 32;
            slider.scrollTo({
                left: currentSlide * slideWidth,
                behavior: 'smooth'
            });
        }

        slider.addEventListener('mouseover', () => {
            clearInterval(autoSlide);
        });
    };

    // NEW: Initialize 3D model viewer if present
    const initModelViewer = () => {
        const modelViewer = document.querySelector('model-viewer');

        if (!modelViewer) return;

        const rotateBtn = document.querySelector('.model-btn[data-action="rotate"]');
        const resetBtn = document.querySelector('.model-btn[data-action="reset"]');

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                if (modelViewer.hasAttribute('auto-rotate')) {
                    modelViewer.removeAttribute('auto-rotate');
                    rotateBtn.innerHTML = '<i class="fas fa-sync"></i>';
                } else {
                    modelViewer.setAttribute('auto-rotate', true);
                    rotateBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                modelViewer.cameraOrbit = '0deg 75deg 105%';
                modelViewer.cameraTarget = '0 0 0';
            });
        }
    };

    // NEW: Initialize all components
    const initApp = () => {
        enable3DCards();
        initMagneticButtons();
        initWebGLProjects();
        initSkillsChart();
        initBlog();
        initTestimonialSlider();
        initModelViewer();
        initParticleBackground();

        if (document.querySelector('.typing-text')) {
            runTypingAnimation();
        }

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                once: false,
                mirror: true,
                anchorPlacement: 'center-bottom',
                disable: function() {
                    return window.innerWidth < 768 && 'phone';
                }
            });
        }

        animateOnScroll();
    };

    // Enhanced animation on scroll with intersection observer for better performance
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animation || 'fade-up';
                    entry.target.classList.add('animated', animation);

                    if (!entry.target.dataset.repeat) {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.repeat) {
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
                typingSpeed = 30;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 1500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        }

        type();
    }

    // Update footer copyright year
    document.querySelector('.copyright p').innerHTML = 
        `&copy; ${new Date().getFullYear()} Kalvin Shah. All Rights Reserved.`;
});
