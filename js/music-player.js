// ===== SYSTÈME AUDIO AVANCÉ =====

const MUSIC_CONFIG = {
    volumes: {
        background: 0.3,
        effects: 0.5,
        ui: 0.2
    },
    fadeDuration: 1000,
    crossfadeDuration: 500,
    musicFiles: {
        noel: {
            url: 'assets/music/christmas-magic.mp3',
            title: 'Magie de Noël',
            artist: 'Orchestre de Noël',
            duration: 180
        },
        festive: {
            url: 'assets/music/festive-bells.mp3',
            title: 'Cloches Festives',
            artist: 'Chœur de Noël',
            duration: 150
        },
        jazz: {
            url: 'assets/music/winter-jazz.mp3',
            title: 'Jazz d\'Hiver',
            artist: 'Quartet de Noël',
            duration: 200
        },
        peaceful: {
            url: 'assets/music/peaceful-christmas.mp3',
            title: 'Noël Paisible',
            artist: 'Piano Solo',
            duration: 240
        },
        celebration: {
            url: 'assets/music/christmas-celebration.mp3',
            title: 'Célébration',
            artist: 'Orchestre Symphonique',
            duration: 210
        }
    },
    soundEffects: {
        click: ['click1.mp3', 'click2.mp3', 'click3.mp3'],
        envelope: ['envelope-open.mp3', 'paper-rustle.mp3'],
        snow: ['snow-fall.mp3', 'wind-chime.mp3'],
        sparkle: ['sparkle1.mp3', 'sparkle2.mp3'],
        confetti: ['confetti-pop.mp3', 'celebration.mp3'],
        success: ['success-bell.mp3', 'achievement.mp3'],
        error: ['error-beep.mp3', 'alert.mp3'],
        share: ['share-notification.mp3', 'message-sent.mp3']
    }
};

// ===== ÉTAT DU SYSTÈME AUDIO =====
const audioState = {
    // Contexte audio
    audioContext: null,
    masterGain: null,
    
    // Musique de fond
    backgroundMusic: {
        audio: null,
        source: null,
        gainNode: null,
        isPlaying: false,
        currentTrack: null,
        volume: MUSIC_CONFIG.volumes.background,
        fadeInterval: null
    },
    
    // Effets sonores
    soundEffects: {
        pool: [],
        available: [],
        active: []
    },
    
    // État général
    isInitialized: false,
    isMuted: false,
    isSuspended: true,
    lastInteraction: 0,
    
    // Statistiques
    stats: {
        totalPlayTime: 0,
        tracksPlayed: [],
        effectsPlayed: 0
    }
};

// ===== INITIALISATION =====
function initAudioSystem() {
    try {
        // Créer le contexte audio
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioState.audioContext = new AudioContextClass();
        
        // Créer le gain master
        audioState.masterGain = audioState.audioContext.createGain();
        audioState.masterGain.connect(audioState.audioContext.destination);
        audioState.masterGain.gain.value = 1.0;
        
        // Initialiser la piscine d'effets sonores
        initSoundEffectPool();
        
        // Détecter la première interaction utilisateur
        setupUserInteractionListener();
        
        // Restaurer les préférences utilisateur
        loadAudioPreferences();
        
        audioState.isInitialized = true;
        console.log('🎵 Système audio initialisé');
        
    } catch (error) {
        console.error('❌ Erreur d\'initialisation audio:', error);
        audioState.isInitialized = false;
    }
}

// ===== GESTION DES INTERACTIONS UTILISATEUR =====
function setupUserInteractionListener() {
    const interactions = ['click', 'touchstart', 'keydown'];
    
    interactions.forEach(eventType => {
        document.addEventListener(eventType, () => {
            audioState.lastInteraction = Date.now();
            
            // Réactiver l'audio si suspendu
            if (audioState.isSuspended && audioState.audioContext) {
                resumeAudioContext();
            }
        }, { once: true });
    });
}

function resumeAudioContext() {
    if (audioState.audioContext && audioState.audioContext.state === 'suspended') {
        audioState.audioContext.resume().then(() => {
            audioState.isSuspended = false;
            console.log('🔊 Contexte audio réactivé');
        }).catch(error => {
            console.error('❌ Erreur de réactivation audio:', error);
        });
    }
}

