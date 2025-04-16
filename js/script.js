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
    
    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            goTopBtn.classList.add('active');
        } else {
            header.classList.remove('sticky');
            goTopBtn.classList.remove('active');
        }
        
        // Active nav link based on scroll position
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 60) {
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
    
    // Mobile Navigation
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    // Close mobile nav when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
    
    // Project Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    
                    // Add animation
                    setTimeout(() => {
                        item.style.transform = 'translateY(0)';
                        item.style.opacity = '1';
                    }, 200);
                } else {
                    item.style.transform = 'translateY(20px)';
                    item.style.opacity = '0';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Animate skill bars on scroll
    const skillSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-percent');
    
    const animateSkills = () => {
        const skillSectionPos = skillSection.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        if (skillSectionPos < screenHeight * 0.75) {
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            });
            
            window.removeEventListener('scroll', animateSkills);
        }
    };
    
    window.addEventListener('scroll', animateSkills);
    
    // Form Submission with validation and status messages
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form inputs
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const subject = contactForm.querySelector('input[name="subject"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showFormStatus('error', 'Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormStatus('error', 'Please enter a valid email address');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, we'll simulate a successful submission
        console.log({ name, email, subject, message });
        
        // Show success message
        showFormStatus('success', 'Thank you! Your message has been sent successfully.');
        
        // Reset form
        contactForm.reset();
        
        // Simulate form processing
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    });
    
    // Form helpers
    function showFormStatus(type, message) {
        formStatus.className = 'form-status ' + type;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-item, .achievement-card, .social-box');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            if (elementPosition < screenHeight * 0.9) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize animations
    setTimeout(animateOnScroll, 100);
    
    // Update footer copyright year
    document.querySelector('.copyright p').innerHTML = 
        `&copy; ${new Date().getFullYear()} Kalvin Shah. All Rights Reserved.`;
});
