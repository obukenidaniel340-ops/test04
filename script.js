/* ==========================================================================
   WOODNEST — Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const bookNowBtn = document.getElementById('bookNowBtn');
  const mobileBookNowBtn = document.getElementById('mobileBookNowBtn');
  const reserveBtn = document.getElementById('reserveBtn');
  const reserveModal = document.getElementById('reserveModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const toastContainer = document.getElementById('toastContainer');
  
  const checkInBox = document.getElementById('checkInBox');
  const checkOutBox = document.getElementById('checkOutBox');
  const guestsSelector = document.getElementById('guestsSelector');
  const datePickerModal = document.getElementById('datePickerModal');
  const closeDatePickerBtn = document.getElementById('closeDatePickerBtn');
  const applyDatesBtn = document.getElementById('applyDatesBtn');
  const inputCheckIn = document.getElementById('inputCheckIn');
  const inputCheckOut = document.getElementById('inputCheckOut');
  const selectGuests = document.getElementById('selectGuests');
  
  const checkInDisplay = document.getElementById('checkInDisplay');
  const checkOutDisplay = document.getElementById('checkOutDisplay');
  const guestsDisplay = document.getElementById('guestsDisplay');
  const summaryDates = document.getElementById('summaryDates');
  const summaryGuests = document.getElementById('summaryGuests');
  const summaryTotal = document.getElementById('summaryTotal');

  const ambienceToggle = document.getElementById('ambienceToggle');
  const glowToggleBtn = document.getElementById('glowToggleBtn');
  const changeBgBtn = document.getElementById('changeBgBtn');
  const heroBg = document.getElementById('heroBg');
  const heroWarmGlow = document.querySelector('.hero-warm-glow');
  const bookingCard = document.getElementById('bookingCard');
  const heroFrame = document.getElementById('heroFrame');

  // Booking State
  let currentCheckIn = 'Feb 11';
  let currentCheckOut = 'Mar 25';
  let currentGuestsCount = 2;
  const ratePerNight = 359;

  // 1. Mobile Menu Toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      hamburgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', isExpanded);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Date Formatting Helper
  function formatDateShort(dateStr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(dateStr + 'T00:00:00');
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  function calculateNights(startStr, endStr) {
    const d1 = new Date(startStr);
    const d2 = new Date(endStr);
    const diffTime = Math.abs(d2 - d1);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // 3. Open Date Picker Modal
  function openDatePicker() {
    datePickerModal.showModal();
  }

  if (checkInBox) checkInBox.addEventListener('click', openDatePicker);
  if (checkOutBox) checkOutBox.addEventListener('click', openDatePicker);
  if (guestsSelector) guestsSelector.addEventListener('click', openDatePicker);
  if (closeDatePickerBtn) {
    closeDatePickerBtn.addEventListener('click', () => datePickerModal.close());
  }

  if (applyDatesBtn) {
    applyDatesBtn.addEventListener('click', () => {
      const inVal = inputCheckIn.value;
      const outVal = inputCheckOut.value;
      
      if (new Date(inVal) >= new Date(outVal)) {
        showToast('Check-out date must be after Check-in date', 'warning');
        return;
      }

      currentCheckIn = formatDateShort(inVal);
      currentCheckOut = formatDateShort(outVal);
      currentGuestsCount = parseInt(selectGuests.value, 10);

      checkInDisplay.textContent = currentCheckIn;
      checkOutDisplay.textContent = currentCheckOut;
      guestsDisplay.textContent = currentGuestsCount === 1 ? '1 guest' : `${currentGuestsCount}-5 guests`;

      const nights = calculateNights(inVal, outVal);
      const total = nights * ratePerNight;
      
      summaryDates.textContent = `${currentCheckIn} – ${currentCheckOut} (${nights} nights)`;
      summaryGuests.textContent = `${currentGuestsCount} Guest${currentGuestsCount > 1 ? 's' : ''}`;
      summaryTotal.textContent = `$${total.toLocaleString()}`;

      datePickerModal.close();
      showToast(`Dates updated: ${currentCheckIn} to ${currentCheckOut}`);
    });
  }

  // 4. Open Reservation Modal
  function openReservationModal() {
    reserveModal.showModal();
  }

  if (reserveBtn) reserveBtn.addEventListener('click', openReservationModal);
  if (bookNowBtn) bookNowBtn.addEventListener('click', openReservationModal);
  if (mobileBookNowBtn) {
    mobileBookNowBtn.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (hamburgerBtn) hamburgerBtn.classList.remove('active');
      openReservationModal();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => reserveModal.close());
  }

  // Close modals on backdrop click
  [reserveModal, datePickerModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          modal.close();
        }
      });
    }
  });

  // 5. Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName').value;
      reserveModal.close();
      showToast(`✨ Thank you, ${guestName}! Reservation confirmed for ${currentCheckIn} - ${currentCheckOut}.`);
      bookingForm.reset();
    });
  }

  // 6. Toast Notification System
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${type === 'warning' ? '#ffaa00' : '#f5a623'}" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 7. Ambient Forest Synthesizer (Web Audio API)
  let audioCtx = null;
  let isPlayingAmbience = false;
  let ambientNoiseNode = null;
  let ambientGainNode = null;

  function toggleAmbience() {
    if (!isPlayingAmbience) {
      startForestAudio();
    } else {
      stopForestAudio();
    }
  }

  function startForestAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Create pink noise for gentle wind
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.035; // keep gentle
        b6 = white * 0.115926;
      }

      ambientNoiseNode = audioCtx.createBufferSource();
      ambientNoiseNode.buffer = noiseBuffer;
      ambientNoiseNode.loop = true;

      // Lowpass filter for deep forest breeze tone
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      ambientGainNode = audioCtx.createGain();
      ambientGainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      ambientGainNode.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 2);

      ambientNoiseNode.connect(filter);
      filter.connect(ambientGainNode);
      ambientGainNode.connect(audioCtx.destination);

      ambientNoiseNode.start();
      isPlayingAmbience = true;
      ambienceToggle.classList.add('active');
      showToast('🌲 Forest breeze ambience enabled');
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  function stopForestAudio() {
    if (ambientGainNode && audioCtx) {
      ambientGainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientNoiseNode) ambientNoiseNode.stop();
        if (audioCtx) audioCtx.close();
        isPlayingAmbience = false;
        ambienceToggle.classList.remove('active');
        showToast('Forest ambience muted');
      }, 500);
    }
  }

  if (ambienceToggle) {
    ambienceToggle.addEventListener('click', toggleAmbience);
  }

  // 8. Cabin Window Glow Toggle
  let glowIntensity = 1;
  if (glowToggleBtn && heroWarmGlow) {
    glowToggleBtn.addEventListener('click', () => {
      glowIntensity = (glowIntensity + 1) % 3;
      if (glowIntensity === 0) {
        heroWarmGlow.style.opacity = '0.1';
        showToast('Cabin interior lights dimmed');
      } else if (glowIntensity === 1) {
        heroWarmGlow.style.opacity = '0.85';
        showToast('Cabin interior lights warm standard');
      } else {
        heroWarmGlow.style.opacity = '1.4';
        showToast('Cabin interior lights vibrant glow');
      }
    });
  }

  // 9. Switch Background View
  const backgrounds = [
    'woodnest-cabin.jpg',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=85',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=2000&q=85'
  ];
  let currentBgIndex = 0;

  if (changeBgBtn && heroBg) {
    changeBgBtn.addEventListener('click', () => {
      currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
      heroBg.style.backgroundImage = `url('${backgrounds[currentBgIndex]}')`;
      showToast(`Switched view (${currentBgIndex + 1}/${backgrounds.length})`);
    });
  }

  // 10. Subtle 3D Card Parallax Tilt on Desktop
  if (bookingCard && window.innerWidth > 900) {
    bookingCard.addEventListener('mousemove', (e) => {
      const rect = bookingCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;
      bookingCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    bookingCard.addEventListener('mouseleave', () => {
      bookingCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }
});
