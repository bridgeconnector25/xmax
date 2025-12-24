// ===== CONFIGURATION =====
const APP_CONFIG = {
    maxNameLength: 50,
    maxMessageLength: 500,
    minMessageLength: 5,
    defaultMusic: 'noel',
    defaultTheme: 'classic',
    defaultEffects: ['snow', 'sparkle', 'lights']
};

// ===== TEMPLATES AMÉLIORÉS =====
const templates = {
    noel: {
        joyeux: "🎄 Joyeux Noël ! Que cette période magique t'apporte bonheur, paix et moments précieux avec tes proches. Que chaque instant soit empreint de douceur et de lumière festive ✨",
        amour: "❤️ Mon cœur pense à toi en cette période de Noël. Que notre amour brille encore plus fort que les guirlandes et soit plus doux que la neige qui tombe. Je t'aime plus que tout au monde 🥰",
        amitie: "🤝 En cette belle période de Noël, je tenais à te dire à quel point notre amitié compte pour moi. Merci d'être cette étoile brillante dans mon ciel. Joyeuses fêtes mon ami(e) ! 🌟",
        spirituel: "✨ Que la lumière de Noël illumine ton chemin, que la paix de cette saison remplisse ton cœur et que l'amour qui nous entoure guide chacune de tes journées. Paix, Amour, Joie ✨"
    },
    anniversaire: {
        joyeux: "🎉 Joyeux anniversaire ! Que cette journée soit aussi exceptionnelle que toi, remplie de rires, de joie et de souvenirs inoubliables. Profite de chaque instant ! 🥳",
        amour: "💖 En ce jour spécial, je veux te rappeler à quel point tu es important(e) pour moi. Que cette nouvelle année de vie soit remplie d'amour, de bonheur et de rêves réalisés. Je t'aime ❤️",
        amitie: "👫 Bon anniversaire à un ami précieux ! Merci pour tous ces moments partagés. Que cette nouvelle année t'apporte tout le bonheur que tu mérites 🎂",
        spirituel: "🌟 En cette nouvelle année de vie, je te souhaite sagesse, croissance personnelle et paix intérieure. Que chaque jour t'apprenne quelque chose de nouveau et t'approche de tes rêves ✨"
    },
    nouvel_an: {
        joyeux: "🎆 Bonne année ! Que 2026 soit une aventure extraordinaire remplie de succès, de rires et de moments magiques. Allons créer des souvenirs inoubliables ! 🚀",
        amour: "💕 Que cette nouvelle année renforce notre amour et nous apporte encore plus de bonheurs partagés. Ensemble, tout est possible. Je t'aime plus chaque jour ❤️",
        amitie: "🤗 Bonne année mon ami ! Que 2026 nous apporte encore plus d'aventures, de fous rires et de moments précieux. Merci d'être là 🎊",
        spirituel: "🕊️ Que cette nouvelle année t'apporte clarté, paix intérieure et harmonie. Puisses-tu trouver ton chemin vers l'épanouissement et le bonheur véritable ✨"
    },
    saint_valentin: {
        joyeux: "💘 Joyeuse Saint-Valentin ! Que cette journée soit remplie de douceur, de tendresse et de moments romantiques. Profite de chaque instant d'amour 💕",
        amour: "💖 Mon cœur bat pour toi chaque jour, mais aujourd'hui un peu plus fort. Tu es mon plus beau cadeau, mon plus grand bonheur. Je t'aime éternellement ❤️",
        amitie: "🤍 Bonne Saint-Valentin à toi, ami précieux ! Même si ce n'est pas de l'amour romantique, sache que notre amitié est un trésor pour moi 💝",
        spirituel: "✨ Que l'amour sous toutes ses formes remplisse ton cœur aujourd'hui. Amour de soi, amour des autres, amour de la vie. Sois béni(e) 💫"
    }
};

// ===== ÉTAT DE L'APPLICATION =====
const appState = {
    currentTab: 'message',
    currentOccasion: 'noel',
    currentTone: 'joyeux',
    currentTheme: 'classic',
    currentMusic: 'noel',
    selectedEffects: ['snow', 'sparkle', 'lights'],
    isMusicEnabled: true,
    creatorName: '',
    recipientName: '',
    customMessage: '',
    creationProgress: 33,
    isPreviewFullscreen: false
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les composants
    initTabs();
    initOccasionCards();
    initToneSelector();
    initThemeSelector();
    initMusicControls();
    initEffectsControls();
    initMessageEditor();
    initPreviewSystem();
    initCountdown();
    initEventListeners();
    
    // Charger les préférences utilisateur
    loadUserPreferences();
    
    // Mettre à jour l'interface
    updateProgress();
    updatePreview();
    
    console.log('🎄 Studio Magique de Noël initialisé avec succès !');
});

