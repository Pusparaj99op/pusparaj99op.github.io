/**
 * Enhanced Chess Game Features
 * Additional functionality for the 3D Chess Game
 */

class ChessEnhancements {
    constructor(chessGame) {
        this.chessGame = chessGame;
        this.gameSettings = {
            autoSave: true,
            soundEnabled: true,
            showHints: true,
            animationSpeed: 'normal'
        };
        this.achievements = [];
        this.gameStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalMoves: 0,
            averageGameTime: 0
        };
        this.init();
    }

    init() {
        this.loadGameSettings();
        this.loadGameStats();
        this.setupEnhancedControls();
        this.initializeAchievements();
        this.setupAutoSave();
        this.addVisualEffects();
        console.log('Chess enhancements initialized');
    }

    setupEnhancedControls() {
        // Add save/load functionality
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn secondary-btn';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Game';
        saveBtn.onclick = () => this.saveGame();

        const loadBtn = document.createElement('button');
        loadBtn.className = 'btn secondary-btn';
        loadBtn.innerHTML = '<i class="fas fa-folder-open"></i> Load Game';
        loadBtn.onclick = () => this.loadGame();

        const hintsBtn = document.createElement('button');
        hintsBtn.className = 'btn secondary-btn';
        hintsBtn.innerHTML = '<i class="fas fa-lightbulb"></i> Hint';
        hintsBtn.onclick = () => this.showHint();

        const undoBtn = document.createElement('button');
        undoBtn.className = 'btn secondary-btn';
        undoBtn.innerHTML = '<i class="fas fa-undo"></i> Undo';
        undoBtn.onclick = () => this.undoMove();

        // Add buttons to controls
        const controlsContainer = document.querySelector('.chess-controls');
        if (controlsContainer) {
            controlsContainer.appendChild(saveBtn);
            controlsContainer.appendChild(loadBtn);
            controlsContainer.appendChild(hintsBtn);
            controlsContainer.appendChild(undoBtn);
        }

        // Add settings panel
        this.createSettingsPanel();
    }

    createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'chess-settings glass-effect';
        settingsPanel.innerHTML = `
            <h4><i class="fas fa-cog"></i> Game Settings</h4>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="autoSave" ${this.gameSettings.autoSave ? 'checked' : ''}>
                    Auto Save Game
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="soundEnabled" ${this.gameSettings.soundEnabled ? 'checked' : ''}>
                    Sound Effects
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="showHints" ${this.gameSettings.showHints ? 'checked' : ''}>
                    Show Move Hints
                </label>
            </div>
            <div class="setting-item">
                <label for="animationSpeed">Animation Speed:</label>
                <select id="animationSpeed">
                    <option value="slow" ${this.gameSettings.animationSpeed === 'slow' ? 'selected' : ''}>Slow</option>
                    <option value="normal" ${this.gameSettings.animationSpeed === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="fast" ${this.gameSettings.animationSpeed === 'fast' ? 'selected' : ''}>Fast</option>
                </select>
            </div>
        `;

        const chessContainer = document.querySelector('.chess-container');
        if (chessContainer) {
            chessContainer.appendChild(settingsPanel);
        }

        // Add event listeners for settings
        this.setupSettingsListeners();
    }

    setupSettingsListeners() {
        document.getElementById('autoSave')?.addEventListener('change', (e) => {
            this.gameSettings.autoSave = e.target.checked;
            this.saveGameSettings();
        });

        document.getElementById('soundEnabled')?.addEventListener('change', (e) => {
            this.gameSettings.soundEnabled = e.target.checked;
            this.saveGameSettings();
        });

        document.getElementById('showHints')?.addEventListener('change', (e) => {
            this.gameSettings.showHints = e.target.checked;
            this.saveGameSettings();
        });

        document.getElementById('animationSpeed')?.addEventListener('change', (e) => {
            this.gameSettings.animationSpeed = e.target.value;
            this.saveGameSettings();
        });
    }

    saveGame() {
        const gameState = {
            boardState: this.chessGame.boardState,
            currentPlayer: this.chessGame.currentPlayer,
            moveHistory: this.chessGame.moveHistory,
            capturedPieces: this.chessGame.capturedPieces,
            gameState: this.chessGame.gameState,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('chess3d_saved_game', JSON.stringify(gameState));
        this.showNotification('Game saved successfully!', 'success');
    }

    loadGame() {
        const savedGame = localStorage.getItem('chess3d_saved_game');
        if (savedGame) {
            try {
                const gameState = JSON.parse(savedGame);
                this.chessGame.loadGameState(gameState);
                this.showNotification('Game loaded successfully!', 'success');
            } catch (error) {
                this.showNotification('Failed to load game!', 'error');
            }
        } else {
            this.showNotification('No saved game found!', 'warning');
        }
    }

    showHint() {
        if (!this.gameSettings.showHints) {
            this.showNotification('Hints are disabled in settings', 'warning');
            return;
        }

        // Get best move for current player
        const bestMove = this.calculateBestMove();
        if (bestMove) {
            this.highlightHint(bestMove);
            this.showNotification(`Hint: Move ${bestMove.piece.userData.type} to ${bestMove.move.row},${bestMove.move.col}`, 'info');
        }
    }

    undoMove() {
        if (this.chessGame.moveHistory.length > 0) {
            const lastMove = this.chessGame.moveHistory.pop();
            this.chessGame.undoLastMove(lastMove);
            this.showNotification('Move undone', 'info');
        } else {
            this.showNotification('No moves to undo', 'warning');
        }
    }

    calculateBestMove() {
        // Simple AI logic to find best move
        const allPieces = Object.values(this.chessGame.pieces).filter(
            piece => piece.userData.color === this.chessGame.currentPlayer && 
            this.chessGame.scene.children.includes(piece)
        );

        let bestMove = null;
        let bestScore = -Infinity;

        allPieces.forEach(piece => {
            const moves = this.chessGame.getPossibleMoves(piece);
            moves.forEach(move => {
                const score = this.evaluateMove(piece, move);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { piece, move };
                }
            });
        });

        return bestMove;
    }

    evaluateMove(piece, move) {
        let score = Math.random();
        
        // Prefer captures
        if (move.isCapture) score += 10;
        
        // Prefer center control
        if (move.row >= 2 && move.row <= 5 && move.col >= 2 && move.col <= 5) {
            score += 2;
        }
        
        // Prefer piece development
        if (piece.userData.type === 'knight' || piece.userData.type === 'bishop') {
            score += 1;
        }
        
        return score;
    }

    highlightHint(move) {
        // Add visual hint highlighting
        const hintMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.5 
        });
        
        const hintGeometry = new THREE.PlaneGeometry(0.9, 0.9);
        const hintMesh = new THREE.Mesh(hintGeometry, hintMaterial);
        
        hintMesh.position.set(
            move.move.col - 3.5,
            0.01,
            move.move.row - 3.5
        );
        hintMesh.rotation.x = -Math.PI / 2;
        
        this.chessGame.scene.add(hintMesh);
        
        // Remove hint after 3 seconds
        setTimeout(() => {
            this.chessGame.scene.remove(hintMesh);
        }, 3000);
    }

    initializeAchievements() {
        this.achievements = [
            { id: 'first_game', name: 'First Game', description: 'Play your first game', unlocked: false },
            { id: 'quick_win', name: 'Quick Victory', description: 'Win a game in under 20 moves', unlocked: false },
            { id: 'comeback_king', name: 'Comeback King', description: 'Win after being down material', unlocked: false },
            { id: 'chess_master', name: 'Chess Master', description: 'Win 10 games', unlocked: false },
            { id: 'hint_master', name: 'Hint Master', description: 'Win without using hints', unlocked: false }
        ];
        
        this.loadAchievements();
        this.displayAchievements();
    }

    checkAchievements() {
        // Check for achievement unlocks
        if (this.gameStats.gamesPlayed === 1) {
            this.unlockAchievement('first_game');
        }
        
        if (this.gameStats.gamesWon === 10) {
            this.unlockAchievement('chess_master');
        }
        
        // Add more achievement checks...
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.saveAchievements();
            this.showNotification(`Achievement Unlocked: ${achievement.name}!`, 'achievement');
            this.displayAchievements();
        }
    }

    displayAchievements() {
        const achievementsContainer = document.querySelector('.achievement-display') || this.createAchievementsContainer();
        
        achievementsContainer.innerHTML = '<h4><i class="fas fa-trophy"></i> Achievements</h4>';
        
        this.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.unlocked ? 'trophy' : 'lock'}"></i>
                </div>
                <div class="achievement-info">
                    <h5>${achievement.name}</h5>
                    <p>${achievement.description}</p>
                </div>
            `;
            achievementsContainer.appendChild(achievementElement);
        });
    }

    createAchievementsContainer() {
        const container = document.createElement('div');
        container.className = 'achievement-display glass-effect';
        
        const chessFeatures = document.querySelector('.chess-features');
        if (chessFeatures) {
            chessFeatures.appendChild(container);
        }
        
        return container;
    }

    addVisualEffects() {
        // Add particle effects for special moves
        this.setupMoveEffects();
        
        // Add screen shake for captures
        this.setupCaptureEffects();
        
        // Add victory animations
        this.setupVictoryEffects();
    }

    setupMoveEffects() {
        // Override the original move function to add effects
        const originalExecuteMove = this.chessGame.executeMove.bind(this.chessGame);
        this.chessGame.executeMove = (piece, newRow, newCol) => {
            this.createMoveParticles(piece.position);
            if (this.gameSettings.soundEnabled) {
                this.playMoveSound();
            }
            return originalExecuteMove(piece, newRow, newCol);
        };
    }

    setupCaptureEffects() {
        const originalCapturePiece = this.chessGame.capturePiece.bind(this.chessGame);
        this.chessGame.capturePiece = (piece) => {
            this.createCaptureEffect(piece.position);
            if (this.gameSettings.soundEnabled) {
                this.playCaptureSound();
            }
            return originalCapturePiece(piece);
        };
    }

    createMoveParticles(position) {
        // Create particle effect at move position
        const particleCount = 10;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.02, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x6C63FF, transparent: true, opacity: 0.8 })
            );
            
            particle.position.copy(position);
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                Math.random() * 0.3,
                (Math.random() - 0.5) * 0.2
            );
            
            particles.push(particle);
            this.chessGame.scene.add(particle);
        }
        
        // Animate particles
        this.animateParticles(particles);
    }

    animateParticles(particles) {
        const animate = () => {
            particles.forEach((particle, index) => {
                particle.position.add(particle.velocity);
                particle.velocity.y -= 0.01; // Gravity
                particle.material.opacity -= 0.02;
                
                if (particle.material.opacity <= 0) {
                    this.chessGame.scene.remove(particle);
                    particles.splice(index, 1);
                }
            });
            
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    createCaptureEffect(position) {
        // Create explosion effect for captures
        const flash = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xFF6B6B, transparent: true, opacity: 0.8 })
        );
        
        flash.position.copy(position);
        this.chessGame.scene.add(flash);
        
        // Animate flash
        const animate = () => {
            flash.scale.multiplyScalar(1.1);
            flash.material.opacity -= 0.05;
            
            if (flash.material.opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.chessGame.scene.remove(flash);
            }
        };
        animate();
    }

    playMoveSound() {
        // Create audio context and play move sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const AudioContextClass = AudioContext || webkitAudioContext;
            const audioContext = new AudioContextClass();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 440;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }

    playCaptureSound() {
        // Play capture sound (higher pitch)
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const AudioContextClass = AudioContext || webkitAudioContext;
            const audioContext = new AudioContextClass();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 660;
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `chess-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle',
            achievement: 'trophy'
        };
        return icons[type] || 'info-circle';
    }

    setupAutoSave() {
        if (this.gameSettings.autoSave) {
            setInterval(() => {
                if (this.chessGame.gameState === 'playing') {
                    this.saveGame();
                }
            }, 30000); // Auto-save every 30 seconds
        }
    }

    saveGameSettings() {
        localStorage.setItem('chess3d_settings', JSON.stringify(this.gameSettings));
    }

    loadGameSettings() {
        const savedSettings = localStorage.getItem('chess3d_settings');
        if (savedSettings) {
            this.gameSettings = { ...this.gameSettings, ...JSON.parse(savedSettings) };
        }
    }

    saveGameStats() {
        localStorage.setItem('chess3d_stats', JSON.stringify(this.gameStats));
    }

    loadGameStats() {
        const savedStats = localStorage.getItem('chess3d_stats');
        if (savedStats) {
            this.gameStats = { ...this.gameStats, ...JSON.parse(savedStats) };
        }
    }

    saveAchievements() {
        localStorage.setItem('chess3d_achievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const savedAchievements = localStorage.getItem('chess3d_achievements');
        if (savedAchievements) {
            const saved = JSON.parse(savedAchievements);
            this.achievements.forEach(achievement => {
                const savedAchievement = saved.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
    }

    updateStats(gameResult) {
        this.gameStats.gamesPlayed++;
        if (gameResult === 'win') {
            this.gameStats.gamesWon++;
        }
        this.gameStats.totalMoves += this.chessGame.moveHistory.length;
        this.saveGameStats();
        this.checkAchievements();
    }
}

// Initialize enhancements when chess game is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for chess game to initialize
    setTimeout(() => {
        if (window.chess3DGame) {
            window.chessEnhancements = new ChessEnhancements(window.chess3DGame);
            
            // Add color selection notification
            document.getElementById('colorSelect')?.addEventListener('change', (e) => {
                const color = e.target.value;
                const colorName = color.charAt(0).toUpperCase() + color.slice(1);
                if (window.chessEnhancements) {
                    window.chessEnhancements.showNotification(
                        `Now playing as ${colorName} pieces! Game restarted.`, 
                        'info'
                    );
                }
            });
        }
    }, 2000);
});
