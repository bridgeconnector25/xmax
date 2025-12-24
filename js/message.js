// ===== CONFIGURATION =====
const MESSAGE_CONFIG = {
    loadingSteps: [
        "Préparation de la magie...",
        "Allumage des guirlandes ✨",
        "Gonflage des bonhommes de neige ⛄",
        "Accrochage des boules de Noël 🎄",
        "Chargement des sourires 😊",
        "Presque prêt...",
        "Magie activée ! 🎉"
    ],
    loadingDuration: 3000,
    envelopeOpenDuration: 1500,
    messageRevealDuration: 2000,
    autoPlayMusic: true,
    defaultEffects: ['snow', 'sparkle', 'lights'],
    maxViewCount: 999,
    shareUrlBase: window.location.origin + window.location.pathname
};

// ===== ÉTAT DE L'APPLICATION =====
const messageState = {
    // Données du message
    senderName: '',
    recipientName: '',
    occasion: 'noel',
    tone: 'joyeux',
    theme: 'classic',
    message: '',
    musicEnabled: true,
    selectedEffects: [],
    timestamp: Date.now(),
    
    // État de l'interface
    isLoading: true,
    isIntroVisible: true,
    isEnvelopeOpen: false,
    isMessageRevealed: false,
    isMusicPlaying: false,
    areEffectsEnabled: true,
    
    // Statistiques
    viewCount: 1,
    shareCount: 0,
    timeSpent: 0,
    
    // Éléments DOM
    elements: {}
};

// ===== INITIALISATION =====
function initMessageApp() {
    // Initialiser les références aux éléments DOM
    initDOMElements();
    
    // Charger et analyser les paramètres URL
    loadURLParameters();
    
    // Démarrer le processus de chargement
    startLoadingSequence();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Initialiser les statistiques
    initStatistics();
    
    console.log('🎁 Application de message initialisée');
}

// ===== INITIALISATION DES ÉLÉMENTS DOM =====
function initDOMElements() {
    messageState.elements = {
        // Écran de chargement
        loadingScreen: document.getElementById('loadingScreen'),
        loadingProgress: document.getElementById('loadingProgress'),
        loadingText: document.getElementById('loadingText'),
        
        // Introduction
        introOverlay: document.getElementById('introOverlay'),
        introFrom: document.getElementById('introFrom'),
        introOccasion: document.getElementById('introOccasion'),
        revealBtn: document.getElementById('revealBtn'),
        
        // Scène principale
        magicScene: document.getElementById('magicScene'),
        smallCountdown: document.getElementById('smallCountdown'),
        countdownDisplay: document.getElementById('countdownDisplay'),
        
        // Contrôles
        musicToggleBtn: document.getElementById('musicToggleBtn'),
        effectsToggleBtn: document.getElementById('effectsToggleBtn'),
        
        // Enveloppe
        envelopeContainer: document.getElementById('envelopeContainer'),
        envelopeTo: document.getElementById('envelopeTo'),
        envelopeFrom: document.getElementById('envelopeFrom'),
        openEnvelopeBtn: document.getElementById('openEnvelopeBtn'),
        
        // Contenu du message
        messageContent: document.getElementById('messageContent'),
        occasionBadge: document.getElementById('occasionBadge'),
        greetingText: document.getElementById('greetingText'),
        recipientName: document.getElementById('recipientName'),
        illustrationContainer: document.getElementById('illustrationContainer'),
        messageText: document.getElementById('messageText'),
        senderName: document.getElementById('senderName'),
        messageDate: document.getElementById('messageDate'),
        messageTime: document.getElementById('messageTime'),
        
        // Effets interactifs
        snowEffectBtn: document.getElementById('snowEffectBtn'),
        sparkleEffectBtn: document.getElementById('sparkleEffectBtn'),
        confettiEffectBtn: document.getElementById('confettiEffectBtn'),
        
        // Actions de partage
        messageActions: document.getElementById('messageActions'),
        shareWhatsAppBtn: document.getElementById('shareWhatsAppBtn'),
        shareFacebookBtn: document.getElementById('shareFacebookBtn'),
        shareTwitterBtn: document.getElementById('shareTwitterBtn'),
        shareCopyBtn: document.getElementById('shareCopyBtn'),
        
        // Statistiques
        viewCount: document.getElementById('viewCount'),
        shareCount: document.getElementById('shareCount'),
        
        // Audio
        backgroundMusic: document.getElementById('backgroundMusic'),
        soundEffects: document.getElementById('soundEffects'),
        
        // Modales
        shareModal: document.getElementById('shareModal'),
        closeShareModal: document.getElementById('closeShareModal')
    };
}