// ===== GESTION DES ONGLETS =====
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Mettre à jour les boutons d'onglet
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour les contenus d'onglet
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            // Mettre à jour l'état
            appState.currentTab = tabId;
            
            // Mettre à jour la progression
            updateProgress();
            
            // Si on passe à l'aperçu, mettre à jour
            if (tabId === 'preview') {
                updatePreview();
            }
            
            // Effet sonore
            playSound('click');
        });
    });
}

// ===== SÉLECTION D'OCCASION =====
function initOccasionCards() {
    const occasionCards = document.querySelectorAll('.occasion-card');
    const eventTypeSelect = document.getElementById('eventType');
    
    occasionCards.forEach(card => {
        card.addEventListener('click', function() {
            const occasion = this.dataset.occasion;
            
            // Mettre à jour l'apparence
            occasionCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour l'état
            appState.currentOccasion = occasion;
            
            // Mettre à jour le select caché
            eventTypeSelect.value = occasion;
            
            // Mettre à jour le message
            updateMessageFromTemplate();
            
            // Effet visuel
            createRippleEffect(this, 'var(--christmas-gold)');
            
            // Effet sonore
            playSound('occasion');
            
            console.log(`Occasion sélectionnée : ${occasion}`);
        });
    });
}

// ===== SÉLECTION DE TON =====
function initToneSelector() {
    const toneOptions = document.querySelectorAll('.tone-option');
    const templateSelect = document.getElementById('template');
    
    toneOptions.forEach(option => {
        option.addEventListener('click', function() {
            const tone = this.dataset.tone;
            
            // Mettre à jour l'apparence
            toneOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour l'état
            appState.currentTone = tone;
            
            // Mettre à jour le select caché
            templateSelect.value = tone;
            
            // Mettre à jour le message
            updateMessageFromTemplate();
            
            // Effet visuel
            createSparkleEffect(this);
            
            // Effet sonore
            playSound('tone');
            
            console.log(`Ton sélectionné : ${tone}`);
        });
    });
}

// ===== SÉLECTION DE THÈME =====
function initThemeSelector() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            // Mettre à jour l'apparence
            themeOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour l'état
            appState.currentTheme = theme;
            
            // Appliquer le thème
            applyTheme(theme);
            
            // Effet visuel
            createThemeTransition(theme);
            
            // Effet sonore
            playSound('theme');
            
            console.log(`Thème sélectionné : ${theme}`);
        });
    });
}

// ===== CONTRÔLES MUSICAUX =====
function initMusicControls() {
    const musicToggle = document.getElementById('musicToggle');
    const musicOptions = document.querySelectorAll('.music-option');
    const previewButtons = document.querySelectorAll('.music-preview');
    
    // Toggle musique
    musicToggle.addEventListener('change', function() {
        appState.isMusicEnabled = this.checked;
        updateMusicState();
    });
    
    // Sélection de musique
    musicOptions.forEach(option => {
        option.addEventListener('click', function() {
            const music = this.dataset.music;
            
            // Mettre à jour l'apparence
            musicOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour l'état
            appState.currentMusic = music;
            
            console.log(`Musique sélectionnée : ${music}`);
        });
    });
    
    // Prévisualisation musicale
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const musicOption = this.closest('.music-option');
            const music = musicOption.dataset.music;
            
            // Simuler une prévisualisation
            playSound('music-preview');
            
            // Animation de bouton
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-play"></i>';
            }, 2000);
        });
    });
}

// ===== CONTRÔLES D'EFFETS =====
function initEffectsControls() {
    const effectCheckboxes = document.querySelectorAll('.effect-checkbox input');
    
    effectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const effectId = this.id.replace('effect', '').toLowerCase();
            
            if (this.checked) {
                // Ajouter l'effet
                if (!appState.selectedEffects.includes(effectId)) {
                    appState.selectedEffects.push(effectId);
                }
            } else {
                // Retirer l'effet
                const index = appState.selectedEffects.indexOf(effectId);
                if (index > -1) {
                    appState.selectedEffects.splice(index, 1);
                }
            }
            
            // Mettre à jour l'aperçu
            if (appState.currentTab === 'preview') {
                updatePreview();
            }
            
            console.log('Effets sélectionnés :', appState.selectedEffects);
        });
    });
}

