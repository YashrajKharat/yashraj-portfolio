// main.js - High-level interactivity, GSAP, and Custom Cursor

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && cursorFollower) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let followerX = mouseX;
        let followerY = mouseY;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        const followCursor = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(followCursor);
        };
        followCursor();
        
        const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .view-btn, .close-modal');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover-active'));
        });
    }

    // --- 2. Loader and Initialization ---
    const loader = document.getElementById('loader');
    
    // Typing Effect for Hero
    const typeWriter = () => {
        const textElement = document.getElementById('typewriter-text');
        if (!textElement) return;
        
        // Dynamically injected strings provided by Yashraj
        const texts = ["Full Stack Developer", "App Developer", "UI/UX Designer"];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        
        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                textElement.innerText = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50;
            } else {
                textElement.innerText = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingDelay = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingDelay = 500; // Pause before typing new word
            }
            
            setTimeout(type, typingDelay);
        };
        type();
    };

    window.addEventListener('load', () => {
        setTimeout(() => {
            if(loader) loader.style.opacity = '0';
            setTimeout(() => {
                if(loader) loader.style.display = 'none';
                initGSAPAnimations();
                typeWriter();
            }, 500);
        }, 1000);
    });

    // --- 3. Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Integrated Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if(anchor.getAttribute('id') === 'modal-link') return;
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            lenis.scrollTo(this.getAttribute('href'), {
                offset: -100 // Adjust for sticky header
            });
        });
    });

    // --- 4. GSAP Animations Setup ---
    const initGSAPAnimations = () => {
        // Hero Entrance
        const heroTl = gsap.timeline();
        heroTl.to('.hero-image-content', { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
              .to('.hero-subtitle', { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
              .to('.hero-title', { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
              .to('.typewriter-container', { opacity: 1, duration: 0.8 }, "-=0.4")
              .to('.hero-buttons', { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
        
        // Section Title Reveals
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            gsap.fromTo(title, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // About Section
        gsap.fromTo(".about-image-wrapper", 
            { x: -50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: ".about-container", start: "top 80%" }
            }
        );
        gsap.fromTo(".about-text", 
            { x: 50, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: ".about-container", start: "top 80%" }
            }
        );

        // Skills Section Reveal
        gsap.fromTo(".skill-card", 
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: ".skills-grid", start: "top 85%" }
            }
        );

        // Projects Section Reveal
        gsap.fromTo(".project-card",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: ".projects-grid", start: "top 80%" }
            }
        );

        // Timeline Scroll 
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, i) => {
            gsap.fromTo(item, 
                { x: 50, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: item, start: "top 85%" }
                }
            );
        });

        // Contact Section
        gsap.fromTo(".contact-info", 
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".contact-container", start: "top 80%" } }
        );
        gsap.fromTo(".contact-form", 
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".contact-container", start: "top 80%" } }
        );
    };

    // --- 5. Mobile Nav Toggle & Sticky Nav ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(7,7,7,0.95)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) navLinks.style.display = 'none';
        });
    });

    // --- 6. Project Modals ---
    const modals = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').innerText;
            const tags = card.querySelector('.project-tags').innerHTML;
            
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-tags').innerHTML = tags;
            
            let desc = "";
            let link = "#";

            if(title.includes("Beauty Point")) {
                desc = "Beauty Point is an e-commerce website developed for selling beauty and cosmetic products online. It is built using React.js, Node.js, and Supabase, providing a smooth and responsive user experience.\n\nThe platform allows users to register, browse products, add items to the cart, and place orders. It also includes an admin panel for managing products and orders.\n\nOverall, the project demonstrates full-stack development skills, including user authentication, database management, and CRUD operations.";
                link = "https://beauty-point-hqp4.vercel.app/";
            } else if (title.includes("AJ Global Class")) {
                desc = "AJ Global is a website developed for an educational institute to showcase courses and services online. It is built using PHP, HTML, CSS, and JavaScript, with a dynamic database for managing content.\n\nThe platform allows users to explore courses, view testimonials, and get detailed information about the institute. It also includes an admin panel to manage courses and website content.\n\nOverall, the project demonstrates web development skills, including dynamic content handling, database integration, and responsive design.";
                link = "https://ajglobal.wuaze.com/";
            } else if(title.includes("Liberty Decor (Interior)")) {
                desc = "Interior Design Website is a platform developed to showcase interior design services and projects. It is built using modern web technologies to provide a clean and attractive user experience.\n\nThe platform allows users to view design portfolios, explore services, and contact the business. It highlights creativity through well-structured layouts and visuals.\n\nOverall, the project demonstrates frontend design skills, responsive UI development, and effective presentation of services.";
                link = "https://liberty-decor-website.vercel.app/";
            }
            else{
                desc="Agasti Enterprises is a modern, responsive business website developed using HTML, CSS, and JavaScript. The website features a clean and user-friendly interface, smooth animations, responsive layouts, service showcase sections, contact forms, and optimized navigation to provide an engaging user experience across desktop and mobile devices. It demonstrates strong front-end development skills with a focus on performance, usability, and professional design."
                link = "https://agasti.enterprises.logicalsolutions.co.in/";
            }
            
            document.getElementById('modal-desc').innerText = desc;
            document.getElementById('modal-link').href = link;
            
            modals.classList.add('active');
            lenis.stop();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modals.classList.remove('active');
            lenis.start();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modals) {
            modals.classList.remove('active');
            lenis.start();
        }
    });

    // Mock Contact Form
    const cForm = document.getElementById('contactForm');
    if (cForm) {
        cForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your message has been initiated. Thank you!');
            e.target.reset();
        });
    }
});
