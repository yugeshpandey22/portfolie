/**
 * YUGESH PANDEY PORTFOLIO - CYBER DARK & GLASSMORPHISM INTERACTIVITY
 * High-performance Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initCustomCursor();
    initNavbarScroll();
    initTypewriter();
    initProjectFilters();
    initProjectModal();
    initContactForm();
    initBackToTop();
    initMobileNav();
    initNumberCounters();
});

/* ===================================================================
   1. INTERACTIVE PARTICLE CONSTELLATION CANVAS
   =================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const maxDistance = 140;

    const mouse = {
        x: null,
        y: null,
        radius: 160
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2 + 1;
            // Palette: cyan, purple, blue
            const colors = ['rgba(0, 242, 254, ', 'rgba(138, 43, 226, ', 'rgba(79, 172, 254, '];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.25;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            // Mouse repulsion/attraction gentle physics
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + this.alpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const lineAlpha = (1 - dist / maxDistance) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
            for (let i = 0; i < particles.length; i++) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const lineAlpha = (1 - dist / mouse.radius) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ===================================================================
   2. CUSTOM CURSOR
   =================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    if (!cursor || !follower) return;

    let posX = -100, posY = -100;
    let mouseX = -100, mouseY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
            posX = mouseX;
            posY = mouseY;
        }
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    window.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
        isVisible = false;
    });

    window.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
        isVisible = true;
    });

    function renderFollower() {
        posX += (mouseX - posX) * 0.18;
        posY += (mouseY - posY) * 0.18;
        follower.style.left = `${posX}px`;
        follower.style.top = `${posY}px`;
        requestAnimationFrame(renderFollower);
    }
    renderFollower();

    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .timeline-card, .filter-btn, .channel-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
    });
}

/* ===================================================================
   3. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHT
   =================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ===================================================================
   4. DYNAMIC TYPEWRITER EFFECT
   =================================================================== */
function initTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element) return;

    const words = [
        "Full Stack Web Developer (MERN & PHP)",
        "Flutter Cross-Platform App Developer",
        "High-Performance Cloud Architect",
        "SEO & Fast Web Experience Specialist"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseTime = 1800;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            currentSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentSpeed = 400;
        }

        setTimeout(type, currentSpeed);
    }

    type();
}

/* ===================================================================
   5. PROJECT FILTERING
   =================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || (filterValue === 'live' && card.hasAttribute('data-live'))) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ===================================================================
   6. PROJECT DETAILS MODAL DATA & CONTROLLER
   =================================================================== */