// ===== ÉDITEUR DE MESSAGE =====
function initMessageEditor() {
    const customMsg = document.getElementById('customMsg');
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const charCount = document.getElementById('charCount');
    const suggestTemplateBtn = document.getElementById('suggestTemplate');
    const emojiButtons = document.querySelectorAll('.editor-tool');
    
    // Suivi de la longueur du message
    customMsg.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        // Mettre à jour l'état
        appState.customMessage = this.value;
        
        // Changer la couleur du compteur
        if (length > 450) {
            charCount.style.color = 'var(--christmas-red)';
        } else if (length > 400) {
            charCount.style.color = 'var(--christmas-gold)';
        } else {
            charCount.style.color = 'var(--text-muted)';
        }
        
        // Mettre à jour l'aperçu si visible
        if (appState.currentTab === 'preview') {
            updatePreview();
        }
    });
    
    // Suivi des noms
    fromInput.addEventListener('input', function() {
        appState.creatorName = this.value.trim();
        updateProgress();
        if (appState.currentTab === 'preview') updatePreview();
    });
    
    toInput.addEventListener('input', function() {
        appState.recipientName = this.value.trim();
        updateProgress();
        if (appState.currentTab === 'preview') updatePreview();
    });
    
    // Bouton de suggestion
    suggestTemplateBtn.addEventListener('click', function() {
        generateSmartSuggestion();
    });
    
    // Boutons d'émojis
    emojiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            insertAtCursor(customMsg, emoji);
            playSound('emoji');
        });
    });
    
    // Initialiser le message
    updateMessageFromTemplate();
}

// ===== SYSTÈME D'APERÇU =====
function initPreviewSystem() {
    const refreshBtn = document.getElementById('refreshPreview');
    const fullscreenBtn = document.getElementById('fullscreenPreview');
    
    // Rafraîchir l'aperçu
    refreshBtn.addEventListener('click', function() {
        updatePreview();
        createRippleEffect(this, 'var(--christmas-gold)');
        playSound('refresh');
    });
    
    // Plein écran
    fullscreenBtn.addEventListener('click', function() {
        toggleFullscreenPreview();
    });
    
    // Initialiser la détection de plein écran
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// ===== COMPTE À REBOURS =====
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 60000); // Mettre à jour chaque minute
}

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Si Noël est passé cette année, cibler l'année prochaine
    const targetDate = new Date(currentYear, 11, 25); // 25 décembre
    if (now > targetDate) {
        targetDate.setFullYear(currentYear + 1);
    }
    
    const diff = targetDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Mettre à jour l'affichage
    document.getElementById('countdown-days').textContent = 
        days.toString().padStart(2, '0');
    document.getElementById('countdown-hours').textContent = 
        hours.toString().padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = 
        minutes.toString().padStart(2, '0');
}

