const screens = {
  hero: document.getElementById('hero'),
  quiz: document.getElementById('quiz'),
  result: document.getElementById('result'),
  game: document.getElementById('game'),
  gameover: document.getElementById('gameover')
};

const quiz = [
  {
    q: 'Your closest ally leaks classified information to expose corruption. What do you do?',
    a: [
      ['Protect the nation first', 'operator'],
      ['Protect the truth', 'patriot'],
      ['Protect the ally', 'insider'],
      ['Use the leak strategically', 'strategist']
    ]
  },
  {
    q: 'Your commanding officer may be the mole. What is your move?',
    a: [
      ['Arrest immediately', 'operator'],
      ['Gather evidence silently', 'strategist'],
      ['Feed false intelligence', 'ghost'],
      ['Force a public confession', 'patriot']
    ]
  },
  {
    q: 'A mission can save thousands, but one innocent family may die.',
    a: [
      ['Proceed', 'operator'],
      ['Abort', 'patriot'],
      ['Delay and reroute', 'strategist'],
      ['Fake the operation', 'ghost']
    ]
  },
  {
    q: 'The surveillance system starts predicting your movements.',
    a: [
      ['Move faster', 'operator'],
      ['Stop moving', 'strategist'],
      ['Become someone else', 'ghost'],
      ['Warn the others', 'insider']
    ]
  },
  {
    q: 'Your country brands you a traitor, but you know the truth.',
    a: [
      ['Disappear and finish the mission', 'ghost'],
      ['Face the accusation', 'patriot'],
      ['Build a counter-case', 'strategist'],
      ['Find the person who framed you', 'operator']
    ]
  },
  {
    q: 'The final file can clear your name or expose everyone.',
    a: [
      ['Release it all', 'patriot'],
      ['Trade it for leverage', 'ghost'],
      ['Secure it until the right moment', 'strategist'],
      ['Destroy it and move on', 'operator']
    ]
  }
];

const profiles = {
  strategist: {
    title: 'THE STRATEGIST',
    description: 'Calm under pressure. Emotionally disciplined. Always three steps ahead.',
    share: 'You don’t react. You calculate.',
    perk: 'SEES HIDDEN TRAPS',
    threat: 'SEVERE'
  },
  operator: {
    title: 'THE OPERATOR',
    description: 'Tactical. Fearless. Loyal when the mission deserves loyalty.',
    share: 'Some wars are won before the first shot.',
    perk: 'FASTER MOVEMENT',
    threat: 'EXTREME'
  },
  ghost: {
    title: 'THE GHOST',
    description: 'Unpredictable, morally gray, and impossible to track for long.',
    share: 'Truth is whatever survives.',
    perk: 'TEMPORARY INVISIBILITY',
    threat: 'UNKNOWN'
  },
  insider: {
    title: 'THE INSIDER',
    description: 'Trusted by everyone, conflicted by everything, dangerous because you know the system.',
    share: 'The system trusted the wrong person.',
    perk: 'BYPASSES CHECKPOINTS',
    threat: 'HIGH'
  },
  patriot: {
    title: 'THE PATRIOT',
    description: 'Rare profile unlocked. You sacrifice yourself before the mission.',
    share: 'You sacrifice yourself before the mission.',
    perk: 'TRACE RESISTANCE',
    threat: 'NATIONAL'
  }
};

let currentQuestion = 0;
let scores = { strategist: 0, operator: 0, ghost: 0, insider: 0, patriot: 0 };
let selectedProfile = 'operator';

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour12: false });
}
setInterval(updateClock, 1000); updateClock();

function startQuiz() {
  currentQuestion = 0;
  scores = { strategist: 0, operator: 0, ghost: 0, insider: 0, patriot: 0 };
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  const item = quiz[currentQuestion];
  document.getElementById('questionCounter').textContent = `${String(currentQuestion + 1).padStart(2, '0')} / ${String(quiz.length).padStart(2, '0')}`;
  document.getElementById('quizProgress').style.width = `${(currentQuestion / quiz.length) * 100}%`;
  document.getElementById('questionText').textContent = item.q;
  const answers = document.getElementById('answers');
  answers.innerHTML = '';
  item.a.forEach(([text, type]) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = text;
    btn.onclick = () => chooseAnswer(type);
    answers.appendChild(btn);
  });
}

function chooseAnswer(type) {
  scores[type]++;
  if (currentQuestion === 2) flashGlitch();
  currentQuestion++;
  if (currentQuestion >= quiz.length) return showResult();
  renderQuestion();
}

function flashGlitch() {
  const alert = document.getElementById('glitchAlert');
  alert.classList.add('show');
  setTimeout(() => alert.classList.remove('show'), 950);
}

function showResult() {
  document.getElementById('quizProgress').style.width = '100%';
  selectedProfile = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
  const p = profiles[selectedProfile];
  document.getElementById('resultTitle').textContent = p.title;
  document.getElementById('resultDescription').textContent = p.description;
  document.getElementById('shareLine').textContent = p.share;
  document.getElementById('gamePerk').textContent = p.perk;
  document.getElementById('threatLevel').textContent = p.threat;
  document.getElementById('codename').textContent = `${['SHADOW','VIPER','ECHO','NOVA','RAVEN'][Math.floor(Math.random()*5)]}-${Math.floor(10 + Math.random()*89)}`;
  showScreen('result');
}

document.getElementById('startBtn').onclick = startQuiz;
document.getElementById('restartQuizBtn').onclick = startQuiz;
document.getElementById('playGridBtn').onclick = () => startGame();
document.getElementById('exitGameBtn').onclick = () => showScreen('result');
document.getElementById('retryGameBtn').onclick = () => startGame();
document.getElementById('homeBtn').onclick = () => showScreen('hero');

