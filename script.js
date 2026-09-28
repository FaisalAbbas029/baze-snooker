(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const modal = document.getElementById('bookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const toast = document.getElementById('toast');
  const bookingDate = document.getElementById('bookingDate');
  let toastTimer;

  // Keep the reservation form focused on usable dates.
  const today = new Date();
  const todayISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  bookingDate.min = todayISO;
  bookingDate.value = todayISO;

  function setMenu(open) {
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('modal-open', open || modal.classList.contains('open'));
  }

  function openModal() {
    setMenu(false);
    bookingSuccess.hidden = true;
    bookingForm.hidden = false;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    window.setTimeout(() => bookingDate.focus(), 300);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
  }

  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.querySelectorAll('.book-trigger').forEach(button => button.addEventListener('click', openModal));
  document.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      if (mobileMenu.classList.contains('open')) setMenu(false);
    }
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    bookingForm.hidden = true;
    bookingSuccess.hidden = false;
    const name = document.getElementById('bookingName').value.trim();
    if (name) {
      bookingSuccess.querySelector('h3').textContent = `See you soon, ${name.split(' ')[0]}.`;
    }
  });

  document.querySelectorAll('.membership-select').forEach(button => {
    button.addEventListener('click', () => {
      openModal();
      const tableField = document.getElementById('bookingTable');
      tableField.value = 'First available';
      showToast(`${button.dataset.plan} interest noted — book a visit and we’ll show you around.`);
    });
  });

  document.getElementById('newsletterForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail');
    showToast(`Thanks — club news is headed to ${email.value}.`);
    event.currentTarget.reset();
  });

  // Gentle reveal animation for sections.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