// ===== ÉVÉNEMENTS GLOBAUX =====
function initEventListeners() {
    // Bouton de réinitialisation
    document.getElementById('resetBtn').addEventListener('click', resetCreation);
    
    // Bouton de partage principal
    document.getElementById('shareBtn').addEventListener('click', shareCreation);
    
    // Boutons de la modale de succès
    document.getElementById('copyLinkBtn')?.addEventListener('click', copyShareLink);
    document.getElementById('openWhatsAppBtn')?.addEventListener('click', openWhatsApp);
    
    // Fermer la modale en cliquant à l'extérieur
    document.getElementById('successModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Sauvegarder automatiquement
    setInterval(saveDraft, 30000); // Toutes les 30 secondes
    
    // Prévenir la fermeture avec des données non sauvegardées
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// ===== FONCTIONS UTILITAIRES =====

// Mettre à jour le message depuis le template
function updateMessageFromTemplate() {
    const textarea = document.getElementById('customMsg');
    const charCount = document.getElementById('charCount');
    
    if (templates[appState.currentOccasion] && 
        templates[appState.currentOccasion][appState.currentTone]) {
        
        const template = templates[appState.currentOccasion][appState.currentTone];
        textarea.value = template;
        appState.customMessage = template;
        
        // Mettre à jour le compteur
        charCount.textContent = template.length;
        
        // Effet visuel
        textarea.classList.add('message-entrance');
        setTimeout(() => {
            textarea.classList.remove('message-entrance');
        }, 800);
    }
}

// Appliquer un thème
function applyTheme(theme) {
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
}

// Générer une suggestion intelligente
function generateSmartSuggestion() {
    const textarea = document.getElementById('customMsg');
    const suggestions = {
        noel: [
            "🎅 Le Père Noël m'a chargé de te souhaiter un merveilleux Noël !",
            "🌟 Sous le ciel étoilé de Noël, je pense à toi et te souhaite tout le bonheur du monde.",
            "❄️ Que la magie de Noël enveloppe ta maison de paix, d'amour et de joie."
        ],
        nouvel_an: [
            "🎇 Prêt(e) pour une nouvelle aventure ? Que 2026 soit ton année !",
            "🔄 Tournons la page ensemble et écrivons un nouveau chapitre plein de promesses.",
            "🚀 Décollage immédiat pour une année extraordinaire !"
        ]
    };
    
    const occasionSuggestions = suggestions[appState.currentOccasion] || [
        "✨ En cette occasion spéciale, je veux te dire à quel point tu comptes pour moi.",
        "💝 Les mots manquent parfois pour exprimer ce qu'on ressent... Sache que je pense à toi.",
        "🌷 Que cette journée soit aussi belle que ton sourire."
    ];
    
    const randomSuggestion = occasionSuggestions[
        Math.floor(Math.random() * occasionSuggestions.length)
    ];
    
    // Ajouter la suggestion au message existant
    const currentText = textarea.value;
    const separator = currentText ? '\n\n' : '';
    textarea.value = currentText + separator + randomSuggestion;
    
    // Déclencher l'événement input
    textarea.dispatchEvent(new Event('input'));
    
    // Effet visuel
    createConfettiEffect(textarea);
    playSound('suggestion');
}

// Mettre à jour la progression
function updateProgress() {
    let progress = 0;
    
    // Vérifier les étapes complétées
    if (appState.creatorName && appState.recipientName) progress += 33;
    if (appState.customMessage && appState.customMessage.length > 10) progress += 33;
    if (appState.currentTab === 'preview') progress += 34;
    
    // Mettre à jour l'affichage
    const progressBar = document.getElementById('creationProgress');
    const progressText = document.querySelector('.progress-text');
    
    progressBar.style.width = `${progress}%`;
    appState.creationProgress = progress;
    
    // Mettre à jour le texte d'étape
    let stepText = '';
    if (progress < 33) {
        stepText = 'Étape 1 sur 3';
    } else if (progress < 66) {
        stepText = 'Étape 2 sur 3';
    } else {
        stepText = 'Étape 3 sur 3';
    }
    
    if (progressText) {
        progressText.textContent = stepText;
    }
}

// Mettre à jour l'aperçu
function updatePreview() {
    const previewContainer = document.querySelector('.preview-card');
    const placeholder = document.querySelector('.preview-placeholder');
    
    if (!appState.creatorName || !appState.recipientName) {
        if (placeholder) {
            placeholder.style.display = 'block';
            previewContainer.innerHTML = '';
            previewContainer.appendChild(placeholder);
        }
        return;
    }
    
    // Cacher le placeholder
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    // Générer l'aperçu
    const previewHTML = generatePreviewHTML();
    previewContainer.innerHTML = previewHTML;
    
    // Animer l'entrée
    const previewElements = previewContainer.querySelectorAll('.preview-element');
    previewElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-on-scroll', 'visible');
    });
}

// Générer le HTML de l'aperçu
function generatePreviewHTML() {
    return `
        <div class="preview-content">
            <div class="preview-header float-animation">
                <div class="preview-icon gift-glow">
                    ${getOccasionIcon()}
                </div>
                <h3 class="preview-title text-glow">
                    Pour ${appState.recipientName || 'ton ami(e)'}
                </h3>
            </div>
            
            <div class="preview-message message-entrance">
                <div class="message-bubble">
                    <p class="message-text">${appState.customMessage || 'Ton message apparaîtra ici...'}</p>
                </div>
            </div>
            
            <div class="preview-footer pulse-animation">
                <div class="preview-from">
                    <i class="fas fa-heart"></i>
                    De la part de ${appState.creatorName || 'quelqu\'un'}
                </div>
            </div>
            
            <div class="preview-effects">
                ${generateEffectsPreview()}
            </div>
        </div>
    `;
}

// Obtenir l'icône d'occasion
function getOccasionIcon() {
    const icons = {
        noel: '🎄',
        anniversaire: '🎂',
        nouvel_an: '🎆',
        saint_valentin: '❤️'
    };
    return icons[appState.currentOccasion] || '🎁';
}

