// ============================================================
// SCRIBBLE GREEN — MAIN JAVASCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    // --- Mobile hamburger ---
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileNav = document.querySelector('.navbar__mobile');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const spans = hamburger.querySelectorAll('span');
            if (mobileNav.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
            }
        });
    }

    // --- Intersection Observer for fade-up animations ---
    const fadeEls = document.querySelectorAll('.fade-up');
    if (fadeEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeEls.forEach(el => observer.observe(el));
    }

    // --- Accordion ---
    document.querySelectorAll('.accordion__header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion__item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    // --- Tag filters ---
    document.querySelectorAll('.tag[data-filter]').forEach(tag => {
        tag.addEventListener('click', () => {
            const group = tag.closest('.tag-group');
            if (group) {
                group.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            }
            tag.classList.add('active');
            const filter = tag.dataset.filter;
            const cards = document.querySelectorAll('[data-category]');
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Form submission feedback ---
    document.querySelectorAll('form[data-feedback]').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('[type="submit"]');
            if (btn) {
                btn.textContent = 'Sent! ✓';
                btn.disabled = true;
                btn.style.background = '#2D6A4F';
                setTimeout(() => {
                    btn.textContent = 'Send Message';
                    btn.disabled = false;
                    btn.style.background = '';
                }, 4000);
            }
        });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (mobileNav) mobileNav.classList.remove('open');
            }
        });
    });

    // --- Stagger fade-up children ---
    document.querySelectorAll('.stagger-children').forEach(parent => {
        const children = parent.children;
        Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
            child.classList.add('fade-up');
        });
    });

    // --- Active nav link ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__nav a, .navbar__mobile a').forEach(link => {
        const linkPage = link.getAttribute('href')?.split('/').pop();
        if (linkPage === currentPage) {
            link.style.color = 'var(--green)';
        }
    });

});