// ===== MUSIQUE DE FOND =====
function playBackgroundMusic(trackName = 'noel') {
    if (!audioState.isInitialized || audioState.isMuted) return;
    
    const trackConfig = MUSIC_CONFIG.musicFiles[trackName];
    if (!trackConfig) {
        console.error('❌ Piste inconnue:', trackName);
        return;
    }
    
    // Arrêter la musique en cours
    stopBackgroundMusic();
    
    // Créer l'élément audio
    const audio = new Audio(trackConfig.url);
    audio.loop = true;
    audio.volume = 0; // Commencer à volume 0 pour fondu d'entrée
    
    // Créer les nœuds audio
    const source = audioState.audioContext.createMediaElementSource(audio);
    const gainNode = audioState.audioContext.createGain();
    
    // Connecter la chaîne audio
    source.connect(gainNode);
    gainNode.connect(audioState.masterGain);
    
    // Mettre à jour l'état
    audioState.backgroundMusic = {
        audio: audio,
        source: source,
        gainNode: gainNode,
        isPlaying: true,
        currentTrack: trackName,
        volume: MUSIC_CONFIG.volumes.background
    };
    
    // Lancer la lecture
    audio.play().then(() => {
        console.log(`🎵 Lecture de "${trackConfig.title}"`);
        
        // Fade in
        fadeInBackgroundMusic();
        
        // Suivre les statistiques
        trackPlayback(trackName);
        
    }).catch(error => {
        console.error('❌ Erreur de lecture:', error);
        audioState.backgroundMusic.isPlaying = false;
    });
    
    // Gérer la fin (théoriquement jamais avec loop=true)
    audio.onended = () => {
        console.log('🎵 Fin de la piste');
        audioState.backgroundMusic.isPlaying = false;
    };
    
    // Gérer les erreurs
    audio.onerror = (error) => {
        console.error('❌ Erreur audio:', error);
        audioState.backgroundMusic.isPlaying = false;
    };
}

function fadeInBackgroundMusic() {
    if (!audioState.backgroundMusic.gainNode) return;
    
    const gainNode = audioState.backgroundMusic.gainNode;
    const audio = audioState.backgroundMusic.audio;
    const targetVolume = audioState.backgroundMusic.volume;
    
    // Définir le volume initial à 0
    gainNode.gain.setValueAtTime(0, audioState.audioContext.currentTime);
    
    // Fade in progressif
    gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        audioState.audioContext.currentTime + (MUSIC_CONFIG.fadeDuration / 1000)
    );
    
    // Ajuster aussi le volume de l'élément HTML5
    let currentTime = 0;
    const fadeStep = 50; // ms
    const totalSteps = MUSIC_CONFIG.fadeDuration / fadeStep;
    const volumeStep = targetVolume / totalSteps;
    
    clearInterval(audioState.backgroundMusic.fadeInterval);
    
    audioState.backgroundMusic.fadeInterval = setInterval(() => {
        currentTime += fadeStep;
        const progress = currentTime / MUSIC_CONFIG.fadeDuration;
        
        if (progress >= 1) {
            audio.volume = targetVolume;
            clearInterval(audioState.backgroundMusic.fadeInterval);
        } else {
            audio.volume = progress * targetVolume;
        }
    }, fadeStep);
}

function fadeOutBackgroundMusic(callback) {
    if (!audioState.backgroundMusic.gainNode || !audioState.backgroundMusic.isPlaying) {
        if (callback) callback();
        return;
    }
    
    const gainNode = audioState.backgroundMusic.gainNode;
    const audio = audioState.backgroundMusic.audio;
    const currentVolume = gainNode.gain.value;
    
    // Fade out progressif
    gainNode.gain.cancelScheduledValues(audioState.audioContext.currentTime);
    gainNode.gain.setValueAtTime(currentVolume, audioState.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
        0,
        audioState.audioContext.currentTime + (MUSIC_CONFIG.fadeDuration / 1000)
    );
    
    // Ajuster aussi le volume de l'élément HTML5
    let currentTime = 0;
    const fadeStep = 50; // ms
    const totalSteps = MUSIC_CONFIG.fadeDuration / fadeStep;
    const volumeStep = audio.volume / totalSteps;
    
    clearInterval(audioState.backgroundMusic.fadeInterval);
    
    audioState.backgroundMusic.fadeInterval = setInterval(() => {
        currentTime += fadeStep;
        const progress = 1 - (currentTime / MUSIC_CONFIG.fadeDuration);
        
        if (progress <= 0) {
            audio.volume = 0;
            clearInterval(audioState.backgroundMusic.fadeInterval);
            stopBackgroundMusic();
            if (callback) callback();
        } else {
            audio.volume = progress * currentVolume;
        }
    }, fadeStep);
}