// Générer la prévisualisation des effets
function generateEffectsPreview() {
    if (!appState.selectedEffects.length) return '';
    
    const effectsIcons = {
        snow: '❄️',
        sparkle: '✨',
        lights: '💡',
        fireplace: '🔥'
    };
    
    return `
        <div class="effects-preview">
            <div class="effects-label">
                <i class="fas fa-magic"></i>
                Effets magiques activés :
            </div>
            <div class="effects-list">
                ${appState.selectedEffects.map(effect => `
                    <span class="effect-badge">
                        ${effectsIcons[effect] || '✨'} ${effect}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

// Basculer le plein écran
function toggleFullscreenPreview() {
    const previewCard = document.querySelector('.preview-card');
    
    if (!appState.isPreviewFullscreen) {
        if (previewCard.requestFullscreen) {
            previewCard.requestFullscreen();
        } else if (previewCard.webkitRequestFullscreen) {
            previewCard.webkitRequestFullscreen();
        } else if (previewCard.mozRequestFullScreen) {
            previewCard.mozRequestFullScreen();
        } else if (previewCard.msRequestFullscreen) {
            previewCard.msRequestFullscreen();
        }
        appState.isPreviewFullscreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        appState.isPreviewFullscreen = false;
    }
    
    playSound('fullscreen');
}

// Gérer le changement de plein écran
function handleFullscreenChange() {
    const previewCard = document.querySelector('.preview-card');
    const fullscreenBtn = document.getElementById('fullscreenPreview');
    
    if (document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement) {
        previewCard.classList.add('fullscreen-mode');
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Quitter le plein écran';
        appState.isPreviewFullscreen = true;
    } else {
        previewCard.classList.remove('fullscreen-mode');
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Plein écran';
        appState.isPreviewFullscreen = false;
    }
}

// Partager la création
function shareCreation() {
    // Validation
    if (!validateForm()) {
        return;
    }
    
    // Afficher le chargement
    const shareBtn = document.getElementById('shareBtn');
    const originalContent = shareBtn.innerHTML;
    shareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Préparation...';
    shareBtn.classList.add('loading');
    
    // Simuler un traitement
    setTimeout(() => {
        // Générer l'URL de partage
        const shareUrl = generateShareUrl();
        
        // Sauvegarder la création
        saveCreation(shareUrl);
        
        // Afficher la modale de succès
        showSuccessModal(shareUrl);
        
        // Restaurer le bouton
        shareBtn.innerHTML = originalContent;
        shareBtn.classList.remove('loading');
        
        // Effets
        createConfettiEffect(shareBtn);
        playSound('success');
        
        console.log('Création partagée :', shareUrl);
    }, 1500);
}

// Valider le formulaire
function validateForm() {
    const errors = [];
    
    if (!appState.creatorName.trim()) {
        errors.push('Votre nom est requis');
        highlightError('from');
    }
    
    if (!appState.recipientName.trim()) {
        errors.push('Le nom du destinataire est requis');
        highlightError('to');
    }
    
    if (!appState.customMessage.trim() || 
        appState.customMessage.length < APP_CONFIG.minMessageLength) {
        errors.push(`Le message doit contenir au moins ${APP_CONFIG.minMessageLength} caractères`);
        highlightError('customMsg');
    }
    
    if (errors.length > 0) {
        showErrorModal(errors);
        playSound('error');
        return false;
    }
    
    return true;
}

// Générer l'URL de partage
function generateShareUrl() {
    const baseUrl = window.location.origin;
    const path = window.location.pathname.replace('index.html', 'message.html');
    
    const params = new URLSearchParams({
        from: encodeURIComponent(appState.creatorName),
        to: encodeURIComponent(appState.recipientName),
        event: appState.currentOccasion,
        tone: appState.currentTone,
        theme: appState.currentTheme,
        music: appState.currentMusic,
        musicOn: appState.isMusicEnabled ? '1' : '0',
        effects: appState.selectedEffects.join(','),
        msg: encodeURIComponent(appState.customMessage),
        t: Date.now() // Timestamp pour éviter le cache
    });
    
    return `${baseUrl}${path}?${params.toString()}`;
}

// Afficher la modale de succès
function showSuccessModal(shareUrl) {
    const modal = document.getElementById('successModal');
    const shareLinkInput = document.getElementById('shareLink');
    
    if (shareLinkInput) {
        shareLinkInput.value = shareUrl;
    }
    
    modal.classList.add('active');
    
    // Animation d'entrée
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.add('message-entrance');
}

// Copier le lien de partage
function copyShareLink() {
    const shareLinkInput = document.getElementById('shareLink');
    
    if (shareLinkInput && shareLinkInput.value) {
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            // Afficher un feedback
            const copyBtn = document.getElementById('copyLinkBtn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
            copyBtn.style.background = 'var(--christmas-green)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
            
            playSound('copy');
        }).catch(err => {
            console.error('Erreur lors de la copie :', err);
            alert('Impossible de copier le lien. Veuillez le copier manuellement.');
        });
    }
}