// ===== CHARGEMENT DES PARAMÈTRES URL =====
function loadURLParameters() {
    try {
        const params = new URLSearchParams(window.location.search);
        
        // Données obligatoires
        messageState.senderName = decodeURIComponent(params.get('from') || 'Un ami');
        messageState.recipientName = decodeURIComponent(params.get('to') || 'Mon ami(e)');
        messageState.message = decodeURIComponent(params.get('msg') || '');
        
        // Données optionnelles
        messageState.occasion = params.get('event') || 'noel';
        messageState.tone = params.get('tone') || 'joyeux';
        messageState.theme = params.get('theme') || 'classic';
        messageState.musicEnabled = params.get('musicOn') === '1';
        messageState.selectedEffects = (params.get('effects') || 'snow,sparkle,lights').split(',');
        
        // Timestamp pour éviter le cache
        messageState.timestamp = parseInt(params.get('t')) || Date.now();
        
        console.log('📨 Message chargé depuis URL:', {
            sender: messageState.senderName,
            recipient: messageState.recipientName,
            occasion: messageState.occasion,
            messageLength: messageState.message.length
        });
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des paramètres URL:', error);
        
        // Valeurs par défaut en cas d'erreur
        messageState.senderName = 'Un ami';
        messageState.recipientName = 'Toi';
        messageState.message = 'Quelqu\'un voulait te souhaiter un joyeux Noël mais le message s\'est perdu dans les flocons de neige ! ❄️ Joyeuses fêtes quand même ! 🎄';
        messageState.occasion = 'noel';
        messageState.tone = 'joyeux';
    }
}

// ===== SÉQUENCE DE CHARGEMENT =====
function startLoadingSequence() {
    let currentStep = 0;
    const totalSteps = MESSAGE_CONFIG.loadingSteps.length;
    const stepDuration = MESSAGE_CONFIG.loadingDuration / totalSteps;
    
    // Mettre à jour la barre de progression
    const updateProgress = () => {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        messageState.elements.loadingProgress.style.width = `${progress}%`;
        messageState.elements.loadingText.textContent = MESSAGE_CONFIG.loadingSteps[currentStep];
        
        currentStep++;
        
        if (currentStep < totalSteps) {
            setTimeout(updateProgress, stepDuration);
        } else {
            // Chargement terminé
            setTimeout(() => {
                messageState.isLoading = false;
                messageState.elements.loadingScreen.style.opacity = '0';
                
                setTimeout(() => {
                    messageState.elements.loadingScreen.style.display = 'none';
                    showIntroScreen();
                }, 500);
            }, 500);
        }
    };
    
    // Démarrer la progression
    updateProgress();
}

// ===== AFFICHAGE DE L'INTRODUCTION =====
function showIntroScreen() {
    // Mettre à jour les informations d'introduction
    messageState.elements.introFrom.textContent = messageState.senderName;
    messageState.elements.introOccasion.textContent = getOccasionName(messageState.occasion);
    
    // Mettre à jour l'enveloppe
    messageState.elements.envelopeTo.textContent = messageState.recipientName;
    messageState.elements.envelopeFrom.textContent = messageState.senderName;
    
    // Afficher l'introduction
    messageState.elements.introOverlay.style.display = 'flex';
    setTimeout(() => {
        messageState.elements.introOverlay.classList.add('visible');
    }, 100);
    
    // Démarrer le suivi du temps
    startTimeTracking();
}

// ===== OUVRIR L'ENVELOPPE =====
function openEnvelope() {
    if (messageState.isEnvelopeOpen) return;
    
    messageState.isEnvelopeOpen = true;
    
    // Désactiver le bouton
    messageState.elements.openEnvelopeBtn.disabled = true;
    messageState.elements.openEnvelopeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ouverture...';
    
    // Animation d'ouverture
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('opening');
    
    // Effet sonore
    playSoundEffect('envelope-open');
    
    // Attendre la fin de l'animation
    setTimeout(() => {
        // Cacher l'enveloppe
        messageState.elements.envelopeContainer.style.opacity = '0';
        messageState.elements.envelopeContainer.style.transform = 'scale(0.8)';
        
        // Révéler le message après un délai
        setTimeout(() => {
            messageState.elements.envelopeContainer.style.display = 'none';
            revealMessage();
        }, 500);
        
    }, MESSAGE_CONFIG.envelopeOpenDuration);
}