function stopBackgroundMusic() {
    if (!audioState.backgroundMusic.audio) return;
    
    // Arrêter le fade en cours
    clearInterval(audioState.backgroundMusic.fadeInterval);
    
    // Arrêter la lecture
    audioState.backgroundMusic.audio.pause();
    audioState.backgroundMusic.audio.currentTime = 0;
    
    // Déconnecter les nœuds audio
    if (audioState.backgroundMusic.source) {
        audioState.backgroundMusic.source.disconnect();
    }
    
    // Réinitialiser l'état
    audioState.backgroundMusic = {
        audio: null,
        source: null,
        gainNode: null,
        isPlaying: false,
        currentTrack: null,
        volume: MUSIC_CONFIG.volumes.background,
        fadeInterval: null
    };
    
    console.log('🎵 Musique arrêtée');
}

function toggleBackgroundMusic() {
    if (audioState.backgroundMusic.isPlaying) {
        pauseBackgroundMusic();
    } else {
        const track = audioState.backgroundMusic.currentTrack || 'noel';
        playBackgroundMusic(track);
    }
}

function pauseBackgroundMusic() {
    if (!audioState.backgroundMusic.audio || !audioState.backgroundMusic.isPlaying) return;
    
    audioState.backgroundMusic.audio.pause();
    audioState.backgroundMusic.isPlaying = false;
    console.log('🎵 Musique mise en pause');
}

function setBackgroundMusicVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    audioState.backgroundMusic.volume = clampedVolume;
    
    if (audioState.backgroundMusic.gainNode) {
        audioState.backgroundMusic.gainNode.gain.setValueAtTime(
            clampedVolume,
            audioState.audioContext.currentTime
        );
    }
    
    if (audioState.backgroundMusic.audio) {
        audioState.backgroundMusic.audio.volume = clampedVolume;
    }
    
    saveAudioPreferences();
}

function changeBackgroundMusicTrack(trackName) {
    if (!MUSIC_CONFIG.musicFiles[trackName]) {
        console.error('❌ Piste inconnue:', trackName);
        return;
    }
    
    if (audioState.backgroundMusic.currentTrack === trackName && 
        audioState.backgroundMusic.isPlaying) {
        return; // Déjà en cours de lecture
    }
    
    // Crossfade entre les pistes
    fadeOutBackgroundMusic(() => {
        playBackgroundMusic(trackName);
    });
}

// ===== EFFETS SONORES =====
function initSoundEffectPool() {
    // Créer une piscine de 10 sources audio réutilisables
    for (let i = 0; i < 10; i++) {
        const audio = new Audio();
        audio.preload = 'auto';
        
        audioState.soundEffects.pool.push({
            audio: audio,
            isAvailable: true,
            lastUsed: 0
        });
    }
    
    audioState.soundEffects.available = [...audioState.soundEffects.pool];
}

