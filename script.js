(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If GSAP failed to load or user prefers reduced motion, just show everything.
    if (typeof gsap === 'undefined' || prefersReduced) {
        document.querySelectorAll('.reveal').forEach(el => (el.style.opacity = 1));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ---- Hero + header: gentle fade-up intro ---- */
    gsap.set(['.hello', '.lede', '.scroll-hint'], { opacity: 0, y: 24 });
    gsap.set('.topveil', { opacity: 0 });
    gsap.set('.topbar', { opacity: 0, y: -10 });
    gsap.timeline({ delay: 0.5, defaults: { ease: 'power2.out' } })
        .to('.topveil', { opacity: 1, duration: 1.3 }, 0)
        .to('.topbar', { opacity: 1, y: 0, duration: 1.1 }, 0.2)
        .to('.hello', { opacity: 1, y: 0, duration: 1.9 }, 0.35)
        .to('.lede', { opacity: 1, y: 0, duration: 1.7 }, '-=1.25')
        .to('.scroll-hint', { opacity: 1, y: 0, duration: 1.4 }, '-=1.0');

    /* ---- Split each story line into words for staggered reveal ---- */
    document.querySelectorAll('.story .line').forEach(line => {
        // Wrap each top-level text word in a span, leaving inline elements intact.
        const wrapWords = node => {
            Array.from(node.childNodes).forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach(token => {
                        if (token.trim() === '') {
                            frag.appendChild(document.createTextNode(token));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'word';
                            span.textContent = token;
                            frag.appendChild(span);
                        }
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    // Treat inline elements (mark, em, a, span) as a single reveal unit.
                    child.classList.add('word');
                }
            });
        };
        wrapWords(line);

        const words = line.querySelectorAll('.word');
        gsap.set(words, { opacity: 0.12 });

        gsap.to(words, {
            opacity: 1,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: {
                trigger: line,
                start: 'top 80%',
                end: 'top 35%',
                scrub: true
            }
        });
    });

    /* ---- Contact section reveal ---- */
    gsap.to('.contact .reveal', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 70%' }
    });
    gsap.from('.contact .reveal', {
        y: 30,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact', start: 'top 70%' }
    });

    /* ---- Scroll progress bar ---- */
    gsap.to('.progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
})();
