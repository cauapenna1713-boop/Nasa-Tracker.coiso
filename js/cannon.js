const PLANETS = [
  { name:"Mercury", emoji:"☿", radius:2439.7e3, mass:3.301e23, gravity:3.7,
    escapeVelocity:4.25, orbitalVelocity:3.01,
    atmosphereHeight:0, atmosphereDensity:0,
    color:"#b5b5b5", atmosphereColor:"transparent", mountainHeight:8,
    description:"Sem atmosfera. Projéteis orbitam para sempre uma vez lançados." },
  { name:"Venus", emoji:"♀", radius:6051.8e3, mass:4.867e24, gravity:8.87,
    escapeVelocity:10.36, orbitalVelocity:7.33,
    atmosphereHeight:250, atmosphereDensity:0.92,
    color:"#e8cda0", atmosphereColor:"rgba(255,200,100,0.4)", mountainHeight:11,
    description:"Atmosfera extremamente densa. Resistência enorme ao projétil." },
  { name:"Earth", emoji:"🌍", radius:6371e3, mass:5.972e24, gravity:9.81,
    escapeVelocity:11.2, orbitalVelocity:7.9,
    atmosphereHeight:100, atmosphereDensity:0.5,
    color:"#1a7fd4", atmosphereColor:"rgba(100,180,255,0.3)", mountainHeight:8.849,
    description:"Planeta natal. Velocidade orbital ~7.9 km/s na superfície." },
  { name:"Moon", emoji:"🌕", radius:1737.4e3, mass:7.342e22, gravity:1.62,
    escapeVelocity:2.38, orbitalVelocity:1.68,
    atmosphereHeight:0, atmosphereDensity:0,
    color:"#cccccc", atmosphereColor:"transparent", mountainHeight:5,
    description:"Gravidade fraca facilita muito a entrada em órbita." },
  { name:"Mars", emoji:"♂", radius:3389.5e3, mass:6.417e23, gravity:3.72,
    escapeVelocity:5.03, orbitalVelocity:3.55,
    atmosphereHeight:70, atmosphereDensity:0.07,
    color:"#c1440e", atmosphereColor:"rgba(200,100,50,0.15)", mountainHeight:21.9,
    description:"Atmosfera fina de CO₂. Monte Olimpo como ponto de lançamento." },
  { name:"Jupiter", emoji:"♃", radius:69911e3, mass:1.898e27, gravity:24.79,
    escapeVelocity:59.5, orbitalVelocity:42.1,
    atmosphereHeight:1000, atmosphereDensity:0.85,
    color:"#c88b3a", atmosphereColor:"rgba(200,150,80,0.35)", mountainHeight:50,
    description:"Gigante gasoso. Gravidade enorme — velocidade de escape: 59.5 km/s!" },
  { name:"Saturn", emoji:"♄", radius:58232e3, mass:5.683e26, gravity:10.44,
    escapeVelocity:35.5, orbitalVelocity:25.1,
    atmosphereHeight:1000, atmosphereDensity:0.75,
    color:"#e4d191", atmosphereColor:"rgba(220,210,130,0.3)", mountainHeight:50,
    description:"Planeta dos anéis. Renderize os anéis de Saturno no canvas." },
  { name:"Uranus", emoji:"⛢", radius:25362e3, mass:8.681e25, gravity:8.87,
    escapeVelocity:21.3, orbitalVelocity:15.1,
    atmosphereHeight:800, atmosphereDensity:0.65,
    color:"#7de8e8", atmosphereColor:"rgba(100,220,220,0.25)", mountainHeight:30,
    description:"Gigante de gelo inclinado. Atmosfera ciano única." },
  { name:"Neptune", emoji:"♆", radius:24622e3, mass:1.024e26, gravity:11.15,
    escapeVelocity:23.5, orbitalVelocity:16.6,
    atmosphereHeight:800, atmosphereDensity:0.7,
    color:"#3f54d1", atmosphereColor:"rgba(80,120,220,0.3)", mountainHeight:30,
    description:"Planeta mais ventoso. Azul profundo." },
  { name:"Pluto", emoji:"♇", radius:1188.3e3, mass:1.303e22, gravity:0.62,
    escapeVelocity:1.23, orbitalVelocity:0.87,
    atmosphereHeight:10, atmosphereDensity:0.01,
    color:"#c4a882", atmosphereColor:"rgba(180,160,120,0.1)", mountainHeight:3,
    description:"Planeta anão. Gravidade mínima." },
  { name:"Custom", emoji:"🔧", radius:6371e3, mass:5.972e24, gravity:9.81,
    escapeVelocity:11.2, orbitalVelocity:7.9,
    atmosphereHeight:100, atmosphereDensity:0.5,
    color:"#8a2be2", atmosphereColor:"rgba(180,100,255,0.3)", mountainHeight:10,
    description:"Mundo personalizado. Configure todos os parâmetros livremente." }
];

const G = 6.674e-11;

