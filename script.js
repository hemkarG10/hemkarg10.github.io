// Content-driven rendering and UX behaviors
document.addEventListener('DOMContentLoaded', function() {
    // Utility: build Font Awesome class
    function iconClass(name) {
        const brandIcons = new Set(['github', 'linkedin', 'x-twitter', 'facebook', 'instagram']);
        const prefix = brandIcons.has(name) ? 'fab' : 'fas';
        return `${prefix} fa-${name}`;
    }

    // Fetch content.json and render
    fetch('content.json')
        .then(r => r.json())
        .then(content => {
            renderFromContent(content);
            initBehaviors(content);
            // Initialize horizontal scroll after content is rendered
            setTimeout(() => {
                initHorizontalScroll();
            }, 200);
        })
        .catch(() => {
            // If content.json fails, still init behaviors with defaults
            initBehaviors();
            setTimeout(() => {
                initHorizontalScroll();
            }, 200);
        });

    function renderFromContent(data) {
        if (!data || !data.site || !data.sections) return;

        // Document title and nav logo
        document.title = data.site.title || document.title;
        const logoEl = document.querySelector('.nav-logo');
        if (logoEl && data.site.name) logoEl.textContent = data.site.name;

        // Nav menu
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && Array.isArray(data.sections.nav)) {
            navMenu.innerHTML = data.sections.nav.map(item => (
                `<li><a href="${item.href}">${item.label}</a></li>`
            )).join('');
        }

        // Hero
        if (data.site.name) {
            const t = document.querySelector('.hero-title');
            if (t) t.textContent = data.site.name;
        }
        if (data.site.role) {
            const st = document.querySelector('.hero-subtitle');
            if (st) st.textContent = data.site.role;
        }
        if (data.site.description) {
            const d = document.querySelector('.hero-description');
            if (d) d.textContent = data.site.description;
        }
        const heroButtons = document.querySelector('.hero-buttons');
        if (heroButtons) {
            const primary = data.site.ctaPrimary || 'Get in Touch';
            const secondary = data.site.ctaSecondary || 'View Experience';
            heroButtons.innerHTML = `
                <a href="#contact" class="btn btn-primary">${primary}</a>
                <a href="#experience" class="btn btn-secondary">${secondary}</a>
            `;
        }
        const heroContact = document.querySelector('.hero-contact');
        if (heroContact && data.site.contact) {
            const { email, phone, location } = data.site.contact;
            heroContact.innerHTML = `
                <p><i class="fas fa-envelope"></i> ${email || ''}</p>
                <p><i class="fas fa-phone"></i> ${phone || ''}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${location || ''}</p>
            `;
        }

        // Why Product
        const why = data.sections.whyProduct;
        if (why) {
            const title = document.querySelector('.why-product .section-title');
            const desc = document.querySelector('.why-product .section-description');
            if (title && why.title) title.textContent = why.title;
            if (desc && why.description) desc.textContent = why.description;
        }

        // Experience
        const exp = data.sections.experience;
        if (exp) {
            const title = document.querySelector('#experience .section-title');
            if (title && exp.title) title.textContent = exp.title;
            const grid = document.querySelector('.experience-grid');
            if (grid && Array.isArray(exp.items)) {
                grid.innerHTML = exp.items.map(item => `
                    <div class="experience-card">
                        <div class="experience-header">
                            <h3>${item.role}</h3>
                            <span class="company">${item.company}</span>
                            <span class="duration">${item.duration}</span>
                            <span class="location">${item.location}</span>
                        </div>
                        <ul class="achievement-list">
                            ${(item.achievements || []).map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
            }
        }

        // Projects
        const projects = data.sections.projects;
        if (projects) {
            const title = document.querySelector('#projects .section-title');
            if (title && projects.title) title.textContent = projects.title;
            const grid = document.querySelector('.projects-grid');
            if (grid && Array.isArray(projects.items)) {
                grid.innerHTML = projects.items.map(p => `
                    <div class="project-card">
                        <div class="project-content">
                            <h3>${p.name}</h3>
                            <ul class="project-achievements">
                                ${(p.achievements || []).map(a => `<li>${a}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Skills
        const skills = data.sections.skills;
        if (skills) {
            const title = document.querySelector('#skills .section-title');
            if (title && skills.title) title.textContent = skills.title;
            // Programming languages
            const progEl = document.querySelector('#skills .skill-category:nth-of-type(1) .skill-tags');
            if (progEl && Array.isArray(skills.programming)) {
                progEl.innerHTML = skills.programming.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
            // AI & ML
            const aiEl = document.querySelector('#skills .skill-category:nth-of-type(2) .skill-tags');
            if (aiEl && Array.isArray(skills.ai_ml)) {
                aiEl.innerHTML = skills.ai_ml.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
            // Backend & Systems matches backend_systems
            const backendEl = document.querySelector('#skills .skill-category:nth-of-type(3) .skill-tags');
            if (backendEl && Array.isArray(skills.backend_systems)) {
                backendEl.innerHTML = skills.backend_systems.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
            // Product & Strategy matches product_strategic
            const prodEl = document.querySelector('#skills .skill-category:nth-of-type(4) .skill-tags');
            if (prodEl && Array.isArray(skills.product_strategic)) {
                prodEl.innerHTML = skills.product_strategic.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
            // Tools matches tools
            const toolsEl = document.querySelector('#skills .skill-category:nth-of-type(5) .skill-tags');
            if (toolsEl && Array.isArray(skills.tools)) {
                toolsEl.innerHTML = skills.tools.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
        }

        // Education
        const edu = data.sections.education;
        if (edu) {
            const title = document.querySelector('#education .section-title');
            if (title && edu.title) title.textContent = edu.title;
            const grid = document.querySelector('.education-grid');
            if (grid && Array.isArray(edu.items)) {
                grid.innerHTML = edu.items.map(e => `
                    <div class="education-card">
                        <h3>${e.institution}</h3>
                        <p class="degree">${e.degree}</p>
                        <span class="graduation">${e.graduation}</span>
                    </div>
                `).join('');
            }
        }

        // Research
        const research = data.sections.research;
        if (research) {
            const title = document.querySelector('#research .section-title');
            if (title && research.title) title.textContent = research.title;
            const grid = document.querySelector('.research-grid');
            if (grid && Array.isArray(research.items)) {
                grid.innerHTML = research.items.map(r => `
                    <div class="research-card">
                        <div class="research-icon"><i class="${iconClass(r.icon || 'microscope')}"></i></div>
                        <h3>${r.name}</h3>
                        <p class="research-journal">${r.journal}</p>
                        <p class="research-description">${r.description}</p>
                        <div class="research-highlights">
                            ${(r.highlights || []).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
                        </div>
                    </div>
                `).join('');
            }
        }

        // Certifications
        const certs = data.sections.certifications;
        if (certs) {
            const title = document.querySelector('.certifications .section-title');
            if (title && certs.title) title.textContent = certs.title;
            const grid = document.querySelector('.certifications-grid');
            if (grid && Array.isArray(certs.items)) {
                grid.innerHTML = certs.items.map(c => `
                    <div class="certification-card">
                        <div class="certification-icon"><i class="${iconClass(c.icon || 'certificate')}"></i></div>
                        <h3>${c.name}</h3>
                        <p>${c.details}</p>
                    </div>
                `).join('');
            }
        }

        // Community
        const community = data.sections.community;
        if (community) {
            const title = document.querySelector('.community .section-title');
            if (title && community.title) title.textContent = community.title;
            const grid = document.querySelector('.community-grid');
            if (grid && Array.isArray(community.items)) {
                grid.innerHTML = community.items.map(c => `
                    <div class="community-card">
                        <div class="community-icon"><i class="${iconClass(c.icon || 'users')}"></i></div>
                        <h3>${c.name}</h3>
                        <p>${c.description}</p>
                    </div>
                `).join('');
            }
        }

        // Interests
        const interests = data.sections.interests;
        if (interests) {
            const title = document.querySelector('.interests .section-title');
            if (title && interests.title) title.textContent = interests.title;
            const grid = document.querySelector('.interests-grid');
            if (grid && Array.isArray(interests.items)) {
                grid.innerHTML = interests.items.map(i => `
                    <div class="interest-card">
                        <div class="interest-icon"><i class="${iconClass(i.icon || 'star')}"></i></div>
                        <h3>${i.name}</h3>
                        <p>${i.description}</p>
                    </div>
                `).join('');
            }
        }

        // Contact
        const contact = data.sections.contact;
        if (contact) {
            const title = document.querySelector('#contact .section-title');
            if (title && contact.title) title.textContent = contact.title;
            const desc = document.querySelector('#contact .section-description');
            if (desc && contact.description) desc.textContent = contact.description;

            const methodsWrap = document.querySelector('.contact-methods');
            if (methodsWrap && Array.isArray(contact.methods)) {
                methodsWrap.innerHTML = contact.methods.map(m => `
                    <div class="contact-method">
                        <h3><i class="${iconClass(m.icon || 'envelope')}"></i> ${m.type}</h3>
                        <p>${m.value}</p>
                        <a href="${m.href}" ${m.external ? 'target="_blank"' : ''} class="btn ${m.type === 'Email' ? 'btn-primary' : 'btn-secondary'} contact-btn">
                            ${m.type === 'Email' ? (contact.ctaEmail || 'Send Email') : m.type === 'Phone' ? (contact.ctaCall || 'Call Now') : (contact.ctaMap || 'View on Map')}
                        </a>
                    </div>
                `).join('');
            }

            const socialWrap = document.querySelector('.social-links');
            if (socialWrap && Array.isArray(contact.social)) {
                socialWrap.innerHTML = contact.social.map(s => `
                    <a href="${s.href}" target="_blank" class="social-link" title="${s.platform}">
                        <i class="${iconClass(s.icon)}"></i>
                    </a>
                `).join('');
            }
        }

        // Footer
        const footerText = document.querySelector('.footer .container p');
        if (footerText && data.sections.footer && data.sections.footer.copyright) {
            footerText.textContent = data.sections.footer.copyright;
        }
    }

    function initBehaviors(content) {
        // Mobile nav toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                const isActive = navMenu.classList.toggle('active');
                navToggle.setAttribute('aria-expanded', String(isActive));
            });
            // Close menu when a link is clicked
            navMenu.addEventListener('click', function(e) {
                const target = e.target;
                if (target && target.closest('a')) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Reset horizontal scroll containers in the target section
                    setTimeout(() => {
                        const grids = targetSection.querySelectorAll('.experience-grid, .projects-grid');
                        grids.forEach(grid => {
                            grid.scrollLeft = 0;
                        });
                    }, 500);
                }
            });
        });

        // Active nav on scroll
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-menu a');
        function updateActiveNav() {
            let current = '';
            const scrollPos = window.scrollY + 100;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        }
        window.addEventListener('scroll', updateActiveNav);

        // Title bar updates based on scroll
        const siteName = content?.site?.name || 'Hemkar Goswami';
        const siteFullTitle = content?.site?.title || 'Hemkar Goswami - Portfolio';
        function updateTitleBar() {
            const homeSection = document.querySelector('#home');
            if (!homeSection) return;
            const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
            const scrollPos = window.scrollY;
            if (scrollPos > homeBottom - 100) {
                document.title = siteName;
            } else {
                document.title = siteFullTitle;
            }
        }
        window.addEventListener('scroll', updateTitleBar);

        // Nav logo visibility and navbar scroll effect
        function updateNavLogo() {
            const homeSection = document.querySelector('#home');
            const navLogo = document.querySelector('.nav-logo');
            const navbar = document.querySelector('.navbar');
            if (!homeSection || !navLogo || !navbar) return;
            
            const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
            const scrollPos = window.scrollY;
            
            // Show/hide logo based on scroll position
            if (scrollPos > homeBottom - 200) {
                navLogo.classList.add('visible');
            } else {
                navLogo.classList.remove('visible');
            }
            
            // Add scrolled class to navbar for enhanced appearance
            if (scrollPos > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', updateNavLogo);
        // Initial check
        updateNavLogo();

        // Handle mailto links
        const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
        mailtoLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const email = this.getAttribute('href').replace('mailto:', '');
                try {
                    window.location.href = `mailto:${email}`;
                } catch (error) {
                    navigator.clipboard.writeText(email).then(() => {
                        alert(`Email copied to clipboard: ${email}`);
                    }).catch(() => {
                        prompt('Email address:', email);
                    });
                }
            });
        });

        // Handle phone links
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const phone = this.getAttribute('href').replace('tel:', '');
                try {
                    window.location.href = `tel:${phone}`;
                } catch (error) {
                    navigator.clipboard.writeText(phone).then(() => {
                        alert(`Phone number copied to clipboard: ${phone}`);
                    }).catch(() => {
                        prompt('Phone number:', phone);
                    });
                }
            });
        });

    }

    function initHorizontalScroll() {
        const experienceSection = document.querySelector('#experience');
        const projectsSection = document.querySelector('#projects');
        const experienceGrid = document.querySelector('.experience-grid');
        const projectsGrid = document.querySelector('.projects-grid');
        const scrollOverlay = document.querySelector('#scrollOverlay');
        const scrollOverlayBtn = document.querySelector('#scrollOverlayBtn');
        const carouselArrows = document.querySelector('#carouselArrows');
        const carouselLeftBtn = document.querySelector('#carouselLeftBtn');
        const carouselRightBtn = document.querySelector('#carouselRightBtn');

        let isExperienceLocked = false;
        let isProjectsLocked = false;
        let lockedSection = null;
        let currentGrid = null;

        // Function to check if horizontal scroll is at the end
        function isAtEndOfScroll(grid) {
            if (!grid) return true;
            const threshold = 5; // 5px threshold
            return grid.scrollLeft >= (grid.scrollWidth - grid.clientWidth - threshold);
        }

        // Function to check if horizontal scroll has started
        function hasStartedScrolling(grid) {
            if (!grid) return false;
            return grid.scrollLeft > 10; // Started if scrolled more than 10px
        }

        function getGridStep(grid) {
            if (!grid) return 0;
            const firstCard = grid.querySelector('.experience-card, .project-card');
            if (!firstCard) return 0;
            const style = window.getComputedStyle(grid);
            const gapRaw = style.gap || style.columnGap || '32px';
            const gap = Number.parseFloat(gapRaw) || 32;
            return firstCard.offsetWidth + gap;
        }

        function updateCarouselArrows(grid, section) {
            if (!carouselArrows || !carouselLeftBtn || !carouselRightBtn || !grid || !section) return;
            const isLocked = section.classList.contains('locked');
            const canScroll = grid.scrollWidth > grid.clientWidth + 1;

            if (isLocked && canScroll) {
                carouselArrows.classList.add('visible');
                carouselArrows.setAttribute('aria-hidden', 'false');

                const leftDisabled = grid.scrollLeft <= 1;
                const rightDisabled = grid.scrollLeft >= (grid.scrollWidth - grid.clientWidth - 1);
                carouselLeftBtn.disabled = leftDisabled;
                carouselRightBtn.disabled = rightDisabled;
            } else {
                carouselArrows.classList.remove('visible');
                carouselArrows.setAttribute('aria-hidden', 'true');
                carouselLeftBtn.disabled = true;
                carouselRightBtn.disabled = true;
            }
        }

        // Function to update overlay button visibility
        function updateOverlayButton(grid, section) {
            if (!scrollOverlay || !scrollOverlayBtn || !grid || !section) return;
            
            const canScroll = grid.scrollWidth > grid.clientWidth;
            
            // Show button if section is locked and can scroll horizontally
            const isLocked = section.classList.contains('locked');
            
            if (isLocked && canScroll) {
                scrollOverlay.classList.add('visible');
                // Always show down arrow - it's for skipping to next section
                scrollOverlayBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
                scrollOverlayBtn.setAttribute('aria-label', 'Skip to next section');
            } else if (!isLocked) {
                scrollOverlay.classList.remove('visible');
            }
        }

        // Function to get next section
        function getNextSection(currentSection) {
            const sections = document.querySelectorAll('section[id]');
            let foundCurrent = false;
            for (let i = 0; i < sections.length; i++) {
                if (foundCurrent && sections[i].id) {
                    return sections[i];
                }
                if (sections[i] === currentSection) {
                    foundCurrent = true;
                }
            }
            return null;
        }

        // Function to lock vertical scrolling for a section
        function lockSection(section, grid) {
            if (!section || !grid) return;
            
            const sectionId = section.id;
            currentGrid = grid;
            
            if (sectionId === 'experience') {
                isExperienceLocked = true;
            } else {
                isProjectsLocked = true;
            }
            
            lockedSection = section;
            section.classList.add('locked');
            // Lock main page vertical scrolling while in this section
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            
            // Convert all vertical scroll to horizontal when over the section
            const handleWheel = function(e) {
                const rect = section.getBoundingClientRect();
                const isInSection = e.clientY >= rect.top && e.clientY <= rect.bottom &&
                                   e.clientX >= rect.left && e.clientX <= rect.right;
                
                if (isInSection) {
                    // If user is scrolling inside a card's internal list, allow that Y-scroll.
                    // (Main page is locked, but these lists can scroll vertically.)
                    const internalScrollEl = e.target?.closest?.('.achievement-list, .project-achievements');
                    if (internalScrollEl) return;

                    const canScrollRight = grid.scrollLeft < (grid.scrollWidth - grid.clientWidth - 5);
                    
                    // Prevent vertical scrolling
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Calculate card width including gap for scrolling one card at a time
                    const firstCard = grid.querySelector('.experience-card, .project-card');
                    if (!firstCard) return;
                    
                    const cardWidth = firstCard.offsetWidth;
                    const gap = 32; // 2rem gap
                    const scrollDistance = cardWidth + gap;
                    
                    // Determine scroll direction and amount
                    let scrollAmount = 0;
                    if (e.deltaY > 0) {
                        // Scrolling down - move right (next card)
                        scrollAmount = scrollDistance;
                    } else if (e.deltaY < 0) {
                        // Scrolling up - move left (previous card)
                        scrollAmount = -scrollDistance;
                    }
                    
                    const canScrollLeft = grid.scrollLeft > 0;
                    
                    if ((canScrollLeft && scrollAmount < 0) || (canScrollRight && scrollAmount > 0) || scrollAmount !== 0) {
                        grid.scrollBy({
                            left: scrollAmount,
                            behavior: 'smooth'
                        });
                        
                        // Update overlay button after scroll
                        setTimeout(() => {
                            updateOverlayButton(grid, section);
                        }, 50);
                    }
                }
            };
            
            // Use capture phase to catch events early
            window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
            
            // Store handler for cleanup
            section._wheelHandler = handleWheel;
            
            // Listen to grid scroll events
            const handleGridScroll = function() {
                updateOverlayButton(grid, section);
                updateCarouselArrows(grid, section);
            };
            
            grid.addEventListener('scroll', handleGridScroll, { passive: true });
            grid._scrollHandler = handleGridScroll;
            
            // Initial check for overlay button
            setTimeout(() => {
                updateOverlayButton(grid, section);
                updateCarouselArrows(grid, section);
            }, 100);
        }

        // Function to unlock vertical scrolling
        function unlockSection() {
            if (lockedSection && lockedSection._wheelHandler) {
                window.removeEventListener('wheel', lockedSection._wheelHandler, { capture: true });
                lockedSection.classList.remove('locked');
            }

            // Restore main page scrolling
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            
            // Remove grid scroll handler
            if (currentGrid && currentGrid._scrollHandler) {
                currentGrid.removeEventListener('scroll', currentGrid._scrollHandler);
            }
            
            // Hide overlay button
            if (scrollOverlay) {
                scrollOverlay.classList.remove('visible');
            }

            // Hide carousel arrows
            if (carouselArrows) {
                carouselArrows.classList.remove('visible');
                carouselArrows.setAttribute('aria-hidden', 'true');
            }
            if (carouselLeftBtn) carouselLeftBtn.disabled = true;
            if (carouselRightBtn) carouselRightBtn.disabled = true;
            
            isExperienceLocked = false;
            isProjectsLocked = false;
            lockedSection = null;
            currentGrid = null;
        }

        // Check scroll position and lock/unlock sections
        function checkScrollPosition() {
            if (!experienceSection || !projectsSection) return;
            
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const expRect = experienceSection.getBoundingClientRect();
            const projRect = projectsSection.getBoundingClientRect();
            
            // Check if section is fully in view (top of section is at top of viewport)
            const expFullyInView = expRect.top <= 100 && expRect.top >= -50 && expRect.bottom > windowHeight * 0.3;
            const projFullyInView = projRect.top <= 100 && projRect.top >= -50 && projRect.bottom > windowHeight * 0.3;
            
            if (expFullyInView && !isExperienceLocked) {
                unlockSection();
                lockSection(experienceSection, experienceGrid);
            } else if (projFullyInView && !isProjectsLocked) {
                unlockSection();
                lockSection(projectsSection, projectsGrid);
            } else if (!expFullyInView && !projFullyInView && (isExperienceLocked || isProjectsLocked)) {
                unlockSection();
            }
        }

        // Listen for scroll events
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkScrollPosition, 50);
        }, { passive: true });

        // Initial check
        checkScrollPosition();

        // Also handle when user navigates via nav links
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const targetId = this.getAttribute('href');
                setTimeout(() => {
                    checkScrollPosition();
                }, 600);
            });
        });

        // Overlay button click handler - always jump to next section
        if (scrollOverlayBtn) {
            scrollOverlayBtn.addEventListener('click', function() {
                if (!lockedSection) return;
                
                // Always scroll to next section
                const nextSection = getNextSection(lockedSection);
                if (nextSection) {
                    // Unlock current section first
                    unlockSection();
                    
                    // Scroll to next section
                    nextSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }

        // Left/Right arrow click handlers for horizontal navigation
        if (carouselLeftBtn) {
            carouselLeftBtn.addEventListener('click', function() {
                if (!currentGrid || !lockedSection) return;
                const step = getGridStep(currentGrid);
                if (!step) return;
                currentGrid.scrollBy({ left: -step, behavior: 'smooth' });
                setTimeout(() => {
                    updateOverlayButton(currentGrid, lockedSection);
                    updateCarouselArrows(currentGrid, lockedSection);
                }, 80);
            });
        }

        if (carouselRightBtn) {
            carouselRightBtn.addEventListener('click', function() {
                if (!currentGrid || !lockedSection) return;
                const step = getGridStep(currentGrid);
                if (!step) return;
                currentGrid.scrollBy({ left: step, behavior: 'smooth' });
                setTimeout(() => {
                    updateOverlayButton(currentGrid, lockedSection);
                    updateCarouselArrows(currentGrid, lockedSection);
                }, 80);
            });
        }

        // Touch support for mobile horizontal scrolling
        if (experienceGrid) {
            let touchStartX = 0;
            experienceGrid.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            experienceGrid.addEventListener('touchmove', function(e) {
                const touchX = e.touches[0].clientX;
                const deltaX = touchStartX - touchX;
                experienceGrid.scrollLeft += deltaX;
                touchStartX = touchX;
                
                // Update overlay button
                setTimeout(() => {
                    updateOverlayButton(experienceGrid, experienceSection);
                }, 50);
            }, { passive: true });
        }

        if (projectsGrid) {
            let touchStartX = 0;
            projectsGrid.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            projectsGrid.addEventListener('touchmove', function(e) {
                const touchX = e.touches[0].clientX;
                const deltaX = touchStartX - touchX;
                projectsGrid.scrollLeft += deltaX;
                touchStartX = touchX;
                
                // Update overlay button
                setTimeout(() => {
                    updateOverlayButton(projectsGrid, projectsSection);
                }, 50);
            }, { passive: true });
        }
    }

});

