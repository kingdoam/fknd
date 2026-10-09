/**
 * FKND FOUNDATION LEARNING CENTRE
 * Main JavaScript Controller
 * - Header Scroll Effect
 * - Mobile Navigation Toggle
 * - Animated Counters (Intersection Observer)
 * - Academic Tabs Switcher
 * - Live Search Modal & Keyboard Shortcuts
 * - ASH-style Multi-step Admissions Application Wizard
 * - Campus Tour Booking Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll shadow (optimized with requestAnimationFrame to prevent scroll jitter/shaking)
  const siteHeader = document.querySelector('.site-header');
  let isScrollingTicking = false;
  window.addEventListener('scroll', () => {
    if (!isScrollingTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 15) {
          siteHeader?.classList.add('scrolled');
        } else {
          siteHeader?.classList.remove('scrolled');
        }
        isScrollingTicking = false;
      });
      isScrollingTicking = true;
    }
  }, { passive: true });

  // 2. Navigation Menu Dropdown Toggle (Desktop & Mobile)
  const menuToggles = document.querySelectorAll('#mobileNavToggle, #desktopNavMenuBtn, [data-toggle-menu]');
  const navDrawer = document.getElementById('siteDropdownMenu') || document.getElementById('mobileNavDrawer');
  const dropdownCloseBtn = document.getElementById('dropdownCloseBtn') || document.querySelector('.dropdown-close-btn');
  const dropdownBackdrop = document.getElementById('siteDropdownBackdrop') || document.querySelector('.site-dropdown-backdrop');

  if (navDrawer && menuToggles.length > 0) {
    const setDrawerState = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !navDrawer.classList.contains('active');
      navDrawer.classList.toggle('active', isOpen);
      navDrawer.setAttribute('aria-hidden', !isOpen);

      if (dropdownBackdrop) {
        dropdownBackdrop.classList.toggle('active', isOpen);
      }

      menuToggles.forEach(btn => {
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
      });

      // Prevent background body scroll when drawer is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerState();
      });
    });

    if (dropdownCloseBtn) {
      dropdownCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerState(false);
      });
    }

    if (dropdownBackdrop) {
      dropdownBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerState(false);
      });
    }

    // Close when clicking nav links or action buttons inside dropdown (except the close button)
    navDrawer.querySelectorAll('.nav-anchor, .dropdown-link-card, button:not(#dropdownCloseBtn):not(.dropdown-close-btn)').forEach(link => {
      link.addEventListener('click', () => {
        setDrawerState(false);
      });
    });

    // Close when clicking outside dropdown or pressing ESC
    document.addEventListener('click', (e) => {
      let clickedInsideToggle = false;
      menuToggles.forEach(btn => {
        if (btn.contains(e.target)) clickedInsideToggle = true;
      });

      if (navDrawer.classList.contains('active') && !navDrawer.contains(e.target) && !clickedInsideToggle) {
        setDrawerState(false);
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
        setDrawerState(false);
        menuToggles[0]?.focus();
      }
    });

    // Automatically mark the current page link as active in dropdown
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navDrawer.querySelectorAll('.dropdown-link-card').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const isMatch = href === currentPath || (href === 'index.html' && (currentPath === '' || currentPath === '/'));
        link.classList.toggle('active', isMatch);
      }
    });
  }

  // 3. Academic Tabs (Section 5)
  const tabButtons = document.querySelectorAll('.academic-tab-btn');
  const tabViews = document.querySelectorAll('.academic-tab-view');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });

  // 4. FKND At a Glance Animated Counters
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 1800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  };

  const observerOptions = {
    threshold: 0.3
  };

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counterElements.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, observerOptions);

  const glanceSection = document.getElementById('glanceSection');
  if (glanceSection) {
    countObserver.observe(glanceSection);
  }

  // 5. Global Modal Helpers
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const input = modal.querySelector('input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modals on backdrop click or close button
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-trigger')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }

    // Ctrl+K or Cmd+K to open search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal('searchModal');
    }
  });

  // Modal Triggers
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  // 6. Live Search System (Dallas ISD inspired quick discovery)
  const searchInput = document.getElementById('siteSearchInput');
  const searchResultsContainer = document.getElementById('searchResults');

  const siteSearchIndex = [
    { title: 'Admissions & How to Apply', url: '#admissions', cat: 'Admissions', desc: '5-step application process, eligibility requirements & checklist.' },
    { title: 'Early Years Foundation', url: '#academics', cat: 'Academics', desc: 'Play-based inquiry, literacy, and developmental nurturing for young minds.' },
    { title: 'Primary School Curriculum', url: '#academics', cat: 'Academics', desc: 'Rigorous foundational learning, STEM thinking, and cultural arts.' },
    { title: 'Junior High School', url: '#academics', cat: 'Academics', desc: 'Critical thinking, leadership development, laboratory sciences.' },
    { title: 'Senior High & College Prep', url: '#academics', cat: 'Academics', desc: 'Advanced pathways, vocational training, university guidance.' },
    { title: 'STEM & Innovation Lab', url: '#academics', cat: 'Academics', desc: 'Coding, robotics, experiential science, practical discovery.' },
    { title: 'Athletics & Sports Program', url: '#student-life', cat: 'Student Life', desc: 'Football, basketball, athletics, teamwork, and character building.' },
    { title: 'Community Outreach & Service', url: '#student-life', cat: 'Student Life', desc: 'Learners actively giving back and transforming local communities.' },
    { title: 'Hope for a Cut Down Tree Story', url: '#our-story', cat: 'About FKND', desc: 'The history and restorative mission behind the FKND emblem and tree.' },
    { title: 'Our Core Values (Bishop Dunne Model)', url: '#values', cat: 'Identity', desc: 'Hope, Knowledge, Service, Character, and Impact.' },
    { title: 'Tuition & Foundation Scholarships', url: '#admissions', cat: 'Admissions', desc: 'Needs-based grants, merit support, and foundation endowments.' },
    { title: 'Book a Campus Visit', url: '#', action: () => openModal('tourModal'), cat: 'Visit', desc: 'Schedule a guided tour of our facilities, classrooms, and grounds.' }
  ];

  if (searchInput && searchResultsContainer) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        searchResultsContainer.innerHTML = `
          <div class="search-result-row">
            <span class="search-result-title">Quick Tip</span>
            <span class="search-result-meta">Type keywords like "Admissions", "STEM", "Scholarship", or "Visit"...</span>
          </div>
        `;
        return;
      }

      const matches = siteSearchIndex.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.cat.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResultsContainer.innerHTML = `
          <div class="search-result-row" style="text-align: center; padding: 1.5rem;">
            <p style="color: var(--text-muted);">No matching results found for "<strong>${escapeHtml(query)}</strong>".</p>
            <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.35rem;">Try searching for "apply", "curriculum", "contact", or "scholarship".</p>
          </div>
        `;
      } else {
        searchResultsContainer.innerHTML = matches.map(m => `
          <a href="${m.url || '#'}" class="search-result-row search-item-link" data-has-action="${!!m.action}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
              <span class="search-result-title">${m.title}</span>
              <span class="news-category-badge" style="font-size: 0.65rem;">${m.cat}</span>
            </div>
            <span class="search-result-meta">${m.desc}</span>
          </a>
        `).join('');

        // Wire click for modal actions
        searchResultsContainer.querySelectorAll('.search-item-link').forEach((link, idx) => {
          link.addEventListener('click', (ev) => {
            closeModal('searchModal');
            if (matches[idx].action) {
              ev.preventDefault();
              matches[idx].action();
            }
          });
        });
      }
    });
  }

  // 7. Multi-Step Admissions Wizard Logic (ASH Inspired)
  let currentStep = 1;
  const totalSteps = 4;
  const wizardForm = document.getElementById('admissionsWizardForm');
  const wizardPrevBtn = document.getElementById('wizardPrevBtn');
  const wizardNextBtn = document.getElementById('wizardNextBtn');
  const wizardSubmitBtn = document.getElementById('wizardSubmitBtn');
  const wizardSteps = document.querySelectorAll('.wizard-step-pane');
  const wizardIndicators = document.querySelectorAll('.wizard-step-indicator');
  const wizardSuccessPane = document.getElementById('wizardSuccessPane');

  const updateWizardUI = () => {
    wizardSteps.forEach((pane, index) => {
      pane.style.display = (index + 1 === currentStep) ? 'block' : 'none';
    });

    wizardIndicators.forEach((ind, index) => {
      const stepNum = index + 1;
      ind.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        ind.classList.add('active');
      } else if (stepNum < currentStep) {
        ind.classList.add('completed');
      }
    });

    if (wizardPrevBtn) {
      wizardPrevBtn.style.visibility = (currentStep === 1) ? 'hidden' : 'visible';
    }

    if (currentStep === totalSteps) {
      if (wizardNextBtn) wizardNextBtn.style.display = 'none';
      if (wizardSubmitBtn) wizardSubmitBtn.style.display = 'inline-flex';
    } else {
      if (wizardNextBtn) wizardNextBtn.style.display = 'inline-flex';
      if (wizardSubmitBtn) wizardSubmitBtn.style.display = 'none';
    }
  };

  if (wizardNextBtn) {
    wizardNextBtn.addEventListener('click', () => {
      // Basic validation for current step
      const activePane = wizardSteps[currentStep - 1];
      const requiredInputs = activePane.querySelectorAll('[required]');
      let valid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--fknd-accent-dark)';
          input.focus();
        } else {
          input.style.borderColor = '';
        }
      });

      if (valid && currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
      }
    });
  }

  if (wizardPrevBtn) {
    wizardPrevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  }

  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Transition to success state
      if (wizardSteps[currentStep - 1]) {
        wizardSteps[currentStep - 1].style.display = 'none';
      }
      if (wizardPrevBtn) wizardPrevBtn.style.display = 'none';
      if (wizardSubmitBtn) wizardSubmitBtn.style.display = 'none';
      const progBar = document.querySelector('.wizard-progress-bar');
      if (progBar) progBar.style.display = 'none';

      if (wizardSuccessPane) {
        wizardSuccessPane.style.display = 'block';
      }
    });
  }

  // 8. Campus Tour Modal Form Submission
  const tourForm = document.getElementById('tourBookingForm');
  const tourSuccess = document.getElementById('tourSuccessPane');
  if (tourForm) {
    tourForm.addEventListener('submit', (e) => {
      e.preventDefault();
      tourForm.style.display = 'none';
      if (tourSuccess) tourSuccess.style.display = 'block';
    });
  }

  // 9. Gallery Category Filter & Lightbox
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxCloseBtn');

  if (galleryFilterBtns.length > 0) {
    galleryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterCategory = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterCategory === 'all' || cardCategory === filterCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  if (galleryCards.length > 0 && lightboxModal) {
    galleryCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgEl = card.querySelector('img');
        const titleEl = card.querySelector('.gallery-card-title');
        const descEl = card.querySelector('.gallery-card-desc');

        if (lightboxImg && imgEl) lightboxImg.src = imgEl.src;
        if (lightboxTitle && titleEl) lightboxTitle.textContent = titleEl.textContent;
        if (lightboxDesc && descEl) lightboxDesc.textContent = descEl.textContent;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 10. FAQ Accordions (Contact Page & Admissions)
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Optional: close other open items in the same group
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // 11. Contact Form Interactive Submit & Feedback
  const contactForm = document.getElementById('directContactForm');
  const contactSuccessAlert = document.getElementById('contactFormSuccessAlert');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `⏳ Sending Message...`;
      }

      setTimeout(() => {
        if (contactSuccessAlert) {
          contactSuccessAlert.style.display = 'flex';
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        // Scroll to success banner smoothly
        contactSuccessAlert?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    });
  }

  // 12. Dynamic Campus Office Status Badge (EAT / UTC+3)
  const officeStatusEl = document.getElementById('liveOfficeStatusBadge');
  if (officeStatusEl) {
    const updateOfficeStatus = () => {
      const now = new Date();
      // UTC time + 3 hours for East Africa Time
      const eatHour = (now.getUTCHours() + 3) % 24;
      const eatDay = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      let isOpen = false;
      let statusMessage = '';

      if (eatDay >= 1 && eatDay <= 5) {
        // Mon-Fri: 8:00 AM to 4:30 PM (16:30)
        if (eatHour >= 8 && eatHour < 17) {
          isOpen = true;
          statusMessage = '🟢 Main Offices Open Now (8:00 AM – 4:30 PM EAT)';
        } else {
          statusMessage = '🌙 Offices Closed for the Day (Opens at 8:00 AM EAT)';
        }
      } else if (eatDay === 6) {
        // Saturday: 9:00 AM to 1:00 PM
        if (eatHour >= 9 && eatHour < 13) {
          isOpen = true;
          statusMessage = '🟡 Saturday Admissions Clinic Open (9:00 AM – 1:00 PM EAT)';
        } else {
          statusMessage = '🌙 Closed (Weekend Operations Resume Monday 8:00 AM)';
        }
      } else {
        // Sunday
        statusMessage = '🌙 Closed on Sunday (Campus Security Active 24/7)';
      }

      officeStatusEl.innerHTML = `
        <span class="${isOpen ? 'status-dot-pulse' : 'status-pulse-dot'}" style="${!isOpen ? 'background: #94A3B8;' : ''}"></span>
        <span>${statusMessage}</span>
      `;
    };

    updateOfficeStatus();
  }

  // Helper escape
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});

