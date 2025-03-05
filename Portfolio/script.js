document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });

    // Active nav item based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    function updateActiveNavItem() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === currentSection) {
                item.classList.add('active');
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            
            // Simulate form submission (replace with actual form handling)
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Message sent successfully!');
                contactForm.reset();
            } catch (error) {
                alert('Failed to send message. Please try again.');
            } finally {
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Scroll animations
    let scrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!scrolling) {
            window.requestAnimationFrame(() => {
                updateActiveNavItem();
                scrolling = false;
            });
            scrolling = true;
        }
    });

    // Initial check for active section
    updateActiveNavItem();

    // Animate tech stack items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Parallax effect for profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        window.addEventListener('scroll', () => {
            if (!scrolling) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    profileImage.style.transform = `translateY(${scrolled * 0.1}px)`;
                    scrolling = false;
                });
                scrolling = true;
            }
        });
    }

    // Typing animation for the description (if needed)
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing animation if element exists
    const descriptionElement = document.querySelector('.about-description');
    if (descriptionElement) {
        const text = descriptionElement.textContent;
        typeWriter(descriptionElement, text);
    }

    // Tech Rain Animation
    function setupTechRain() {
        const rainContainer = document.querySelector('.tech-rain');
        if (!rainContainer) return; // Safety check
        
        const icons = rainContainer.querySelectorAll('i');
        
        icons.forEach(icon => {
            // Random horizontal position
            const left = Math.random() * 100;
            // Random animation duration between 7 and 15 seconds
            const duration = 7 + Math.random() * 8;
            // Random delay
            const delay = Math.random() * 5;
            // Random size between 1rem and 2rem
            const size = 1 + Math.random();
            
            icon.style.left = `${left}%`;
            icon.style.animationDuration = `${duration}s`;
            icon.style.animationDelay = `${delay}s`;
            icon.style.fontSize = `${size}rem`;
            
            // Debug log
            console.log('Icon initialized:', {
                left,
                duration,
                delay,
                size
            });
        });
    }

    // Initialize tech rain
    setupTechRain();
    console.log('Tech rain initialization attempted'); // Debug log

    // Regenerate rain animation on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setupTechRain, 300);
    });

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-dot-outline");
    const techRainContainer = document.querySelector(".tech-rain");
    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const playPauseIcon = playPauseBtn.querySelector('i');

    // Initialize audio
    audio.volume = volumeSlider.value / 100;
    
    // Function to play audio
    const playAudio = async () => {
        try {
            // Create and resume AudioContext
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            
            // Play audio
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playPauseIcon.classList.remove('fa-play');
                    playPauseIcon.classList.add('fa-pause');
                    console.log('Audio started successfully');
                }).catch(error => {
                    console.log('Audio play failed:', error);
                });
            }
        } catch (error) {
            console.log('Play error:', error);
        }
    };

    // Add click event listener to the entire document
    let hasInteracted = false;
    document.addEventListener('click', async () => {
        if (!hasInteracted) {
            await playAudio();
            hasInteracted = true; // Prevent multiple initializations
        }
    });

    // Cursor Movement
    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        requestAnimationFrame(() => {
            const transform = `translate(${posX}px, ${posY}px)`;
            cursorDot.style.transform = transform;
            cursorOutline.style.transform = transform;
        });
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the document click handler
        if (audio.paused) {
            audio.play().then(() => {
                playPauseIcon.classList.remove('fa-play');
                playPauseIcon.classList.add('fa-pause');
            }).catch(err => console.log('Play failed:', err));
        } else {
            audio.pause();
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation(); // Prevent triggering the document click handler
        audio.volume = e.target.value / 100;
    });

    // Update play/pause button on audio end
    audio.addEventListener('ended', () => {
        if (!audio.loop) {  // Only update if not looping
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    });

    // Debug listeners
    audio.addEventListener('play', () => console.log('Audio play event'));
    audio.addEventListener('playing', () => console.log('Audio playing event'));
    audio.addEventListener('pause', () => console.log('Audio paused event'));
    audio.addEventListener('error', (e) => console.log('Audio error:', e));

    // Tech Rain
    class TechDrop {
        constructor() {
            this.element = document.createElement('i');
            this.element.className = this.getRandomTechIcon();
            this.reset();
            techRainContainer.appendChild(this.element);
        }

        getRandomTechIcon() {
            const icons = [
                'fab fa-html5', 'fab fa-css3-alt', 'fab fa-js', 'fab fa-react',
                'fab fa-node', 'fab fa-python', 'fab fa-git-alt', 'fab fa-github'
            ];
            return icons[Math.floor(Math.random() * icons.length)];
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = -30;
            this.speed = 1 + Math.random() * 2;
            this.deflected = false;
            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }

        update(cursorX, cursorY) {
            if (!this.deflected) {
                this.y += this.speed;
                
                // Check collision with cursor
                const dx = this.x - cursorX;
                const dy = this.y - cursorY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 50) {
                    this.deflected = true;
                    const angle = Math.atan2(dy, dx) + (Math.random() * 0.5 - 0.25);
                    this.vx = Math.cos(angle) * 5;
                    this.vy = Math.sin(angle) * 5;
                }
            } else {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.2; // gravity
            }

            // Reset if out of bounds
            if (this.y > window.innerHeight || this.x < 0 || this.x > window.innerWidth) {
                this.reset();
            }

            this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
    }

    // Create tech drops
    const drops = Array.from({ length: 30 }, () => new TechDrop());

    // Animation loop
    function animate() {
        const cursorX = parseFloat(cursorDot.style.transform.split('(')[1]) || 0;
        const cursorY = parseFloat(cursorDot.style.transform.split(',')[1]) || 0;
        
        drops.forEach(drop => drop.update(cursorX, cursorY));
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Debug
    console.log('Cursor and rain initialized');
});