function playSoundEffect(effectType, options = {}) {
    if (!audioState.isInitialized || audioState.isMuted) return null;
    
    // Vérifier si on a des fichiers pour cet effet
    const effectFiles = MUSIC_CONFIG.soundEffects[effectType];
    if (!effectFiles || effectFiles.length === 0) {
        console.warn(`⚠️ Aucun fichier pour l'effet: ${effectType}`);
        return null;
    }
    
    // Choisir un fichier aléatoire
    const randomFile = effectFiles[Math.floor(Math.random() * effectFiles.length)];
    const effectUrl = `assets/sounds/${randomFile}`;
    
    // Trouver une source audio disponible
    const availableSource = audioState.soundEffects.available.shift();
    
    if (!availableSource) {
        console.warn('⚠️ Aucune source audio disponible');
        return null;
    }
    
    // Marquer comme occupée
    availableSource.isAvailable = false;
    availableSource.lastUsed = Date.now();
    audioState.soundEffects.active.push(availableSource);
    
    // Configurer l'audio
    const audio = availableSource.audio;
    audio.src = effectUrl;
    audio.volume = options.volume || MUSIC_CONFIG.volumes.effects;
    
    // Gérer la fin de lecture
    const onEnded = () => {
        // Retirer des actifs
        const index = audioState.soundEffects.active.indexOf(availableSource);
        if (index > -1) {
            audioState.soundEffects.active.splice(index, 1);
        }
        
        // Remettre dans les disponibles
        availableSource.isAvailable = true;
        audioState.soundEffects.available.push(availableSource);
        
        // Nettoyer les écouteurs
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        
        // Rappel optionnel
        if (options.onEnd) options.onEnd();
    };
    
    const onError = (error) => {
        console.error('❌ Erreur d\'effet sonore:', error);
        onEnded();
    };
    
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    
    // Lancer la lecture
    audio.play().catch(error => {
        console.error('❌ Erreur de lecture d\'effet:', error);
        onEnded();
    });
    
    // Suivre les statistiques
    audioState.stats.effectsPlayed++;
    
    return {
        stop: () => {
            audio.pause();
            audio.currentTime = 0;
            onEnded();
        },
        audio: audio
    };
}

function playUISound(effectType) {
    return playSoundEffect(effectType, {
        volume: MUSIC_CONFIG.volumes.ui
    });
}

// ===== GESTION DU VOLUME =====
function setMasterVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (audioState.masterGain) {
        audioState.masterGain.gain.setValueAtTime(
            clampedVolume,
            audioState.audioContext.currentTime
        );
    }
    
    saveAudioPreferences();
}

function toggleMute() {
    audioState.isMuted = !audioState.isMuted;
    
    if (audioState.masterGain) {
        audioState.masterGain.gain.setValueAtTime(
            audioState.isMuted ? 0 : 1,
            audioState.audioContext.currentTime
        );
    }
    
    // Mettre à jour l'interface
    updateMuteButton();
    saveAudioPreferences();
    
    console.log(audioState.isMuted ? '🔇 Audio muet' : '🔊 Audio activé');
}

function updateMuteButton() {
    const muteButtons = document.querySelectorAll('[data-audio-mute]');
    muteButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = audioState.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
        button.classList.toggle('muted', audioState.isMuted);
    });
}

// ===== PRÉFÉRENCES UTILISATEUR =====
function saveAudioPreferences() {
    const preferences = {
        isMuted: audioState.isMuted,
        musicVolume: audioState.backgroundMusic.volume,
        effectsVolume: MUSIC_CONFIG.volumes.effects,
        lastTrack: audioState.backgroundMusic.currentTrack
    };
    
    localStorage.setItem('noelMagicAudioPrefs', JSON.stringify(preferences));
}

function loadAudioPreferences() {
    try {
        const saved = localStorage.getItem('noelMagicAudioPrefs');
        if (saved) {
            const preferences = JSON.parse(saved);
            
            audioState.isMuted = preferences.isMuted || false;
            audioState.backgroundMusic.volume = preferences.musicVolume || MUSIC_CONFIG.volumes.background;
            MUSIC_CONFIG.volumes.effects = preferences.effectsVolume || MUSIC_CONFIG.volumes.effects;
            
            // Appliquer les préférences
            if (audioState.isMuted) {
                toggleMute(); // Pour appliquer le mute
            }
            
            // Mettre à jour l'interface
            updateMuteButton();
            
            console.log('🎵 Préférences audio chargées');
        }
    } catch (error) {
        console.error('❌ Erreur de chargement des préférences audio:', error);
    }
}

