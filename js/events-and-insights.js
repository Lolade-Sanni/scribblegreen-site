/* ============================================================
   SCRIBBLE GREEN — EVENTS-INSIGHTS.JS
   Handles: newsletter popup, events carousel, tab switching.
   Include AFTER main.js and forms.js on events-insights.html
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Newsletter popup ────────────────────────────────────────
    // Shows once per session, after 2.5 seconds
    (function initNewsletterPopup() {
        const overlay = document.getElementById('newsletterPopupOverlay');
        const closeBtn = document.getElementById('popupClose');
        const skipBtn  = document.getElementById('popupSkip');
        if (!overlay) return;

        const STORAGE_KEY = 'sg_popup_dismissed';
        if (sessionStorage.getItem(STORAGE_KEY)) return; // Already seen this session

        const show = () => overlay.classList.add('is-open');
        const hide = () => {
            overlay.classList.remove('is-open');
            sessionStorage.setItem(STORAGE_KEY, '1');
        };

        setTimeout(show, 2500);

        closeBtn?.addEventListener('click', hide);
        skipBtn?.addEventListener('click',  hide);
        overlay.addEventListener('click', e => { if (e.target === overlay) hide(); });

        // After successful newsletter submit, also close popup
        const popupForm = overlay.querySelector('[data-form="newsletter"]');
        if (popupForm) {
            popupForm.addEventListener('submit', () => {
                setTimeout(hide, 2000);
            });
        }
    })();


    // ── Events carousel ────────────────────────────────────────
    (function initCarousel() {
        const outer    = document.getElementById('eventsCarousel');
        if (!outer) return;

        const track    = outer.querySelector('.carousel-track');
        const slides   = Array.from(outer.querySelectorAll('.carousel-slide'));
        const prevBtn  = outer.querySelector('.carousel-btn--prev');
        const nextBtn  = outer.querySelector('.carousel-btn--next');
        const dotsWrap = outer.querySelector('.carousel-dots');

        if (!track || !slides.length) return;

        let current   = 0;
        let perView   = getPerView();
        const total   = slides.length;

        function getPerView() {
            if (window.innerWidth <= 640)  return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function maxIndex() { return Math.max(0, total - perView); }

        // Build dots
        function buildDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = '';
            for (let i = 0; i <= maxIndex(); i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === current ? ' is-active' : '');
                dot.setAttribute('aria-label', `Slide group ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        }

        function updateDots() {
            dotsWrap?.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('is-active', i === current);
            });
        }

        function updateButtons() {
            if (prevBtn) prevBtn.disabled = current <= 0;
            if (nextBtn) nextBtn.disabled = current >= maxIndex();
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, maxIndex()));
            // Calculate offset based on slide width + gap (1.5rem = 24px)
            const slideW = slides[0].offsetWidth + 24;
            track.style.transform = `translateX(-${current * slideW}px)`;
            updateDots();
            updateButtons();
        }

        prevBtn?.addEventListener('click', () => goTo(current - 1));
        nextBtn?.addEventListener('click', () => goTo(current + 1));

        // Touch/swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend',   e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        });

        // Rebuild on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newPerView = getPerView();
                if (newPerView !== perView) {
                    perView  = newPerView;
                    current  = Math.min(current, maxIndex());
                    buildDots();
                    goTo(current);
                }
            }, 200);
        }, { passive: true });

        buildDots();
        goTo(0);
    })();


    // ── Tab switching (Past / Upcoming events) ─────────────────
    (function initEventTabs() {
        const tabs    = document.querySelectorAll('[data-events-tab]');
        const panels  = document.querySelectorAll('[data-events-panel]');
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t    => t.classList.remove('active'));
                panels.forEach(p  => p.hidden = true);
                tab.classList.add('active');
                const target = document.querySelector(`[data-events-panel="${tab.dataset.eventsTab}"]`);
                if (target) target.hidden = false;
            });
        });
    })();


    // ── Resources tab switching (on courses.html) ──────────────
    (function initResourcesTabs() {
        const tabs   = document.querySelectorAll('.resources-tab');
        const panels = document.querySelectorAll('[data-resources-panel]');
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t   => t.classList.remove('active'));
                panels.forEach(p => p.hidden = true);
                tab.classList.add('active');
                const target = document.querySelector(`[data-resources-panel="${tab.dataset.tab}"]`);
                if (target) target.hidden = false;
            });
        });
    })();

});