// ===== RÉVÉLER LE MESSAGE =====
function revealMessage() {
    messageState.isMessageRevealed = true;
    
    // Afficher le contenu du message
    messageState.elements.messageContent.classList.remove('hidden');
    messageState.elements.messageContent.style.display = 'block';
    
    // Animation d'entrée
    setTimeout(() => {
        messageState.elements.messageContent.classList.add('visible');
        messageState.elements.messageContent.style.opacity = '1';
        messageState.elements.messageContent.style.transform = 'translateY(0)';
        
        // Mettre à jour le contenu
        updateMessageContent();
        
        // Afficher les actions après un délai
        setTimeout(() => {
            showMessageActions();
        }, 1000);
        
        // Démarrer la musique si activée
        if (messageState.musicEnabled && MESSAGE_CONFIG.autoPlayMusic) {
            playBackgroundMusic();
        }
        
        // Activer les effets
        activateMessageEffects();
        
        // Incrémenter le compteur de vues
        incrementViewCount();
        
    }, 100);
}

// ===== METTRE À JOUR LE CONTENU DU MESSAGE =====
function updateMessageContent() {
    // Mettre à jour le badge d'occasion
    updateOccasionBadge();
    
    // Mettre à jour la salutation
    updateGreeting();
    
    // Mettre à jour le nom du destinataire
    messageState.elements.recipientName.textContent = messageState.recipientName + ' !';
    
    // Mettre à jour le message
    messageState.elements.messageText.innerHTML = formatMessageText(messageState.message);
    
    // Mettre à jour le nom de l'expéditeur
    messageState.elements.senderName.textContent = messageState.senderName;
    
    // Mettre à jour la date et l'heure
    updateDateTime();
    
    // Générer l'illustration
    generateIllustration();
    
    // Appliquer le thème
    applyMessageTheme();
}

// ===== METTRE À JOUR LE BADGE D'OCCASION =====
function updateOccasionBadge() {
    const badge = messageState.elements.occasionBadge;
    const occasion = messageState.occasion;
    
    const icons = {
        noel: 'fa-tree',
        anniversaire: 'fa-birthday-cake',
        nouvel_an: 'fa-glass-cheers',
        saint_valentin: 'fa-heart'
    };
    
    const colors = {
        noel: 'var(--christmas-green)',
        anniversaire: 'var(--christmas-gold)',
        nouvel_an: 'var(--christmas-blue)',
        saint_valentin: 'var(--christmas-red)'
    };
    
    const names = {
        noel: 'Noël',
        anniversaire: 'Anniversaire',
        nouvel_an: 'Nouvel An',
        saint_valentin: 'Saint-Valentin'
    };
    
    // Mettre à jour l'icône
    const iconElement = badge.querySelector('i');
    iconElement.className = `fas ${icons[occasion] || 'fa-gift'}`;
    
    // Mettre à jour le texte
    const textElement = badge.querySelector('span');
    textElement.textContent = names[occasion] || 'Fête';
    
    // Mettre à jour la couleur
    badge.style.backgroundColor = colors[occasion] || 'var(--christmas-gold)';
}

// ===== METTRE À JOUR LA SALUTATION =====
function updateGreeting() {
    const greetings = {
        noel: {
            joyeux: 'Joyeux Noël',
            amour: 'Mon amour à Noël',
            amitie: 'Joyeux Noël mon ami',
            spirituel: 'Paix de Noël'
        },
        anniversaire: {
            joyeux: 'Joyeux anniversaire',
            amour: 'Mon cœur pour ton anniversaire',
            amitie: 'Bon anniversaire',
            spirituel: 'Bénédictions d\'anniversaire'
        },
        nouvel_an: {
            joyeux: 'Bonne année',
            amour: 'Mon amour en cette nouvelle année',
            amitie: 'Bonne année mon ami',
            spirituel: 'Nouvelle année de lumière'
        },
        saint_valentin: {
            joyeux: 'Joyeuse Saint-Valentin',
            amour: 'Mon amour pour la Saint-Valentin',
            amitie: 'Bonne Saint-Valentin',
            spirituel: 'Amour de Saint-Valentin'
        }
    };
    
    const greeting = greetings[messageState.occasion]?.[messageState.tone] || 'Salutations';
    messageState.elements.greetingText.textContent = greeting;
}

