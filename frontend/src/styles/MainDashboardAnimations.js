// PlantCare Pro - Animation Controller
class PlantCareAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHeaderScroll();
    this.setupParticleEffects();
    this.setupInteractiveElements();
  }

  // Scroll-triggered animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger specific animations based on element
          if (entry.target.classList.contains('feature-card')) {
            this.animateFeatureCard(entry.target);
          }
          
          if (entry.target.classList.contains('stat-card')) {
            this.animateCounter(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .stat-card, .hero-section, .scroll-fade').forEach(el => {
      observer.observe(el);
    });
  }

  // Header scroll effect
  setupHeaderScroll() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (!header) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show header on scroll
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }

  // Animated counters
  animateCounter(element) {
    const valueElement = element.querySelector('.stat-value');
    if (!valueElement || valueElement.dataset.animated) return;

    valueElement.dataset.animated = 'true';
    const finalValue = valueElement.textContent;
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    const suffix = finalValue.replace(/[\d,]/g, '');
    
    let currentValue = 0;
    const increment = numericValue / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const counter = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        valueElement.textContent = finalValue;
        clearInterval(counter);
      } else {
        valueElement.textContent = Math.floor(currentValue).toLocaleString() + suffix;
      }
    }, stepTime);
  }

  // Feature card animations
  animateFeatureCard(card) {
    if (card.dataset.animated) return;
    card.dataset.animated = 'true';

    const icon = card.querySelector('.feature-icon');
    if (icon) {
      setTimeout(() => {
        icon.style.animation = 'bounce 0.6s ease';
      }, Math.random() * 200);
    }
  }

  // Particle effects for hero section
  setupParticleEffects() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(16, 185, 129, 0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: float 4s ease-in-out infinite;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 4}s;
      `;
      
      heroSection.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 4000);
    };

    // Create particles periodically
    setInterval(createParticle, 2000);
  }

  // Interactive element enhancements
  setupInteractiveElements() {
    // Button ripple effect
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', this.createRipple);
    });

    // Card hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          transform: scale(0);
          animation: ripple 0.6s linear;
          left: ${x}px;
          top: ${y}px;
          width: 20px;
          height: 20px;
          margin-left: -10px;
          margin-top: -10px;
          pointer-events: none;
        `;
        
        card.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Ripple effect for buttons
  createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: 20px;
      height: 20px;
      margin-left: -10px;
      margin-top: -10px;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // Performance optimization
  debounce(func, wait) {
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

  // Add loading animations
  static addLoadingStates() {
    document.querySelectorAll('.btn').forEach(btn => {
      const originalContent = btn.innerHTML;
      
      btn.addEventListener('click', function() {
        if (this.classList.contains('loading')) return;
        
        this.classList.add('loading');
        this.innerHTML = `
          <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        `;
        
        // Simulate loading (remove in production)
        setTimeout(() => {
          this.classList.remove('loading');
          this.innerHTML = originalContent;
        }, 2000);
      });
    });
  }
}

// CSS for additional animations (add to your CSS file)
const additionalCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add additional CSS
  const style = document.createElement('style');
  style.textContent = additionalCSS;
  document.head.appendChild(style);
  
  // Initialize animations
  new PlantCareAnimations();
  
  // Add loading states
  PlantCareAnimations.addLoadingStates();
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page loaded in ${pageLoadTime}ms`);
    });
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlantCareAnimations;
}