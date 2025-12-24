// ===== SYSTÈME D'EFFETS VISUELS AVANCÉS =====

const EFFECTS_CONFIG = {
    snow: {
        count: 150,
        speed: 1,
        size: { min: 2, max: 6 },
        wind: 0.5,
        opacity: { min: 0.3, max: 0.9 }
    },
    sparkle: {
        count: 50,
        duration: { min: 1000, max: 3000 },
        size: { min: 10, max: 20 },
        colors: ['#FFD700', '#FFEC8B', '#FFFACD', '#FFFFFF']
    },
    lights: {
        count: 30,
        colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
        size: 8,
        twinkleSpeed: 2
    },
    fireplace: {
        flameCount: 15,
        colors: ['#FF4500', '#FF8C00', '#FFD700'],
        size: { min: 20, max: 60 },
        flickerSpeed: 0.1
    }
};

// ===== ÉTAT DES EFFETS =====
const effectsState = {
    // Conteneurs
    containers: {
        snow: null,
        sparkle: null,
        lights: null,
        fireplace: null,
        particles: null
    },
    
    // État des effets
    effects: {
        snow: { active: false, elements: [] },
        sparkle: { active: false, elements: [] },
        lights: { active: false, elements: [] },
        fireplace: { active: false, elements: [] },
        confetti: { active: false, elements: [] }
    },
    
    // Animation frames
    animationFrames: {
        snow: null,
        sparkle: null,
        lights: null,
        fireplace: null
    },
    
    // Configuration dynamique
    config: { ...EFFECTS_CONFIG },
    
    // Performances
    performance: {
        lastUpdate: 0,
        fps: 60,
        maxParticles: 500,
        enabled: true
    }
};

// ===== INITIALISATION =====
function initEffectsSystem() {
    // Créer les conteneurs
    createEffectContainers();
    
    // Configurer les performances
    setupPerformanceMonitoring();
    
    // Vérifier la compatibilité
    checkEffectCompatibility();
    
    console.log('✨ Système d\'effets initialisé');
}

function createEffectContainers() {
    const containerIds = ['snowContainer', 'lightsContainer', 'starsContainer', 'effectsContainer'];
    
    containerIds.forEach(id => {
        effectsState.containers[id.replace('Container', '')] = document.getElementById(id);
    });
    
    // Créer un conteneur supplémentaire pour les particules
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particlesContainer';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 4;
    `;
    document.body.appendChild(particlesContainer);
    
    effectsState.containers.particles = particlesContainer;
}

// ===== EFFET NEIGE =====
function initSnowEffect() {
    if (!effectsState.performance.enabled) return;
    
    const container = effectsState.containers.snow;
    if (!container) return;
    
    // Nettoyer la neige existante
    clearSnowEffect();
    
    // Créer les flocons initiaux
    for (let i = 0; i < effectsState.config.snow.count; i++) {
        createSnowflake(true);
    }
    
    // Démarrer l'animation
    effectsState.effects.snow.active = true;
    animateSnow();
    
    console.log('❄️ Effet neige activé');
}

function createSnowflake(isInitial = false) {
    if (!effectsState.containers.snow) return;
    
    const config = effectsState.config.snow;
    const snowflake = document.createElement('div');
    
    // Propriétés aléatoires
    const size = randomBetween(config.size.min, config.size.max);
    const opacity = randomBetween(config.opacity.min, config.opacity.max);
    const speed = randomBetween(config.speed * 0.5, config.speed * 1.5);
    
    // Style
    snowflake.className = 'snowflake';
    snowflake.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        opacity: ${opacity};
        filter: blur(${size > 4 ? 1 : 0}px);
        left: ${isInitial ? Math.random() * 100 : -10}%;
        top: ${isInitial ? Math.random() * 100 : -10}%;
        z-index: 1;
    `;
    
    // Données d'animation
    snowflake.dataset.speed = speed.toString();
    snowflake.dataset.wind = (Math.random() - 0.5) * config.wind;
    snowflake.dataset.spin = (Math.random() - 0.5) * 2;
    
    effectsState.containers.snow.appendChild(snowflake);
    effectsState.effects.snow.elements.push(snowflake);
    
    return snowflake;
}

