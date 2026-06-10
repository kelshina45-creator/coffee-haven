document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navMenu = document.querySelector('.nav-links');
    const navBurger = document.querySelector('.nav-burger');


    /* 1. NAVBAR EFFECT ON SCROLL */

    function changeNavbarOnScroll() {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    changeNavbarOnScroll();
    window.addEventListener('scroll', changeNavbarOnScroll);


    /* 2. MOBILE NAVIGATION */

    if (navBurger && navMenu) {
        navBurger.addEventListener('click', () => {
            navBurger.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navBurger.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }


    /* 3. SMOOTH SCROLL FOR ANCHOR LINKS */

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');

            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });


    /* 4. REVEAL ANIMATION ON SCROLL */

    const elementsForAnimation = document.querySelectorAll(`
        .hero-content,
        .section-header,
        .menu-layout,
        .about-container,
        .about-image,
        .about-content,
        .reserve-container,
        .reserve-content,
        .reserve-form,
        .contact-container,
        .menu-page-content,
        .menu-category,
        .menu-category-title,
        .full-menu-card,
        .menu-page-cta
    `);

    elementsForAnimation.forEach((element) => {
        element.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    setTimeout(() => {
        elementsForAnimation.forEach((element) => {
            revealObserver.observe(element);
        });
    }, 100);


    /* 5. ACTIVE NAVBAR LINK WHILE SCROLLING */

    function updateActiveNavLink() {
        let currentSectionId = '';

        const sections = document.querySelectorAll('section[id], footer[id]');

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 170;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            const linkHash = link.hash;

            if (!linkHash) return;

            link.classList.remove('active');

            if (linkHash === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);


    /* 6. RESERVATION FORM */

    const reserveForm = document.querySelector('.reserve-form');

    if (reserveForm) {
        const dateInput = reserveForm.querySelector('input[type="date"]');

        const formMessage = document.createElement('p');
        formMessage.className = 'form-message';
        reserveForm.appendChild(formMessage);

        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        reserveForm.addEventListener('submit', (event) => {
            event.preventDefault();

            formMessage.classList.remove('error');

            if (!reserveForm.checkValidity()) {
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.classList.add('error');
                return;
            }

            formMessage.textContent = 'Thank you! Your reservation request has been received.';

            reserveForm.reset();

            setTimeout(() => {
                formMessage.textContent = '';
            }, 4500);
        });
    }

    /* 7. MENU PAGE FILTER */

const filterButtons = document.querySelectorAll('.menu-filter button');
const menuCategories = document.querySelectorAll('.menu-category');
const menuStatusText = document.querySelector('.menu-status-text');
const menuStatusCount = document.querySelector('.menu-status-count');

if (filterButtons.length > 0 && menuCategories.length > 0) {
    const categoryNames = {
        all: 'All menu',
        coffee: 'Coffee',
        donuts: 'Donuts',
        croissants: 'Croissants'
    };

    function updateMenuStatus(selectedCategory) {
        let itemsCount = 0;

        menuCategories.forEach((category) => {
            const categoryName = category.dataset.category;
            const cards = category.querySelectorAll('.full-menu-card');

            if (selectedCategory === 'all' || selectedCategory === categoryName) {
                itemsCount += cards.length;
            }
        });

        if (menuStatusText) {
            menuStatusText.textContent = `Showing: ${categoryNames[selectedCategory]}`;
        }

        if (menuStatusCount) {
            const itemWord = itemsCount === 1 ? 'item' : 'items';
            menuStatusCount.textContent = `${itemsCount} ${itemWord} available`;
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.filter;

            filterButtons.forEach((btn) => {
                btn.classList.remove('active');
            });

            button.classList.add('active');

            menuCategories.forEach((category) => {
                const categoryName = category.dataset.category;

                const shouldShow =
                    selectedCategory === 'all' || selectedCategory === categoryName;

                if (shouldShow) {
                    category.classList.remove('hidden');

                    setTimeout(() => {
                        category.classList.remove('is-hiding');
                    }, 10);
                } else {
                    category.classList.add('is-hiding');

                    setTimeout(() => {
                        category.classList.add('hidden');
                    }, 350);
                }
            });

            updateMenuStatus(selectedCategory);
        });
    });

    updateMenuStatus('all');
}
});