// Ouvrir WhatsApp
function openWhatsApp() {
    const shareLinkInput = document.getElementById('shareLink');
    
    if (shareLinkInput && shareLinkInput.value) {
        const message = `🎁 ${appState.creatorName} t'a envoyé un message magique pour ${getOccasionName(appState.currentOccasion)} ! ✨\n\nClique pour découvrir la surprise :\n${shareLinkInput.value}`;
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        playSound('whatsapp');
    }
}

// Obtenir le nom de l'occasion
function getOccasionName(occasion) {
    const names = {
        noel: 'Noël',
        anniversaire: 'ton anniversaire',
        nouvel_an: 'le Nouvel An',
        saint_valentin: 'la Saint-Valentin'
    };
    return names[occasion] || 'cette occasion';
}

// Réinitialiser la création
function resetCreation() {
    if (confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Cette action est irréversible.')) {
        // Réinitialiser l'état
        appState.creatorName = '';
        appState.recipientName = '';
        appState.customMessage = '';
        appState.currentTab = 'message';
        appState.currentOccasion = 'noel';
        appState.currentTone = 'joyeux';
        appState.currentTheme = 'classic';
        appState.currentMusic = 'noel';
        appState.selectedEffects = APP_CONFIG.defaultEffects;
        appState.isMusicEnabled = true;
        appState.creationProgress = 33;
        
        // Réinitialiser l'interface
        document.getElementById('from').value = '';
        document.getElementById('to').value = '';
        document.getElementById('musicToggle').checked = true;
        
        // Réinitialiser les sélections visuelles
        document.querySelectorAll('.occasion-card').forEach((card, index) => {
            card.classList.toggle('active', index === 0);
        });
        
        document.querySelectorAll('.tone-option').forEach((option, index) => {
            option.classList.toggle('active', index === 0);
        });
        
        document.querySelectorAll('.theme-option').forEach((option, index) => {
            option.classList.toggle('active', index === 0);
        });
        
        document.querySelectorAll('.music-option').forEach((option, index) => {
            option.classList.toggle('active', index === 0);
        });
        
        document.querySelectorAll('.effect-checkbox input').forEach((checkbox, index) => {
            checkbox.checked = APP_CONFIG.defaultEffects.includes(
                checkbox.id.replace('effect', '').toLowerCase()
            );
        });
        
        // Revenir à l'onglet message
        document.querySelector('.tab-btn[data-tab="message"]').click();
        
        // Mettre à jour le message
        updateMessageFromTemplate();
        
        // Mettre à jour le thème
        applyTheme('classic');
        
        // Effets
        createSnowEffect(document.body);
        playSound('reset');
        
        console.log('Création réinitialisée');
    }
}

// Sauvegarder le brouillon
function saveDraft() {
    const draft = {
        creatorName: appState.creatorName,
        recipientName: appState.recipientName,
        customMessage: appState.customMessage,
        currentOccasion: appState.currentOccasion,
        currentTone: appState.currentTone,
        currentTheme: appState.currentTheme,
        currentMusic: appState.currentMusic,
        selectedEffects: appState.selectedEffects,
        isMusicEnabled: appState.isMusicEnabled,
        timestamp: Date.now()
    };
    
    localStorage.setItem('noelMagicDraft', JSON.stringify(draft));
    console.log('Brouillon sauvegardé');
}

// Charger les préférences utilisateur
function loadUserPreferences() {
    const savedDraft = localStorage.getItem('noelMagicDraft');
    
    if (savedDraft) {
        try {
            const draft = JSON.parse(savedDraft);
            
            // Vérifier si le brouillon est récent (moins de 7 jours)
            const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            if (draft.timestamp && draft.timestamp > oneWeekAgo) {
                // Charger le brouillon
                appState.creatorName = draft.creatorName || '';
                appState.recipientName = draft.recipientName || '';
                appState.customMessage = draft.customMessage || '';
                appState.currentOccasion = draft.currentOccasion || 'noel';
                appState.currentTone = draft.currentTone || 'joyeux';
                appState.currentTheme = draft.currentTheme || 'classic';
                appState.currentMusic = draft.currentMusic || 'noel';
                appState.selectedEffects = draft.selectedEffects || APP_CONFIG.defaultEffects;
                appState.isMusicEnabled = draft.isMusicEnabled !== undefined ? draft.isMusicEnabled : true;
                
                // Mettre à jour l'interface
                document.getElementById('from').value = appState.creatorName;
                document.getElementById('to').value = appState.recipientName;
                document.getElementById('customMsg').value = appState.customMessage;
                document.getElementById('musicToggle').checked = appState.isMusicEnabled;
                
                // Mettre à jour les sélections visuelles
                updateVisualSelections();
                
                // Appliquer le thème
                applyTheme(appState.currentTheme);
                
                console.log('Brouillon chargé');
                
                // Demander à l'utilisateur s'il veut reprendre
                setTimeout(() => {
                    if (confirm('Voulez-vous reprendre votre dernière création ?')) {
                        updateMessageFromTemplate();
                        updatePreview();
                    }
                }, 500);
            } else {
                // Supprimer le brouillon trop ancien
                localStorage.removeItem('noelMagicDraft');
                console.log('Brouillon trop ancien, supprimé');
            }
        } catch (error) {
            console.error('Erreur lors du chargement du brouillon :', error);
            localStorage.removeItem('noelMagicDraft');
        }
    }
}

