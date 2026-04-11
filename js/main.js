(function () {
  'use strict';

  var toggle = document.getElementById('menu-toggle');
  var panel = document.getElementById('mobile-panel');
  var backdrop = document.getElementById('mobile-backdrop');
  var links = document.querySelectorAll('.mobile-nav-link');

  function setOpen(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.classList.toggle('translate-x-full', !open);
    panel.classList.toggle('translate-x-0', open);
    if (backdrop) {
      backdrop.classList.toggle('pointer-events-none', !open);
      backdrop.classList.toggle('opacity-0', !open);
      backdrop.classList.toggle('opacity-100', open);
    }
    document.body.classList.toggle('overflow-hidden', open);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      setOpen(false);
    });
  });

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      setOpen(false);
    });
  }

  var form = document.getElementById('contact-form');
  var toast = document.getElementById('form-toast');
  var toastBox = document.getElementById('form-toast-box');
  var toastText = document.getElementById('form-toast-text');
  var toastTimer = null;

  function hideToast() {
    if (!toast) return;
    toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }

  function showToast(message, isError) {
    if (!toast || !toastBox || !toastText) return;
    clearTimeout(toastTimer);
    toastText.textContent = message;
    if (isError) {
      toastBox.className =
        'rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-center text-sm font-medium text-red-900 shadow-lg ring-1 ring-red-200/60';
    } else {
      toastBox.className =
        'rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-center text-sm font-medium text-slate-800 shadow-lg ring-1 ring-slate-200/60';
    }
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    toastTimer = setTimeout(hideToast, 5200);
  }

  if (form && toast) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('name');
      var emailEl = document.getElementById('email');
      var messageEl = document.getElementById('message');
      var name = nameEl ? nameEl.value.trim() : '';
      var email = emailEl ? emailEl.value.trim() : '';
      var message = messageEl ? messageEl.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please complete name, email, and message.', true);
        return;
      }

      showToast('Form submission failed. You can reach out using WhatsApp or email above.', true);
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