const projectsData = {
    'amadika': {
        title: 'Amadika / Addika (amadika.in & adikka.com)',
        badge: '🟢 Live Client E-Commerce',
        category: 'Luxury Lifestyle & E-Commerce',
        image: 'assets/images/Amadika.jpeg',
        liveUrl: 'https://amadika.in',
        description: 'Amadika is a premier luxury handcrafted leather lifestyle e-commerce platform. Designed and developed from scratch to offer an opulent shopping experience for artisanal leather jewelry boxes, executive desk sets, trunks, and wine cabinets.',
        features: [
            'End-to-End responsive storefront with rich artisanal aesthetic',
            'Full cart management, multi-currency support & wishlist engine',
            'Razorpay payment gateway integration for seamless zero-drop transactions',
            'Advanced SEO schema implementation achieving high Google SERP visibility',
            'Interactive product image zoom, variations (leather texture, colors), and reviews'
        ],
        techStack: ['PHP 8.x', 'MySQL', 'JavaScript (ES6+)', 'Bootstrap 5', 'Razorpay API', 'Technical SEO', 'cPanel Hosting']
    },
    'addika-app': {
        title: 'Addika - Luxury Leather Mobile App (Flutter)',
        badge: '📱 Flutter Mobile App (Coming on Play Store)',
        category: 'Cross-Platform Mobile Application',
        image: 'assets/images/addika_flutter_app.jpg',
        liveUrl: 'https://adikka.com',
        description: 'The official mobile shopping application for Addika Luxury Leather, engineered with Flutter and Dart. Delivers a native 60fps luxury shopping experience for Android & iOS users with clean typography, fluid transitions, and instant checkout.',
        features: [
            'Sleek modern UI matching the artisanal luxury identity with curated collections',
            'Real-time catalog synchronization with backend RESTful APIs',
            'Interactive product galleries (Crocodile texture, vintage trunks, jewelry boxes)',
            'Secure authentication, user profiles, address book & order tracking',
            'Prepared and optimized for Google Play Store release'
        ],
        techStack: ['Flutter', 'Dart', 'REST APIs', 'State Management', 'Cached Network Image', 'Payment Gateway Integration']
    },
    'sbsmart': {
        title: 'SB Smart (sbsmart.in)',
        badge: '🟢 Live Client Portal',
        category: 'Industrial Automation & E-Commerce',
        image: 'assets/images/sbsmart.jpg',
        liveUrl: 'https://sbsmart.in',
        description: 'Primary e-commerce and catalog portal for SB Smart, catering to industrial automation components, smart sensors, electrical switchgear, and factory automation equipment across India.',
        features: [
            'Extensive industrial catalog with 500+ electrical & smart automation SKUs',
            'Bulk procurement inquiry forms and quotation generator',
            'Fast search filtering by voltage, brand, and industrial specifications',
            'Dynamic product detail pages with downloadable PDF datasheets'
        ],
        techStack: ['PHP', 'MySQL', 'JavaScript', 'HTML5/CSS3', 'SEO Optimization']
    },
    'dmhealthcares': {
        title: 'DmHealthcare - Home Healthcare & Nursing (dmhealthcares.com)',
        badge: '🟢 Live Medical Portal',
        category: 'Home Healthcare & Elder Care Services',
        image: 'assets/images/dmhealthcares_banner.jpg',
        liveUrl: 'https://dmhealthcares.com',
        description: 'DmHealthcare (DmHealthcares) provides 24/7 comprehensive home healthcare services, verified nursing staff, elder care, ICU setup at home, physiotherapy, and medical equipment rental in Faridabad, Noida, and Delhi NCR.',
        features: [
            'Online doctor appointment booking calendar with department filtering',
            'Diagnostic test directory with price calculators and home sample collection booking',
            'Emergency hotline integration, verified nurses and ICU setup at home',
            'Mobile-optimized responsive design with HIPAA-friendly contact handling'
        ],
        techStack: ['PHP', 'MySQL', 'AJAX Form Handling', 'JavaScript', 'Responsive UI', 'SEO']
    },
    'shreeshyam': {
        title: 'Shree Shyam Constructions (shrishyamconstructions.com)',
        badge: '🟢 Live Enterprise Site',
        category: 'Civil Infrastructure & Construction',
        image: 'assets/images/shrishyam_banner.png',
        liveUrl: 'https://shrishyamconstructions.com/',
        description: 'Corporate civil engineering and infrastructure enterprise web platform for Shree Shyam Constructions. Showcases luxury 4BHK residential villas, high-rise commercial developments, industrial warehouses, and architectural milestones.',
        features: [
            'Dynamic project portfolio categorized into Commercial, Residential, and Infrastructure',
            'Interactive project milestone timeline and company history',
            'Tender enquiry & architectural consultation request engine',
            'Optimized image lazy loading for high-resolution project photos'
        ],
        techStack: ['PHP', 'HTML5 / CSS3', 'JavaScript', 'Responsive Design', 'SEO']
    },
    'globalrise': {
        title: 'The Global Rise Foundation (theglobalrisefoundation.com)',
        badge: '🟢 Live NGO Platform',
        category: 'Humanitarian & Non-Profit Organization',
        image: 'assets/images/globalrise_banner.png',
        liveUrl: 'https://theglobalrisefoundation.com/',
        description: 'Official digital presence for The Global Rise Foundation, a non-profit NGO dedicated to empowering underprivileged children through education, healthcare drives, women empowerment, and disaster relief programs.',
        features: [
            'Real-time live impact counter displaying lives touched and funds raised',
            'Transparent cause showcases with individual campaign donation links',
            'Online volunteer enrollment portal with automated onboarding email',
            'Media press releases and community photo gallery'
        ],
        techStack: ['PHP', 'MySQL', 'Donation Integration', 'PHPMailer', 'CSS3 Glassmorphism']
    },
    'kanhajirealty': {
        title: 'Kanha Ji Realty (kanhajirealty.in)',
        badge: '🟢 Live Real Estate Portal',
        category: 'Real Estate & Luxury Property Platform',
        image: 'assets/images/kanhajirealty.jpg',
        liveUrl: 'https://kanhajirealty.in/',
        description: 'High-end real estate portal designed for Kanha Ji Realty. Features premier residential villas, luxury apartment listings, commercial plots, and investment advisories with interactive search filters.',
        features: [
            'Interactive property filter engine by location, budget slider, and bedroom count',
            'High-definition villa photo galleries and floor plan blueprints',
            'Instant WhatsApp booking inquiry & site-visit scheduling form',
            'Google Maps integration with nearby amenities markers'
        ],
        techStack: ['Full Stack PHP', 'MySQL', 'JavaScript', 'Leaflet / Maps API', 'CSS Grid']
    },
    'crazyfox': {
        title: 'CrazyFox India - Kitchen Appliances (crazyfoxindia.com)',
        badge: '🟢 Live Client Platform',
        category: 'Kitchen Appliances & E-Commerce Store',
        image: 'assets/images/crazyfox_banner.jpeg',
        liveUrl: 'https://crazyfoxindia.com/',
        description: 'Official e-commerce platform for CrazyFox India, delivering premium kitchen appliances, water purifiers, chimneys, built-in ovens, and modern kitchen lifestyle products.',
        features: [
            'Product catalog for Aquaguard water purifiers, chimneys, built-in ovens & pumps',
            'Integrated customer service booking & product quotation requests',
            'Modern responsive storefront with high-resolution appliance showcases',
            'Technical SEO architecture ensuring high search ranking for kitchen appliances'
        ],
        techStack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'E-Commerce', 'Technical SEO']
    },
    'ytechpanel': {
        title: 'YTech Panels (ytechpanel.com)',
        badge: '🟢 Live Manufacturer Portal',
        category: 'Electrical Control Panels & Automation',
        image: 'assets/images/ytechpanel_hero.png',
        liveUrl: 'https://ytechpanel.com/',
        description: 'Official corporate website for YTech Panels, premier manufacturer of industrial electrical control panels, LT/HT switchgear, PCC, MCC, and APFC panels, powering industrial facilities across India.',
        features: [
            'Complete engineering product catalog for LT/HT control panels, PCC, MCC & APFC systems',
            'Technical specification sheets and quotation inquiry engine',
            'Client sectors showcase (Infrastructure, Manufacturing, Commercial Real Estate)',
            'Engineered for high search visibility and B2B industrial procurement'
        ],
        techStack: ['PHP', 'HTML5 / CSS3', 'JavaScript', 'Responsive UI', 'B2B SEO Optimization']
    },
    'sbsyscon': {
        title: 'SB Syscon (sbsyscon.in)',
        badge: '🟢 Live Industrial Portal',
        category: 'Industrial Electrical & PLC Systems',
        image: 'assets/images/sbsyscon.png',
        liveUrl: 'https://www.sbsyscon.in/',
        description: 'Corporate digital hub for SB Syscon, highlighting industrial automation systems, electrical control panels (PCC, MCC, APFC), and automation turnkey engineering projects.',
        features: [
            'Comprehensive technical specification showcase for industrial control panels',
            'Client portfolio across manufacturing and energy sectors',
            'Interactive quote request with file upload for electrical single-line diagrams',
            'Fast page loads and full search engine indexation'
        ],
        techStack: ['PHP', 'JavaScript', 'HTML5', 'CSS3', 'SEO Schema']
    },
    'zerodha': {
        title: 'Zerodha Fintech Trading Clone',
        badge: '📊 Full-Stack MERN Project',
        category: 'Fintech & Real-Time Trading',
        image: 'assets/images/zerodha.png',
        liveUrl: '#',
        description: 'A full-stack replica of Zerodha Kite stock trading platform. Features candlestick chart analysis, live watchlist updates, order placement modals, and portfolio holding calculations.',
        features: [
            'Real-time market depth visualizer and interactive charts',
            'Buy/Sell order execution simulations (Market, Limit, SL)',
            'Holdings and positions P&L calculation engine'
        ],
        techStack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Chart.js']
    },
    'uber': {
        title: 'Uber Ride Booking Web App',
        badge: '🚗 Full-Stack MERN Project',
        category: 'Geolocation & On-Demand Booking',
        image: 'assets/images/uber.png',
        liveUrl: '#',
        description: 'On-demand ride booking web application inspired by Uber. Features pickup and drop-off location autocomplete, fare estimation, driver dispatch simulation, and live route mapping.',
        features: [
            'Interactive map integration with routing and distance calculation',
            'Fare estimation algorithm based on vehicle type (Uber Go, Premier, Moto)',
            'Responsive mobile-first user experience'
        ],
        techStack: ['React', 'Node.js', 'Express', 'Socket.io', 'Mapbox API']
    }
};

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const detailButtons = document.querySelectorAll('.btn-view-details');

    if (!modal) return;

    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const data = projectsData[projectId];
            if (!data) return;

            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalBadge').textContent = data.badge;
            document.getElementById('modalCategory').textContent = data.category;
            document.getElementById('modalImage').src = data.image;
            document.getElementById('modalImage').alt = data.title;
            document.getElementById('modalDescription').textContent = data.description;

            // Features
            const featureList = document.getElementById('modalFeatures');
            featureList.innerHTML = '';
            data.features.forEach(f => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${f}</span>`;
                featureList.appendChild(li);
            });

            // Tech Stack
            const techContainer = document.getElementById('modalTechStack');
            techContainer.innerHTML = '';
            data.techStack.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tech-chip';
                span.textContent = t;
                techContainer.appendChild(span);
            });

            // Live Button
            const liveBtn = document.getElementById('modalLiveBtn');
            if (data.liveUrl && data.liveUrl !== '#') {
                liveBtn.href = data.liveUrl;
                liveBtn.style.display = 'inline-flex';
                liveBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit Live Website';
            } else {
                liveBtn.style.display = 'none';
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ===================================================================
   7. AJAX CONTACT FORM TO SEND_MAIL.PHP
   =================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const responseBox = document.getElementById('formResponse');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
        responseBox.className = 'form-alert';
        responseBox.style.display = 'none';

        const formData = new FormData(form);

        try {
            const response = await fetch('send_mail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                responseBox.className = 'form-alert success';
                responseBox.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i> ${result.message}`;
                form.reset();
            } else {
                responseBox.className = 'form-alert error';
                responseBox.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i> ${result.message || 'Something went wrong. Please try WhatsApp directly.'}`;
            }
        } catch (error) {
            responseBox.className = 'form-alert error';
            responseBox.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i> Network error. Please reach out via WhatsApp (+91 85211 79540) or Email directly.';
        } finally {
            responseBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

/* ===================================================================
   8. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===================================================================
   9. MOBILE NAVIGATION DRAWER
   =================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = hamburger.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = hamburger.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        });
    });
}

/* ===================================================================
   10. ANIMATED NUMBER COUNTERS IN HERO
   =================================================================== */
function initNumberCounters() {
    const statStrip = document.querySelector('.hero-stats-strip');
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    let hasAnimated = false;

    // Smooth cubic ease-out easing
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function startCounting() {
        if (hasAnimated) return;
        hasAnimated = true;

        statNumbers.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target')) || 0;
            const suffix = counter.getAttribute('data-suffix') || '';
            // Tailored duration based on target size for satisfying visual feedback
            const duration = target > 50 ? 2200 : (target > 5 ? 1800 : 1400);
            let startTime = null;

            function animateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutCubic(progress);

                let currentVal = Math.floor(eased * target);
                if (currentVal > target) currentVal = target;

                counter.textContent = currentVal + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animateCount);
                } else {
                    counter.textContent = target + suffix;
                    counter.classList.add('counter-finished');
                    setTimeout(() => counter.classList.remove('counter-finished'), 500);
                }
            }

            requestAnimationFrame(animateCount);
        });
    }

    // Trigger when stats strip enters viewport or immediately with a small delay
    if ('IntersectionObserver' in window && statStrip) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(startCounting, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        observer.observe(statStrip);
    } else {
        setTimeout(startCounting, 300);
    }
}