// Mettre à jour les sélections visuelles
function updateVisualSelections() {
    // Occasion
    document.querySelectorAll('.occasion-card').forEach(card => {
        card.classList.toggle('active', card.dataset.occasion === appState.currentOccasion);
    });
    
    // Ton
    document.querySelectorAll('.tone-option').forEach(option => {
        option.classList.toggle('active', option.dataset.tone === appState.currentTone);
    });
    
    // Thème
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.toggle('active', option.dataset.theme === appState.currentTheme);
    });
    
    // Musique
    document.querySelectorAll('.music-option').forEach(option => {
        option.classList.toggle('active', option.dataset.music === appState.currentMusic);
    });
    
    // Effets
    document.querySelectorAll('.effect-checkbox input').forEach(checkbox => {
        const effectId = checkbox.id.replace('effect', '').toLowerCase();
        checkbox.checked = appState.selectedEffects.includes(effectId);
    });
}

// Vérifier les modifications non sauvegardées
function hasUnsavedChanges() {
    return appState.creatorName || 
           appState.recipientName || 
           appState.customMessage;
}

// ===== EFFETS VISUELS =====

// Créer un effet de vague
function createRippleEffect(element, color) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = color || 'var(--christmas-gold)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '100';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event ? event.clientX - rect.left : rect.width / 2;
    const y = event ? event.clientY - rect.top : rect.height / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Créer un effet d'étincelles
function createSparkleEffect(element) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        sparkle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--christmas-gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
        `;
        
        const rect = element.getBoundingClientRect();
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30;
        
        sparkle.style.left = `${rect.width / 2 + Math.cos(angle) * distance - 3}px`;
        sparkle.style.top = `${rect.height / 2 + Math.sin(angle) * distance - 3}px`;
        
        element.appendChild(sparkle);
        
        // Animation
        const duration = 600 + Math.random() * 400;
        const targetX = Math.cos(angle) * 100;
        const targetY = Math.sin(angle) * 100;
        
        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => sparkle.remove(), duration);
    }
}

// Créer un effet de confettis
function createConfettiEffect(element) {
    const colors = [
        'var(--christmas-red)',
        'var(--christmas-green)',
        'var(--christmas-gold)',
        'var(--christmas-blue)',
        'var(--christmas-white)'
    ];
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(confetti);
        
        // Animation
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const duration = 1000 + Math.random() * 1000;
        const rotation = Math.random() * 720;
        
        confetti.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${rotation}deg) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        setTimeout(() => confetti.remove(), duration);
    }
}

// Transition de thème
function createThemeTransition(theme) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${theme === 'classic' ? 'var(--classic-bg)' : 
                     theme === 'elegant' ? 'var(--elegant-bg)' :
                     theme === 'modern' ? 'var(--modern-bg)' : 'var(--colorful-bg)'};
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
    `;
    
    document.body.appendChild(overlay);
    
    // Animation
    overlay.animate([
        { opacity: 0 },
        { opacity: 1 },
        { opacity: 0 }
    ], {
        duration: 800,
        easing: 'ease-in-out'
    });
    
    setTimeout(() => overlay.remove(), 800);
}

// Insérer du texte à la position du curseur
function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    
    textarea.value = before + text + after;
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
    
    // Déclencher l'événement input
    textarea.dispatchEvent(new Event('input'));
}

// Mettre en évidence une erreur
function highlightError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('error-highlight');
        setTimeout(() => {
            element.classList.remove('error-highlight');
        }, 3000);
    }
}

