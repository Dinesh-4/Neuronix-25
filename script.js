// Neuronix '25 - Interactive JavaScript

class NeuronixApp {
    constructor() {
        this.sounds = {};
        this.initializeApp();
    }

    initializeApp() {
        this.loadSounds();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupNavigation();
        this.setupModal();
        this.setupForm();
        this.initializeScrollAnimations();
    }

    // Sound Management
    loadSounds() {
        const soundFiles = {
            button: 'sounds/button-click.mp3',
            form: 'sounds/form-submit.mp3',
            modal: 'sounds/modal-open.mp3'
        };

        Object.keys(soundFiles).forEach(key => {
            this.sounds[key] = new Audio(soundFiles[key]);
            this.sounds[key].volume = 0.3;
            
            // Fallback for missing audio files
            this.sounds[key].addEventListener('error', () => {
                console.log(`Audio file ${soundFiles[key]} not found, creating synthetic sound`);
                this.createSyntheticSound(key);
            });
        });
    }

    createSyntheticSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds[type] = {
            play: () => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                switch(type) {
                    case 'button':
                        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                        break;
                    case 'form':
                        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
                        break;
                    case 'modal':
                        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                        oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.15);
                        break;
                }
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }
        };
    }

    playSound(soundType) {
        if (this.sounds[soundType]) {
            this.sounds[soundType].play().catch(e => {
                console.log('Sound play failed:', e);
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Sound effects for buttons
        document.addEventListener('click', (e) => {
            const soundType = e.target.getAttribute('data-sound') || 
                            e.target.closest('[data-sound]')?.getAttribute('data-sound');
            
            if (soundType) {
                this.playSound(soundType);
            }
        });

        // Cyber button effects
        document.querySelectorAll('.cyber-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });

        // Hero buttons functionality
        document.querySelector('.cyber-btn.primary')?.addEventListener('click', () => {
            document.querySelector('#register').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });

        document.querySelector('.cyber-btn.secondary')?.addEventListener('click', () => {
             window.location.href = 'event-register.html';
        });

        // Event card interactions
        document.querySelectorAll('.view-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventCard = e.target.closest('.event-card');
                const eventType = eventCard.getAttribute('data-event');
                this.showEventModal(eventType);
            });
        });
    }

    // Navigation
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu
                    navMenu.classList.remove('active');
                }
            });
        });

        // Active nav link highlighting
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && 
                window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Modal System
    setupModal() {
        const modal = document.getElementById('eventModal');
        const closeBtn = document.querySelector('.close-modal');

        closeBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    showEventModal(eventType) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        const eventData = {
            keynote: {
                title: 'Keynote Speeches',
                content: `
                    <h4>Featured Keynotes:</h4>
                    <ul>
                        <li><strong>Dr. Sarah Chen</strong> - "The Future of Neural Computing"</li>
                        <li><strong>Prof. Marcus Rodriguez</strong> - "Quantum AI: Breaking the Barriers"</li>
                    </ul>
                    <p>Join world-renowned AI researchers as they unveil the next generation of artificial intelligence technologies that will reshape our understanding of machine learning and neural networks.</p>
                    <p><strong>Time:</strong> 9:00 AM - 10:30 AM</p>
                    <p><strong>Venue:</strong> Main Auditorium</p>
                `
            },
            workshops: {
                title: 'Technical Workshops',
                content: `
                    <h4>Available Workshops:</h4>
                    <ul>
                        <li><strong>Deep Learning Fundamentals</strong> - Build your first neural network</li>
                        <li><strong>Computer Vision with PyTorch</strong> - Image recognition techniques</li>
                        <li><strong>Natural Language Processing</strong> - Text analysis and generation</li>
                        <li><strong>Reinforcement Learning</strong> - Training AI agents</li>
                    </ul>
                    <p>Hands-on coding sessions with industry experts. Laptops will be provided.</p>
                    <p><strong>Time:</strong> 1:30 PM - 3:00 PM</p>
                    <p><strong>Venue:</strong> Computer Labs 1-4</p>
                `
            },
            panels: {
                title: 'Panel Discussions',
                content: `
                    <h4>Discussion Topics:</h4>
                    <ul>
                        <li><strong>AI Ethics and Society</strong> - Responsible AI development</li>
                        <li><strong>The Future of Work</strong> - AI's impact on employment</li>
                        <li><strong>AI in Healthcare</strong> - Medical applications and challenges</li>
                        <li><strong>Climate Change & AI</strong> - Technology for sustainability</li>
                    </ul>
                    <p>Thought-provoking discussions with industry leaders, ethicists, and researchers about the implications of AI in our society.</p>
                    <p><strong>Time:</strong> 10:30 AM - 12:00 PM</p>
                    <p><strong>Venue:</strong> Conference Hall</p>
                `
            },
            showcase: {
                title: 'Project Showcase',
                content: `
                    <h4>Competition Categories:</h4>
                    <ul>
                        <li><strong>Student Innovation Award</strong> - Best undergraduate project</li>
                        <li><strong>Research Excellence</strong> - Most impactful research</li>
                        <li><strong>Creative AI</strong> - Most creative application</li>
                        <li><strong>Social Impact</strong> - Technology for good</li>
                    </ul>
                    <p>Witness groundbreaking AI projects from students and professionals. Vote for your favorite and win prizes!</p>
                    <p><strong>Time:</strong> 3:00 PM - 5:00 PM</p>
                    <p><strong>Venue:</strong> Exhibition Hall</p>
                    <p><strong>Prizes:</strong> $5000 total prize pool</p>
                `
            }
        };

        const event = eventData[eventType];
        if (event) {
            modalTitle.textContent = event.title;
            modalContent.innerHTML = event.content;
            modal.style.display = 'block';
            this.playSound('modal');
        }
    }

    closeModal() {
        const modal = document.getElementById('eventModal');
        modal.style.display = 'none';
    }

    // Form Handling
    setupForm() {
        const form = document.getElementById('regForm');
        const processingOverlay = document.querySelector('.processing-overlay');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                await this.processRegistration(form, processingOverlay);
            }
        });

        // Real-time validation
        form?.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateForm(form) {
        const fields = form.querySelectorAll('[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ff4444';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '0.5rem';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
            
            field.style.borderBottomColor = '#ff4444';
        } else {
            field.style.borderBottomColor = 'var(--primary-cyan)';
        }

        return isValid;
    }

    async processRegistration(form, overlay) {
        // Show processing animation
        overlay.style.display = 'flex';
        this.playSound('form');

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Hide processing animation
        overlay.style.display = 'none';

        // Show success message
        this.showSuccessMessage();

        // Redirect to Google Form (replace with actual URL)
        setTimeout(() => {
            window.open('https://forms.google.com/your-form-url', '_blank');
        }, 2000);
    }

    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--card-bg);
                border: 2px solid var(--neon-green);
                border-radius: 15px;
                padding: 2rem;
                text-align: center;
                z-index: 3000;
                box-shadow: 0 0 30px rgba(0, 255, 128, 0.5);
            ">
                <i class="fas fa-check-circle" style="
                    font-size: 3rem;
                    color: var(--neon-green);
                    margin-bottom: 1rem;
                "></i>
                <h3 style="color: var(--neon-green); margin-bottom: 1rem;">Registration Successful!</h3>
                <p style="color: var(--text-secondary);">Redirecting to confirmation form...</p>
            </div>
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Animations
    initializeAnimations() {
        // Glitch effect for logo and titles
        setInterval(() => {
            const glitchElements = document.querySelectorAll('.glitch');
            glitchElements.forEach(element => {
                if (Math.random() < 0.1) {
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = 'glitch 0.3s ease-in-out infinite';
                    }, 50);
                }
            });
        }, 5000);

        // Floating panels animation
        this.animateFloatingPanels();
        
        // Neural network background animation
        this.animateNeuralNetwork();
    }

    animateFloatingPanels() {
        const panels = document.querySelectorAll('.floating-panel');
        panels.forEach((panel, index) => {
            const randomDelay = Math.random() * 2;
            panel.style.animationDelay = `${randomDelay}s`;
            
            panel.addEventListener('mouseenter', () => {
                panel.style.transform = 'translateY(-15px) scale(1.02)';
                panel.style.boxShadow = '0 15px 40px rgba(0, 255, 255, 0.4)';
            });
            
            panel.addEventListener('mouseleave', () => {
                panel.style.transform = '';
                panel.style.boxShadow = '';
            });
        });
    }

    animateNeuralNetwork() {
        const neuralNetwork = document.querySelector('.neural-network');
        if (!neuralNetwork) return;

        setInterval(() => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = ['var(--primary-cyan)', 'var(--neon-purple)', 'var(--neon-green)'][Math.floor(Math.random() * 3)];
            
            const pulse = document.createElement('div');
            pulse.style.position = 'absolute';
            pulse.style.left = `${x}%`;
            pulse.style.top = `${y}%`;
            pulse.style.width = '4px';
            pulse.style.height = '4px';
            pulse.style.background = color;
            pulse.style.borderRadius = '50%';
            pulse.style.boxShadow = `0 0 10px ${color}`;
            pulse.style.animation = 'pulse 2s ease-out forwards';
            
            neuralNetwork.appendChild(pulse);
            
            setTimeout(() => {
                pulse.remove();
            }, 2000);
        }, 3000);
    }

    // Scroll Animations
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Stagger animation for grid items
                    if (entry.target.classList.contains('dashboard') ||
                        entry.target.classList.contains('events-grid') ||
                        entry.target.classList.contains('speakers-grid') ||
                        entry.target.classList.contains('team-grid')) {
                        this.staggerGridAnimation(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe sections for animation
        document.querySelectorAll('section, .dashboard, .events-grid, .speakers-grid, .team-grid').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Timeline animation
        this.animateTimeline();
    }

    staggerGridAnimation(container) {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    
                    const marker = entry.target.querySelector('.timeline-marker');
                    if (marker) {
                        marker.style.boxShadow = '0 0 20px var(--primary-cyan)';
                        marker.style.transform = 'translateX(-50%) scale(1.2)';
                        
                        setTimeout(() => {
                            marker.style.transform = 'translateX(-50%) scale(1)';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.5 });

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            timelineObserver.observe(item);
        });
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance monitoring
    initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
                }, 0);
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new NeuronixApp();
    
    // Add loading screen fade out
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-essential animations when page is hidden
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animation) {
                el.style.animationPlayState = 'paused';
            }
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animation) {
                el.style.animationPlayState = 'running';
            }
        });
    }
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('Non-critical error:', e.message);
});

// Service Worker registration for offline capability
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Event Section Drop Down
  document.querySelectorAll('.event-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });


  document.getElementById('regForm')?.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent form's default behavior (i.e., page reload)

    // Optional: Play sound if your submit button has sound logic
    const sound = document.querySelector('audio[data-sound="form"]');
    sound?.play();

    // Optional: Show processing animation for a short time
    document.querySelector('.processing-overlay')?.classList.add('active');

    setTimeout(() => {
        window.location.href = 'event-register.html'; // redirect after 1 second
    }, 1000);
});


// Background music

// const audio = document.getElementById("bg-music");
//   audio.volume = 0.05;
//   document.addEventListener("click", () => {
//     if (audio.paused) {
//       audio.play().catch(() => {});
//     }
//   }, { once: true });