(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = [...document.querySelectorAll('.nav-link')];

  // Scroll progress and sticky header treatment.
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile navigation.
  function closeMenu() {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('menu-open');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });
  navItems.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

  // Reveal elements when they enter the viewport.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Highlight the current navigation section.
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Current year in footer.
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Class enquiry buttons open WhatsApp with the selected class included.
  const whatsappNumber = '919894934389';
  document.querySelectorAll('.card-enquire').forEach(button => {
    button.addEventListener('click', () => {
      const className = button.dataset.class || 'mathematics tuition';
      const message = `Hello Veanthan Maths Academy, I would like to enquire about tuition for ${className}. Please share more details.`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  });

  // The form validates locally, then opens WhatsApp with the enquiry prefilled.
  const form = document.getElementById('enquiry-form');
  const error = document.getElementById('form-error');
  form.addEventListener('submit', event => {
    event.preventDefault();
    error.hidden = true;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const student = String(data.get('studentName') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (!student || !phone) {
      error.textContent = 'Please complete the required fields.';
      error.hidden = false;
      return;
    }
    const lines = [
      'Hello Veanthan Maths Academy, I would like to make a tuition enquiry.',
      `Student Name: ${student}`,
      `Parent/Guardian Name: ${String(data.get('parentName') || '').trim() || 'Not provided'}`,
      `Contact Number: ${phone}`,
      `Class: ${String(data.get('studentClass') || '')}`,
      `Board: ${String(data.get('board') || '')}`,
      `Message: ${String(data.get('message') || '').trim() || 'No additional message'}`
    ];
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
