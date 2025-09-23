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
        })
        .catch(() => {
            // If content.json fails, still init behaviors with defaults
            initBehaviors();
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
                            <div class="project-stats">
                                ${(p.stats || []).map(s => `
                                    <div class="stat">
                                        <span class="stat-number">${s.number}</span>
                                        <span class="stat-label">${s.label}</span>
                                    </div>
                                `).join('')}
                            </div>
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
            // Technical skills
            const techEl = document.querySelector('#skills .skill-category:nth-of-type(2) .skill-tags');
            if (techEl && Array.isArray(skills.technical)) {
                techEl.innerHTML = skills.technical.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
            // Technologies & tools
            const toolsEl = document.querySelector('#skills .skill-category:nth-of-type(3) .skill-tags');
            if (toolsEl && Array.isArray(skills.technologies)) {
                toolsEl.innerHTML = skills.technologies.map(s => `<span class="skill-tag">${s}</span>`).join('');
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
});