function animateSnow() {
    if (!effectsState.effects.snow.active) return;
    
    const elements = effectsState.effects.snow.elements;
    const container = effectsState.containers.snow;
    const config = effectsState.config.snow;
    
    // Mettre à jour chaque flocon
    elements.forEach((flake, index) => {
        if (!flake.parentNode) {
            elements.splice(index, 1);
            return;
        }
        
        // Récupérer les données
        const speed = parseFloat(flake.dataset.speed);
        const wind = parseFloat(flake.dataset.wind);
        const spin = parseFloat(flake.dataset.spin);
        
        // Position actuelle
        let left = parseFloat(flake.style.left) || 0;
        let top = parseFloat(flake.style.top) || 0;
        
        // Nouvelle position
        left += wind;
        top += speed;
        
        // Rotation
        const rotation = parseFloat(flake.dataset.rotation || 0) + spin;
        flake.dataset.rotation = rotation.toString();
        
        // Appliquer les transformations
        flake.style.left = `${left}%`;
        flake.style.top = `${top}%`;
        flake.style.transform = `rotate(${rotation}deg)`;
        
        // Réinitialiser si le flocon sort de l'écran
        if (top > 100 || left < -10 || left > 110) {
            // Supprimer l'ancien flocon
            flake.remove();
            elements.splice(index, 1);
            
            // Créer un nouveau flocon en haut
            if (elements.length < config.count * 1.5) {
                createSnowflake();
            }
        }
    });
    
    // Créer de nouveaux flocons si nécessaire
    if (elements.length < config.count) {
        for (let i = elements.length; i < config.count; i++) {
            createSnowflake();
        }
    }
    
    // Continuer l'animation
    effectsState.animationFrames.snow = requestAnimationFrame(animateSnow);
}

function clearSnowEffect() {
    effectsState.effects.snow.active = false;
    
    if (effectsState.animationFrames.snow) {
        cancelAnimationFrame(effectsState.animationFrames.snow);
    }
    
    effectsState.effects.snow.elements.forEach(flake => {
        if (flake.parentNode) flake.remove();
    });
    
    effectsState.effects.snow.elements = [];
}

// ===== EFFET SCINTILLEMENT =====
function initSparkleEffect() {
    if (!effectsState.performance.enabled) return;
    
    const container = effectsState.containers.particles;
    if (!container) return;
    
    clearSparkleEffect();
    
    // Créer des scintillements initiaux
    for (let i = 0; i < effectsState.config.sparkle.count; i++) {
        createSparkle(true);
    }
    
    effectsState.effects.sparkle.active = true;
    animateSparkle();
    
    console.log('✨ Effet scintillement activé');
}

