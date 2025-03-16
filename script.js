document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });

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
            submitBtn.disabled = true;
            
            const formData = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                message: contactForm.querySelector('textarea').value
            };
            
            try {
                const response = await fetch('/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                
                if (response.ok) {
                    submitBtn.textContent = 'Sent!';
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 2000);
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                submitBtn.textContent = 'Error!';
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 2000);
                alert(error.message);
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

    // Audio Elements
    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const playPauseIcon = playPauseBtn.querySelector('i');

    // Initialize audio
    let hasStarted = false;
    audio.volume = 0.5;

    // Function to handle audio play
    const startAudio = async () => {
        try {
            await audio.play();
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } catch (err) {
            console.error('Audio play failed:', err);
        }
    };

    // Document click handler for first interaction
    document.addEventListener('click', () => {
        if (!hasStarted) {
            startAudio();
            hasStarted = true;
        }
    }, { once: true });

    // Play/Pause button handler
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.paused) {
            audio.play();
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        } else {
            audio.pause();
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Cursor Elements
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-dot-outline");
    let cursorX = 0;
    let cursorY = 0;

    // Cursor Movement
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        requestAnimationFrame(() => {
            const transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorDot.style.transform = transform;
            cursorOutline.style.transform = transform;
        });
    });

    // Tech Rain
    class TechDrop {
        constructor() {
            this.element = document.createElement('i');
            this.element.className = this.getRandomTechIcon();
            this.reset();
            document.querySelector('.tech-rain').appendChild(this.element);
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
            this.vx = 0;
            this.vy = this.speed;
            this.updatePosition();
        }

        updatePosition() {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }

        update() {
            if (!this.deflected) {
                this.y += this.vy;
                
                // Check collision with cursor
                const dx = this.x - cursorX;
                const dy = this.y - cursorY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 40) { // Collision radius
                    this.deflected = true;
                    const angle = Math.atan2(dy, dx) + (Math.random() * 0.5 - 0.25);
                    const deflectSpeed = 5;
                    this.vx = Math.cos(angle) * deflectSpeed;
                    this.vy = Math.sin(angle) * deflectSpeed;
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

            this.updatePosition();
        }
    }

    // Create tech drops
    const drops = Array.from({ length: 20 }, () => new TechDrop());

    // Animation loop
    function animate() {
        drops.forEach(drop => drop.update());
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Debug
    console.log('Cursor and rain initialized');

    let slideIndex = 1;
    showSlides(slideIndex);

    function changeSlide(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        const slides = document.getElementsByClassName("slides");
        const dots = document.getElementsByClassName("dot");
        
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        
        // Remove active class from all dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        
        // Show current slide and activate corresponding dot
        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
    }

    // Optional: Auto-advance slides
    setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
});
