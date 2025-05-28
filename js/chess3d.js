/**
 * 3D Chess Game Implementation
 * Advanced WebGL-based chess game with AI opponent
 */

class Chess3D {    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.board = null;
        this.pieces = {};
        this.selectedPiece = null;
        this.gameState = 'playing'; // playing, checkmate, stalemate, draw
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.aiDifficulty = 'intermediate';
        this.isAiThinking = false;
        this.gameMode = 'human-vs-ai'; // human-vs-ai, human-vs-human
        this.humanColor = 'white'; // which color the human plays
        
        // Chess board state (8x8 grid)
        this.boardState = this.initializeBoardState();
        
        this.init();
    }
      init() {
        this.setupScene();
        this.createBoard();
        this.createPieces();
        this.setupControls();
        this.setupEventListeners();
        this.updateGameStatus(); // Initialize game status display
        this.animate();
        
        console.log('3D Chess game initialized successfully!');
    }
    
    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 8);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.container.appendChild(this.renderer.domElement);
        
        // Add lighting
        this.setupLighting();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (main light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // Point lights for dramatic effect
        const pointLight1 = new THREE.PointLight(0x6C63FF, 0.8, 100);
        pointLight1.position.set(-10, 5, 0);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00E0FF, 0.8, 100);
        pointLight2.position.set(10, 5, 0);
        this.scene.add(pointLight2);
    }
    
    createBoard() {
        const boardGroup = new THREE.Group();
        const boardSize = 8;
        const squareSize = 1;
        
        // Create board squares
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const isLight = (row + col) % 2 === 0;
                const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize);
                
                const material = new THREE.MeshPhongMaterial({
                    color: isLight ? 0xf0d9b5 : 0xb58863,
                    transparent: true,
                    opacity: 0.9
                });
                
                const square = new THREE.Mesh(geometry, material);
                square.position.set(
                    (col - 3.5) * squareSize,
                    0,
                    (row - 3.5) * squareSize
                );
                
                square.receiveShadow = true;
                square.userData = { row, col, type: 'square' };
                
                boardGroup.add(square);
            }
        }
        
        // Add board border
        const borderGeometry = new THREE.BoxGeometry(9, 0.2, 9);
        const borderMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4a4a4a,
            transparent: true,
            opacity: 0.8
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.y = -0.15;
        boardGroup.add(border);
        
        this.board = boardGroup;
        this.scene.add(boardGroup);
    }
    
    createPieces() {
        const pieceTypes = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        
        // Create white pieces
        for (let col = 0; col < 8; col++) {
            // Pawns
            this.createPiece('pawn', 'white', 1, col);
            // Back row pieces
            this.createPiece(pieceTypes[col], 'white', 0, col);
        }
        
        // Create black pieces
        for (let col = 0; col < 8; col++) {
            // Pawns
            this.createPiece('pawn', 'black', 6, col);
            // Back row pieces
            this.createPiece(pieceTypes[col], 'black', 7, col);
        }
    }
    
    createPiece(type, color, row, col) {
        let geometry;
        
        // Create different geometries for different piece types
        switch (type) {
            case 'pawn':
                geometry = this.createPawnGeometry();
                break;
            case 'rook':
                geometry = this.createRookGeometry();
                break;
            case 'knight':
                geometry = this.createKnightGeometry();
                break;
            case 'bishop':
                geometry = this.createBishopGeometry();
                break;
            case 'queen':
                geometry = this.createQueenGeometry();
                break;
            case 'king':
                geometry = this.createKingGeometry();
                break;
            default:
                geometry = new THREE.ConeGeometry(0.3, 0.6, 8);
        }
          const material = new THREE.MeshPhongMaterial({
            color: color === 'white' ? 0xf8f8f8 : 0x1a1a1a,
            shininess: 150,
            transparent: true,
            opacity: 0.95,
            specular: color === 'white' ? 0x222222 : 0x444444
        });
        
        const piece = new THREE.Mesh(geometry, material);
        piece.position.set(
            (col - 3.5),
            0.35,
            (row - 3.5)
        );
        
        piece.castShadow = true;
        piece.userData = {
            type,
            color,
            row,
            col,
            hasMoved: false,
            originalPosition: { row, col }
        };
        
        // Add piece to pieces object for easy access
        const pieceId = `${color}_${type}_${row}_${col}`;
        this.pieces[pieceId] = piece;
        
        this.scene.add(piece);
        
        // Update board state
        this.boardState[row][col] = { type, color, piece };
    }
    
    createPawnGeometry() {
        const geometry = new THREE.ConeGeometry(0.2, 0.6, 8);
        return geometry;
    }
    
    createRookGeometry() {
        const geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.7, 8);
        return geometry;
    }
    
    createKnightGeometry() {
        // Simplified knight as a more complex shape
        const geometry = new THREE.ConeGeometry(0.3, 0.8, 6);
        return geometry;
    }
    
    createBishopGeometry() {
        const geometry = new THREE.ConeGeometry(0.2, 0.9, 8);
        return geometry;
    }
    
    createQueenGeometry() {
        const geometry = new THREE.ConeGeometry(0.35, 1.0, 8);
        return geometry;
    }
    
    createKingGeometry() {
        const geometry = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 8);
        return geometry;
    }
    
    setupControls() {
        // Add orbit controls for camera movement
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2.2;
    }
    
    setupEventListeners() {
        // Raycaster for mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });
        
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Game controls
        document.getElementById('newGameBtn')?.addEventListener('click', () => {
            this.newGame();
        });
        
        document.getElementById('resetBtn')?.addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('toggleViewBtn')?.addEventListener('click', () => {
            this.toggleView();
        });
          document.getElementById('difficultySelect')?.addEventListener('change', (e) => {
            this.aiDifficulty = e.target.value;
        });
        
        document.getElementById('colorSelect')?.addEventListener('change', (e) => {
            this.humanColor = e.target.value;
            console.log('Human color changed to:', this.humanColor);
            // Start a new game with the new color selection
            this.resetGame();
        });
    }
    
    onMouseClick(event) {
        if (this.isAiThinking) return;
        
        this.updateMousePosition(event);
        
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            
            if (object.userData.type && object.userData.type !== 'square') {
                // Clicked on a piece
                this.selectPiece(object);
            } else if (object.userData.type === 'square') {
                // Clicked on a square
                this.movePiece(object.userData.row, object.userData.col);
            }
        }
    }
      onMouseMove(event) {
        this.updateMousePosition(event);
        
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        // Reset all piece hover effects
        Object.values(this.pieces).forEach(piece => {
            if (piece !== this.selectedPiece) {
                piece.material.emissive.setHex(0x000000);
            }
        });
        
        // Update cursor style and add hover effects
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.type && object.userData.type !== 'square') {
                // Check if this piece can be selected
                const canSelect = object.userData.color === this.currentPlayer && 
                                (this.gameMode !== 'human-vs-ai' || this.currentPlayer === this.humanColor) &&
                                !this.isAiThinking;
                
                if (canSelect) {
                    this.renderer.domElement.style.cursor = 'pointer';
                    if (object !== this.selectedPiece) {
                        object.material.emissive.setHex(0x222222);
                    }
                } else {
                    this.renderer.domElement.style.cursor = 'not-allowed';
                }
            } else {
                this.renderer.domElement.style.cursor = 'default';
            }
        } else {
            this.renderer.domElement.style.cursor = 'default';
        }
    }
    
    updateMousePosition(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
    }
      selectPiece(piece) {
        // Clear previous selection
        this.clearSelection();
        
        // Only allow selecting pieces of current player and only if it's human's turn
        if (piece.userData.color !== this.currentPlayer || 
            (this.gameMode === 'human-vs-ai' && this.currentPlayer !== this.humanColor)) {
            console.log('Cannot select piece:', piece.userData.color, 'Current player:', this.currentPlayer, 'Human color:', this.humanColor);
            return;
        }
        
        this.selectedPiece = piece;
        
        // Enhanced highlighting for selected piece
        piece.material.emissive.setHex(0x444444);
        piece.material.opacity = 1.0;
        
        // Show possible moves
        this.showPossibleMoves(piece);
        
        console.log('Selected piece:', piece.userData.type, piece.userData.color);
    }
      clearSelection() {
        if (this.selectedPiece) {
            this.selectedPiece.material.emissive.setHex(0x000000);
            this.selectedPiece.material.opacity = 0.95;
            this.selectedPiece = null;
        }
        
        // Clear move indicators
        this.clearMoveIndicators();
    }
    
    showPossibleMoves(piece) {
        const possibleMoves = this.getPossibleMoves(piece);
        
        possibleMoves.forEach(move => {
            const indicator = this.createMoveIndicator(move.row, move.col, move.isCapture);
            this.scene.add(indicator);
        });
    }
    
    createMoveIndicator(row, col, isCapture = false) {
        const geometry = new THREE.RingGeometry(0.3, 0.4, 16);
        const material = new THREE.MeshBasicMaterial({
            color: isCapture ? 0xff4444 : 0x44ff44,
            transparent: true,
            opacity: 0.7
        });
        
        const indicator = new THREE.Mesh(geometry, material);
        indicator.position.set((col - 3.5), 0.06, (row - 3.5));
        indicator.rotation.x = -Math.PI / 2;
        indicator.userData = { type: 'moveIndicator' };
        
        return indicator;
    }
    
    clearMoveIndicators() {
        const indicators = this.scene.children.filter(
            child => child.userData.type === 'moveIndicator'
        );
        indicators.forEach(indicator => {
            this.scene.remove(indicator);
        });
    }
    
    movePiece(targetRow, targetCol) {
        if (!this.selectedPiece) return;
        
        const piece = this.selectedPiece;
        const possibleMoves = this.getPossibleMoves(piece);
        const validMove = possibleMoves.find(
            move => move.row === targetRow && move.col === targetCol
        );
        
        if (!validMove) {
            this.clearSelection();
            return;
        }
        
        this.executeMove(piece, targetRow, targetCol);
    }
    
    executeMove(piece, targetRow, targetCol) {
        const oldRow = piece.userData.row;
        const oldCol = piece.userData.col;
        
        // Handle captures
        const targetPiece = this.boardState[targetRow][targetCol];
        if (targetPiece && targetPiece.piece) {
            this.capturePiece(targetPiece.piece);
        }
        
        // Update piece position
        piece.position.set((targetCol - 3.5), 0.35, (targetRow - 3.5));
        piece.userData.row = targetRow;
        piece.userData.col = targetCol;
        piece.userData.hasMoved = true;
        
        // Update board state
        this.boardState[oldRow][oldCol] = null;
        this.boardState[targetRow][targetCol] = {
            type: piece.userData.type,
            color: piece.userData.color,
            piece: piece
        };
        
        // Add to move history
        this.addToMoveHistory(piece.userData.type, oldRow, oldCol, targetRow, targetCol);
        
        // Clear selection
        this.clearSelection();
        
        // Switch players
        this.switchPlayer();
        
        // Check for game end conditions
        this.checkGameEnd();
          // AI move if it's AI's turn
        if (this.currentPlayer === 'black' && this.gameState === 'playing') {
            setTimeout(() => {
                this.makeAiMove();
            }, 1000);
        }
    }
    
    capturePiece(piece) {
        const color = piece.userData.color;
        this.capturedPieces[color].push(piece);
        
        // Remove from scene
        this.scene.remove(piece);
        
        // Update captured pieces display
        this.updateCapturedPiecesDisplay();    }
      switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Update UI immediately
        this.updateGameStatus();
        
        // Trigger AI move if current player is AI and it's AI's turn
        if (this.gameMode === 'human-vs-ai' && this.currentPlayer !== this.humanColor && this.gameState === 'playing') {
            this.isAiThinking = true;
            setTimeout(() => this.makeAiMove(), 1000);
        }
    }
      updateGameStatus() {
        const statusElement = document.getElementById('currentPlayer');
        if (statusElement) {
            const playerName = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
            const isHumanTurn = this.currentPlayer === this.humanColor;
            const turnText = isHumanTurn ? `Your Turn (${playerName})` : `AI Turn (${playerName})`;
            
            statusElement.textContent = turnText;
            statusElement.style.color = this.currentPlayer === 'white' ? '#f5f5f5' : '#2c2c2c';
            statusElement.style.fontWeight = isHumanTurn ? 'bold' : 'normal';
            
            // Add visual indicator for human turn
            if (isHumanTurn) {
                statusElement.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                statusElement.style.padding = '0.5rem 1rem';
                statusElement.style.borderRadius = '10px';
            } else {
                statusElement.style.background = 'transparent';
                statusElement.style.padding = '0';
            }
        }
    }
    
    getPossibleMoves(piece) {
        const moves = [];
        const { type, color, row, col } = piece.userData;
        
        switch (type) {
            case 'pawn':
                return this.getPawnMoves(row, col, color);
            case 'rook':
                return this.getRookMoves(row, col, color);
            case 'knight':
                return this.getKnightMoves(row, col, color);
            case 'bishop':
                return this.getBishopMoves(row, col, color);
            case 'queen':
                return this.getQueenMoves(row, col, color);
            case 'king':
                return this.getKingMoves(row, col, color);
            default:
                return moves;
        }
    }
    
    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? 1 : -1;
        const startRow = color === 'white' ? 1 : 6;
        
        // Forward move
        const newRow = row + direction;
        if (this.isValidPosition(newRow, col) && !this.boardState[newRow][col]) {
            moves.push({ row: newRow, col });
            
            // Double move from starting position
            if (row === startRow && !this.boardState[newRow + direction][col]) {
                moves.push({ row: newRow + direction, col });
            }
        }
        
        // Capture moves
        [-1, 1].forEach(colOffset => {
            const captureCol = col + colOffset;
            if (this.isValidPosition(newRow, captureCol)) {
                const target = this.boardState[newRow][captureCol];
                if (target && target.color !== color) {
                    moves.push({ row: newRow, col: captureCol, isCapture: true });
                }
            }
        });
        
        return moves;
    }
    
    getRookMoves(row, col, color) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dRow * i;
                const newCol = col + dCol * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = this.boardState[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== color) {
                        moves.push({ row: newRow, col: newCol, isCapture: true });
                    }
                    break;
                }
            }
        });
        
        return moves;
    }
    
    getKnightMoves(row, col, color) {
        const moves = [];
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        
        knightMoves.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = this.boardState[newRow][newCol];
                if (!target || target.color !== color) {
                    moves.push({ 
                        row: newRow, 
                        col: newCol, 
                        isCapture: !!target 
                    });
                }
            }
        });
        
        return moves;
    }
    
    getBishopMoves(row, col, color) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        directions.forEach(([dRow, dCol]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dRow * i;
                const newCol = col + dCol * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = this.boardState[newRow][newCol];
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== color) {
                        moves.push({ row: newRow, col: newCol, isCapture: true });
                    }
                    break;
                }
            }
        });
        
        return moves;
    }
    
    getQueenMoves(row, col, color) {
        return [
            ...this.getRookMoves(row, col, color),
            ...this.getBishopMoves(row, col, color)
        ];
    }
    
    getKingMoves(row, col, color) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        directions.forEach(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = this.boardState[newRow][newCol];
                if (!target || target.color !== color) {
                    moves.push({ 
                        row: newRow, 
                        col: newCol, 
                        isCapture: !!target 
                    });
                }
            }
        });
        
        return moves;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
      makeAiMove() {
        if (this.isAiThinking || this.gameState !== 'playing') return;
        
        this.isAiThinking = true;
        console.log('AI is thinking... Difficulty:', this.aiDifficulty);
        
        // Update status to show AI is thinking
        const statusElement = document.getElementById('currentPlayer');
        if (statusElement) {
            statusElement.textContent = `AI is thinking... (${this.aiDifficulty})`;
        }
        
        // Simple AI implementation with difficulty-based delays and logic
        const allPieces = Object.values(this.pieces).filter(
            piece => piece.userData.color === this.currentPlayer && 
            this.scene.children.includes(piece)
        );
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        // Difficulty affects thinking time and move quality
        const thinkingTime = {
            'beginner': 500,
            'intermediate': 1000,
            'advanced': 1500,
            'expert': 2000
        }[this.aiDifficulty] || 1000;
        
        allPieces.forEach(piece => {
            const moves = this.getPossibleMoves(piece);
            moves.forEach(move => {
                const score = this.evaluateMove(piece, move);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { piece, move };
                }
            });
        });
        
        setTimeout(() => {
            if (bestMove) {
                this.selectedPiece = bestMove.piece;
                this.executeMove(bestMove.piece, bestMove.move.row, bestMove.move.col);
                console.log('AI moved:', bestMove.piece.userData.type, 'to', bestMove.move.row, bestMove.move.col);
            }
            this.isAiThinking = false;
        }, thinkingTime);
    }
    
    evaluateMove(piece, move) {
        let score = Math.random(); // Basic randomness
        
        // Prefer captures
        if (move.isCapture) {
            score += 10;
        }
        
        // Prefer center control
        const centerDistance = Math.abs(move.row - 3.5) + Math.abs(move.col - 3.5);
        score += (7 - centerDistance) * 0.1;
        
        return score;
    }
    
    checkGameEnd() {
        // Basic game end detection (simplified)
        // In a full implementation, you'd check for checkmate, stalemate, etc.
    }
    
    addToMoveHistory(pieceType, fromRow, fromCol, toRow, toCol) {
        const move = {
            piece: pieceType,
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            player: this.currentPlayer
        };
        
        this.moveHistory.push(move);
        this.updateMoveHistoryDisplay();
    }
    
    updateMoveHistoryDisplay() {
        const historyElement = document.getElementById('moveHistory');
        if (historyElement) {
            historyElement.innerHTML = '';
            this.moveHistory.forEach((move, index) => {
                const moveElement = document.createElement('div');
                moveElement.className = 'move-item';
                moveElement.textContent = `${index + 1}. ${move.piece} ${String.fromCharCode(97 + move.from.col)}${8 - move.from.row} → ${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;
                historyElement.appendChild(moveElement);
            });
            historyElement.scrollTop = historyElement.scrollHeight;
        }
    }
    
    updateCapturedPiecesDisplay() {
        ['white', 'black'].forEach(color => {
            const element = document.getElementById(`captured${color.charAt(0).toUpperCase() + color.slice(1)}`);
            if (element) {
                element.innerHTML = '';
                this.capturedPieces[color].forEach(piece => {
                    const pieceElement = document.createElement('span');
                    pieceElement.className = 'captured-piece';
                    pieceElement.textContent = this.getPieceSymbol(piece.userData.type);
                    element.appendChild(pieceElement);
                });
            }
        });
    }
    
    getPieceSymbol(type) {
        const symbols = {
            'king': '♔',
            'queen': '♕',
            'rook': '♖',
            'bishop': '♗',
            'knight': '♘',
            'pawn': '♙'
        };
        return symbols[type] || '?';
    }
    
    newGame() {
        this.resetGame();
    }
      resetGame() {
        // Clear scene
        Object.values(this.pieces).forEach(piece => {
            this.scene.remove(piece);
        });
        this.clearMoveIndicators();
        
        // Reset game state
        this.pieces = {};
        this.selectedPiece = null;
        this.currentPlayer = 'white';
        this.gameState = 'playing';
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.boardState = this.initializeBoardState();
        this.isAiThinking = false;
        
        // Recreate pieces
        this.createPieces();
        
        // Update UI
        this.updateMoveHistoryDisplay();
        this.updateCapturedPiecesDisplay();
        this.updateGameStatus();
        
        console.log('Game reset. Human playing as:', this.humanColor);
        
        // If human is playing black, AI makes the first move
        if (this.humanColor === 'black') {
            setTimeout(() => this.makeAiMove(), 1000);
        }
    }
    
    toggleView() {
        // Rotate camera view
        const currentPosition = this.camera.position.clone();
        this.camera.position.set(-currentPosition.x, currentPosition.y, -currentPosition.z);
        this.camera.lookAt(0, 0, 0);
    }
    
    initializeBoardState() {
        return Array(8).fill(null).map(() => Array(8).fill(null));
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the chess game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is required for the 3D chess game');
        return;
    }
    
    const chessContainer = document.getElementById('chess3d');
    if (chessContainer) {
        window.chess3D = new Chess3D(chessContainer);
    }
});