function createSparkle(isInitial = false) {
    if (!effectsState.containers.particles) return;
    
    const config = effectsState.config.sparkle;
    const sparkle = document.createElement('div');
    
    // Propriétés aléatoires
    const size = randomBetween(config.size.min, config.size.max);
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const duration = randomBetween(config.duration.min, config.duration.max);
    const delay = isInitial ? Math.random() * 2000 : 0;
    
    // Position
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    
    // Style
    sparkle.className = 'sparkle-particle';
    sparkle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        left: ${left}%;
        top: ${top}%;
        z-index: 2;
        box-shadow: 0 0 ${size}px ${color};
        transform: scale(0);
    `;
    
    // Animation
    sparkle.animate([
        { 
            opacity: 0,
            transform: 'scale(0) rotate(0deg)',
            offset: 0
        },
        { 
            opacity: 1,
            transform: 'scale(1) rotate(180deg)',
            offset: 0.5
        },
        { 
            opacity: 0,
            transform: 'scale(0) rotate(360deg)',
            offset: 1
        }
    ], {
        duration: duration,
        delay: delay,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)',
        iterations: Infinity
    });
    
    effectsState.containers.particles.appendChild(sparkle);
    effectsState.effects.sparkle.elements.push(sparkle);
    
    // Suppression automatique après un certain temps
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.remove();
            const index = effectsState.effects.sparkle.elements.indexOf(sparkle);
            if (index > -1) {
                effectsState.effects.sparkle.elements.splice(index, 1);
            }
        }
    }, duration * 3);
    
    return sparkle;
}

function animateSparkle() {
    if (!effectsState.effects.sparkle.active) return;
    
    const elements = effectsState.effects.sparkle.elements;
    const config = effectsState.config.sparkle;
    
    // Créer de nouveaux scintillements si nécessaire
    if (elements.length < config.count) {
        const needed = config.count - elements.length;
        for (let i = 0; i < needed; i++) {
            createSparkle();
        }
    }
    
    // Nettoyer les éléments supprimés
    effectsState.effects.sparkle.elements = elements.filter(sparkle => 
        sparkle.parentNode
    );
    
    // Continuer l'animation
    effectsState.animationFrames.sparkle = requestAnimationFrame(animateSparkle);
}

function clearSparkleEffect() {
    effectsState.effects.sparkle.active = false;
    
    if (effectsState.animationFrames.sparkle) {
        cancelAnimationFrame(effectsState.animationFrames.sparkle);
    }
    
    effectsState.effects.sparkle.elements.forEach(sparkle => {
        if (sparkle.parentNode) sparkle.remove();
    });
    
    effectsState.effects.sparkle.elements = [];
}

// ===== GUIRLANDES LUMINEUSES =====
function initLightsEffect() {
    if (!effectsState.performance.enabled) return;
    
    const container = effectsState.containers.lights;
    if (!container) return;
    
    clearLightsEffect();
    
    // Créer des guirlandes
    createChristmasLights();
    
    effectsState.effects.lights.active = true;
    animateLights();
    
    console.log('💡 Guirlandes lumineuses activées');
}

function createChristmasLights() {
    const container = effectsState.containers.lights;
    const config = effectsState.config.lights;
    
    // Créer plusieurs chaînes de guirlandes
    const chains = 3;
    const lightsPerChain = Math.floor(config.count / chains);
    
    for (let chain = 0; chain < chains; chain++) {
        const startY = 10 + chain * 25;
        const amplitude = 20 + chain * 10;
        const frequency = 0.02 + chain * 0.01;
        
        for (let i = 0; i < lightsPerChain; i++) {
            const light = document.createElement('div');
            const x = (i / lightsPerChain) * 100;
            const y = startY + Math.sin(x * frequency) * amplitude;
            
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const delay = Math.random() * config.twinkleSpeed * 1000;
            
            light.className = 'fairy-light';
            light.style.cssText = `
                position: absolute;
                width: ${config.size}px;
                height: ${config.size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                left: ${x}%;
                top: ${y}%;
                z-index: 2;
                box-shadow: 0 0 ${config.size * 2}px ${color};
                opacity: 0.7;
                animation: twinkleLights ${config.twinkleSpeed}s ease-in-out infinite;
                animation-delay: ${delay}ms;
            `;
            
            container.appendChild(light);
            effectsState.effects.lights.elements.push(light);
        }
    }
}

function animateLights() {
    if (!effectsState.effects.lights.active) return;
    
    // Les lumières sont animées via CSS, donc juste vérifier l'état
    effectsState.animationFrames.lights = requestAnimationFrame(animateLights);
}

function clearLightsEffect() {
    effectsState.effects.lights.active = false;
    
    if (effectsState.animationFrames.lights) {
        cancelAnimationFrame(effectsState.animationFrames.lights);
    }
    
    effectsState.effects.lights.elements.forEach(light => {
        if (light.parentNode) light.remove();
    });
    
    effectsState.effects.lights.elements = [];
}

// ===== CHEMINÉE =====
function initFireplaceEffect() {
    if (!effectsState.performance.enabled) return;
    
    const container = effectsState.containers.particles;
    if (!container) return;
    
    clearFireplaceEffect();
    
    // Créer l'effet de cheminée
    createFireplace();
    
    effectsState.effects.fireplace.active = true;
    animateFireplace();
    
    console.log('🔥 Effet cheminée activé');
}

function createFireplace() {
    const container = document.createElement('div');
    container.className = 'fireplace-container';
    container.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 150px;
        pointer-events: none;
        z-index: 3;
    `;
    
    effectsState.containers.particles.appendChild(container);
    effectsState.effects.fireplace.container = container;
    
    // Créer les flammes
    const config = effectsState.config.fireplace;
    
    for (let i = 0; i < config.flameCount; i++) {
        createFlame(container, i);
    }
}

function createFlame(container, index) {
    const config = effectsState.config.fireplace;
    const flame = document.createElement('div');
    
    const size = randomBetween(config.size.min, config.size.max);
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const left = 50 + (Math.random() - 0.5) * 100;
    const bottom = Math.random() * 30;
    
    flame.className = 'flame';
    flame.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size * 1.5}px;
        background: ${color};
        border-radius: 50% 50% 20% 20%;
        left: ${left}px;
        bottom: ${bottom}px;
        filter: blur(5px);
        opacity: ${randomBetween(0.6, 0.9)};
        transform-origin: bottom center;
    `;
    
    // Animation de flamme
    flame.animate([
        { 
            transform: 'scaleY(1) translateY(0)',
            opacity: 0.7
        },
        { 
            transform: 'scaleY(1.2) translateY(-10px)',
            opacity: 0.9
        },
        { 
            transform: 'scaleY(0.9) translateY(5px)',
            opacity: 0.6
        },
        { 
            transform: 'scaleY(1) translateY(0)',
            opacity: 0.7
        }
    ], {
        duration: randomBetween(500, 1500),
        iterations: Infinity,
        easing: 'ease-in-out',
        delay: index * 100
    });
    
    container.appendChild(flame);
    effectsState.effects.fireplace.elements.push(flame);
}

function animateFireplace() {
    if (!effectsState.effects.fireplace.active) return;
    
    // Les flammes sont animées via Web Animations API
    effectsState.animationFrames.fireplace = requestAnimationFrame(animateFireplace);
}

function clearFireplaceEffect() {
    effectsState.effects.fireplace.active = false;
    
    if (effectsState.animationFrames.fireplace) {
        cancelAnimationFrame(effectsState.animationFrames.fireplace);
    }
    
    if (effectsState.effects.fireplace.container) {
        effectsState.effects.fireplace.container.remove();
    }
    
    effectsState.effects.fireplace.elements.forEach(flame => {
        if (flame.parentNode) flame.remove();
    });
    
    effectsState.effects.fireplace.elements = [];
    effectsState.effects.fireplace.container = null;
}

// ===== CONFETTIS =====
function createConfettiBurst(options = {}) {
    if (!effectsState.performance.enabled) return;
    
    const container = effectsState.containers.particles;
    if (!container) return;
    
    const config = {
        count: options.count || 100,
        colors: options.colors || ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
        duration: options.duration || 3000,
        spread: options.spread || 360,
        power: options.power || 1
    };
    
    for (let i = 0; i < config.count; i++) {
        createConfettiPiece(container, config, i);
    }
    
    console.log('🎉 Confettis lancés !');
}

function createConfettiPiece(container, config, index) {
    const piece = document.createElement('div');
    
    // Forme aléatoire
    const isCircle = Math.random() > 0.5;
    const size = randomBetween(5, 12);
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    
    // Position de départ (haut de l'écran)
    const startX = Math.random() * 100;
    const startY = -10;
    
    // Physique
    const angle = (Math.random() * config.spread * Math.PI) / 180;
    const velocity = randomBetween(2, 5) * config.power;
    const rotation = randomBetween(-720, 720);
    const gravity = 0.1;
    const wind = (Math.random() - 0.5) * 0.5;
    
    // Style
    piece.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        pointer-events: none;
        left: ${startX}%;
        top: ${startY}%;
        z-index: 5;
        transform: rotate(0deg);
        opacity: 1;
    `;
    
    container.appendChild(piece);
    
    // Animation manuelle pour plus de contrôle
    let x = startX;
    let y = startY;
    let vx = Math.cos(angle) * velocity + wind;
    let vy = Math.sin(angle) * velocity;
    let rot = 0;
    let time = 0;
    
    const animateConfetti = () => {
        time += 16; // ~60fps
        
        // Physique
        vy += gravity;
        x += vx;
        y += vy;
        rot += rotation / config.duration * 16;
        
        // Appliquer la transformation
        piece.style.left = `${x}%`;
        piece.style.top = `${y}%`;
        piece.style.transform = `rotate(${rot}deg)`;
        
        // Fade out
        if (time > config.duration * 0.7) {
            const opacity = 1 - ((time - config.duration * 0.7) / (config.duration * 0.3));
            piece.style.opacity = opacity.toString();
        }
        
        // Continuer ou terminer
        if (time < config.duration && y < 110) {
            requestAnimationFrame(animateConfetti);
        } else {
            piece.remove();
        }
    };
    
    // Démarrer l'animation
    requestAnimationFrame(animateConfetti);
}