// ===== FORMATER LE TEXTE DU MESSAGE =====
function formatMessageText(text) {
    if (!text) return '<p class="empty-message">Le message est vide... mais l\'intention est pleine d\'amour ! ❤️</p>';
    
    // Convertir les sauts de ligne en paragraphes
    let formattedText = text
        .split('\n\n')
        .map(paragraph => {
            if (paragraph.trim()) {
                return `<p>${formatParagraph(paragraph)}</p>`;
            }
            return '';
        })
        .join('');
    
    // Si aucun paragraphe n'a été créé, utiliser des sauts de ligne simples
    if (!formattedText.includes('<p>')) {
        formattedText = text
            .split('\n')
            .map(line => line.trim() ? `<p>${formatParagraph(line)}</p>` : '')
            .join('');
    }
    
    return formattedText;
}

function formatParagraph(paragraph) {
    // Mettre en forme les émojis et le texte
    return paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **gras**
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italique*
        .replace(/_(.*?)_/g, '<u>$1</u>') // _souligné_
        .replace(/`(.*?)`/g, '<code>$1</code>') // `code`
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>') // Liens
        .replace(/:\)/g, '😊') // Smileys
        .replace(/:\(/g, '😢')
        .replace(/:D/g, '😄')
        .replace(/<3/g, '❤️')
        .replace(/:heart:/g, '❤️')
        .replace(/:star:/g, '⭐')
        .replace(/:tree:/g, '🎄')
        .replace(/:gift:/g, '🎁');
}

// ===== METTRE À JOUR LA DATE ET L'HEURE =====
function updateDateTime() {
    const now = new Date(messageState.timestamp);
    
    // Formater la date
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageState.elements.messageDate.textContent = dateFormatter.format(now);
    messageState.elements.messageTime.textContent = timeFormatter.format(now);
}

// ===== GÉNÉRER L'ILLUSTRATION =====
function generateIllustration() {
    const container = messageState.elements.illustrationContainer;
    const occasion = messageState.occasion;
    const tone = messageState.tone;
    
    // Nettoyer le conteneur
    container.innerHTML = '';
    
    // Créer l'illustration selon l'occasion et le ton
    const illustration = createIllustrationForOccasion(occasion, tone);
    container.appendChild(illustration);
    
    // Animation d'entrée
    setTimeout(() => {
        illustration.classList.add('animate-in');
    }, 300);
}

function createIllustrationForOccasion(occasion, tone) {
    const illustration = document.createElement('div');
    illustration.className = `illustration ${occasion} ${tone}`;
    
    switch (occasion) {
        case 'noel':
            illustration.innerHTML = createChristmasIllustration(tone);
            break;
        case 'anniversaire':
            illustration.innerHTML = createBirthdayIllustration(tone);
            break;
        case 'nouvel_an':
            illustration.innerHTML = createNewYearIllustration(tone);
            break;
        case 'saint_valentin':
            illustration.innerHTML = createValentineIllustration(tone);
            break;
        default:
            illustration.innerHTML = createDefaultIllustration();
    }
    
    return illustration;
}

function createChristmasIllustration(tone) {
    const isRomantic = tone === 'amour';
    const isSpiritual = tone === 'spirituel';
    
    if (isRomantic) {
        return `
            <div class="illustration-hearts">
                <i class="fas fa-heart"></i>
                <i class="fas fa-heart"></i>
                <i class="fas fa-heart"></i>
            </div>
            <div class="illustration-couple">
                <div class="person"></div>
                <div class="person"></div>
            </div>
            <div class="illustration-snowflakes">
                <i class="fas fa-snowflake"></i>
                <i class="fas fa-snowflake"></i>
            </div>
        `;
    } else if (isSpiritual) {
        return `
            <div class="illustration-star">
                <i class="fas fa-star"></i>
            </div>
            <div class="illustration-light">
                <div class="light-beam"></div>
                <div class="light-beam"></div>
                <div class="light-beam"></div>
            </div>
        `;
    } else {
        return `
            <div class="illustration-tree">
                <i class="fas fa-tree"></i>
            </div>
            <div class="illustration-gifts">
                <div class="gift"></div>
                <div class="gift"></div>
                <div class="gift"></div>
            </div>
            <div class="illustration-snow">
                <div class="snow-pile"></div>
            </div>
        `;
    }
}

function createBirthdayIllustration(tone) {
    return `
        <div class="illustration-cake">
            <div class="cake-layer"></div>
            <div class="cake-layer"></div>
            <div class="cake-candles">
                <div class="candle"></div>
                <div class="candle"></div>
                <div class="candle"></div>
            </div>
        </div>
        <div class="illustration-balloons">
            <div class="balloon"></div>
            <div class="balloon"></div>
            <div class="balloon"></div>
        </div>
    `;
}