document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('cannon-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // UI Elements
    const pillsContainer = document.getElementById('planet-pills');
    const customPanel = document.getElementById('custom-planet-panel');
    const infoPanel = document.getElementById('sim-planet-info');
    
    const uiSpeed = document.getElementById('sim-speed');
    const lblSpeed = document.getElementById('lbl-speed');
    const uiAngle = document.getElementById('sim-angle');
    const lblAngle = document.getElementById('lbl-angle');
    
    // Custom UI
    const customUI = {
        grav: document.getElementById('sim-gravity'), lblGrav: document.getElementById('lbl-grav'),
        rad: document.getElementById('sim-radius'), lblRad: document.getElementById('lbl-rad'),
        atmoH: document.getElementById('sim-atmoh'), lblAtmoH: document.getElementById('lbl-atmoh'),
        atmoD: document.getElementById('sim-atmod'), lblAtmoD: document.getElementById('lbl-atmod'),
        mount: document.getElementById('sim-mount'), lblMount: document.getElementById('lbl-mount')
    };

    // Telemetry
    const tStatus = document.getElementById('sim-status');
    const tVel = document.getElementById('sim-vel');
    const tAlt = document.getElementById('sim-alt');
    const tDrag = document.getElementById('sim-drag');
    const tVhor = document.getElementById('sim-vhor');
    const tVver = document.getElementById('sim-vver');

    // Controls
    const btnFire = document.getElementById('sim-fire');
    const warpBtns = document.querySelectorAll('.warp-btn');
    const badgeOrbit = document.getElementById('orbit-badge');
    
    // Modal
    const modal = document.getElementById('sim-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalAlt = document.getElementById('m-alt');
    const modalTime = document.getElementById('m-time');
    const modalSpd = document.getElementById('m-spd');
    const modalComp = document.getElementById('m-comp');
    const modalRetry = document.getElementById('modal-retry');

    // Toast
    const toast = document.getElementById('achievement-toast');
    const toastTitle = document.getElementById('achievement-title');

    // State Variables
    let currentPlanetIdx = 2; // Earth
    let planet = {...PLANETS[2]};
    let timeWarp = 1;

    let simState = 'READY'; // READY, FLYING, IMPACTED, ESCAPED
    let flightStatus = 'READY'; // For telemetry badge: READY, LAUNCHED, SUBORBITAL, ORBITAL, ESCAPING, IMPACTED
    
    let pos = {x: 0, y: 0}; // in meters
    let vel = {x: 0, y: 0}; // in m/s
    
    let trail = [];
    let particles = [];
    let stars = [];
    
    let maxAlt = 0;
    let maxSpd = 0;
    let flightTime = 0;
    let totalAngleScanned = 0;
    let startAngle = 0;
    let previousAngle = 0;
    let orbitAchievedThisFlight = false;
    let orbitsCompleted = 0;
    
    let isPaused = false;
    let cameraScale = 1;
    let targetCameraScale = 1;
    let cameraOffsetX = 0;
    let cameraOffsetY = 0;
    let userZoom = 1;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    
    let isLocked = false;
    let isSteeringLeft = false;
    let isSteeringRight = false;
    let mainEngineActive = false;
    let rcsActive = false;
    
    let baseTimeStep = 0.05; // base step per physics tick
    let accumulator = 0;
    let lastTime = performance.now();
    let simStartedTime = 0;

    // Load achievements
    let achievements = {};
    try {
        achievements = JSON.parse(localStorage.getItem('cannon_achievements')) || {};
    } catch(e) { achievements = {}; }

    // Inject Orbital parameters for Solar System view
    const sunDistToKm = {
        Mercury: 58000, Venus: 108000, Earth: 150000, Moon: 151000,
        Mars: 228000, Jupiter: 778000, Saturn: 1433000, Uranus: 2872000,
        Neptune: 4495000, Pluto: 5906000, Custom: 200000
    };
    PLANETS.forEach(p => {
        p.sunDistance = sunDistToKm[p.name] * 200; // Scaled for visible map
        p.revSpeed = (1 / Math.sqrt(p.sunDistance || 1)) * 50; 
        p.phase = Math.random() * Math.PI * 2;
    });

    // Init UI
    function initUI() {
        // Pills
        PLANETS.forEach((p, idx) => {
            const pill = document.createElement('div');
            pill.className = 'planet-pill' + (idx === currentPlanetIdx ? ' active' : '');
            pill.innerHTML = `<span>${p.emoji}</span> <span>${p.name}</span>`;
            pill.onclick = () => selectPlanet(idx);
            pillsContainer.appendChild(pill);
        });
        
        // Stars
        for(let i=0; i<300; i++) {
            stars.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                r: Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.05 + 0.01
            });
        }

        // Window resize
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        selectPlanet(currentPlanetIdx);
        
        // Map navigation listeners
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
        });
        window.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            cameraOffsetX += (e.clientX - dragStartX);
            cameraOffsetY += (e.clientY - dragStartY);
            dragStartX = e.clientX;
            dragStartY = e.clientY;
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 1.1;
            if(e.deltaY > 0) userZoom /= zoomSpeed;
            else userZoom *= zoomSpeed;
        });
        
        // Ranges bindings
        uiSpeed.addEventListener('input', () => { lblSpeed.textContent = uiSpeed.value; });
        uiAngle.addEventListener('input', () => { lblAngle.textContent = uiAngle.value; });

        // Custom bounds
        Object.keys(customUI).forEach(k => {
            if(customUI[k].tagName === 'INPUT') {
                customUI[k].addEventListener('input', updateCustomPlanet);
            }
        });

        // Warp buttons
        warpBtns.forEach(btn => {
            btn.onclick = () => {
                warpBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                timeWarp = parseFloat(btn.dataset.warp);
            };
        });

        // Lock button
        const btnLock = document.getElementById('btn-camera-lock');
        const lblLock = document.getElementById('lbl-lock');
        if (btnLock) {
            btnLock.onclick = () => {
                isLocked = !isLocked;
                btnLock.classList.toggle('active', isLocked);
                lblLock.textContent = isLocked ? 'LOCKED' : 'UNLOCK';
            };
        }

        btnFire.onclick = toggleFire;
        modalRetry.onclick = resetSim;

        // Keyboard mappings
        document.addEventListener('keydown', (e) => {
            const simEl = document.getElementById('simulator');
            const rect = simEl.getBoundingClientRect();
            if(rect.top > window.innerHeight || rect.bottom < 0) return; // not in view

            if(e.code === 'Space') { e.preventDefault(); toggleFire(); }
            if(e.code === 'KeyP') { e.preventDefault(); isPaused = !isPaused; }
            if(e.code === 'KeyL' && btnLock) { e.preventDefault(); btnLock.click(); }
            if(e.code === 'ArrowRight') { 
                e.preventDefault(); 
                if(isLocked && simState === 'FLYING') isSteeringRight = true;
                else { uiSpeed.value = Math.min(150, parseFloat(uiSpeed.value)+0.1).toFixed(1); lblSpeed.textContent = uiSpeed.value; }
            }
            if(e.code === 'ArrowLeft') { 
                e.preventDefault(); 
                if(isLocked && simState === 'FLYING') isSteeringLeft = true;
                else { uiSpeed.value = Math.max(0, parseFloat(uiSpeed.value)-0.1).toFixed(1); lblSpeed.textContent = uiSpeed.value; }
            }
            if(e.key >= '0' && e.key <= '9') {
                let p = parseInt(e.key) - 1;
                if(p === -1) p = 9; // '0' maps to 10th planet
                if(p < PLANETS.length) selectPlanet(p);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if(e.code === 'ArrowRight') isSteeringRight = false;
            if(e.code === 'ArrowLeft') isSteeringLeft = false;
        });

        requestAnimationFrame(gameLoop);
    }

    function toggleFire() {
        if(simState === 'READY') {
            fireCannon();
        } else {
            resetSim();
        }
    }

    function selectPlanet(idx) {
        currentPlanetIdx = idx;
        const pills = document.querySelectorAll('.planet-pill');
        pills.forEach((p, i) => p.classList.toggle('active', i === idx));
        
        planet = {...PLANETS[idx]};
        
        if(planet.name === 'Custom') {
            customPanel.style.display = 'flex';
            updateCustomPlanet(); // loads values from UI to planet object
        } else {
            customPanel.style.display = 'none';
        }

        infoPanel.innerHTML = `<strong>${planet.name}:</strong> ${planet.description} <br><br>
        Orbital velocity: <span style="color:var(--accent-primary)">${planet.orbitalVelocity.toFixed(2)} km/s</span> | Escape velocity: <span style="color:#fff">${planet.escapeVelocity.toFixed(2)} km/s</span>`;
        
        uiSpeed.value = planet.orbitalVelocity;
        lblSpeed.textContent = uiSpeed.value;

        if (simState === 'FLYING' && orbitAchievedThisFlight) {
            let alt = planet.atmosphereHeight ? planet.atmosphereHeight * 1000 * 2 : 200000;
            if (alt < 100000) alt = 100000;
            const r = planet.radius + alt;
            pos = { x: 0, y: -r };
            vel = { x: Math.sqrt(G * planet.mass / r), y: 0 };
            trail = [{...pos}];
            maxAlt = alt / 1000;
            maxSpd = vel.x / 1000;
            startAngle = Math.atan2(pos.y, pos.x);
            previousAngle = startAngle;
            totalAngleScanned = 0;
            orbitsCompleted = 0;
            flightStatus = 'ORBITAL';
        } else {
            resetSim();
        }
    }

    function updateCustomPlanet() {
        if(planet.name !== 'Custom') return;
        planet.gravity = parseFloat(customUI.grav.value);
        planet.radius = parseFloat(customUI.rad.value) * 1000;
        planet.atmosphereHeight = parseFloat(customUI.atmoH.value);
        planet.atmosphereDensity = parseFloat(customUI.atmoD.value);
        planet.mountainHeight = parseFloat(customUI.mount.value);

        customUI.lblGrav.textContent = planet.gravity + ' m/s²';
        customUI.lblRad.textContent = (planet.radius / 1000).toFixed(0) + ' km';
        customUI.lblAtmoH.textContent = planet.atmosphereHeight + ' km';
        customUI.lblAtmoD.textContent = planet.atmosphereDensity.toFixed(2);
        customUI.lblMount.textContent = planet.mountainHeight + ' km';

        // Recalculate physical properties based on custom values
        // gravity = G * M / R^2 => M = gravity * R^2 / G
        planet.mass = (planet.gravity * Math.pow(planet.radius, 2)) / G;
        planet.orbitalVelocity = Math.sqrt(planet.gravity * planet.radius) / 1000;
        planet.escapeVelocity = Math.sqrt(2 * planet.gravity * planet.radius) / 1000;
        
        infoPanel.innerHTML = `<strong>${planet.name}:</strong> ${planet.description} <br><br>
        Orbital velocity: <span style="color:var(--accent-primary)">${planet.orbitalVelocity.toFixed(2)} km/s</span> | Escape velocity: <span style="color:#fff">${planet.escapeVelocity.toFixed(2)} km/s</span>`;
    }

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    function resetSim() {
        simState = 'READY';
        flightStatus = 'READY';
        trail = [];
        particles = [];
        orbitAchievedThisFlight = false;
        orbitsCompleted = 0;
        cameraOffsetX = 0;
        cameraOffsetY = 0;
        userZoom = 1;
        badgeOrbit.classList.add('hide');
        modal.classList.add('hide');
        btnFire.textContent = 'FIRE! 🚀';
        btnFire.className = 'btn btn-primary';
        updateTelemetry();
        targetCameraScale = 1;
    }

    function fireCannon() {
        resetSim();
        simState = 'FLYING';
        flightStatus = 'LAUNCHED';
        btnFire.textContent = 'RESET ↺';
        btnFire.className = 'btn btn-glass';
        
        const rInitial = planet.radius + planet.mountainHeight * 1000;
        // The cannon is at the top (y = -rInitial)
        pos = { x: 0, y: -rInitial };
        
        const speed = parseFloat(uiSpeed.value) * 1000; // to m/s
        const angleDeg = parseFloat(uiAngle.value);
        const angleRad = angleDeg * Math.PI / 180;
        
        // 0 degrees means horizontal to the right: x velocity > 0, y velocity = 0
        // -45 degrees means angled up: x > 0, y < 0
        vel = {
            x: speed * Math.cos(angleRad),
            y: speed * Math.sin(angleRad)
        };

        trail.push({...pos});
        
        maxAlt = planet.mountainHeight;
        maxSpd = speed / 1000;
        flightTime = 0;
        
        startAngle = Math.atan2(pos.y, pos.x);
        previousAngle = startAngle;
        totalAngleScanned = 0;
    }

    // Physics Engine
    function gravityAccel(p, pl) {
        const r = Math.sqrt(p.x*p.x + p.y*p.y);
        const mag = G * pl.mass / (r * r);
        return { x: -mag * p.x / r, y: -mag * p.y / r };
    }

    function atmoDensity(alt_m, pl) {
        const H = pl.atmosphereHeight * 1000;
        if (alt_m >= H || pl.atmosphereDensity === 0) return 0;
        const scaleH = H / 8;
        return pl.atmosphereDensity * Math.exp(-alt_m / scaleH);
    }

    function dragAccel(v, alt_m, pl) {
        const rho = atmoDensity(alt_m, pl);
        if (rho === 0) return { x: 0, y: 0 };
        const speed = Math.sqrt(v.x*v.x + v.y*v.y);
        if (speed === 0) return { x: 0, y: 0 };
        const k = 2e-5; // drag coefficient constant
        const mag = k * rho * speed;
        return { x: -mag * v.x, y: -mag * v.y };
    }

    function checkAchievements() {
        if (!achievements.physicist && planet.name === 'Custom') {
            unlockAchievement('physicist', 'Físico', 'Usou Mundo Customizado');
        }
        if (simState === 'FLYING') {
            if (!achievements.speed_demon && (maxSpd >= 50)) {
                unlockAchievement('speed_demon', '⚡ Demônio da Velocidade', '> 50 km/s launch!');
            }
            if (!achievements.first_orbit && orbitAchievedThisFlight) {
                unlockAchievement('first_orbit', '🎯 Primeira Órbita', 'Atingiu órbita com sucesso');
            }
            if (!achievements.lunar_launch && orbitAchievedThisFlight && planet.name === 'Moon') {
                unlockAchievement('lunar_launch', '🌙 Lançamento Lunar', 'Órbita na Lua');
            }
            if (!achievements.cannon_run && orbitsCompleted >= 10) {
                unlockAchievement('cannon_run', '☄️ Corrida do Canhão', '10 órbitas completas!');
            }
        }
        if (simState === 'ESCAPING' || flightStatus === 'ESCAPING') {
            if (!achievements.escape_artist) {
                unlockAchievement('escape_artist', '🚀 Artista da Fuga', 'Atingiu a velocidade de fuga!');
            }
        }
        if (simState === 'FLYING' && orbitAchievedThisFlight) {
            // Check Grand Tour
            if(!achievements.grand_tour_planets) achievements.grand_tour_planets = [];
            if(!achievements.grand_tour_planets.includes(planet.name) && planet.name !== 'Custom') {
                achievements.grand_tour_planets.push(planet.name);
                localStorage.setItem('cannon_achievements', JSON.stringify(achievements));
                if(achievements.grand_tour_planets.length >= 5 && !achievements.grand_tour) {
                    unlockAchievement('grand_tour', '🌏 Grande Tour', 'Órbitas em 5 planetas diferentes!');
                }
            }
        }
    }

    function unlockAchievement(id, title, desc) {
        achievements[id] = true;
        localStorage.setItem('cannon_achievements', JSON.stringify(achievements));
        
        toastTitle.textContent = title;
        toast.classList.remove('hide');
        toast.style.animation = 'none';
        void toast.offsetWidth; // trigger reflow
        toast.style.animation = 'slideUpIn 0.5s ease forwards, slideDownOut 0.5s ease 3.5s forwards';
    }

    function endFlight(type) {
        simState = type;
        
        modalIcon.textContent = type === 'IMPACTED' ? '💥' : '🚀';
        modalTitle.textContent = type === 'IMPACTED' ? 'IMPACT' : 'ESCAPED';
        modalTitle.style.color = type === 'IMPACTED' ? '#ff4444' : '#ffffff';
        
        modalAlt.textContent = maxAlt.toFixed(1);
        modalTime.textContent = flightTime.toFixed(0);
        modalSpd.textContent = maxSpd.toFixed(2);
        
        const distKm = maxAlt;
        const ratioEL = distKm / 384400;
        if(ratioEL > 0.05) {
            modalComp.textContent = `Atingiu ${(ratioEL*100).toFixed(1)}% da distância Terra-Lua!`;
        } else if (distKm > 400) {
            modalComp.textContent = `Passou a altura da Estação Espacial Internacional (ISS)`;
        } else if (distKm > 100) {
            modalComp.textContent = `Atravessou a Linha de Kármán (espaço)!`;
        } else {
            modalComp.textContent = 'Voo atmosférico regional.';
        }

        setTimeout(() => {
            modal.classList.remove('hide');
        }, 500);

        if(type === 'IMPACTED') createExplosion(pos);
    }

    function createExplosion(p) {
        for(let i=0; i<30; i++) {
            particles.push({
                x: p.x, y: p.y,
                vx: (Math.random() - 0.5) * 5000,
                vy: (Math.random() - 0.5) * 5000,
                life: 1.0
            });
        }
    }

    function getStatusColor(status) {
        switch(status) {
            case 'READY': return ['ready', 'READY'];
            case 'LAUNCHED': return ['launched', 'LAUNCHED'];
            case 'SUBORBITAL': return ['suborbital', 'SUBORBITAL'];
            case 'ORBITAL': return ['orbital', 'ORBITAL'];
            case 'ESCAPING': return ['escaping', 'ESCAPING'];
            case 'IMPACTED': return ['impacted', 'IMPACTED'];
            default: return ['ready', 'READY'];
        }
    }

    function updateTelemetry() {
        const altKm = (Math.sqrt(pos.x*pos.x + pos.y*pos.y) - planet.radius) / 1000;
        const spdKm = Math.sqrt(vel.x*vel.x + vel.y*vel.y) / 1000;
        
        tAlt.textContent = simState === 'READY' ? '0' : altKm.toFixed(1);
        tVel.textContent = simState === 'READY' ? '0.00' : spdKm.toFixed(2);
        
        tVhor.textContent = simState === 'READY' ? '0.00' : Math.abs(vel.x / 1000).toFixed(2);
        tVver.textContent = simState === 'READY' ? '0.00' : Math.abs(vel.y / 1000).toFixed(2);
        
        if (simState === 'READY') {
            tDrag.textContent = '0.00';
            flightStatus = 'READY';
        }

        const [cls, txt] = getStatusColor(flightStatus);
        tStatus.textContent = txt;
        tStatus.className = 't-badge ' + cls;
    }

    function updatePhysics(dt) {
        if(simState !== 'FLYING') return;

        // Animate all planets in the background
        PLANETS.forEach(p => {
            if (p.sunDistance && p.revSpeed) {
                p.phase += p.revSpeed * dt * 0.00005; // Base rotation
            }
        });

        // Substepping for collision accuracy
        const STEPS = Math.min(20, Math.ceil((Math.sqrt(vel.x*vel.x + vel.y*vel.y) * dt) / (planet.radius * 0.05)));
        const subDt = dt / STEPS;
        
        mainEngineActive = false;
        rcsActive = false;

        for(let i=0; i<STEPS; i++) {
            const r = Math.sqrt(pos.x*pos.x + pos.y*pos.y);
            const alt = r - planet.radius;
            
            // Check impact
            if(alt <= 0) {
                flightStatus = 'IMPACTED';
                pos.x = planet.radius * (pos.x / r);
                pos.y = planet.radius * (pos.y / r);
                trail.push({...pos});
                endFlight('IMPACTED');
                checkAchievements();
                return;
            }

            const gAcc = gravityAccel(pos, planet);
            const dAcc = dragAccel(vel, alt, planet);
            
            const gMag = Math.sqrt(gAcc.x**2 + gAcc.y**2);
            const dMag = Math.sqrt(dAcc.x**2 + dAcc.y**2);
            if(simState === 'FLYING') tDrag.textContent = (gMag > 0 ? (dMag / gMag * 100) : 0).toFixed(2);

            vel.x += (gAcc.x + dAcc.x) * subDt;
            vel.y += (gAcc.y + dAcc.y) * subDt;
            
            // Steering Logic
            if (isLocked) {
                if (isSteeringLeft) {
                    const steerRate = 1.0 * subDt;
                    const spd = Math.sqrt(vel.x*vel.x + vel.y*vel.y);
                    const ang = Math.atan2(vel.y, vel.x) - steerRate;
                    vel.x = spd * Math.cos(ang);
                    vel.y = spd * Math.sin(ang);
                    rcsActive = true;
                }
                if (isSteeringRight) {
                    const steerRate = 1.0 * subDt;
                    const spd = Math.sqrt(vel.x*vel.x + vel.y*vel.y);
                    const ang = Math.atan2(vel.y, vel.x) + steerRate;
                    vel.x = spd * Math.cos(ang);
                    vel.y = spd * Math.sin(ang);
                    rcsActive = true;
                }
            }

            // Automatic staging burn after exiting atmosphere
            if (simState === 'FLYING' && !orbitAchievedThisFlight && flightStatus !== 'ESCAPING') {
                if (alt > planet.atmosphereHeight * 1000 && alt < planet.atmosphereHeight * 1000 + 400000 && vel.y < 0) {
                    mainEngineActive = true;
                    const speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y);
                    // Add slight thrust to simulate orbital insertion, if not fully orbital yet
                    if (speed < planet.orbitalVelocity * 1000) {
                        vel.x *= (1 + 0.005 * subDt);
                        vel.y *= (1 + 0.005 * subDt); 
                    }
                }
            }
            
            pos.x += vel.x * subDt;
            pos.y += vel.y * subDt;
            flightTime += subDt;

            // Track stats
            if(alt / 1000 > maxAlt) maxAlt = alt / 1000;
            const spd = Math.sqrt(vel.x*vel.x + vel.y*vel.y) / 1000;
            if(spd > maxSpd) maxSpd = spd;

            // Detect Escape
            if(spd >= planet.escapeVelocity * 0.98) {
                // Check if moving away
                const dot = pos.x*vel.x + pos.y*vel.y; // dr/dt
                if (dot > 0) {
                    flightStatus = 'ESCAPING';
                    if(alt / 1000 > Math.max(100000, planet.radius * 2 / 1000)) {
                        endFlight('ESCAPED');
                        checkAchievements();
                        return;
                    }
                }
            } else if (flightStatus === 'ESCAPING') {
                flightStatus = 'SUBORBITAL'; // fell back ?
            }

            // Angle tracking for orbit
            const currAngle = Math.atan2(pos.y, pos.x);
            let diff = currAngle - previousAngle;
            if(diff > Math.PI) diff -= 2*Math.PI;
            if(diff < -Math.PI) diff += 2*Math.PI;
            totalAngleScanned += diff;
            previousAngle = currAngle;

            if(Math.abs(totalAngleScanned) >= 2 * Math.PI) {
                orbitAchievedThisFlight = true;
                orbitsCompleted++;
                totalAngleScanned = 0; // reset for next orbit count
            }

            if(orbitAchievedThisFlight && flightStatus !== 'ESCAPING') {
                flightStatus = 'ORBITAL';
                badgeOrbit.classList.remove('hide');
            } else if(alt > planet.atmosphereHeight * 1000 && flightStatus === 'LAUNCHED') {
                flightStatus = 'SUBORBITAL';
            }
        }
        
        trail.push({...pos});
        if(trail.length > 2000) trail.shift();
        checkAchievements();
    }

    function getTrailColor(p, index, total) {
        const altKm = (Math.sqrt(p.x*p.x + p.y*p.y) - planet.radius) / 1000;
        const ratioH = altKm / (planet.atmosphereHeight || 1);
        
        let colorStr = '';
        if (flightStatus === 'ORBITAL') colorStr = '57, 255, 20'; // #39ff14
        else if (flightStatus === 'ESCAPING') colorStr = '255, 255, 255';
        else {
            if (altKm < (planet.atmosphereHeight * 0.3)) colorStr = '255, 68, 68'; // #ff4444
            else if (altKm < planet.atmosphereHeight) colorStr = '255, 153, 68'; // #ff9944
            else colorStr = '0, 229, 255'; // #00e5ff vacuum
        }
        
        const alpha = Math.max(0, index / total);
        return `rgba(${colorStr}, ${alpha})`;
    }

    // Main Draw Function
    function render(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);

        // Dynamic Camera Zoom
        let maxDist = planet.radius + planet.atmosphereHeight * 1000 + planet.mountainHeight * 1000;
        if(simState !== 'READY' && trail.length > 0) {
            const p = trail[trail.length-1];
            const d = Math.sqrt(p.x*p.x + p.y*p.y);
            maxDist = Math.max(maxDist, d * 1.2); 
            // limit out zoom to not lose the planet entirely unless escaped very far
            if(maxDist > planet.radius * 30) maxDist = planet.radius * 30;
        }
        
        // Base planet scale so planet occupies ~35% of height
        const desiredScale = (height * 0.35) / planet.radius;
        // Account for zoom out if maxDist > radius
        const zoomOut = planet.radius / maxDist;
        
        targetCameraScale = desiredScale * zoomOut * userZoom;
        cameraScale += (targetCameraScale - cameraScale) * 0.05;

        // Center Coordinate System
        ctx.save();
        if (isLocked && simState !== 'READY') {
            ctx.translate(width/2 - pos.x * cameraScale, height/2 - pos.y * cameraScale);
        } else {
            ctx.translate(width/2 + cameraOffsetX, height/2 + cameraOffsetY);
        }

        // Draw Stars (don't scale, just subtle parallax or static)
        ctx.save();
        stars.forEach(s => {
            s.phase += s.speed;
            const alpha = 0.5 + 0.5 * Math.sin(s.phase);
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            ctx.fill();
        });
        ctx.restore();

        ctx.scale(cameraScale, cameraScale);

        // Draw Solar System Map if moderately zoomed out
        if (targetCameraScale < 0.005 && planet.name !== 'Custom') {
            ctx.save();
            let sX = -planet.sunDistance * Math.cos(planet.phase);
            let sY = -planet.sunDistance * Math.sin(planet.phase);
            
            // Draw Sun
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(sX, sY, 696000 * 2, 0, Math.PI*2);
            ctx.fill();

            // Draw other planets
            PLANETS.forEach(p => {
                if(p.name === 'Custom') return;
                
                let px = sX + p.sunDistance * Math.cos(p.phase);
                let py = sY + p.sunDistance * Math.sin(p.phase);
                
                // If it's the current planet, it should be at (0,0) by math, but due to floating point it's extremely close to 0,0
                if (p.name === planet.name) { px = 0; py = 0; }
                
                // Draw Orbit around Sun
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 1 / cameraScale * 0.5;
                ctx.beginPath();
                ctx.arc(sX, sY, p.sunDistance, 0, Math.PI*2);
                ctx.stroke();

                // Draw Planet Dot Scaled
                if (p.name !== planet.name) {
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(px, py, p.radius * 10, 0, Math.PI*2); 
                    ctx.fill();
                    
                    // Display name
                    ctx.fillStyle = "white";
                    ctx.font = `${14 / cameraScale}px Arial`;
                    ctx.fillText(p.name, px + p.radius*15, py);
                }
            });
            ctx.restore();
        }

        // Draw Atmosphere Halo
        if(planet.atmosphereHeight > 0) {
            const atmoGrad = ctx.createRadialGradient(0, 0, planet.radius, 0, 0, planet.radius + planet.atmosphereHeight * 1000);
            const baseCol = planet.atmosphereColor || 'rgba(255,255,255,0)';
            // Parse rgba out to change alpha safely if needed, or just use as is
            atmoGrad.addColorStop(0, baseCol);
            atmoGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = atmoGrad;
            ctx.beginPath();
            ctx.arc(0, 0, planet.radius + planet.atmosphereHeight * 1000, 0, Math.PI*2);
            ctx.fill();
        }

        // Draw Rings for Saturn
        if(planet.name === 'Saturn') {
            ctx.save();
            ctx.rotate(0.3); // tilt
            ctx.beginPath();
            ctx.ellipse(0, 0, planet.radius * 2.2, planet.radius * 0.5, 0, 0, Math.PI * 2);
            ctx.lineWidth = planet.radius * 0.4;
            ctx.strokeStyle = 'rgba(200, 190, 140, 0.6)';
            ctx.stroke();
            
            ctx.beginPath();
            ctx.ellipse(0, 0, planet.radius * 1.6, planet.radius * 0.35, 0, 0, Math.PI * 2);
            ctx.lineWidth = planet.radius * 0.2;
            ctx.strokeStyle = 'rgba(180, 170, 120, 0.8)';
            ctx.stroke();
            ctx.restore();
        }

        // Draw Planet Body
        const rGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, planet.radius);
        // lighten a bit center
        rGrad.addColorStop(0, planet.color);
        rGrad.addColorStop(0.8, planet.color);
        rGrad.addColorStop(1, '#000000');
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.arc(0, 0, planet.radius, 0, Math.PI*2);
        ctx.fill();

        // Specific details
        if(planet.name === 'Jupiter') {
            ctx.save();
            ctx.clip(); // clip to planet circle
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-planet.radius, -planet.radius*0.3, planet.radius*2, planet.radius*0.1);
            ctx.fillRect(-planet.radius, planet.radius*0.1, planet.radius*2, planet.radius*0.15);
            ctx.fillStyle = '#ecb176';
            ctx.fillRect(-planet.radius, -planet.radius*0.6, planet.radius*2, planet.radius*0.2);
            // Great red spot
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#a63c14';
            ctx.beginPath();
            ctx.ellipse(planet.radius*0.3, planet.radius*0.2, planet.radius*0.2, planet.radius*0.1, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        } else if (planet.name === 'Earth') {
            ctx.save();
            ctx.clip();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#228B22'; // some green continents
            ctx.beginPath();
            ctx.arc(-planet.radius*0.2, -planet.radius*0.2, planet.radius*0.5, 0, Math.PI*2);
            ctx.fill();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ffffff'; // some clouds
            ctx.beginPath();
            ctx.arc(planet.radius*0.4, -planet.radius*0.4, planet.radius*0.3, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        // Draw Mountain
        if(planet.mountainHeight > 0) {
            ctx.fillStyle = '#444';
            ctx.beginPath();
            const w = planet.mountainHeight * 1000;
            ctx.moveTo(-w, -planet.radius);
            ctx.lineTo(w, -planet.radius);
            ctx.lineTo(0, -(planet.radius + planet.mountainHeight * 1000));
            ctx.closePath();
            ctx.fill();
        }

        // Projectile Trail
        if(trail.length > 1) {
            for(let i=1; i<trail.length; i++) {
                ctx.beginPath();
                ctx.moveTo(trail[i-1].x, trail[i-1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = getTrailColor(trail[i], i, trail.length);
                const visualWidth = Math.max(1 / cameraScale * 1.5, 2); // keep trail visible when zoomed out
                ctx.lineWidth = visualWidth;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        // Projectile
        if(simState !== 'READY' && trail.length > 0) {
            ctx.save();
            ctx.translate(pos.x, pos.y);
            
            let sScale = 1 / cameraScale;
            let shipLen = Math.max(planet.radius * 0.05, 15 * sScale);
            if(shipLen > 800000) shipLen = 800000;
            
            // Rocket model points along its velocity
            ctx.rotate(Math.atan2(vel.y, vel.x));
            
            // Draw Main Rocket Body
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(shipLen*0.5, 0); // nose
            ctx.lineTo(-shipLen*0.5, shipLen*0.25); // bottom right fin
            ctx.lineTo(-shipLen*0.4, 0); // engine block
            ctx.lineTo(-shipLen*0.5, -shipLen*0.25); // bottom left fin
            ctx.closePath();
            ctx.fill();
            
            // Draw Engine Fire
            if (mainEngineActive || rcsActive) {
                ctx.fillStyle = rcsActive ? '#00e5ff' : '#ffaa00';
                ctx.shadowColor = ctx.fillStyle;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(-shipLen*0.4, shipLen*0.1);
                ctx.lineTo(-shipLen*(0.6 + Math.random()*0.8), 0); // flickering tail
                ctx.lineTo(-shipLen*0.4, -shipLen*0.1);
                ctx.closePath();
                ctx.fill();
                
                // RCS side plumes if steering
                if (isSteeringRight) {
                    ctx.beginPath();
                    ctx.arc(shipLen*0.2, shipLen*0.3, shipLen*0.1, 0, Math.PI*2);
                    ctx.fill();
                } else if (isSteeringLeft) {
                    ctx.beginPath();
                    ctx.arc(shipLen*0.2, -shipLen*0.3, shipLen*0.1, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            ctx.restore();
        } else {
            // Draw dummy at top of mountain
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            let pr = Math.max(planet.radius * 0.02, 3 / cameraScale);
            ctx.arc(0, -(planet.radius + planet.mountainHeight * 1000), pr, 0, Math.PI*2);
            ctx.fill();
        }

        // Particles (Explosions)
        for(let i=particles.length-1; i>=0; i--) {
            let p = particles[i];
            p.x += p.vx * 0.01;
            p.y += p.vy * 0.01;
            p.life -= 0.02;
            if(p.life <= 0) {
                particles.splice(i, 1);
            } else {
                ctx.fillStyle = `rgba(255, 100, 50, ${p.life})`;
                ctx.beginPath();
                let pr = Math.max(planet.radius * 0.005, 1 / cameraScale);
                ctx.arc(p.x, p.y, pr, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    function gameLoop(time) {
        requestAnimationFrame(gameLoop);
        
        const rawDt = (time - lastTime) / 1000;
        lastTime = time;
        if(rawDt > 0.1) return; // avoid huge jumps if tab inactive

        if(!isPaused && simState === 'FLYING') {
            const dtSim = rawDt * timeWarp * 10; // base speed multiplier
            updatePhysics(dtSim);
        }

        updateTelemetry();
        render(ctx, canvas.width, canvas.height);
    }

    // Init
    initUI();
});