// Afficher une modale d'erreur
function showErrorModal(errors) {
    // Créer la modale d'erreur si elle n'existe pas
    let errorModal = document.getElementById('errorModal');
    
    if (!errorModal) {
        errorModal = document.createElement('div');
        errorModal.id = 'errorModal';
        errorModal.className = 'modal-overlay';
        errorModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon error">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h2>Attention</h2>
                <div class="error-list"></div>
                <div class="modal-actions">
                    <button class="modal-btn primary" id="closeErrorBtn">
                        <i class="fas fa-times"></i>
                        Fermer
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(errorModal);
        
        // Ajouter l'événement de fermeture
        document.getElementById('closeErrorBtn').addEventListener('click', () => {
            errorModal.classList.remove('active');
        });
        
        // Fermer en cliquant à l'extérieur
        errorModal.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                errorModal.classList.remove('active');
            }
        });
    }
    
    // Mettre à jour le contenu
    const errorList = errorModal.querySelector('.error-list');
    errorList.innerHTML = errors.map(error => 
        `<div class="error-item"><i class="fas fa-times-circle"></i> ${error}</div>`
    ).join('');
    
    // Afficher la modale
    errorModal.classList.add('active');
}

// ===== SYSTÈME AUDIO =====

// Jouer un son
function playSound(soundType) {
    // Dans une vraie application, vous auriez des fichiers audio
    // Pour cette démo, nous utilisons l'API Web Audio
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        switch(soundType) {
            case 'click':
                playClickSound(audioContext);
                break;
            case 'occasion':
                playOccasionSound(audioContext);
                break;
            case 'tone':
                playToneSound(audioContext);
                break;
            case 'theme':
                playThemeSound(audioContext);
                break;
            case 'emoji':
                playEmojiSound(audioContext);
                break;
            case 'suggestion':
                playSuggestionSound(audioContext);
                break;
            case 'refresh':
                playRefreshSound(audioContext);
                break;
            case 'fullscreen':
                playFullscreenSound(audioContext);
                break;
            case 'success':
                playSuccessSound(audioContext);
                break;
            case 'error':
                playErrorSound(audioContext);
                break;
            case 'copy':
                playCopySound(audioContext);
                break;
            case 'whatsapp':
                playWhatsAppSound(audioContext);
                break;
            case 'reset':
                playResetSound(audioContext);
                break;
            case 'music-preview':
                playMusicPreviewSound(audioContext);
                break;
        }
    } catch (error) {
        console.log('Audio non disponible');
    }
}

// Sons spécifiques (simplifiés pour la démo)
function playClickSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playSuccessSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Do
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Mi
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Sol
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Mettre à jour l'état de la musique
function updateMusicState() {
    console.log(`Musique ${appState.isMusicEnabled ? 'activée' : 'désactivée'}`);
}

// ===== SAUVEGARDE DE LA CRÉATION =====
function saveCreation(shareUrl) {
    const creation = {
        ...appState,
        shareUrl: shareUrl,
        timestamp: Date.now(),
        id: 'creation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    };
    
    // Sauvegarder dans le localStorage
    const creations = JSON.parse(localStorage.getItem('noelMagicCreations') || '[]');
    creations.unshift(creation);
    
    // Garder seulement les 10 dernières créations
    if (creations.length > 10) {
        creations.pop();
    }
    
    localStorage.setItem('noelMagicCreations', JSON.stringify(creations));
    
    console.log('Création sauvegardée :', creation.id);
}

// ===== STYLES DYNAMIQUES =====
const style = document.createElement('style');
style.textContent = `
    .error-highlight {
        border-color: var(--christmas-red) !important;
        box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.2) !important;
        animation: shake 0.5s ease !important;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .fullscreen-mode {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        margin: 0 !important;
        border-radius: 0 !important;
        padding: 2rem !important;
        background: rgba(0, 0, 0, 0.9) !important;
        backdrop-filter: blur(20px) !important;
    }
    
    .preview-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 2rem;
    }
    
    .preview-header {
        text-align: center;
    }
    
    .preview-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .preview-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--christmas-gold);
    }
    
    .message-bubble {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--card-border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        max-width: 600px;
        text-align: center;
        backdrop-filter: blur(10px);
    }
    
    .message-text {
        font-size: 1.2rem;
        line-height: 1.6;
        color: var(--text-primary);
        white-space: pre-wrap;
    }
    
    .preview-footer {
        color: var(--text-secondary);
        font-style: italic;
    }
    
    .effects-preview {
        background: rgba(0, 0, 0, 0.3);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .effects-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .effects-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
    }
    
    .effect-badge {
        background: rgba(249, 168, 37, 0.2);
        border: 1px solid var(--christmas-gold);
        color: var(--christmas-gold);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
    }
    
    .modal-icon.error {
        color: var(--christmas-red);
    }
    
    .error-list {
        text-align: left;
        margin: 1.5rem 0;
    }
    
    .error-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }
    
    .error-item i {
        color: var(--christmas-red);
    }
`;
document.head.appendChild(style);

// ===== EXPORT POUR LES TESTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        templates,
        APP_CONFIG,
        appState,
        updateMessageFromTemplate,
        validateForm,
        generateShareUrl
    };
}