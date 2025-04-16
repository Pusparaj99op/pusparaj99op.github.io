/**
 * Psychology.js - Advanced psychological triggers to enhance user engagement
 * This module implements various psychology-based UI patterns that make the website
 * more engaging, memorable and potentially "addictive" in a positive way.
 */

// Self-invoking function to avoid global scope pollution
(function() {
    'use strict';
    
    // Expose the API to window.psychology
    window.psychology = {
        init: initPsychology,
        reward: triggerReward,
        surprise: createSurpriseElements,
        scarcity: initScarcityIndicators,
        socialProof: initSocialProof
    };
    
    // Variables for tracking rewards
    let rewardPoints = 0;
    let lastScrollPosition = 0;
    const scrollThreshold = 300; // Reward every 300px of scrolling
    let scrollTimeout = null;
    
    /**
     * Initialize all psychological enhancement features
     */
    function initPsychology() {
        // Initialize progress tracking to create a sense of achievement
        initProgressTracking();
        
        // Initialize microinteractions
        initMicroInteractions();
        
        // Set up scroll-based rewards
        initScrollRewards();
        
        // Implement surprise elements
        createSurpriseElements();

        // Initialize artificial scarcity indicators
        initScarcityIndicators();
        
        // Add social proof elements
        initSocialProof();
        
        console.log('✨ Psychology enhancements initialized');
    }
    
    /**
     * Creates a progress bar that fills as user explores the site
     * This gives users a sense of achievement and completion
     */
    function initProgressTracking() {
        // Create progress bar element
        const progressBar = document.createElement('div');
        progressBar.classList.add('psychology-progress');
        document.body.appendChild(progressBar);
        
        // Update progress bar on scroll
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
            
            // Add glow effect when hitting milestones
            if (scrollPercentage > 25 && scrollPercentage < 30) {
                progressBar.classList.add('milestone-glow');
                setTimeout(() => progressBar.classList.remove('milestone-glow'), 1000);
            } else if (scrollPercentage > 50 && scrollPercentage < 55) {
                progressBar.classList.add('milestone-glow');
                setTimeout(() => progressBar.classList.remove('milestone-glow'), 1000);
            } else if (scrollPercentage > 75 && scrollPercentage < 80) {
                progressBar.classList.add('milestone-glow');
                setTimeout(() => progressBar.classList.remove('milestone-glow'), 1000);
            } else if (scrollPercentage > 95) {
                progressBar.classList.add('milestone-glow');
                setTimeout(() => progressBar.classList.remove('milestone-glow'), 1000);
                
                // Trigger completion reward
                if (scrollPercentage >= 98) {
                    triggerReward('completion', 50, 'You\'ve explored the entire portfolio!');
                }
            }
        });
    }
    
    /**
     * Initialize micro-interactions for immediate feedback
     * These small animations provide instantaneous feedback to user actions
     */
    function initMicroInteractions() {
        // Add click ripple effect to all buttons
        const buttons = document.querySelectorAll('button, .btn, .project-link');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('psychology-ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                // Add a small haptic-like animation to the button
                button.classList.add('psychology-haptic');
                
                setTimeout(() => {
                    ripple.remove();
                    button.classList.remove('psychology-haptic');
                }, 600);
                
                // Trigger a small reward for interaction
                triggerReward('interaction', 1);
            });
        });
        
        // Add hover animations to project cards
        const projects = document.querySelectorAll('.project-item');
        
        projects.forEach(project => {
            project.addEventListener('mouseenter', () => {
                // Create floating particles
                for (let i = 0; i < 5; i++) {
                    const particle = document.createElement('span');
                    particle.classList.add('psychology-particle');
                    
                    // Randomize particle appearance
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.animationDelay = `${Math.random() * 0.5}s`;
                    particle.style.opacity = Math.random() * 0.5 + 0.5;
                    
                    project.appendChild(particle);
                    
                    setTimeout(() => {
                        particle.remove();
                    }, 1000);
                }
            });
        });
    }
    
    /**
     * Set up scroll-based rewards to encourage exploration
     */
    function initScrollRewards() {
        window.addEventListener('scroll', () => {
            const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // Clear previous timeout if it exists
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            // Set a timeout to ensure we only trigger after scrolling stops
            scrollTimeout = setTimeout(() => {
                // Calculate how far user has scrolled since last reward
                const scrollDistance = Math.abs(currentScrollPosition - lastScrollPosition);
                
                // If scrolled past threshold, give a reward
                if (scrollDistance > scrollThreshold) {
                    triggerReward('exploration', Math.floor(scrollDistance / scrollThreshold));
                    lastScrollPosition = currentScrollPosition;
                }
            }, 200);
        });
    }
    
    /**
     * Trigger a reward animation with points
     * @param {string} type - Type of reward (exploration, interaction, etc.)
     * @param {number} points - Points to award
     * @param {string} message - Optional message to display
     */
    function triggerReward(type, points, message = null) {
        // Increment reward points
        rewardPoints += points;
        
        // Create reward notification
        const reward = document.createElement('div');
        reward.classList.add('psychology-reward');
        
        // Customize based on reward type
        if (type === 'exploration') {
            reward.innerHTML = `<span>+${points}</span> Exploration`;
            reward.style.backgroundColor = 'rgba(108, 99, 255, 0.9)';
        } else if (type === 'interaction') {
            reward.innerHTML = `<span>+${points}</span>`;
            reward.style.backgroundColor = 'rgba(0, 224, 255, 0.9)';
        } else if (type === 'completion') {
            reward.innerHTML = `<span>+${points}</span> ${message}`;
            reward.style.backgroundColor = 'rgba(255, 189, 89, 0.9)';
            reward.classList.add('psychology-reward-large');
        }
        
        document.body.appendChild(reward);
        
        // Animate reward
        setTimeout(() => {
            reward.classList.add('psychology-reward-show');
            
            // Make reward float up and fade out
            setTimeout(() => {
                reward.classList.add('psychology-reward-hide');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    reward.remove();
                }, 600);
            }, 1500);
        }, 10);
        
        // Update reward counter if it exists
        const rewardCounter = document.querySelector('.reward-counter');
        if (rewardCounter) {
            rewardCounter.textContent = rewardPoints;
            rewardCounter.classList.add('reward-counter-update');
            setTimeout(() => {
                rewardCounter.classList.remove('reward-counter-update');
            }, 500);
        } else if (type === 'exploration' || type === 'completion') {
            // Create counter if first reward and not just an interaction
            createRewardCounter();
        }
    }
    
    /**
     * Create a points counter in the corner of the screen
     */
    function createRewardCounter() {
        // Only create if it doesn't exist already
        if (document.querySelector('.reward-counter-container')) return;
        
        const container = document.createElement('div');
        container.classList.add('reward-counter-container');
        
        container.innerHTML = `
            <div class="reward-counter-icon">
                <i class="fas fa-star"></i>
            </div>
            <span class="reward-counter">${rewardPoints}</span>
        `;
        
        document.body.appendChild(container);
        
        // Add entrance animation
        setTimeout(() => {
            container.classList.add('reward-counter-show');
        }, 100);
    }
    
    /**
     * Create surprise elements that appear randomly as user scrolls
     * These unexpected events create delight and memorability
     */
    function createSurpriseElements() {
        // Array of possible surprises
        const surprises = [
            {
                type: 'confetti',
                threshold: 0.3, // 30% chance
                handler: createConfettiSurprise
            },
            {
                type: 'floating',
                threshold: 0.5, // 50% chance
                handler: createFloatingElement
            },
            {
                type: 'notification',
                threshold: 0.2, // 20% chance
                handler: createSurpriseNotification
            }
        ];
        
        // Create scroll observer
        let lastTriggerTime = 0;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            // Limit frequency of surprises to avoid overwhelming the user
            if (now - lastTriggerTime < 15000) return; // At least 15 seconds between surprises
            
            // Only trigger sometimes based on random chance
            const rand = Math.random();
            if (rand > 0.9) { // 10% chance on scroll
                lastTriggerTime = now;
                
                // Choose a random surprise from the array, weighted by threshold
                for (const surprise of surprises) {
                    if (Math.random() < surprise.threshold) {
                        surprise.handler();
                        break;
                    }
                }
            }
        });
    }
    
    /**
     * Creates a confetti explosion at random position
     */
    function createConfettiSurprise() {
        // Only create if canvas library is loaded
        if (typeof confetti !== 'function') {
            // Load confetti library if not already loaded
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
            document.head.appendChild(script);
            
            script.onload = () => {
                triggerConfetti();
            };
        } else {
            triggerConfetti();
        }
        
        // Trigger the confetti animation
        function triggerConfetti() {
            const x = Math.random() * 0.8 + 0.1; // Between 10-90% of screen width
            const y = Math.random() * 0.5 + 0.1; // Between 10-60% of screen height
            
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x, y },
                zIndex: 9999
            });
            
            // Also trigger a reward
            triggerReward('surprise', 10, 'Surprise!');
        }
    }
    
    /**
     * Creates a floating element that moves across the screen
     */
    function createFloatingElement() {
        // Create a floating element with a random icon
        const element = document.createElement('div');
        element.classList.add('psychology-floating-element');
        
        // Choose a random icon
        const icons = ['💡', '✨', '🚀', '🎮', '🔒', '🌟'];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        
        element.textContent = icon;
        
        // Add to body
        document.body.appendChild(element);
        
        // Set random position on the right edge of the screen
        const viewportHeight = window.innerHeight;
        const startY = Math.random() * (viewportHeight * 0.6) + (viewportHeight * 0.2);
        
        element.style.top = `${startY}px`;
        element.style.right = '0';
        element.style.transform = 'translateX(100%)';
        
        // Start animation
        setTimeout(() => {
            element.style.transform = 'translateX(-100vw)';
            element.style.opacity = '1';
            
            // Clean up after animation
            setTimeout(() => {
                element.remove();
            }, 8000);
        }, 100);
    }
    
    /**
     * Creates a surprise notification with a fun message
     */
    function createSurpriseNotification() {
        // Array of possible messages
        const messages = [
            "Did you know? I've completed over 10 personal projects! 🚀",
            "Fun fact: I love playing chess in my free time! ♟️",
            "Tip: Try clicking on the 3D models to interact with them! 👆",
            "Achievement unlocked: Portfolio explorer! 🏆",
            "You've discovered a secret area of my portfolio! 🔍",
            "Did you notice the particle effects in the background? ✨"
        ];
        
        // Choose a random message
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        // Create notification
        const notification = document.createElement('div');
        notification.classList.add('psychology-notification');
        notification.innerHTML = `
            <div class="psychology-notification-icon">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="psychology-notification-content">
                <p>${message}</p>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('psychology-notification-show');
            
            // Hide after delay
            setTimeout(() => {
                notification.classList.remove('psychology-notification-show');
                notification.classList.add('psychology-notification-hide');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }, 100);
    }
    
    /**
     * Initialize artificial scarcity indicators
     * Creates a sense of urgency and FOMO (Fear of Missing Out)
     */
    function initScarcityIndicators() {
        // Data for services/availability that appears limited
        const scarcityData = [
            {
                type: 'availability',
                message: 'Open to new projects: <span>Limited Spots</span>',
                icon: 'fa-calendar-check',
                contact: true
            },
            {
                type: 'countdown',
                message: 'Portfolio updates in:',
                endTime: new Date().getTime() + (14 * 24 * 60 * 60 * 1000), // 14 days
                icon: 'fa-clock'
            }
        ];
        
        // Create scarcity container
        const container = document.createElement('div');
        container.classList.add('psychology-scarcity-container');
        
        // Create indicators based on data
        scarcityData.forEach(item => {
            const indicator = document.createElement('div');
            indicator.classList.add('psychology-scarcity-indicator');
            
            if (item.type === 'availability') {
                indicator.innerHTML = `
                    <i class="fas ${item.icon}"></i>
                    <p>${item.message}</p>
                    ${item.contact ? '<a href="#contact" class="scarcity-action">Contact Now</a>' : ''}
                `;
            } else if (item.type === 'countdown') {
                indicator.innerHTML = `
                    <i class="fas ${item.icon}"></i>
                    <p>${item.message}</p>
                    <div class="countdown-timer" data-end="${item.endTime}">
                        <span class="days">00</span>d
                        <span class="hours">00</span>h
                        <span class="minutes">00</span>m
                        <span class="seconds">00</span>s
                    </div>
                `;
                
                // Initialize countdown
                initCountdown(indicator.querySelector('.countdown-timer'));
            }
            
            container.appendChild(indicator);
        });
        
        // Add to page in a suitable location
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.querySelector('.container').appendChild(container);
        } else {
            // Fallback to adding before footer
            const footer = document.querySelector('footer');
            if (footer) {
                document.body.insertBefore(container, footer);
            }
        }
        
        // Pulse animation at regular intervals for attention
        setInterval(() => {
            container.classList.add('psychology-scarcity-pulse');
            setTimeout(() => {
                container.classList.remove('psychology-scarcity-pulse');
            }, 1000);
        }, 10000);
    }
    
    /**
     * Initialize countdown timer
     * @param {Element} element - The DOM element for the countdown
     */
    function initCountdown(element) {
        const endTime = parseInt(element.dataset.end);
        
        // Update the countdown every second
        const countdownInterval = setInterval(function() {
            // Get current time
            const now = new Date().getTime();
            
            // Find the distance between now and the countdown end time
            const distance = endTime - now;
            
            // Time calculations
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display result
            element.querySelector('.days').textContent = days.toString().padStart(2, '0');
            element.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
            element.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
            element.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
            
            // If the countdown is finished, clear interval
            if (distance < 0) {
                clearInterval(countdownInterval);
                element.innerHTML = "JUST UPDATED!";
            }
        }, 1000);
    }
    
    /**
     * Initialize social proof elements
     * People trust what others are doing (herd behavior)
     */
    function initSocialProof() {
        // Create visitor counter
        const visitorCount = localStorage.getItem('fakeVisitorCount') || 0;
        let newCount = parseInt(visitorCount) + Math.floor(Math.random() * 5) + 1;
        localStorage.setItem('fakeVisitorCount', newCount);
        
        // Create recent activity notifications
        const activities = [
            { name: "Sarah T.", action: "viewed your portfolio", timeAgo: "2 minutes ago" },
            { name: "Michael R.", action: "contacted for a project", timeAgo: "15 minutes ago" },
            { name: "Tech Company", action: "downloaded your resume", timeAgo: "34 minutes ago" },
            { name: "John D.", action: "viewed your Fantasy Game project", timeAgo: "1 hour ago" }
        ];
        
        // Create the social proof container
        const socialProofContainer = document.createElement('div');
        socialProofContainer.classList.add('psychology-social-proof');
        
        // Add visitor counter
        const visitorCounter = document.createElement('div');
        visitorCounter.classList.add('visitor-counter');
        visitorCounter.innerHTML = `<i class="fas fa-users"></i> <span>${newCount}</span> portfolio visitors today`;
        socialProofContainer.appendChild(visitorCounter);
        
        // Add to the page
        document.body.appendChild(socialProofContainer);
        
        // Show notification bubble periodically
        let lastActivityIndex = -1;
        
        function showRandomActivity() {
            // Remove existing notification
            const existingNotification = document.querySelector('.activity-notification');
            if (existingNotification) {
                existingNotification.classList.add('notification-hide');
                setTimeout(() => existingNotification.remove(), 500);
                return; // Wait for next cycle
            }
            
            // Get a random activity that's not the same as the last one
            let activityIndex;
            do {
                activityIndex = Math.floor(Math.random() * activities.length);
            } while (activityIndex === lastActivityIndex);
            
            lastActivityIndex = activityIndex;
            const activity = activities[activityIndex];
            
            // Create notification element
            const notification = document.createElement('div');
            notification.classList.add('activity-notification');
            notification.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.name}</strong> ${activity.action}</p>
                    <span>${activity.timeAgo}</span>
                </div>
            `;
            
            socialProofContainer.appendChild(notification);
            
            // Show with animation
            setTimeout(() => {
                notification.classList.add('notification-show');
                
                // Hide after delay
                setTimeout(() => {
                    notification.classList.remove('notification-show');
                    notification.classList.add('notification-hide');
                    
                    // Remove from DOM after animation
                    setTimeout(() => {
                        notification.remove();
                    }, 500);
                }, 4000);
            }, 100);
        }
        
        // Show first activity after a delay
        setTimeout(() => {
            showRandomActivity();
            
            // Set random interval for future activities (between 20-60 seconds)
            setInterval(() => {
                if (Math.random() > 0.3) { // 70% chance to show
                    showRandomActivity();
                }
            }, Math.random() * 40000 + 20000);
        }, 15000);
    }

})();