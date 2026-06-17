
    // Preloader and Animations
    document.addEventListener('DOMContentLoaded', () => {
      // Hero Particle System
      const pCanvas = document.getElementById('hero-particle-canvas');
      const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
      let pParticles = [];
      let speedFactor = 1.0;
      let alphaFactor = 1.0;

      function resizeHeroCanvas() {
        if (!pCanvas || !pCtx) return;
        const dpr = window.devicePixelRatio || 1;
        pCanvas.width = pCanvas.clientWidth * dpr;
        pCanvas.height = pCanvas.clientHeight * dpr;
        pCtx.scale(dpr, dpr);
      }
      if (pCanvas && pCtx) {
        resizeHeroCanvas();
        window.addEventListener('resize', resizeHeroCanvas);

        class HeroParticle {
          constructor() {
            this.reset(true);
          }

          reset(isInitial = false) {
            this.x = Math.random() * pCanvas.clientWidth;
            this.y = isInitial ? Math.random() * pCanvas.clientHeight : pCanvas.clientHeight + 10;
            this.radius = Math.random() * 2 + 0.8;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.drift = Math.random() * 0.2 - 0.1;
          }

          update() {
            this.y -= this.speedY * speedFactor;
            this.x += this.drift * speedFactor;
            if (this.y < -10) {
              this.reset(false);
            }
          }

          draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(37, 99, 235, ${this.opacity * alphaFactor})`;
            pCtx.fill();
          }
        }

        for (let i = 0; i < 60; i++) {
          pParticles.push(new HeroParticle());
        }

        function updateHeroParticlesScroll(p) {
          speedFactor = Math.max(0.05, 1 - p * 0.9);
          alphaFactor = Math.max(0.15, 1 - p * 0.7);
        }

        function animateHeroParticles() {
          pCtx.clearRect(0, 0, pCanvas.clientWidth, pCanvas.clientHeight);
          pParticles.forEach(part => {
            part.update();
            part.draw();
          });
          requestAnimationFrame(animateHeroParticles);
        }
        animateHeroParticles();
      }
      // Kinetic Intro Animation Controller
      const kineticIntro = document.getElementById('kinetic-intro');
      const skipIntroBtn = document.getElementById('skip-intro');
      const kineticSlides = document.querySelectorAll('.kinetic-slide');
      const screenHeroText = document.getElementById('screen-hero-text');
      
      // Top-Left NAGI Logo Animation
      const navLogoText = document.getElementById('nav-logo-anim-text');
      const navLogoWords = [".research", ".discovery", ".clarity", ".direction"];
      let navLogoIndex = 0;
      
      if (navLogoText) {
        navLogoText.textContent = navLogoWords[0];
        setInterval(() => {
          navLogoText.style.opacity = '0';
          navLogoText.style.transform = 'translateY(4px)';
          setTimeout(() => {
            navLogoIndex = (navLogoIndex + 1) % navLogoWords.length;
            navLogoText.textContent = navLogoWords[navLogoIndex];
            navLogoText.style.opacity = '0.6';
            navLogoText.style.transform = 'translateY(0)';
          }, 300);
        }, 3000);
      }
      
      let currentSlideIndex = 0;
      let slideTimeout = null;
      let isIntroFinished = false;

      function skipKineticIntro() {
        if (isIntroFinished) return;
        isIntroFinished = true;
        
        if (slideTimeout) clearTimeout(slideTimeout);

        // Fade out overlay
        if (kineticIntro) {
          kineticIntro.style.opacity = '0';
          setTimeout(() => {
            kineticIntro.style.display = 'none';
          }, 800);
        }

        // Show normal screen-hero-text (ensure standard values)
        if (screenHeroText) {
          screenHeroText.style.opacity = '1';
          screenHeroText.style.display = 'flex';
          screenHeroText.style.transform = 'scale(1.0) translate3d(0, 0, 0)';
        }

        // Clean up listeners
        window.removeEventListener('scroll', handleScrollSkip);
      }

      function handleScrollSkip() {
        if (window.scrollY > 20) {
          skipKineticIntro();
        }
      }

      function playNextSlide() {
        if (isIntroFinished) return;

        if (currentSlideIndex >= kineticSlides.length) {
          skipKineticIntro();
          return;
        }

        const currentSlide = kineticSlides[currentSlideIndex];
        
        // Show current slide, hide others
        kineticSlides.forEach((slide, idx) => {
          slide.classList.toggle('active', idx === currentSlideIndex);
        });

        // Set light/dark theme class on overlay dynamically based on slide background color
        if (kineticIntro) {
          if (currentSlide.classList.contains('slide-2') || currentSlide.classList.contains('slide-4')) {
            kineticIntro.style.backgroundColor = '#f8fafc'; // white BG
            kineticIntro.classList.add('light-theme');
          } else {
            kineticIntro.style.backgroundColor = '#09090b'; // black BG
            kineticIntro.classList.remove('light-theme');
          }
        }

        const duration = parseInt(currentSlide.getAttribute('data-duration')) || 1500;

        // Standard slide
        slideTimeout = setTimeout(() => {
          currentSlideIndex++;
          playNextSlide();
        }, duration);
      }

      // Bind Skip Handlers
      if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', skipKineticIntro);
      }
      window.addEventListener('scroll', handleScrollSkip, { passive: true });

      // Start the sequence
      // Initially, hide screenHeroText so we don't flash it
      if (screenHeroText) {
        screenHeroText.style.opacity = '0';
        screenHeroText.style.display = 'none';
      }

      // Run
      playNextSlide();

      // Hero scroll cinematic animation - afternow.co alignment
      const scrollContainer = document.getElementById('hero-scroll-container');
      const stickyFrame = document.getElementById('hero-sticky-frame');
      const titleNode = document.getElementById('hero-title-node');
      const videoNode = document.getElementById('hero-video-node');
      const mainVideoEl = document.getElementById('hero-video-el');
      const navbar = document.querySelector('.navbar');

      // Video Cursor Elements
      const videoCursor = document.getElementById('video-cursor-el');
      


      let targetP = 0;
      let currentP = 0;
      const lerpFactor = 0.08; // Smooth physics lerping

      function updateScrollProgress() {
        if (!scrollContainer) return;
        const rect = scrollContainer.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        if (totalHeight <= 0) return;
        let p = -rect.top / totalHeight;
        targetP = Math.max(0, Math.min(1, p));
      }

      function animateHero(p) {
        if (!stickyFrame) return;

        // PHASE 1 & 2: Background Interpolation (Surface: #f0f6ff -> Abyss: #09090b)
        let r, g, b;
        if (p <= 0.15) {
          r = 240; g = 246; b = 255;
        } else if (p > 0.15 && p <= 0.75) {
          const t = (p - 0.15) / 0.6;
          r = Math.round(240 + t * (9 - 240));
          g = Math.round(246 + t * (9 - 246));
          b = Math.round(255 + t * (11 - 255));
        } else {
          r = 9; g = 9; b = 11;
        }
        scrollContainer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        stickyFrame.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        // Navbar theme toggle based on background depth of current viewport section
        const detectionY = 43; // Midpoint of navbar
        const sections = [
          { selector: '.home-hero', theme: 'dynamic-hero' },
          { selector: '.info-showcase', theme: 'light' },
          { selector: '.photo-scroll-section', theme: 'light' },
          { selector: '.quote-section', theme: 'dark' },
          { selector: '.gap-section', theme: 'dark' },
          { selector: '.works-section', theme: 'dark' },
          { selector: '.audience-section', theme: 'dark' },
          { selector: '.footer', theme: 'dark' }
        ];

        let activeTheme = 'light';
        for (const sec of sections) {
          const el = document.querySelector(sec.selector);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= detectionY && rect.bottom >= detectionY) {
              if (sec.theme === 'dynamic-hero') {
                activeTheme = (p > 0.45) ? 'dark' : 'light';
              } else {
                activeTheme = sec.theme;
              }
              break;
            }
          }
        }

        if (activeTheme === 'dark') {
          navbar.classList.add('navbar-dark');
        } else {
          navbar.classList.remove('navbar-dark');
        }

        // Title opacity animation (fades out as you scroll down)
        if (titleNode) {
          let titleOpacity = 1;
          if (p <= 0.4) {
            titleOpacity = 1 - (p / 0.4);
          } else {
            titleOpacity = 0;
          }
          titleNode.style.opacity = titleOpacity;
          titleNode.style.transform = `translateY(${-p * 50}px)`;
          titleNode.style.pointerEvents = titleOpacity < 0.1 ? 'none' : 'auto';
        }

        // Video scale & border-radius animations (zooms from 0.35 to 1.0, border-radius morphs from 16px to 0)
        if (videoNode) {
          let videoScale = 0.35;
          let borderRadiusVal = 16;
          
          if (p <= 0.8) {
            const t = p / 0.8;
            // cubic ease-out zoom curve
            const easedT = 1 - Math.pow(1 - t, 3);
            videoScale = 0.35 + easedT * 0.65;
            borderRadiusVal = 16 * (1 - easedT);
          } else {
            videoScale = 1.0;
            borderRadiusVal = 0;
          }
          
          videoNode.style.transform = `scale(${videoScale})`;
          videoNode.style.borderRadius = `${borderRadiusVal}px`;
        }

        if (typeof pCanvas !== 'undefined' && pCanvas) {
          updateHeroParticlesScroll(p);
        }
      }

      window.addEventListener('scroll', updateScrollProgress, { passive: true });
      window.addEventListener('resize', updateScrollProgress, { passive: true });
      
      // Run once initially
      updateScrollProgress();
      currentP = targetP;
      animateHero(currentP);

      // Lerped animation loop
      function tickHeroScroll() {
        currentP += (targetP - currentP) * lerpFactor;
        if (Math.abs(targetP - currentP) < 0.0001) {
          currentP = targetP;
        }
        animateHero(currentP);
        requestAnimationFrame(tickHeroScroll);
      }
      requestAnimationFrame(tickHeroScroll);

      // --- CUSTOM PLAY CURSOR FOR VIDEO ---
      if (videoNode && videoCursor) {
        // Track mouse movement inside the video node
        videoNode.addEventListener('mousemove', (e) => {
          videoCursor.style.left = `${e.clientX}px`;
          videoCursor.style.top = `${e.clientY}px`;
        });

        // Show/hide cursor state
        videoNode.addEventListener('mouseenter', () => {
          videoCursor.classList.add('active');
          videoNode.classList.add('has-custom-cursor');
          
          // Animate echo layers on hover
          const echoLayers = document.querySelectorAll('.echo__layer');
          echoLayers.forEach((layer, idx) => {
            layer.style.transform = `scale(${1.08 + idx * 0.04})`;
            layer.style.opacity = '0.3';
          });
        });

        videoNode.addEventListener('mouseleave', () => {
          videoCursor.classList.remove('active');
          videoNode.classList.remove('has-custom-cursor');
          
          // Reset echo layers on leave
          const echoLayers = document.querySelectorAll('.echo__layer');
          echoLayers.forEach((layer) => {
            layer.style.transform = 'scale(1)';
            layer.style.opacity = '0.15';
          });
        });
      }

      // --- REDIRECT ON CLICK INTERACTION ---
      if (videoNode) {
        videoNode.addEventListener('click', () => {
          window.open('https://www.youtube.com/watch?v=HhPZ7yx8ttg', '_blank');
        });
      }

      
      // Logo Marquee Horizontal Scroll
      const logoSection = document.querySelector('.logo-marquee-section');
      const logoTrack = document.querySelector('.logo-marquee-track');

      if (logoSection && logoTrack) {
        window.addEventListener('scroll', () => {
          const rect = logoSection.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Progress from 0 (top enters viewport bottom) to 1 (bottom leaves viewport top)
          // Since it's sticky, we care about when the wrapper sticks to when it un-sticks.
          // It sticks when rect.top == 0. It un-sticks when rect.bottom == windowHeight.
          const maxScroll = rect.height - windowHeight;
          let progress = -rect.top / maxScroll;
          
          // Clamp
          if (progress < 0) progress = 0;
          if (progress > 1) progress = 1;
          
          // Calculate track width
          const trackWidth = logoTrack.scrollWidth;
          // We want to translate from 0 to -(trackWidth - windowWidth)
          const maxTranslate = trackWidth - window.innerWidth;
          
          logoTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
        });
      }

      // Gap Section Scroll Animation
      const gapSection = document.querySelector('.gap-section');
      const gapLeft = document.querySelector('.gap-text-left');
      const gapRight = document.querySelector('.gap-text-right');
      const gapMediaContainer = document.querySelector('.gap-center-media');
      const gapDesc = document.querySelector('.gap-description');

      if (gapSection) {
        window.addEventListener('scroll', () => {
          const rect = gapSection.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          let progress = -rect.top / (rect.height - windowHeight);
          progress = Math.max(0, Math.min(1, progress));
          
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          
          const leftOffset = -100 * (1 - easeProgress);
          const rightOffset = 100 * (1 - easeProgress);
          const mediaScale = 0.4 + 0.6 * easeProgress;
          
          if (gapLeft) gapLeft.style.transform = `translateX(${leftOffset}vw)`;
          if (gapRight) gapRight.style.transform = `translateX(${rightOffset}vw)`;
          if (gapMediaContainer) gapMediaContainer.style.transform = `scale(${mediaScale})`;
          
          if (progress > 0.8 && gapDesc) {
            gapDesc.classList.add('visible');
          } else if (gapDesc) {
            gapDesc.classList.remove('visible');
          }
        });
      }

      // Intersection Observer for scroll animations
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Optional: stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.fade-in, .text-reveal').forEach(el => {
        observer.observe(el);
      });

      // Waitlist form handling
      const form = document.querySelector('.waitlist-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = form.querySelector('.waitlist-input');
          const btn = form.querySelector('.btn');
          
          if (input) {
            input.value = '';
            input.placeholder = '✓ You\'re on the list.';
            input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }
          if (btn) {
            btn.textContent = 'Joined';
            btn.style.backgroundColor = '#2D2D2D';
            btn.style.color = '#E6E4DF';
          }
        });
      }


    });




      // Quote Text Scrub Effect
      const quoteWrapper = document.querySelector('.quote-wrapper');
      const quoteText = document.querySelector('.quote-text');

      if (quoteWrapper && quoteText) {
        window.addEventListener('scroll', () => {
          const rect = quoteWrapper.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // We want the scrub to happen entirely while the wrapper is scrolling.
          // rect.top starts at windowHeight (bottom of screen) and goes to -windowHeight (scrolled past)
          const start = windowHeight * 0.5; // Start scrubbing when wrapper is halfway up the screen
          const end = -windowHeight * 0.5; // Finish scrubbing when wrapper is scrolled halfway out
          
          let progress = 1 - ((rect.top - end) / (start - end));
          if (progress < -0.2) progress = -0.2;
          if (progress > 1.2) progress = 1.2;
          
          quoteText.style.setProperty('--progress', (progress * 100) + '%');
          
          // Zoom out effect as gap section slides up over it
          let overlapProgress = 0;
          if (rect.top < -windowHeight) {
            overlapProgress = (-rect.top - windowHeight) / windowHeight;
            if (overlapProgress > 1) overlapProgress = 1;
          }
          
          const quoteSection = document.querySelector('.quote-section');
          if (quoteSection) {
            const scale = 1 - (0.05 * overlapProgress); // 1 to 0.95
            const opacity = 1 - (0.6 * overlapProgress); // 1 to 0.4
            quoteSection.style.transform = `scale(${scale})`;
            quoteSection.style.opacity = opacity;
          }
        });
      }

      // Screen Scroll Snap Animation (IntersectionObserver)
      const screenMockup = document.querySelector('.huge-screen-mockup');
      const laptopGlow = document.querySelector('.laptop-ambient-glow');
      const laptopStates = document.querySelectorAll('.laptop-screen-state');
      const mockTabTitle = document.getElementById('mock-tab-title');
      
      const typewriterSpan = document.getElementById('mock-typewriter-text');
      const mapCards = document.querySelectorAll('.paper-card-node[data-card]');
      const outlineRows = document.querySelectorAll('.outline-item-row');
      
      const typewriterTopics = [
        "federated learning for healthcare privacy...",
        "attention mechanisms in vision transformers...",
        "retrieval augmented generation in medical LLMs...",
        "zero shot transfer learning in robotic control...",
        "reinforcement learning from human feedback..."
      ];
      let currentTopicIndex = 0;
      let typewriterTimeout = null;
      let isTypewriterActive = false;
      
      // Document scan animation variables
      let scanIntervals = [];

      function getCardTranslateX(cardIndex) {
        const row = document.getElementById('scan-row');
        const cards = document.querySelectorAll('.scan-card');
        if (!row || !cards[cardIndex]) return 0;
        const rowRect = row.getBoundingClientRect();
        const cardRect = cards[cardIndex].getBoundingClientRect();
        const rowCenter = rowRect.left + rowRect.width / 2;
        const cardCenter = cardRect.left + cardRect.width / 2;
        return cardCenter - rowCenter;
      }

      function getStartTranslateX() {
        return getCardTranslateX(0) - 80;
      }

      function getEndTranslateX() {
        const cards = document.querySelectorAll('.scan-card');
        return getCardTranslateX(cards.length - 1) + 80;
      }

      function clearScanAnimation() {
        scanIntervals.forEach(t => clearTimeout(t));
        scanIntervals = [];
        
        const cards = document.querySelectorAll('.scan-card');
        cards.forEach(card => {
          card.classList.remove('active-scan', 'checked-scan');
        });
        
        const lens = document.getElementById('scan-lens');
        const shadow = document.getElementById('scan-lens-shadow');
        if (lens && shadow) {
          lens.style.transition = 'none';
          shadow.style.transition = 'none';
          lens.style.opacity = '0';
          shadow.style.opacity = '0';
          
          const startX = getStartTranslateX();
          lens.style.transform = `translateX(${startX}px)`;
          shadow.style.transform = `translateX(${startX}px)`;
        }
      }

      function runScanSweep() {
        clearScanAnimation();
        
        const row = document.getElementById('scan-row');
        const cards = document.querySelectorAll('.scan-card');
        const lens = document.getElementById('scan-lens');
        const shadow = document.getElementById('scan-lens-shadow');
        if (!row || cards.length === 0 || !lens || !shadow) return;
        
        // Ensure initial positioning is set before transitions begin
        const startX = getStartTranslateX();
        lens.style.transition = 'none';
        shadow.style.transition = 'none';
        lens.style.transform = `translateX(${startX}px)`;
        shadow.style.transform = `translateX(${startX}px)`;
        lens.style.opacity = '0';
        shadow.style.opacity = '0';
        
        // Force reflow so style changes are applied instantly without transition
        void lens.offsetWidth;
        
        // Set transition styles for smooth sweep movement
        lens.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease';
        shadow.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease';
        
        // Step 0: Fade in and move to Card 0
        scanIntervals.push(setTimeout(() => {
          lens.style.opacity = '1';
          shadow.style.opacity = '1';
          const targetX = getCardTranslateX(0);
          lens.style.transform = `translateX(${targetX}px)`;
          shadow.style.transform = `translateX(${targetX}px)`;
          cards[0].classList.add('active-scan');
        }, 100));
        
        // Steps for cards 1 to 5
        for (let i = 1; i < cards.length; i++) {
          scanIntervals.push(setTimeout(() => {
            cards[i].classList.add('active-scan');
            cards[i-1].classList.remove('active-scan');
            cards[i-1].classList.add('checked-scan');
            
            const targetX = getCardTranslateX(i);
            lens.style.transform = `translateX(${targetX}px)`;
            shadow.style.transform = `translateX(${targetX}px)`;
          }, 100 + i * 500));
        }
        
        // Final step: Move past card 5 and fade out
        scanIntervals.push(setTimeout(() => {
          cards[cards.length - 1].classList.remove('active-scan');
          cards[cards.length - 1].classList.add('checked-scan');
          
          const targetX = getEndTranslateX();
          lens.style.transform = `translateX(${targetX}px)`;
          shadow.style.transform = `translateX(${targetX}px)`;
          lens.style.opacity = '0';
          shadow.style.opacity = '0';
        }, 100 + cards.length * 500));
      }

      function runTypewriter() {
        if (!typewriterSpan) return;
        isTypewriterActive = true;
        
        let textIndex = 0;
        let isDeleting = false;
        let currentText = "";
        
        // Run first scan sweep in sync with typing start
        runScanSweep();

        function tick() {
          if (!isTypewriterActive) return;
          
          const fullText = typewriterTopics[currentTopicIndex];
          
          if (!isDeleting) {
            // Typing mode
            currentText = fullText.slice(0, textIndex + 1);
            typewriterSpan.textContent = currentText;
            textIndex++;
            
            if (textIndex >= fullText.length) {
              isDeleting = true;
              typewriterTimeout = setTimeout(tick, 2500); // Wait 2.5s before backspacing
            } else {
              typewriterTimeout = setTimeout(tick, 45); // Typing speed
            }
          } else {
            // Reverse typing mode (deleting)
            currentText = fullText.slice(0, textIndex - 1);
            typewriterSpan.textContent = currentText;
            textIndex--;
            
            if (textIndex <= 0) {
              isDeleting = false;
              currentTopicIndex = (currentTopicIndex + 1) % typewriterTopics.length;
              
              // Run scan sweep for the next topic
              runScanSweep();
              
              typewriterTimeout = setTimeout(tick, 600); // Wait 600ms before next topic
            } else {
              typewriterTimeout = setTimeout(tick, 20); // Backspacing speed
            }
          }
        }

        tick();
      }

      function stopTypewriter() {
        isTypewriterActive = false;
        if (typewriterTimeout) clearTimeout(typewriterTimeout);
        if (typewriterSpan) typewriterSpan.textContent = "";
        currentTopicIndex = 0;
        clearScanAnimation();
      }
 
      function animateCardsIn() {
        mapCards.forEach((card, index) => {
          card.classList.remove('visible');
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 80);
        });
      }
 
      function animateOutlineIn() {
        outlineRows.forEach((row, index) => {
          row.classList.remove('visible');
          setTimeout(() => {
            row.classList.add('visible');
          }, index * 200);
        });
      }
 
      let currentActiveState = null;
      
      function activateState(stateNum) {
        if (currentActiveState === stateNum) return;
        currentActiveState = stateNum;
 
        // Update tab title
        const titles = {
          1: "Nagi: Showcase",
          2: "Nagi: Research Map",
          3: "Nagi: Paper Detail",
          4: "Nagi: Field Connections",
          5: "Nagi: Outliner"
        };
        if (mockTabTitle) {
          mockTabTitle.textContent = titles[stateNum];
        }
 
        // Toggle active states
        laptopStates.forEach(state => {
          const num = parseInt(state.getAttribute('data-state'));
          if (num === stateNum) {
            state.classList.add('active');
          } else {
            state.classList.remove('active');
            if (num === 1) {
              state.classList.remove('play-morph');
              stopTypewriter();
            }
          }
        });
 
        // Transform Screen Mockup
        if (screenMockup) {
          if (stateNum === 1) {
            screenMockup.style.transform = "scale(0.98)";
          } else {
            screenMockup.style.transform = "scale(1.0)";
          }
        }
 
        // Ambient glow shifts
        if (laptopGlow) {
          const alpha = 0.12 + 0.03 * stateNum; // glow increases slightly as we go deep
          laptopGlow.style.background = `radial-gradient(circle, rgba(59, 130, 246, ${alpha}) 0%, rgba(0,0,0,0) 70%)`;
        }
 
        // Trigger specific animations
        if (stateNum === 1) {
          const searchView = document.querySelector('.search-view');
          if (searchView) {
            searchView.classList.remove('play-morph');
            void searchView.offsetWidth; // Trigger reflow
            searchView.classList.add('play-morph');
          }
          stopTypewriter();
          typewriterTimeout = setTimeout(() => {
            runTypewriter();
          }, 1600);
        } else if (stateNum === 2) {
          animateCardsIn();
        } else if (stateNum === 5) {
          animateOutlineIn();
        }
      }

      // Observe Scroll Trigger Segments
      const segments = document.querySelectorAll('.screen-scroll-segment');
      if (segments.length > 0) {
        const segmentObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const segmentNum = parseInt(entry.target.getAttribute('data-segment'));
              activateState(segmentNum);
            }
          });
        }, {
          root: null,
          threshold: 0.55 // trigger when 55% of the segment is in viewport
        });

        segments.forEach(seg => segmentObserver.observe(seg));
      }

      // Literature Review Card Deck Shuffler (inside State 2)
      const deck = document.getElementById('card-deck');
      const shuffleBtn = document.getElementById('shuffle-btn');
      
      if (deck && shuffleBtn) {
        let cards = Array.from(deck.querySelectorAll('.deck-card'));
        let isShuffling = false;

        const cardStates = [
          { transform: 'translate3d(0px, 0px, 0px) scale(1) rotate(0deg)', zIndex: '10', opacity: '1' },
          { transform: 'translate3d(8px, 8px, 0px) scale(0.97) rotate(1.5deg)', zIndex: '9', opacity: '0.95' },
          { transform: 'translate3d(16px, 16px, 0px) scale(0.94) rotate(-2deg)', zIndex: '8', opacity: '0.9' },
          { transform: 'translate3d(24px, 24px, 0px) scale(0.91) rotate(1deg)', zIndex: '7', opacity: '0.85' }
        ];

        function shuffle() {
          if (isShuffling || cards.length < 2) return;
          isShuffling = true;

          const topCard = cards[0];
          topCard.classList.add('shuffling');

          // After 300ms, move the top card to the bottom of the stack stylistically
          setTimeout(() => {
            // Cycle the array
            const shiftedCard = cards.shift();
            cards.push(shiftedCard);

            // Re-apply styles to all cards based on their new positions
            cards.forEach((card, index) => {
              const state = cardStates[index] || cardStates[cardStates.length - 1];
              card.style.transform = state.transform;
              card.style.zIndex = state.zIndex;
              card.style.opacity = state.opacity;
            });
          }, 300);

          // After 600ms, remove the shuffling class to let it slide back into the bottom position
          setTimeout(() => {
            topCard.classList.remove('shuffling');
            isShuffling = false;
          }, 600);
        }

        // Click on the shuffle button
        shuffleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          shuffle();
        });

        // Click on the top card
        cards.forEach(card => {
          card.addEventListener('click', (e) => {
            if (cards[0] === card) {
              e.stopPropagation();
              shuffle();
            }
          });
        });
      }

      if (typeof lucide !== 'undefined') {
        try {
          lucide.createIcons();
        } catch (e) {
          console.warn('Lucide icons creation failed:', e);
        }
      }

      // --- EARLY ACCESS MODAL HANDLER ---
      const eaModal = document.getElementById('early-access-modal');
      const eaCloseBtn = document.getElementById('ea-modal-close-btn');
      const eaForm = document.getElementById('ea-modal-form-el');
      const eaSuccess = document.getElementById('ea-modal-success-el');
      const eaSuccessCloseBtn = document.getElementById('ea-success-close-btn-el');
      const eaSuccessEmail = document.getElementById('ea-success-email');

      // Target nav links and download button
      const navLinksEls = document.querySelectorAll('.nav-links a');
      const downloadBtnEl = document.querySelector('.nav-download-btn');

      function openEAModal(e) {
        if (e) e.preventDefault();
        if (eaModal) {
          eaModal.classList.add('active');
          if (eaForm) eaForm.style.display = 'flex';
          if (eaSuccess) eaSuccess.style.display = 'none';
        }
      }

      function closeEAModal() {
        if (eaModal) {
          eaModal.classList.remove('active');
        }
      }

      if (downloadBtnEl) {
        downloadBtnEl.addEventListener('click', openEAModal);
      }


      if (eaCloseBtn) {
        eaCloseBtn.addEventListener('click', closeEAModal);
      }

      if (eaSuccessCloseBtn) {
        eaSuccessCloseBtn.addEventListener('click', closeEAModal);
      }

      // Close modal on clicking outside card
      if (eaModal) {
        eaModal.addEventListener('click', (e) => {
          if (e.target === eaModal) {
            closeEAModal();
          }
        });
      }

      if (eaForm) {
        eaForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const emailInput = document.getElementById('ea-email');
          if (emailInput && eaSuccessEmail) {
            eaSuccessEmail.textContent = emailInput.value;
          }
          eaForm.style.display = 'none';
          if (eaSuccess) {
            eaSuccess.style.display = 'flex';
          }
        });
      }

      // Advanced horizontal marquee with smooth, slow drift on hover (Web Animations API)
      const scrollTrack = document.querySelector('.photo-scroll-track');
      const marqueeContainer = document.querySelector('.photo-scroll-marquee');
      if (scrollTrack && marqueeContainer) {
        const cards = Array.from(scrollTrack.children);
        if (cards.length > 1) {
          const halfCount = Math.floor(cards.length / 2);
          
          // Add class to body to override CSS keyframe animations to prevent conflicts
          document.body.classList.add('js-marquee-active');
          
          // Calculate exact loop width dynamically based on layout, fall back to hardcoded math
          let translationDistance = cards[halfCount].offsetLeft - cards[0].offsetLeft;
          if (translationDistance <= 0) {
            translationDistance = halfCount * 312; // 300px width + 12px gap
          }
          
          // Create keyframes and options
          const keyframes = [
            { transform: 'translate3d(0, 0, 0)' },
            { transform: `translate3d(-${translationDistance}px, 0, 0)` }
          ];
          
          const speed = 142; // px per second
          const duration = (translationDistance / speed) * 1000;
          
          const anim = scrollTrack.animate(keyframes, {
            duration: duration,
            iterations: Infinity,
            easing: 'linear'
          });
          
          // Control playback rate on container hover for a reliable, jitter-free hover zone
          marqueeContainer.addEventListener('mouseenter', () => {
            anim.playbackRate = 0.12; // slow drift speed (12%)
          });
          
          marqueeContainer.addEventListener('mouseleave', () => {
            anim.playbackRate = 1.0; // normal speed
          });
        }
      }

      // --- MOTION BLUR SCROLL EFFECT ---
      const scrollWrapper = document.getElementById('scroll-wrapper');
      if (scrollWrapper) {
        let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
        let lastScrollTime = Date.now();
        let blurTimeout = null;

        window.addEventListener('scroll', () => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollTime = Date.now();

          const deltaY = Math.abs(scrollTop - lastScrollTop);
          const deltaT = Math.max(1, scrollTime - lastScrollTime);
          const speed = deltaY / deltaT; // pixels per millisecond

          // Calculate motion blur amount (max 2px blur for a subtle, premium effect)
          const blurAmount = Math.min(2, speed * 0.8);

          if (blurAmount > 0.5) {
            scrollWrapper.style.transition = 'filter 0.08s ease-out';
            scrollWrapper.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
          } else {
            scrollWrapper.style.filter = 'none';
          }

          lastScrollTop = scrollTop;
          lastScrollTime = scrollTime;

          // Clean up blur when scroll stops
          clearTimeout(blurTimeout);
          blurTimeout = setTimeout(() => {
            scrollWrapper.style.filter = 'none';
          }, 100);
        }, { passive: true });
      }

      // --- MOBILE NAVIGATION DRAWER TOGGLE ---
      const mobileToggle = document.getElementById('mobile-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileCtaBtn = document.getElementById('mobile-cta-btn');
      const mobileNavLinks = document.querySelectorAll('.nav-mobile-links a');

      if (mobileToggle && mobileMenu) {
        // Toggle mobile menu on click
        mobileToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          mobileToggle.classList.toggle('active');
          mobileMenu.classList.toggle('active');
          
          // Disable body scroll when menu is active
          if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = '';
          }
        });

        // Close mobile menu on link click
        mobileNavLinks.forEach(link => {
          link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
          });
        });

        // Mobile CTA clicks - open Early Access modal
        if (mobileCtaBtn) {
          mobileCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Close mobile drawer
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Open Early Access modal
            if (typeof openEAModal === 'function') {
              openEAModal(e);
            }
          });
        }
        
        // Close menu on resize to desktop width
        window.addEventListener('resize', () => {
          if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      }




