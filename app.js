
(function () {
  'use strict';

  const DEFAULT_PAGE = 'welcome';
  const pages = Array.from(document.querySelectorAll('.page')).map(p => p.id);

  function showPage(id) {
    const target = pages.includes(id) ? id : DEFAULT_PAGE;
    document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.id === target));
    document.querySelectorAll('a[data-page], .nav a').forEach(link => {
      const href = (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', href === target);
    });
    window.scrollTo(0, 0);
  }

  function currentPageFromHash() {
    return (window.location.hash || '#' + DEFAULT_PAGE).replace('#', '');
  }

  window.addEventListener('hashchange', () => showPage(currentPageFromHash()));
  document.addEventListener('click', (event) => {
    const routed = event.target.closest('[data-page][data-scroll-target]');
    if (routed) {
      event.preventDefault();
      const page = routed.dataset.page;
      const target = routed.dataset.scrollTarget;
      showPage(page);
      history.replaceState(null, '', '#' + page);
      setTimeout(() => {
        const anchor = document.getElementById(target);
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      return;
    }

    const toggle = event.target.closest('[data-toggle-apps]');
    if (toggle) {
      document.querySelectorAll('.appSelect').forEach(cb => cb.checked = toggle.checked);
      return;
    }

    const bulk = event.target.closest('[data-bulk]');
    if (bulk) {
      const count = Array.from(document.querySelectorAll('.appSelect')).filter(cb => cb.checked).length;
      alert(count ? `${bulk.dataset.bulk}: ${count} selected application(s).` : 'Select at least one pending application first.');
      return;
    }

    const parishStepLink = event.target.closest('[data-parish-step]');
    if (parishStepLink) {
      setParishStep(parishStepLink.dataset.parishStep);
      return;
    }

    const parishNext = event.target.closest('[data-parish-next]');
    if (parishNext) {
      setParishStep(parishNext.dataset.parishNext);
      return;
    }

    const stepLink = event.target.closest('[data-step]');
    if (stepLink) {
      setStep(stepLink.dataset.step);
      return;
    }

    const nextStep = event.target.closest('[data-next-step]');
    if (nextStep) {
      if (nextStep.dataset.nextStep === '2' && !validateRegistration()) return;
      setStep(nextStep.dataset.nextStep);
      return;
    }



    const attSelect = event.target.closest('[data-att-select]');
    if (attSelect) {
      const panel = document.getElementById('attendanceRegister');
      const prompt = document.getElementById('attendancePrompt');
      const title = document.getElementById('attendanceSelectedTitle');
      if (panel) panel.hidden = false;
      if (prompt) prompt.hidden = true;
      if (title) title.textContent = attSelect.dataset.attSelect + ' attendance register';
      document.querySelectorAll('[data-att-select]').forEach(btn => btn.classList.remove('primary'));
      attSelect.classList.add('primary');
      return;
    }

    const attended = event.target.closest('[data-attended]');
    if (attended) {
      alert('Thank you — your attendance has been recorded.');
    }
  });

  function setParishStep(step) {
    document.querySelectorAll('.parishWizardStep').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('parishStep' + step);
    if (panel) panel.classList.add('active');
    document.querySelectorAll('.parishTab').forEach(tab => tab.classList.toggle('active', tab.dataset.parishStep === step));
  }

  function setStep(step) {
    document.querySelectorAll('.stepPanel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('regStep' + step);
    if (panel) panel.classList.add('active');
    document.querySelectorAll('.regTab').forEach(tab => tab.classList.toggle('active', tab.dataset.step === step));
  }

  function setError(id, message, ok) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + 'Error');
    if (!field || !error) return;
    field.classList.toggle('invalid', !!message && !ok);
    error.textContent = message || '';
    error.classList.toggle('ok', !!ok);
  }

  function validateRegistration() {
    const email = (document.getElementById('regEmail') || {}).value || '';
    const email2 = (document.getElementById('regEmailConfirm') || {}).value || '';
    const password = (document.getElementById('regPassword') || {}).value || '';
    const password2 = (document.getElementById('regPasswordConfirm') || {}).value || '';
    let valid = true;

    if (email && email2 && email.trim().toLowerCase() !== email2.trim().toLowerCase()) {
      setError('regEmailConfirm', 'Email addresses do not match.', false);
      valid = false;
    } else if (email && email2) {
      setError('regEmailConfirm', 'Email addresses match.', true);
    }

    if (password && password2 && password !== password2) {
      setError('regPasswordConfirm', 'Passwords do not match.', false);
      valid = false;
    } else if (password && password2) {
      setError('regPasswordConfirm', 'Passwords match.', true);
    }

    return valid;
  }

  window.addEventListener('error', function (event) {
    const active = document.querySelector('.page.active');
    if (!active) {
      document.body.insertAdjacentHTML('afterbegin', '<div style="padding:24px;background:#fff3f3;border:1px solid #f0b4b4;color:#7a1d1d">Prototype error: ' + event.message + '</div>');
      showPage(DEFAULT_PAGE);
    }
  });

  showPage(currentPageFromHash());
})();