function createDefaultIllustration() {
    return `
        <div class="illustration-gift">
            <i class="fas fa-gift"></i>
        </div>
        <div class="illustration-sparkles">
            <i class="fas fa-sparkles"></i>
            <i class="fas fa-sparkles"></i>
            <i class="fas fa-sparkles"></i>
        </div>
    `;
}

// ===== APPLIQUER LE THÈME DU MESSAGE =====
function applyMessageTheme() {
    const theme = messageState.theme;
    const body = document.body;
    
    const themes = {
        classic: 'var(--classic-bg)',
        elegant: 'var(--elegant-bg)',
        modern: 'var(--modern-bg)',
        colorful: 'var(--colorful-bg)'
    };
    
    if (themes[theme]) {
        body.style.background = themes[theme];
    }
    
    // Appliquer également au conteneur de message
    const messageCard = document.querySelector('.message-card');
    if (messageCard) {
        messageCard.dataset.theme = theme;
    }
}

// ===== AFFICHER LES ACTIONS DU MESSAGE =====
function showMessageActions() {
    messageState.elements.messageActions.classList.remove('hidden');
    messageState.elements.messageActions.style.display = 'block';
    
    setTimeout(() => {
        messageState.elements.messageActions.classList.add('visible');
        messageState.elements.messageActions.style.opacity = '1';
        messageState.elements.messageActions.style.transform = 'translateY(0)';
    }, 100);
}

// ===== ACTIVER LES EFFETS DU MESSAGE =====
function activateMessageEffects() {
    if (!messageState.areEffectsEnabled) return;
    
    // Activer les effets sélectionnés
    messageState.selectedEffects.forEach(effect => {
        activateEffect(effect);
    });
    
    // Démarrer les effets d'arrière-plan
    initBackgroundEffects();
}

function activateEffect(effect) {
    switch (effect) {
        case 'snow':
            startSnowEffect();
            break;
        case 'sparkle':
            startSparkleEffect();
            break;
        case 'lights':
            startLightsEffect();
            break;
        case 'fireplace':
            startFireplaceEffect();
            break;
    }
}

// ===== INITIALISER LES ÉCOUTEURS D'ÉVÉNEMENTS =====
function initEventListeners() {
    // Bouton de révélation
    messageState.elements.revealBtn.addEventListener('click', () => {
        hideIntroScreen();
        showEnvelope();
    });
    
    // Bouton d'ouverture d'enveloppe
    messageState.elements.openEnvelopeBtn.addEventListener('click', openEnvelope);
    
    // Contrôles de musique
    messageState.elements.musicToggleBtn.addEventListener('click', toggleMusic);
    
    // Contrôles d'effets
    messageState.elements.effectsToggleBtn.addEventListener('click', toggleEffects);
    
    // Boutons d'effets interactifs
    messageState.elements.snowEffectBtn.addEventListener('click', () => {
        triggerSnowStorm();
        playSoundEffect('snow');
    });
    
    messageState.elements.sparkleEffectBtn.addEventListener('click', () => {
        triggerSparkleBurst();
        playSoundEffect('sparkle');
    });
    
    messageState.elements.confettiEffectBtn.addEventListener('click', () => {
        triggerConfetti();
        playSoundEffect('confetti');
    });
    
    // Boutons de partage
    messageState.elements.shareWhatsAppBtn.addEventListener('click', shareOnWhatsApp);
    messageState.elements.shareFacebookBtn.addEventListener('click', shareOnFacebook);
    messageState.elements.shareTwitterBtn.addEventListener('click', shareOnTwitter);
    messageState.elements.shareCopyBtn.addEventListener('click', copyShareLink);
    
    // Fermeture de la modale de partage
    messageState.elements.closeShareModal.addEventListener('click', () => {
        messageState.elements.shareModal.classList.remove('active');
    });
    
    // Clic en dehors de la modale pour fermer
    messageState.elements.shareModal.addEventListener('click', (e) => {
        if (e.target === messageState.elements.shareModal) {
            messageState.elements.shareModal.classList.remove('active');
        }
    });
    
    // Suivi de la visibilité de la page
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Prévenir la fermeture pendant le chargement
    window.addEventListener('beforeunload', handleBeforeUnload);
}