// ===== STATISTIQUES ET SUIVI =====
function trackPlayback(trackName) {
    const trackInfo = MUSIC_CONFIG.musicFiles[trackName];
    if (!trackInfo) return;
    
    const playbackRecord = {
        track: trackName,
        title: trackInfo.title,
        timestamp: Date.now(),
        duration: trackInfo.duration
    };
    
    audioState.stats.tracksPlayed.push(playbackRecord);
    
    // Garder seulement les 50 dernières lectures
    if (audioState.stats.tracksPlayed.length > 50) {
        audioState.stats.tracksPlayed.shift();
    }
    
    // Sauvegarder périodiquement
    if (audioState.stats.tracksPlayed.length % 10 === 0) {
        savePlaybackStats();
    }
}

function savePlaybackStats() {
    try {
        localStorage.setItem('noelMagicPlaybackStats', JSON.stringify(audioState.stats));
    } catch (error) {
        console.error('❌ Erreur de sauvegarde des statistiques:', error);
    }
}

function loadPlaybackStats() {
    try {
        const saved = localStorage.getItem('noelMagicPlaybackStats');
        if (saved) {
            audioState.stats = JSON.parse(saved);
        }
    } catch (error) {
        console.error('❌ Erreur de chargement des statistiques:', error);
    }
}

// ===== GESTION DE LA MÉMOIRE =====
function cleanupAudioResources() {
    // Libérer les sources audio inactives
    const now = Date.now();
    const maxInactiveTime = 5 * 60 * 1000; // 5 minutes
    
    audioState.soundEffects.pool.forEach(source => {
        if (source.isAvailable && (now - source.lastUsed) > maxInactiveTime) {
            // Réinitialiser l'élément audio
            source.audio.src = '';
            source.audio.load();
            
            console.log('🧹 Source audio libérée');
        }
    });
}

// ===== ÉVÉNEMENTS DU SYSTÈME =====
function handleVisibilityChange() {
    if (document.hidden) {
        // Page cachée : pause audio
        if (audioState.backgroundMusic.isPlaying) {
            pauseBackgroundMusic();
        }
        
        // Suspendre le contexte audio
        if (audioState.audioContext && audioState.audioContext.state === 'running') {
            audioState.audioContext.suspend().then(() => {
                audioState.isSuspended = true;
                console.log('⏸️ Contexte audio suspendu');
            });
        }
    } else {
        // Page visible : reprendre si nécessaire
        if (!audioState.isSuspended) {
            resumeAudioContext();
        }
    }
}

function handleBeforeUnload() {
    // Sauvegarder les statistiques
    savePlaybackStats();
    saveAudioPreferences();
    
    // Arrêter toute lecture
    stopBackgroundMusic();
    
    // Fermer le contexte audio
    if (audioState.audioContext) {
        audioState.audioContext.close().then(() => {
            console.log('🔒 Contexte audio fermé');
        });
    }
}

// ===== API PUBLIQUE =====
const AudioSystem = {
    // Initialisation
    init: initAudioSystem,
    
    // Musique de fond
    playMusic: playBackgroundMusic,
    pauseMusic: pauseBackgroundMusic,
    stopMusic: stopBackgroundMusic,
    toggleMusic: toggleBackgroundMusic,
    fadeOutMusic: fadeOutBackgroundMusic,
    changeTrack: changeBackgroundMusicTrack,
    setMusicVolume: setBackgroundMusicVolume,
    
    // Effets sonores
    playEffect: playSoundEffect,
    playUISound: playUISound,
    
    // Contrôles généraux
    setVolume: setMasterVolume,
    toggleMute: toggleMute,
    isMuted: () => audioState.isMuted,
    isPlaying: () => audioState.backgroundMusic.isPlaying,
    
    // Informations
    getCurrentTrack: () => audioState.backgroundMusic.currentTrack,
    getStats: () => ({ ...audioState.stats }),
    
    // Gestion des ressources
    cleanup: cleanupAudioResources
};

// ===== ÉVÉNEMENTS GLOBAUX =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le système audio
    initAudioSystem();
    
    // Configurer les écouteurs d'événements
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Nettoyage périodique
    setInterval(cleanupAudioResources, 60 * 1000); // Toutes les minutes
});

// ===== EXPORT POUR LES TESTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AudioSystem,
        MUSIC_CONFIG,
        audioState
    };
}