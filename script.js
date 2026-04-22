// script.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio loaded successfully!');
  
  // Menu toggle functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      this.textContent = nav.classList.contains('active') ? '✕' : '☰';
      this.setAttribute('aria-expanded', nav.classList.contains('active'));
    });
  }

  // Close menu when clicking on a link
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', function() {
      if (nav) {
        nav.classList.remove('active');
        if (menuToggle) {
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-expanded', false);
        }
      }
    });
  });

  // Update year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Create floating elements
  createFloatingElements();

  // Scroll animations
  initScrollAnimations();

  // Add hover effects to buttons
  initButtonEffects();

  // Header scroll effect
  initHeaderScroll();

  // CV download functionality
  initCvDownload();

  // Smooth scrolling for anchor links
  initSmoothScrolling();

  // Add active class to current section in navigation
  initActiveNavLinks();

  // Form validation and WhatsApp integration
  initContactForm();
});

function createFloatingElements() {
  const floatingContainer = document.createElement('div');
  floatingContainer.className = 'floating-elements';
  
  for (let i = 0; i < 3; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    floatingContainer.appendChild(element);
  }
  
  document.body.appendChild(floatingContainer);
}

function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing after animation
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const elementsToAnimate = [
    '.education-card', 
    '.skill-category', 
    '.software-item', 
    '.contact-card', 
    '.section-title', 
    '.about-inner', 
    '.video-item', 
    '.profile-card', 
    '.contact-form',
    '.experience-card',
    '.stats'
  ];

  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  });
}

function initButtonEffects() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.style.setProperty('--x', x + 'px');
      this.style.setProperty('--y', y + 'px');
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class based on scroll position
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Optional: Hide header on scroll down, show on scroll up
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

function initCvDownload() {
  const downloadBtn = document.getElementById('downloadCV');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const url = this.href;

    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Muhammad-Basil-Khan-Rohela-CV.pdf';
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Optional: Show download confirmation
    showNotification('CV download started!', 'success');
  });
}

function initSmoothScrolling() {
  // Select all links with hashes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for fixed header
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;

  function updateActiveNavLink() {
    let scrollPosition = window.scrollY + 100; // Offset for better UX
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  // Initial call
  updateActiveNavLink();
  
  // Update on scroll
  window.addEventListener('scroll', updateActiveNavLink);
}

function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
      showNotification('Please fill in all fields!', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address!', 'error');
      return;
    }
    
    // Send to WhatsApp
    sendToWhatsApp(name, email, message);
    
    // Reset form
    this.reset();
    
    // Show success message
    showNotification('Message sent successfully!', 'success');
  });
}

function sendToWhatsApp(name, email, message) {
  const phoneNumber = "923272390071"; // Muhammad Basil Khan's WhatsApp number
  
  const finalMessage = 
      "Hello Zardar !%0A%0A" +
      "I visited your portfolio and would like to connect with you.%0A%0A" +
      "*Name:* " + name + "%0A" +
      "*Email:* " + email + "%0A" +
      "*Message:* " + message + "%0A%0A" +
      "Looking forward to your response!";
  
  const url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(finalMessage);
  
  // Open WhatsApp in new tab
  window.open(url, "_blank", "noopener noreferrer");
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 8px;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Add CSS for active navigation links
const navStyles = document.createElement('style');
navStyles.textContent = `
  .nav a.active {
    color: var(--accent-color-light) !important;
  }
  .nav a.active::after {
    width: 100% !important;
  }
  .notification {
    font-family: 'Inter', sans-serif;
  }
`;
document.head.appendChild(navStyles);

// Performance optimization: Debounce scroll events
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add debounced scroll listener for better performance
window.addEventListener('scroll', debounce(initActiveNavLinks, 10));

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
  // Close menu with Escape key
  if (e.key === 'Escape') {
    const nav = document.querySelector('.nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && nav.classList.contains('active')) {
      nav.classList.remove('active');
      if (menuToggle) {
        menuToggle.textContent = '☰';
        menuToggle.setAttribute('aria-expanded', false);
      }
    }
  }
  
  // Navigate with arrow keys when menu is open
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const nav = document.querySelector('.nav');
    if (nav && nav.classList.contains('active')) {
      e.preventDefault();
      const links = Array.from(document.querySelectorAll('.nav a'));
      const currentIndex = links.indexOf(document.activeElement);
      let nextIndex;
      
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
      }
      
      links[nextIndex].focus();
    }
  }
});

// Initialize tooltips for social icons
function initTooltips() {
  const socialIcons = document.querySelectorAll('.profile-social-btn, .social-btn');
  
  socialIcons.forEach(icon => {
    const tooltip = document.createElement('span');
    const platform = icon.querySelector('i').className.includes('github') ? 'GitHub' : 'LinkedIn';
    tooltip.textContent = `Visit my ${platform}`;
    tooltip.className = 'tooltip';
    tooltip.style.cssText = `
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 100;
    `;
    
    icon.style.position = 'relative';
    icon.appendChild(tooltip);
    
    icon.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });
    
    icon.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

// Initialize tooltips when DOM is loaded
setTimeout(initTooltips, 1000);