// ===== ÉTOILES FILANTES =====
function createShootingStar() {
    if (!effectsState.performance.enabled) return;
    
    const container = effectsState.containers.particles;
    if (!container) return;
    
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Position de départ (haut gauche)
    const startX = -100;
    const startY = Math.random() * 50;
    
    // Angle et vitesse
    const angle = Math.PI / 4; // 45 degrés
    const distance = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) + 200;
    const duration = randomBetween(2000, 4000);
    
    star.style.cssText = `
        position: fixed;
        width: 2px;
        height: 100px;
        background: linear-gradient(90deg, transparent, white, transparent);
        pointer-events: none;
        z-index: 2;
        left: ${startX}px;
        top: ${startY}%;
        transform: rotate(-45deg);
        opacity: 0;
    `;
    
    container.appendChild(star);
    
    // Animation
    star.animate([
        { 
            transform: 'rotate(-45deg) translateX(0) translateY(0)',
            opacity: 0
        },
        { 
            transform: `rotate(-45deg) translateX(${Math.cos(angle) * distance}px) translateY(${Math.sin(angle) * distance}px)`,
            opacity: 1
        },
        { 
            opacity: 0
        }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    // Suppression après l'animation
    setTimeout(() => {
        if (star.parentNode) star.remove();
    }, duration);
    
    // Programmer la prochaine étoile filante
    const nextDelay = randomBetween(5000, 15000);
    setTimeout(createShootingStar, nextDelay);
}

// ===== GESTION DES PERFORMANCES =====
function setupPerformanceMonitoring() {
    // Vérifier les capacités de l'appareil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                     (navigator.deviceMemory || 4) <= 4;
    
    // Ajuster les paramètres selon l'appareil
    if (isMobile || isLowEnd) {
        effectsState.config.snow.count = Math.floor(effectsState.config.snow.count * 0.5);
        effectsState.config.sparkle.count = Math.floor(effectsState.config.sparkle.count * 0.5);
        effectsState.config.lights.count = Math.floor(effectsState.config.lights.count * 0.5);
        effectsState.performance.maxParticles = 200;
        
        console.log('📱 Mode optimisé pour appareil mobile');
    }
    
    // Surveiller les FPS
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            effectsState.performance.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Ajuster dynamiquement les effets si les FPS sont bas
            if (effectsState.performance.fps < 30) {
                reduceEffectQuality();
            } else if (effectsState.performance.fps > 50) {
                restoreEffectQuality();
            }
        }
        
        requestAnimationFrame(monitorFPS);
    };
    
    monitorFPS();
}