// ===== CACHER L'ÉCRAN D'INTRODUCTION =====
function hideIntroScreen() {
    messageState.isIntroVisible = false;
    
    messageState.elements.introOverlay.classList.remove('visible');
    messageState.elements.introOverlay.style.opacity = '0';
    
    setTimeout(() => {
        messageState.elements.introOverlay.style.display = 'none';
    }, 500);
}

// ===== AFFICHER L'ENVELOPPE =====
function showEnvelope() {
    messageState.elements.envelopeContainer.style.display = 'block';
    
    setTimeout(() => {
        messageState.elements.envelopeContainer.style.opacity = '1';
        messageState.elements.envelopeContainer.style.transform = 'scale(1)';
    }, 100);
}

// ===== BASculer LA MUSIQUE =====
function toggleMusic() {
    messageState.isMusicPlaying = !messageState.isMusicPlaying;
    
    if (messageState.isMusicPlaying) {
        playBackgroundMusic();
        messageState.elements.musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        messageState.elements.musicToggleBtn.classList.add('active');
    } else {
        pauseBackgroundMusic();
        messageState.elements.musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        messageState.elements.musicToggleBtn.classList.remove('active');
    }
    
    playSoundEffect('toggle');
}

// ===== BASculer LES EFFETS =====
function toggleEffects() {
    messageState.areEffectsEnabled = !messageState.areEffectsEnabled;
    
    if (messageState.areEffectsEnabled) {
        activateMessageEffects();
        messageState.elements.effectsToggleBtn.innerHTML = '<i class="fas fa-magic"></i>';
        messageState.elements.effectsToggleBtn.classList.add('active');
    } else {
        clearAllEffects();
        messageState.elements.effectsToggleBtn.innerHTML = '<i class="fas fa-ban"></i>';
        messageState.elements.effectsToggleBtn.classList.remove('active');
    }
    
    playSoundEffect('toggle');
}

// ===== JOUER DE LA MUSIQUE DE FOND =====
function playBackgroundMusic() {
    const music = messageState.elements.backgroundMusic;
    
    if (music && messageState.musicEnabled) {
        music.volume = 0.3;
        music.play().catch(error => {
            console.log('Lecture automatique bloquée:', error);
            // Afficher un bouton de lecture manuelle
            showMusicPlayButton();
        });
    }
}

function showMusicPlayButton() {
    const playButton = document.createElement('button');
    playButton.className = 'music-play-btn';
    playButton.innerHTML = '<i class="fas fa-play"></i> Activer la musique';
    playButton.onclick = () => {
        messageState.elements.backgroundMusic.play();
        playButton.remove();
    };
    
    document.querySelector('.scene-content').appendChild(playButton);
}

function pauseBackgroundMusic() {
    const music = messageState.elements.backgroundMusic;
    if (music) {
        music.pause();
    }
}

// ===== JOUER UN EFFET SONORE =====
function playSoundEffect(effectName) {
    const audio = messageState.elements.soundEffects;
    
    // Dans une vraie application, charger différents fichiers audio
    // Pour cette démo, nous utilisons l'API Web Audio
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        switch (effectName) {
            case 'envelope-open':
                playEnvelopeSound(audioContext);
                break;
            case 'snow':
                playSnowSound(audioContext);
                break;
            case 'sparkle':
                playSparkleSound(audioContext);
                break;
            case 'confetti':
                playConfettiSound(audioContext);
                break;
            case 'toggle':
                playToggleSound(audioContext);
                break;
            case 'share':
                playShareSound(audioContext);
                break;
        }
    } catch (error) {
        console.log('Audio non disponible');
    }
}

// ===== PARTAGE SUR RÉSEAUX SOCIAUX =====
function shareOnWhatsApp() {
    const shareUrl = generateShareUrl();
    const message = `🎁 ${messageState.senderName} m'a envoyé un message magique pour ${getOccasionName(messageState.occasion)} ! Découvre le tien aussi : ${shareUrl}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    trackShare('whatsapp');
    showShareSuccess();
}

function shareOnFacebook() {
    const shareUrl = generateShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(`J'ai reçu un message magique pour ${getOccasionName(messageState.occasion)} !`)}`;
    
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    trackShare('facebook');
    showShareSuccess();
}

function shareOnTwitter() {
    const shareUrl = generateShareUrl();
    const message = `🎄 J'ai reçu un message magique pour ${getOccasionName(messageState.occasion)} ! Créez le vôtre : ${shareUrl}`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    trackShare('twitter');
    showShareSuccess();
}