// Game
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let player, enemies, pickups, keys, gameRunning, startTime, trace, reverseControls, invisibleUntil, animationId;

function startGame() {
  showScreen('game');
  document.getElementById('operativeClass').textContent = profiles[selectedProfile].title.replace('THE ', '');
  player = { x: 80, y: canvas.height / 2, r: 9, speed: selectedProfile === 'operator' ? 4.2 : 3.4 };
  if (selectedProfile === 'patriot') player.speed = 3.6;
  enemies = Array.from({ length: 7 }, (_, i) => ({
    x: 220 + i * 90,
    y: 70 + Math.random() * 360,
    r: 16,
    vx: (Math.random() > .5 ? 1 : -1) * (1.1 + Math.random() * 1.8),
    vy: (Math.random() > .5 ? 1 : -1) * (1.1 + Math.random() * 1.8),
    type: i % 2 ? 'drone' : 'camera'
  }));
  pickups = [
    { x: 760, y: 90, type: 'node' },
    { x: 780, y: 430, type: 'node' },
    { x: 460, y: 260, type: 'emp' }
  ];
  keys = {};
  trace = 0;
  reverseControls = false;
  invisibleUntil = 0;
  gameRunning = true;
  startTime = Date.now();
  cancelAnimationFrame(animationId);
  loop();
}

function loop() {
  if (!gameRunning) return;
  updateGame();
  drawGame();
  animationId = requestAnimationFrame(loop);
}

function updateGame() {
  const elapsed = (Date.now() - startTime) / 1000;
  trace += selectedProfile === 'patriot' ? 0.045 : 0.06;
  if (elapsed > 18 && !reverseControls && Math.random() < 0.004) {
    reverseControls = true;
    flashMessage('OPERATIVE COMPROMISED');
    setTimeout(() => reverseControls = false, 2100);
  }
  const dir = reverseControls ? -1 : 1;
  if (keys.ArrowUp || keys.w) player.y -= player.speed * dir;
  if (keys.ArrowDown || keys.s) player.y += player.speed * dir;
  if (keys.ArrowLeft || keys.a) player.x -= player.speed * dir;
  if (keys.ArrowRight || keys.d) player.x += player.speed * dir;
  player.x = Math.max(player.r, Math.min(canvas.width - player.r, player.x));
  player.y = Math.max(player.r, Math.min(canvas.height - player.r, player.y));

  enemies.forEach(e => {
    e.x += e.vx * (1 + elapsed / 80);
    e.y += e.vy * (1 + elapsed / 80);
    if (e.x < 40 || e.x > canvas.width - 40) e.vx *= -1;
    if (e.y < 40 || e.y > canvas.height - 40) e.vy *= -1;
    const visible = Date.now() > invisibleUntil;
    const dangerRadius = selectedProfile === 'strategist' ? e.r + 15 : e.r + 25;
    if (visible && dist(player, e) < player.r + dangerRadius) endGame();
  });

  pickups = pickups.filter(p => {
    if (dist(player, { x: p.x, y: p.y }) < 24) {
      if (p.type === 'emp' || selectedProfile === 'ghost') {
        invisibleUntil = Date.now() + 2600;
        flashMessage('SIGNAL SCRAMBLED');
      }
      trace = Math.max(0, trace - 13);
      return false;
    }
    return true;
  });

  if (player.x > canvas.width - 30) {
    trace = Math.max(0, trace - 0.35);
    flashMessage('UPLOAD NODE REACHED');
  }

  document.getElementById('survivalTime').textContent = formatTime(elapsed);
  document.getElementById('traceLevel').textContent = `${Math.min(100, Math.floor(trace))}%`;
  if (trace >= 100) endGame();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(88,166,255,.14)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }

  ctx.fillStyle = 'rgba(255,59,79,.12)';
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, selectedProfile === 'strategist' ? e.r + 15 : e.r + 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = e.type === 'drone' ? '#ff3b4f' : '#ffd166';
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,59,79,.12)';
  });

  pickups.forEach(p => {
    ctx.strokeStyle = p.type === 'emp' ? '#70e000' : '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(p.x - 13, p.y - 13, 26, 26); ctx.stroke();
  });

  ctx.fillStyle = Date.now() < invisibleUntil ? 'rgba(112,224,0,.75)' : '#edf6ff';
  ctx.beginPath(); ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(88,166,255,.25)';
  ctx.fillRect(canvas.width - 18, 0, 18, canvas.height);
}

function endGame() {
  if (!gameRunning) return;
  gameRunning = false;
  const elapsed = (Date.now() - startTime) / 1000;
  document.getElementById('finalStats').textContent = `YOU SURVIVED: ${formatTime(elapsed)} | TRACE: ${Math.min(100, Math.floor(trace))}%`;
  showScreen('gameover');
}

function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function flashMessage(msg) {
  const alert = document.getElementById('glitchAlert');
  alert.textContent = msg;
  alert.classList.add('show');
  setTimeout(() => { alert.classList.remove('show'); alert.textContent = 'WE KNOW WHO YOU ARE'; }, 650);
}

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);
document.querySelectorAll('.mobile-controls button').forEach(btn => {
  const map = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  btn.addEventListener('touchstart', e => { e.preventDefault(); keys[map[btn.dataset.dir]] = true; });
  btn.addEventListener('touchend', e => { e.preventDefault(); keys[map[btn.dataset.dir]] = false; });
  btn.addEventListener('mousedown', () => keys[map[btn.dataset.dir]] = true);
  btn.addEventListener('mouseup', () => keys[map[btn.dataset.dir]] = false);
});