function reduceEffectQuality() {
    if (!effectsState.performance.enabled) return;
    
    // Réduire le nombre de particules
    effectsState.config.snow.count = Math.max(50, Math.floor(effectsState.config.snow.count * 0.7));
    effectsState.config.sparkle.count = Math.max(20, Math.floor(effectsState.config.sparkle.count * 0.7));
    
    // Supprimer des éléments si nécessaire
    while (effectsState.effects.snow.elements.length > effectsState.config.snow.count) {
        const flake = effectsState.effects.snow.elements.pop();
        if (flake && flake.parentNode) flake.remove();
    }
    
    console.log('⚡ Réduction des effets pour performance');
}

function restoreEffectQuality() {
    if (!effectsState.performance.enabled) return;
    
    // Restaurer les paramètres d'origine progressivement
    effectsState.config.snow.count = Math.min(
        EFFECTS_CONFIG.snow.count,
        Math.floor(effectsState.config.snow.count * 1.1)
    );
    
    effectsState.config.sparkle.count = Math.min(
        EFFECTS_CONFIG.sparkle.count,
        Math.floor(effectsState.config.sparkle.count * 1.1)
    );
}

function checkEffectCompatibility() {
    // Vérifier la compatibilité Web Animations API
    if (!document.documentElement.animate) {
        console.warn('⚠️ Web Animations API non supportée, certains effets seront limités');
        effectsState.performance.enabled = false;
    }
    
    // Vérifier les performances
    if (typeof requestAnimationFrame !== 'function') {
        console.error('❌ requestAnimationFrame non supporté');
        effectsState.performance.enabled = false;
    }
}

// ===== GESTION DES RESSOURCES =====
function cleanupEffects() {
    // Nettoyer les éléments orphelins
    Object.keys(effectsState.effects).forEach(effectName => {
        const effect = effectsState.effects[effectName];
        effect.elements = effect.elements.filter(element => 
            element.parentNode
        );
    });
    
    // Limiter le nombre total de particules
    const totalParticles = Object.values(effectsState.effects)
        .reduce((total, effect) => total + effect.elements.length, 0);
    
    if (totalParticles > effectsState.performance.maxParticles) {
        reduceEffectQuality();
    }
}