function copyShareLink() {
    const shareUrl = generateShareUrl();
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        // Afficher un feedback
        const originalText = messageState.elements.shareCopyBtn.innerHTML;
        messageState.elements.shareCopyBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
        messageState.elements.shareCopyBtn.classList.add('success');
        
        setTimeout(() => {
            messageState.elements.shareCopyBtn.innerHTML = originalText;
            messageState.elements.shareCopyBtn.classList.remove('success');
        }, 2000);
        
        playSoundEffect('share');
        trackShare('copy');
        showShareSuccess();
    }).catch(err => {
        console.error('Erreur lors de la copie :', err);
        alert('Impossible de copier le lien. Veuillez le copier manuellement :\n\n' + shareUrl);
    });
}

function generateShareUrl() {
    // Utiliser l'URL actuelle ou créer une nouvelle
    const currentUrl = window.location.href;
    
    // Ajouter un paramètre de référence si absent
    if (!currentUrl.includes('ref=')) {
        const separator = currentUrl.includes('?') ? '&' : '?';
        return `${currentUrl}${separator}ref=${messageState.recipientName.replace(/\s+/g, '-')}`;
    }
    
    return currentUrl;
}

function showShareSuccess() {
    messageState.elements.shareModal.classList.add('active');
    
    // Incrémenter le compteur de partages
    incrementShareCount();
}

// ===== SUIVI DES STATISTIQUES =====
function initStatistics() {
    // Récupérer les statistiques existantes
    const stats = JSON.parse(localStorage.getItem('noelMagicStats') || '{}');
    
    // Initialiser le compteur de vues
    const messageId = generateMessageId();
    if (!stats[messageId]) {
        stats[messageId] = {
            views: 0,
            shares: 0,
            created: Date.now()
        };
    }
    
    // Incrémenter la vue
    stats[messageId].views++;
    messageState.viewCount = stats[messageId].views;
    
    // Mettre à jour l'affichage
    messageState.elements.viewCount.textContent = 
        Math.min(messageState.viewCount, MESSAGE_CONFIG.maxViewCount);
    
    // Sauvegarder
    localStorage.setItem('noelMagicStats', JSON.stringify(stats));
}

function incrementViewCount() {
    const messageId = generateMessageId();
    const stats = JSON.parse(localStorage.getItem('noelMagicStats') || '{}');
    
    if (stats[messageId]) {
        stats[messageId].views++;
        messageState.viewCount = stats[messageId].views;
        
        // Mettre à jour l'affichage
        const displayCount = Math.min(messageState.viewCount, MESSAGE_CONFIG.maxViewCount);
        messageState.elements.viewCount.textContent = displayCount;
        
        // Ajouter un "+" si on dépasse le maximum
        if (messageState.viewCount > MESSAGE_CONFIG.maxViewCount) {
            messageState.elements.viewCount.textContent = `${MESSAGE_CONFIG.maxViewCount}+`;
        }
        
        localStorage.setItem('noelMagicStats', JSON.stringify(stats));
    }
}

function incrementShareCount() {
    const messageId = generateMessageId();
    const stats = JSON.parse(localStorage.getItem('noelMagicStats') || '{}');
    
    if (stats[messageId]) {
        stats[messageId].shares++;
        messageState.shareCount = stats[messageId].shares;
        
        // Mettre à jour l'affichage
        messageState.elements.shareCount.textContent = messageState.shareCount;
        
        localStorage.setItem('noelMagicStats', JSON.stringify(stats));
    }
}

function trackShare(platform) {
    const shareData = {
        messageId: generateMessageId(),
        platform: platform,
        timestamp: Date.now(),
        recipient: messageState.recipientName,
        occasion: messageState.occasion
    };
    
    // Sauvegarder dans le localStorage
    const shares = JSON.parse(localStorage.getItem('noelMagicShares') || '[]');
    shares.push(shareData);
    
    // Garder seulement les 100 derniers partages
    if (shares.length > 100) {
        shares.shift();
    }
    
    localStorage.setItem('noelMagicShares', JSON.stringify(shares));
    
    console.log(`Partage sur ${platform} tracé`);
}

function generateMessageId() {
    // Générer un ID unique basé sur les paramètres du message
    const params = [
        messageState.senderName,
        messageState.recipientName,
        messageState.occasion,
        messageState.tone,
        messageState.timestamp.toString().slice(0, 8) // Premiers chiffres du timestamp
    ];
    
    return btoa(params.join('|')).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
}

