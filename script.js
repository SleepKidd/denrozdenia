'use strict';
(() => {
  const $ = (s) => document.querySelector(s);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const photos = [
    ['assets/photos/olya-01.webp', 'Быть собой'],
    ['assets/photos/olya-02.webp', 'Расцветать'],
    ['assets/photos/olya-03.webp', 'Ловить мгновения'],
    ['assets/photos/olya-04.webp', 'Улыбаться миру'],
    ['assets/photos/olya-05.webp', 'Чувствовать'],
    ['assets/photos/olya-06.webp', 'Мечтать без границ'],
    ['assets/photos/olya-07.webp', 'Сиять']
  ];
  // Content stays visible if JavaScript or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
  let scrollPending = false;
  function progress() {
    const total = document.documentElement.scrollHeight - innerHeight;
    $('.page-progress').style.width = `${total > 0 ? scrollY / total * 100 : 0}%`;
    scrollPending = false;
  }
  addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(progress); }
  }, { passive: true });
  progress();

  const lightbox = $('#lightbox');
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    $('#lightbox-image').src = photos[photoIndex][0];
    $('#lightbox-image').alt = `Оля — ${photos[photoIndex][1].toLowerCase()}`;
    $('#photo-caption').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${photos.length} — ${photos[photoIndex][1]}`;
  }
  document.querySelectorAll('[data-photo]').forEach((button) => {
    button.addEventListener('click', () => { showPhoto(Number(button.dataset.photo)); lightbox.showModal(); });
  });
  $('#photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
  $('#photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
  });
  let touchX = 0, touchY = 0;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; touchY = e.changedTouches[0].clientY; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
  $('#open-letter').addEventListener('click', () => $('#letter-dialog').showModal());
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (dialog === lightbox || event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  const wishes = [
    'Пусть хороших новостей всегда будет больше, чем непрочитанных сообщений.',
    'Пусть твои «когда-нибудь» становятся счастливыми «сегодня».',
    'Желаю столько поводов улыбаться, чтобы ни один день не остался без своего.',
    'Пусть любимые люди находят время, нужные слова и повод обнять тебя.',
    'Пусть впереди будут дороги, по которым захочется пройти ещё раз.',
    'Желаю смелости выбирать себя и не извиняться за свои мечты.',
    'Пусть денег хватает и на важное, и на красивое, и на спонтанное «а почему бы и нет?».',
    'Пусть в твоём доме всегда пахнет уютом и звучит смех.',
    'Желаю встреч, после которых идёшь домой и улыбаешься без причины.',
    'Пусть в жизни будет больше «я хочу» и меньше утомительного «я должна».',
    'Пусть удача приходит вовремя, а хорошие люди остаются надолго.',
    'Желаю тебе утра без тревоги, дня с вдохновением и вечера с любимыми.',
    'Пусть твои старания замечают, а твою доброту берегут.',
    'Пусть всегда находится время на любимую музыку и маленькие радости.',
    'Желаю крепкого здоровья и сил на все твои большие и маленькие планы.',
    'Пусть в каждом новом городе найдётся место, в которое ты влюбишься.',
    'Пусть зеркало почаще напоминает, какая ты прекрасная.',
    'Желаю, чтобы твои успехи праздновали рядом с тобой так же искренне, как ты сама.',
    'Пусть нежность будет не редким праздником, а обычной частью каждого дня.',
    'Пусть рядом будут те, кому ты можешь доверить даже самое сокровенное.',
    'Желаю тебе больше времени жить, а не только успевать.',
    'Пусть всё, что начинается в этом году твоей жизни, ведёт к чему-то доброму.',
    'Пусть подарки приятно удивляют, цветы появляются без повода, а любовь не требует доказательств.',
    'Оля, пусть жизнь будет щедра к тебе. На любовь, возможности и счастливые случайности.'
  ];
  let wishIndex = 0;
  $('#wish-button').addEventListener('click', () => {
    wishIndex = (wishIndex + 1) % wishes.length;
    const text = $('#random-wish');
    text.textContent = wishes[wishIndex];
    text.classList.remove('wish-pop');
    void text.offsetWidth;
    text.classList.add('wish-pop');
  });

  // Vector particles scale with device pixels. A fixed particle budget keeps
  // large screens crisp without multiplying simulation work by resolution.
  const canvas = $('#magic');
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, frame = 0, previousTime = 0, running = false;
  let ambient = [], bursts = [];
  const palette = ['#b28d5c', '#b55467', '#8b2940', '#d5b07b', '#dfa7a5'];
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ambient = Array.from({ length: width < 700 ? 16 : 35 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: Math.random() * 1.6 + .6, speed: Math.random() * .22 + .08,
      phase: Math.random() * Math.PI * 2
    }));
    progress();
  }
  function draw(time) {
    if (!running) return;
    const dt = Math.min((time - previousTime) / 16.67 || 1, 2);
    previousTime = time;
    ctx.clearRect(0, 0, width, height);
    ambient.forEach((p) => {
      p.y -= p.speed * dt;
      if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
      const opacity = .16 + (Math.sin(time / 1800 + p.phase) + 1) * .14;
      ctx.globalAlpha = opacity; ctx.fillStyle = '#b28d5c';
      ctx.beginPath(); ctx.arc(p.x + Math.sin(time / 3200 + p.phase) * 10, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    });
    bursts = bursts.filter((p) => p.life > 0);
    bursts.forEach((p) => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += .065 * dt;
      p.vx *= .993; p.life -= dt; p.rotation += p.spin * dt;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.min(1, p.life / 45); ctx.fillStyle = p.color;
      if (p.star) {
        ctx.beginPath(); ctx.moveTo(0, -p.size * 1.7); ctx.lineTo(p.size * .4, -p.size * .4);
        ctx.lineTo(p.size * 1.7, 0); ctx.lineTo(p.size * .4, p.size * .4);
        ctx.lineTo(0, p.size * 1.7); ctx.lineTo(-p.size * .4, p.size * .4);
        ctx.lineTo(-p.size * 1.7, 0); ctx.lineTo(-p.size * .4, -p.size * .4); ctx.closePath(); ctx.fill();
      } else ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .55);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  }
  function syncAnimation() {
    const shouldRun = !reduced.matches && !document.hidden;
    if (shouldRun && !running) { running = true; previousTime = 0; frame = requestAnimationFrame(draw); }
    if (!shouldRun) { running = false; cancelAnimationFrame(frame); ctx.clearRect(0, 0, width, height); bursts = []; }
  }
  function celebrate() {
    $('#celebrate-message').textContent = 'Пусть сбудется. С днём рождения, Оля! ♡';
    $('#celebrate').innerHTML = 'Ещё немного волшебства <span>✧</span>';
    if (reduced.matches) return;
    // Bound memory even when the button is pressed repeatedly.
    const count = width < 700 ? 110 : 200;
    bursts = bursts.slice(-240);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2, speed = 2 + Math.random() * 7;
      bursts.push({ x: width * (.25 + Math.random() * .5), y: height * .4,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
        life: 140 + Math.random() * 100, size: 3 + Math.random() * 5,
        rotation: Math.random() * 6, spin: (Math.random() - .5) * .13,
        color: palette[i % palette.length], star: i % 4 === 0 });
    }
  }
  $('#celebrate').addEventListener('click', celebrate);
  addEventListener('resize', resize, { passive: true });
  reduced.addEventListener('change', syncAnimation);
  resize(); syncAnimation();

  // Original soft music-box pattern, synthesized locally. No trackers, remote
  // streams, autoplay, or recordings that need third-party licensing.
  let audio = null, musicTimer = null, musicOn = false, noteIndex = 0, nextNoteAt = 0;
  let master = null;
  const notes = [72, 76, 79, 83, 81, 79, 76, 74, 72, 76, 81, 84, 83, 79, 76, 74,
    69, 72, 76, 79, 77, 76, 72, 71, 67, 71, 74, 79, 76, 74, 71, 72];
  function note(midi, time, duration, volume) {
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain); gain.connect(master);
    oscillator.start(time); oscillator.stop(time + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  function schedule() {
    if (!musicOn || document.hidden) return;
    while (nextNoteAt < audio.currentTime + .15) {
      note(notes[noteIndex % notes.length], nextNoteAt, 1.6, .1);
      if (noteIndex % 4 === 0) note(notes[noteIndex % notes.length] - 24, nextNoteAt, 2.6, .08);
      nextNoteAt += .43; noteIndex++;
    }
  }
  function updateSoundButton() {
    $('#sound').setAttribute('aria-pressed', String(musicOn));
    $('#sound').setAttribute('aria-label', musicOn ? 'Выключить музыку' : 'Включить музыку');
  }
  $('#sound').addEventListener('click', async () => {
    const button = $('#sound'); button.disabled = true;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('Web Audio unavailable');
      if (!audio) { audio = new Audio(); master = audio.createGain(); master.gain.value = .55; master.connect(audio.destination); }
      if (musicOn) { musicOn = false; clearInterval(musicTimer); await audio.suspend(); }
      else {
        await audio.resume(); musicOn = true; nextNoteAt = audio.currentTime + .05;
        schedule(); musicTimer = setInterval(schedule, 100);
      }
      updateSoundButton();
    } catch {
      musicOn = false; clearInterval(musicTimer); updateSoundButton();
      button.setAttribute('aria-label', 'Музыка недоступна в этом браузере');
      $('.sound-label').textContent = 'Без музыки';
    } finally { button.disabled = false; }
  });
  document.addEventListener('visibilitychange', async () => {
    syncAnimation();
    if (!audio || !musicOn) return;
    try {
      if (document.hidden) { clearInterval(musicTimer); await audio.suspend(); }
      else { await audio.resume(); nextNoteAt = audio.currentTime + .05; schedule(); clearInterval(musicTimer); musicTimer = setInterval(schedule, 100); }
    } catch { musicOn = false; clearInterval(musicTimer); updateSoundButton(); }
  });
})();