// ===== CONTROLES D'EFFETS =====
function toggleEffect(effectName) {
    const effect = effectsState.effects[effectName];
    
    if (!effect) {
        console.error(`❌ Effet inconnu: ${effectName}`);
        return;
    }
    
    if (effect.active) {
        stopEffect(effectName);
    } else {
        startEffect(effectName);
    }
}

function startEffect(effectName) {
    switch (effectName) {
        case 'snow':
            initSnowEffect();
            break;
        case 'sparkle':
            initSparkleEffect();
            break;
        case 'lights':
            initLightsEffect();
            break;
        case 'fireplace':
            initFireplaceEffect();
            break;
        default:
            console.error(`❌ Impossible de démarrer l'effet: ${effectName}`);
    }
}

function stopEffect(effectName) {
    switch (effectName) {
        case 'snow':
            clearSnowEffect();
            break;
        case 'sparkle':
            clearSparkleEffect();
            break;
        case 'lights':
            clearLightsEffect();
            break;
        case 'fireplace':
            clearFireplaceEffect();
            break;
        default:
            console.error(`❌ Impossible d'arrêter l'effet: ${effectName}`);
    }
}

function stopAllEffects() {
    Object.keys(effectsState.effects).forEach(effectName => {
        stopEffect(effectName);
    });
    
    console.log('🛑 Tous les effets arrêtés');
}

// ===== FONCTIONS UTILITAIRES =====
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function getEffectCount(effectName) {
    const effect = effectsState.effects[effectName];
    return effect ? effect.elements.length : 0;
}

function getTotalParticles() {
    return Object.values(effectsState.effects)
        .reduce((total, effect) => total + effect.elements.length, 0);
}

// ===== ÉVÉNEMENTS GLOBAUX =====
window.addEventListener('resize', () => {
    // Réajuster les effets sur le redimensionnement
    Object.keys(effectsState.effects).forEach(effectName => {
        if (effectsState.effects[effectName].active) {
            stopEffect(effectName);
            startEffect(effectName);
        }
    });
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause des animations intensives
        effectsState.performance.enabled = false;
        stopAllEffects();
    } else {
        // Reprise des animations
        effectsState.performance.enabled = true;
        Object.keys(effectsState.effects).forEach(effectName => {
            if (effectsState.effects[effectName].wasActive) {
                startEffect(effectName);
            }
        });
    }
});

// ===== API PUBLIQUE =====
const EffectsSystem = {
    // Initialisation
    init: initEffectsSystem,
    
    // Contrôles d'effets
    startSnow: initSnowEffect,
    stopSnow: clearSnowEffect,
    startSparkle: initSparkleEffect,
    stopSparkle: clearSparkleEffect,
    startLights: initLightsEffect,
    stopLights: clearLightsEffect,
    startFireplace: initFireplaceEffect,
    stopFireplace: clearFireplaceEffect,
    
    // Effets ponctuels
    createConfetti: createConfettiBurst,
    createShootingStar: createShootingStar,
    
    // Contrôles généraux
    toggleEffect: toggleEffect,
    stopAll: stopAllEffects,
    cleanup: cleanupEffects,
    
    // Informations
    getStats: () => ({
        fps: effectsState.performance.fps,
        totalParticles: getTotalParticles(),
        effects: Object.keys(effectsState.effects).reduce((obj, name) => {
            obj[name] = {
                active: effectsState.effects[name].active,
                count: effectsState.effects[name].elements.length
            };
            return obj;
        }, {})
    }),
    
    // Configuration
    updateConfig: (newConfig) => {
        Object.assign(effectsState.config, newConfig);
    },
    
    // Performances
    setEnabled: (enabled) => {
        effectsState.performance.enabled = enabled;
        if (!enabled) stopAllEffects();
    }
};

// ===== INITIALISATION AUTOMATIQUE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le système d'effets
    initEffectsSystem();
    
    // Démarrer les étoiles filantes (aléatoire)
    setTimeout(() => {
        if (effectsState.performance.enabled) {
            createShootingStar();
        }
    }, randomBetween(2000, 8000));
    
    // Nettoyage périodique
    setInterval(cleanupEffects, 30000); // Toutes les 30 secondes
});

// ===== EXPORT POUR LES TESTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EffectsSystem,
        EFFECTS_CONFIG,
        effectsState
    };
}