// ===== SUIVI DU TEMPS =====
function startTimeTracking() {
    messageState.timeSpent = 0;
    
    messageState.timeInterval = setInterval(() => {
        messageState.timeSpent++;
        
        // Enregistrer le temps toutes les 30 secondes
        if (messageState.timeSpent % 30 === 0) {
            saveTimeSpent();
        }
    }, 1000);
}

function saveTimeSpent() {
    const messageId = generateMessageId();
    const stats = JSON.parse(localStorage.getItem('noelMagicStats') || '{}');
    
    if (stats[messageId]) {
        if (!stats[messageId].timeSpent) {
            stats[messageId].timeSpent = 0;
        }
        stats[messageId].timeSpent += 30;
        
        localStorage.setItem('noelMagicStats', JSON.stringify(stats));
    }
}

// ===== GESTION DE LA VISIBILITÉ =====
function handleVisibilityChange() {
    if (document.hidden) {
        // Page cachée : pause musique et effets
        if (messageState.isMusicPlaying) {
            pauseBackgroundMusic();
        }
    } else {
        // Page visible : reprise musique si elle était en cours
        if (messageState.isMusicPlaying) {
            playBackgroundMusic();
        }
    }
}

function handleBeforeUnload(e) {
    if (messageState.isLoading) {
        e.preventDefault();
        e.returnValue = 'Le chargement du message magique est en cours. Voulez-vous vraiment quitter ?';
    }
}

// ===== EFFETS VISUELS =====
function initBackgroundEffects() {
    // Cette fonction est implémentée dans effects.js
    console.log('Effets d\'arrière-plan initialisés');
}

function startSnowEffect() {
    // Implémenté dans effects.js
}

function triggerSnowStorm() {
    // Créer une tempête de neige temporaire
    for (let i = 0; i < 50; i++) {
        createSnowflake(true);
    }
}

function triggerSparkleBurst() {
    // Créer une explosion d'étincelles
    const container = document.querySelector('.scene-content');
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-burst';
        sparkle.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: var(--christmas-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 10px var(--christmas-gold);
        `;
        
        container.appendChild(sparkle);
        
        // Animation
        const duration = 1000 + Math.random() * 1000;
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        
        sparkle.animate([
            { transform: 'scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => sparkle.remove(), duration);
    }
}

function triggerConfetti() {
    // Créer des confettis
    const colors = [
        'var(--christmas-red)',
        'var(--christmas-green)',
        'var(--christmas-gold)',
        'var(--christmas-blue)',
        'var(--christmas-white)'
    ];
    
    const container = document.querySelector('.scene-content');
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * 100}%;
            top: -10px;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        container.appendChild(confetti);
        
        // Animation
        const duration = 2000 + Math.random() * 2000;
        const endX = (Math.random() - 0.5) * 200;
        const endY = 100 + Math.random() * 50;
        
        confetti.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${endX}px, ${endY}vh) rotate(${Math.random() * 720}deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => confetti.remove(), duration);
    }
}

function clearAllEffects() {
    // Supprimer tous les effets visuels
    const effectsContainer = document.getElementById('effectsContainer');
    if (effectsContainer) {
        effectsContainer.innerHTML = '';
    }
}

// ===== UTILITAIRES =====
function getOccasionName(occasion) {
    const names = {
        noel: 'Noël',
        anniversaire: 'ton anniversaire',
        nouvel_an: 'le Nouvel An',
        saint_valentin: 'la Saint-Valentin'
    };
    return names[occasion] || 'cette occasion';
}

function updateCountdownDisplay() {
    const now = new Date();
    const christmas = new Date(now.getFullYear(), 11, 25);
    
    if (now > christmas) {
        christmas.setFullYear(now.getFullYear() + 1);
    }
    
    const diff = christmas - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    const display = messageState.elements.countdownDisplay;
    if (display) {
        display.textContent = `${days}j ${hours}h`;
    }
}

// ===== SONORISATION =====
function playEnvelopeSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Son de papier qui se déchire
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playSnowSound(audioContext) {
    const noise = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    noise.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bruit blanc pour la neige
    noise.type = 'sawtooth';
    noise.frequency.setValueAtTime(100, audioContext.currentTime);
    noise.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    noise.start();
    noise.stop(audioContext.currentTime + 0.5);
}

// ===== EXPORT POUR LES TESTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MESSAGE_CONFIG,
        messageState,
        initMessageApp,
        formatMessageText,
        generateMessageId
    };
}