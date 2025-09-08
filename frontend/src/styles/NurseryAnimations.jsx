import React, { useEffect } from 'react';

const NurseryAnimations = () => {
  useEffect(() => {
    // Inject CSS animations into the document
    const style = document.createElement('style');
    style.textContent = `
      /* Keyframe Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes bounce {
        0%, 20%, 60%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        80% {
          transform: translateY(-10px);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }

      @keyframes glow {
        0% {
          box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
        }
        50% {
          box-shadow: 0 0 20px rgba(40, 167, 69, 0.8);
        }
        100% {
          box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
        }
      }

      @keyframes slideNotification {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes modalFadeIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes loadingSpin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes countUp {
        from {
          transform: scale(0.5);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes progressFill {
        from {
          width: 0%;
        }
        to {
          width: 100%;
        }
      }

      /* Main Container Animation */
      .nursery-container {
        animation: fadeInUp 0.6s ease-out;
      }

      /* Sidebar Animations */
      .nursery-sidebar {
        animation: slideInRight 0.7s ease-out;
      }

      .nursery-sidebar nav div {
        opacity: 0;
        animation: fadeInLeft 0.5s ease-out forwards;
      }

      .nursery-sidebar nav div:nth-child(1) { animation-delay: 0.1s; }
      .nursery-sidebar nav div:nth-child(2) { animation-delay: 0.2s; }
      .nursery-sidebar nav div:nth-child(3) { animation-delay: 0.3s; }
      .nursery-sidebar nav div:nth-child(4) { animation-delay: 0.4s; }

      .nursery-nav-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .nursery-nav-item:hover {
        transform: translateX(10px);
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      }

      .nursery-nav-item::before {
        content: '';
        position: absolute;
        left: -100%;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.6s;
      }

      .nursery-nav-item:hover::before {
        left: 100%;
      }

      /* Dashboard Metrics Cards */
      .nursery-metric-card {
        opacity: 0;
        animation: scaleIn 0.6s ease-out forwards;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .nursery-metric-card:nth-child(1) { animation-delay: 0.1s; }
      .nursery-metric-card:nth-child(2) { animation-delay: 0.2s; }
      .nursery-metric-card:nth-child(3) { animation-delay: 0.3s; }
      .nursery-metric-card:nth-child(4) { animation-delay: 0.4s; }
      .nursery-metric-card:nth-child(5) { animation-delay: 0.5s; }
      .nursery-metric-card:nth-child(6) { animation-delay: 0.6s; }

      .nursery-metric-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        z-index: 10;
      }

      .nursery-metric-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s;
      }

      .nursery-metric-card:hover::before {
        left: 100%;
      }

      .nursery-metric-number {
        animation: countUp 0.8s ease-out;
      }

      /* Button Animations */
      .nursery-btn {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
      }

      .nursery-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      .nursery-btn:active {
        transform: translateY(-1px);
        transition-duration: 0.1s;
      }

      .nursery-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.6s;
      }

      .nursery-btn:hover::before {
        left: 100%;
      }

      .nursery-btn-primary {
        background: linear-gradient(135deg, #28a745, #20c997);
        animation: glow 2s infinite;
      }

      .nursery-btn-success {
        background: linear-gradient(135deg, #28a745, #34ce57);
      }

      .nursery-btn-info {
        background: linear-gradient(135deg, #17a2b8, #20c997);
      }

      .nursery-btn-warning {
        background: linear-gradient(135deg, #ffc107, #fd7e14);
      }

      .nursery-btn-danger {
        background: linear-gradient(135deg, #dc3545, #c82333);
      }

      /* Table Animations */
      .nursery-table {
        opacity: 0;
        animation: fadeInUp 0.8s ease-out forwards;
        animation-delay: 0.3s;
      }

      .nursery-table tbody tr {
        opacity: 0;
        animation: slideDown 0.4s ease-out forwards;
        transition: all 0.3s ease;
      }

      .nursery-table tbody tr:nth-child(odd) { animation-delay: 0.1s; }
      .nursery-table tbody tr:nth-child(even) { animation-delay: 0.2s; }

      .nursery-table tbody tr:hover {
        transform: scale(1.01);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        background: linear-gradient(90deg, #f8f9fa, #e9ecef, #f8f9fa);
        z-index: 5;
      }

      /* Modal Animations */
      .nursery-modal-overlay {
        animation: fadeInUp 0.3s ease-out;
      }

      .nursery-modal {
        animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .nursery-modal-exit {
        animation: scaleIn 0.3s ease-out reverse;
      }

      /* Notification Animations */
      .nursery-notification {
        animation: slideNotification 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .nursery-notification::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        animation: progressFill 4s linear;
      }

      .nursery-notification.success {
        background: linear-gradient(135deg, #28a745, #20c997);
      }

      .nursery-notification.error {
        background: linear-gradient(135deg, #dc3545, #c82333);
      }

      .nursery-notification.warning {
        background: linear-gradient(135deg, #ffc107, #fd7e14);
      }

      /* Loading Animation */
      .nursery-loading {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #28a745;
        border-radius: 50%;
        animation: loadingSpin 1s linear infinite;
      }

      .nursery-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(248, 249, 250, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeInUp 0.3s ease-out;
      }

      /* Card Animations */
      .nursery-card {
        opacity: 0;
        animation: fadeInUp 0.6s ease-out forwards;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .nursery-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      }

      .nursery-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.6s;
      }

      .nursery-card:hover::before {
        left: 100%;
      }

      /* Stock Status Animations */
      .nursery-stock-critical {
        animation: shake 2s infinite;
      }

      .nursery-stock-low {
        animation: pulse 2s infinite;
      }

      /* Image Animations */
      .nursery-image {
        transition: all 0.3s ease;
        overflow: hidden;
      }

      .nursery-image:hover {
        transform: scale(1.1);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      }

      /* Progress Bar Animation */
      .nursery-progress {
        position: relative;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
      }

      .nursery-progress-bar {
        height: 8px;
        background: linear-gradient(90deg, #28a745, #20c997);
        border-radius: 10px;
        animation: progressFill 2s ease-out;
        position: relative;
      }

      .nursery-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
        animation: slideInRight 2s infinite;
      }

      /* Status Badge Animations */
      .nursery-badge {
        position: relative;
        overflow: hidden;
        animation: fadeInUp 0.5s ease-out;
      }

      .nursery-badge-pending {
        background: linear-gradient(135deg, #ffc107, #fd7e14);
        animation: pulse 2s infinite;
      }

      .nursery-badge-completed {
        background: linear-gradient(135deg, #28a745, #20c997);
      }

      .nursery-badge-processing {
        background: linear-gradient(135deg, #17a2b8, #20c997);
        animation: glow 2s infinite;
      }

      .nursery-badge-cancelled {
        background: linear-gradient(135deg, #dc3545, #c82333);
      }

      /* Hover Effects for Interactive Elements */
      .nursery-interactive {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .nursery-interactive:hover {
        transform: scale(1.02);
        filter: brightness(1.1);
      }

      /* Stagger Animation for Lists */
      .nursery-list-item {
        opacity: 0;
        animation: fadeInLeft 0.5s ease-out forwards;
      }

      .nursery-list-item:nth-child(1) { animation-delay: 0.1s; }
      .nursery-list-item:nth-child(2) { animation-delay: 0.2s; }
      .nursery-list-item:nth-child(3) { animation-delay: 0.3s; }
      .nursery-list-item:nth-child(4) { animation-delay: 0.4s; }
      .nursery-list-item:nth-child(5) { animation-delay: 0.5s; }

      /* Tab Animation */
      .nursery-tab-active {
        position: relative;
      }

      .nursery-tab-active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #28a745, #20c997);
        animation: progressFill 0.3s ease-out;
      }

      /* Form Input Animations */
      .nursery-input {
        transition: all 0.3s ease;
        border: 2px solid #e9ecef;
      }

      .nursery-input:focus {
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
        transform: scale(1.02);
      }

      /* Responsive Animations */
      @media (max-width: 768px) {
        .nursery-metric-card {
          animation-delay: 0s;
        }
        
        .nursery-table tbody tr {
          animation-delay: 0s;
        }
      }

      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        .nursery-card::before,
        .nursery-metric-card::before {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
        }
      }

      /* Accessibility - Respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);

    // Apply classes to existing elements
    const applyAnimationClasses = () => {
      // Apply to main container
      const mainContainer = document.querySelector('[style*="display: flex"][style*="minHeight: 100vh"]');
      if (mainContainer) {
        mainContainer.classList.add('nursery-container');
      }

      // Apply to sidebar
      const sidebar = document.querySelector('[style*="width: 280px"][style*="background: #343a40"]');
      if (sidebar) {
        sidebar.classList.add('nursery-sidebar');
        
        // Apply to nav items
        const navItems = sidebar.querySelectorAll('[style*="cursor: pointer"]');
        navItems.forEach(item => {
          item.classList.add('nursery-nav-item');
        });
      }

      // Apply to metric cards
      const metricCards = document.querySelectorAll('[style*="background: linear-gradient"][style*="padding: 20px"][style*="borderRadius: 12px"]');
      metricCards.forEach(card => {
        card.classList.add('nursery-metric-card', 'nursery-interactive');
        
        const numberElement = card.querySelector('[style*="fontSize: 28px"]');
        if (numberElement) {
          numberElement.classList.add('nursery-metric-number');
        }
      });

      // Apply to buttons
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.classList.add('nursery-btn');
        
        const style = button.getAttribute('style') || '';
        if (style.includes('#28a745')) {
          button.classList.add('nursery-btn-success');
        } else if (style.includes('#007bff')) {
          button.classList.add('nursery-btn-primary');
        } else if (style.includes('#17a2b8')) {
          button.classList.add('nursery-btn-info');
        } else if (style.includes('#ffc107')) {
          button.classList.add('nursery-btn-warning');
        } else if (style.includes('#dc3545')) {
          button.classList.add('nursery-btn-danger');
        }
      });

      // Apply to tables
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        table.classList.add('nursery-table');
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          row.classList.add('nursery-list-item');
        });
      });

      // Apply to cards
      const cards = document.querySelectorAll('[style*="background: #fff"][style*="border: 1px solid #ddd"]');
      cards.forEach(card => {
        card.classList.add('nursery-card');
      });

      // Apply to images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.classList.add('nursery-image');
      });

      // Apply to modals
      const modals = document.querySelectorAll('[style*="position: fixed"][style*="rgba(0,0,0,0.5)"]');
      modals.forEach(modal => {
        modal.classList.add('nursery-modal-overlay');
        
        const modalContent = modal.querySelector('[style*="backgroundColor: white"]');
        if (modalContent) {
          modalContent.classList.add('nursery-modal');
        }
      });

      // Apply to notifications
      const notifications = document.querySelectorAll('[style*="position: fixed"][style*="top: 20px"][style*="right: 20px"]');
      notifications.forEach(notification => {
        notification.classList.add('nursery-notification');
        
        const style = notification.getAttribute('style') || '';
        if (style.includes('#28a745')) {
          notification.classList.add('success');
        } else if (style.includes('#dc3545')) {
          notification.classList.add('error');
        } else if (style.includes('#ffc107')) {
          notification.classList.add('warning');
        }
      });

      // Apply to inputs
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.classList.add('nursery-input');
      });

      // Apply stock status classes
      const stockElements = document.querySelectorAll('[style*="color: #dc3545"]');
      stockElements.forEach(el => {
        if (el.textContent.includes('Critical') || el.textContent.includes('0 left')) {
          el.classList.add('nursery-stock-critical');
        }
      });

      const lowStockElements = document.querySelectorAll('[style*="color: #ffc107"]');
      lowStockElements.forEach(el => {
        if (el.textContent.includes('Low')) {
          el.classList.add('nursery-stock-low');
        }
      });
    };

    // Apply classes immediately and on DOM changes
    applyAnimationClasses();
    
    // Set up mutation observer to apply classes to new elements
    const observer = new MutationObserver(() => {
      setTimeout(applyAnimationClasses, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  // Loading component
  const LoadingOverlay = ({ isVisible }) => {
    if (!isVisible) return null;
    
    return (
      <div className="nursery-loading-overlay">
        <div style={{ textAlign: 'center' }}>
          <div className="nursery-loading"></div>
          <p style={{ marginTop: '20px', fontSize: '16px', color: '#6c757d' }}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  };

  // Enhanced notification component
  const EnhancedNotification = ({ notification }) => {
    if (!notification) return null;
    
    return (
      <div 
        className={`nursery-notification ${notification.type}`}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 20px',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 2000,
          minWidth: '300px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>
            {notification.type === 'success' ? '✅' : 
             notification.type === 'error' ? '❌' : '⚠️'}
          </span>
          {notification.message}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        /* Additional real-time styles can be added here */
        .nursery-fade-in {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .nursery-bounce-in {
          animation: bounce 1s ease-out;
        }
        
        .nursery-glow-success {
          animation: glow 2s infinite;
          box-shadow: 0 0 20px rgba(40, 167, 69, 0.6);
        }
      `}</style>
      
      {/* This component will automatically apply animations to your nursery dashboard */}
      <div style={{ display: 'none' }}>
        Animation styles injected successfully
      </div>
    </>
  );
};

export default NurseryAnimations;