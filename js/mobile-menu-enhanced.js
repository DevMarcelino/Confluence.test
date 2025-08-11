/**
 * Enhanced Mobile Menu - CONFLUENCE-C
 * Modern slide-out navigation functionality
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        menuSelector: '.mobile-menu-enhanced',
        toggleSelector: '.mobile-menu-toggle',
        overlaySelector: '.mobile-menu-overlay',
        closeSelector: '.mobile-menu-close',
        bodyClass: 'mobile-menu-open',
        animationDuration: 400
    };

    // Elements
    const elements = {
        menu: null,
        toggle: null,
        overlay: null,
        close: null,
        body: document.body
    };

    // State
    let isOpen = false;

    /**
     * Initialize the mobile menu
     */
    function init() {
        createMenuElements();
        cacheElements();
        bindEvents();
        handleResize();
    }

    /**
     * Create necessary DOM elements
     */
    function createMenuElements() {
        // Create mobile menu toggle
        if (!document.querySelector(config.toggleSelector)) {
            const toggle = document.createElement('button');
            toggle.className = config.toggleSelector.replace('.', '');
            toggle.innerHTML = `
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            document.body.appendChild(toggle);
        }

        // Create mobile menu
        if (!document.querySelector(config.menuSelector)) {
            const menu = document.createElement('div');
            menu.className = config.menuSelector.replace('.', '');
            menu.innerHTML = `
                <div class="mobile-menu-header">
                    <img src="img/logo.png" alt="CONFLUENCE-C">
                    <button class="mobile-menu-close" aria-label="Fechar menu">
                        <span>&times;</span>
                    </button>
                </div>
                <nav class="mobile-menu-nav">
                    <ul>
                        <li><a href="#home" data-section="home">Início</a></li>
                        <li><a href="#about" data-section="about">Sobre</a></li>
                        <li><a href="#mentors" data-section="mentors">Mentoras</a></li>
                        <li><a href="#gallery" data-section="gallery">Galeria</a></li>
                        <li><a href="#tickets" data-section="tickets">Ingressos</a></li>
                        <li><a href="#contact" data-section="contact">Contato</a></li>
                    </ul>
                </nav>
                <div class="mobile-menu-cta">
                    <a href="#ticket-section" class="btn-cta">Garantir Ingresso</a>
                </div>
            `;
            document.body.appendChild(menu);
        }

        // Create overlay
        if (!document.querySelector(config.overlaySelector)) {
            const overlay = document.createElement('div');
            overlay.className = config.overlaySelector.replace('.', '');
            document.body.appendChild(overlay);
        }
    }

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.menu = document.querySelector(config.menuSelector);
        elements.toggle = document.querySelector(config.toggleSelector);
        elements.overlay = document.querySelector(config.overlaySelector);
        elements.close = document.querySelector(config.closeSelector);
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        // Toggle menu
        elements.toggle?.addEventListener('click', toggleMenu);

        // Close menu
        elements.close?.addEventListener('click', closeMenu);
        elements.overlay?.addEventListener('click', closeMenu);

        // Close on escape key
        document.addEventListener('keydown', handleKeydown);

        // Close on link click (for single page navigation)
        elements.menu?.addEventListener('click', handleMenuClick);

        // Handle window resize
        window.addEventListener('resize', handleResize);

        // Handle scroll for sticky behavior
        window.addEventListener('scroll', handleScroll);
    }

    /**
     * Toggle menu open/close
     */
    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Open the mobile menu
     */
    function openMenu() {
        if (isOpen) return;

        isOpen = true;
        
        // Add active classes
        elements.menu?.classList.add('active');
        elements.toggle?.classList.add('active');
        elements.overlay?.classList.add('active');
        elements.body.classList.add(config.bodyClass);

        // Prevent body scroll
        elements.body.style.overflow = 'hidden';

        // Focus management
        const firstFocusable = elements.menu?.querySelector('a, button');
        firstFocusable?.focus();

        // Announce to screen readers
        announceToScreenReader('Menu mobile aberto');
    }

    /**
     * Close the mobile menu
     */
    function closeMenu() {
        if (!isOpen) return;

        isOpen = false;

        // Remove active classes
        elements.menu?.classList.remove('active');
        elements.toggle?.classList.remove('active');
        elements.overlay?.classList.remove('active');
        elements.body.classList.remove(config.bodyClass);

        // Restore body scroll
        elements.body.style.overflow = '';

        // Return focus to toggle button
        elements.toggle?.focus();

        // Announce to screen readers
        announceToScreenReader('Menu mobile fechado');
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(event) {
        if (!isOpen) return;

        // Close on escape key
        if (event.key === 'Escape') {
            closeMenu();
        }

        // Trap focus within menu
        if (event.key === 'Tab') {
            trapFocus(event);
        }
    }

    /**
     * Handle menu item clicks
     */
    function handleMenuClick(event) {
        if (event.target.tagName === 'A') {
            // Close menu for single page navigation
            closeMenu();
            
            // Smooth scroll to section
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                event.preventDefault();
                smoothScrollTo(href);
            }
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close menu on desktop view
        if (window.innerWidth > 768 && isOpen) {
            closeMenu();
        }
    }

    /**
     * Handle scroll behavior
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const toggle = elements.toggle;
        
        if (toggle) {
            if (scrollTop > 100) {
                toggle.style.transform = 'scale(0.9)';
                toggle.style.opacity = '0.8';
            } else {
                toggle.style.transform = 'scale(1)';
                toggle.style.opacity = '1';
            }
        }
    }

    /**
     * Trap focus within menu for accessibility
     */
    function trapFocus(event) {
        const focusableElements = elements.menu?.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Smooth scroll to target section
     */
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Announce changes to screen readers
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Initialize when DOM is ready
     */
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Initialize the mobile menu
    ready(init);

    // Public API
    window.MobileMenuEnhanced = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu
    };

})();
