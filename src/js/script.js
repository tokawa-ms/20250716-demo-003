/**
 * レトロテトリス - メインゲームロジック
 * 80年代風のテトリスゲーム実装
 */

class RetroTetris {
    constructor() {
        // ゲーム設定
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.CELL_SIZE = 30;
        
        // ゲーム状態
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameStarted = false;
        this.gameRunning = false;
        this.gamePaused = false;
        this.dropTime = 0;
        this.dropInterval = 1000; // 1秒間隔で落下
        
        // Canvas要素
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        
        // UI要素
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.nextPieceElement = document.getElementById('next-piece');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.pauseModal = document.getElementById('pause-modal');
        this.startModal = document.getElementById('start-modal');
        this.finalScoreElement = document.getElementById('final-score');
        
        // 音楽管理
        this.audioContext = null;
        this.musicPlaying = true;
        this.currentNote = 0;
        this.noteTimer = 0;
        
        // テトロミノの定義
        this.tetrominoes = {
            'I': {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00ffff'
            },
            'O': {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            'T': {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#ff00ff'
            },
            'S': {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00ff00'
            },
            'Z': {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#ff0000'
            },
            'J': {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#0000ff'
            },
            'L': {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#ffa500'
            }
        };
        
        // コロベイニキのメロディ（MIDI音階）
        this.korobeinikiMelody = [
            659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, // E D C B C D A
            440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 523.25, // A C E D C B C
            587.33, 659.25, 523.25, 440.00, 440.00, 0, // B E C A A (rest)
            587.33, 698.46, 880.00, 783.99, 698.46, 659.25, 523.25, // D F A G F E C
            659.25, 587.33, 523.25, 493.88, 523.25, 587.33, 659.25, // E D C B C D E
            523.25, 440.00, 440.00, 0 // C A A (rest)
        ];
        
        this.noteDuration = 400; // 各音符の長さ(ms)
        
        this.init();
    }
    
    /**
     * ゲームの初期化
     */
    init() {
        this.initBoard();
        this.setupEventListeners();
        this.initAudio();
        this.showStartScreen();
        this.gameLoop(); // ゲームループを開始（スタート画面状態で）
    }
    
    /**
     * スタート画面を表示
     */
    showStartScreen() {
        this.gameStarted = false;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // すべてのモーダルを隠す
        this.gameOverModal.classList.add('hidden');
        this.pauseModal.classList.add('hidden');
        
        // スタートモーダルを表示
        this.startModal.classList.remove('hidden');
        this.startModal.classList.add('modal-enter');
        
        // 空のボードを描画
        this.render();
    }

    /**
     * ゲーム開始
     */
    startGame() {
        console.log('startGame() called!');
        this.gameStarted = true;
        this.gameRunning = true;
        this.gamePaused = false;
        
        // スタートモーダルを隠す
        this.startModal.classList.add('hidden');
        this.startModal.classList.remove('modal-enter');
        
        // ゲーム状態をリセット
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        this.currentNote = 0;
        this.dropTime = Date.now();
        
        // ボードとピースを初期化
        this.initBoard();
        this.generateNextPiece();
        this.spawnPiece();
        this.updateDisplay();
    }

    /**
     * ゲームボードの初期化
     */
    initBoard() {
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => 
            Array(this.BOARD_WIDTH).fill(0)
        );
    }
    
    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // キーボード操作
        document.addEventListener('keydown', (e) => {
            if (!this.gameStarted) {
                console.log('Key pressed while not started:', e.code);
                if (e.code === 'Space' || e.code === 'Enter') {
                    console.log('Starting game with key:', e.code);
                    this.startGame();
                }
                return;
            }
            
            if (!this.gameRunning || this.gamePaused) {
                if (e.code === 'Space') {
                    this.togglePause();
                }
                return;
            }
            
            switch(e.code) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case 'Space':
                    this.togglePause();
                    break;
            }
            e.preventDefault();
        });
        
        // モバイル用ボタン
        document.getElementById('btn-left')?.addEventListener('click', () => {
            if (this.gameStarted && this.gameRunning && !this.gamePaused) this.movePiece(-1, 0);
        });
        
        document.getElementById('btn-right')?.addEventListener('click', () => {
            if (this.gameStarted && this.gameRunning && !this.gamePaused) this.movePiece(1, 0);
        });
        
        document.getElementById('btn-down')?.addEventListener('click', () => {
            if (this.gameStarted && this.gameRunning && !this.gamePaused) this.movePiece(0, 1);
        });
        
        document.getElementById('btn-rotate')?.addEventListener('click', () => {
            if (this.gameStarted && this.gameRunning && !this.gamePaused) this.rotatePiece();
        });
        
        document.getElementById('btn-pause')?.addEventListener('click', () => {
            if (this.gameStarted) this.togglePause();
        });
        
        // スタートボタン
        document.getElementById('start-btn')?.addEventListener('click', () => {
            console.log('START button clicked!');
            this.startGame();
        });
        
        // リスタートボタン
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.restart();
        });
        
        // 音楽トグルボタン
        document.getElementById('music-toggle')?.addEventListener('click', () => {
            this.toggleMusic();
        });
    }
    
    /**
     * Web Audio APIの初期化
     */
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API is not supported');
        }
    }
    
    /**
     * 音符を再生
     */
    playNote(frequency, duration) {
        if (!this.audioContext || !this.musicPlaying) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'square'; // レトロ風の音
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
    
    /**
     * 音楽の切り替え
     */
    toggleMusic() {
        this.musicPlaying = !this.musicPlaying;
        const button = document.getElementById('music-toggle');
        button.textContent = this.musicPlaying ? '🎵 ON' : '🔇 OFF';
    }
    
    /**
     * ランダムなテトロミノを生成
     */
    generateRandomPiece() {
        const types = Object.keys(this.tetrominoes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const tetromino = this.tetrominoes[randomType];
        
        return {
            type: randomType,
            shape: tetromino.shape.map(row => [...row]),
            color: tetromino.color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
            y: 0
        };
    }
    
    /**
     * 次のピースを生成
     */
    generateNextPiece() {
        this.nextPiece = this.generateRandomPiece();
        this.renderNextPiece();
    }
    
    /**
     * 新しいピースをスポーン
     */
    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.generateNextPiece();
        
        // ゲームオーバーチェック
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver();
        }
    }
    
    /**
     * ピースの移動
     */
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (!this.checkCollision(newX, newY, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            this.render();
        } else if (dy > 0) {
            // 下方向の移動で衝突した場合、ピースを固定
            this.placePiece();
        }
    }
    
    /**
     * ピースの回転
     */
    rotatePiece() {
        const rotatedShape = this.rotateMatrix(this.currentPiece.shape);
        
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotatedShape)) {
            this.currentPiece.shape = rotatedShape;
            this.render();
        }
    }
    
    /**
     * マトリックスの回転
     */
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    /**
     * 衝突判定
     */
    checkCollision(x, y, shape) {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    const newX = x + j;
                    const newY = y + i;
                    
                    if (newX < 0 || newX >= this.BOARD_WIDTH || 
                        newY >= this.BOARD_HEIGHT ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    /**
     * ピースをボードに配置
     */
    placePiece() {
        for (let i = 0; i < this.currentPiece.shape.length; i++) {
            for (let j = 0; j < this.currentPiece.shape[i].length; j++) {
                if (this.currentPiece.shape[i][j]) {
                    const boardY = this.currentPiece.y + i;
                    const boardX = this.currentPiece.x + j;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
    }
    
    /**
     * ライン消去処理
     */
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // ライン消去エフェクト
                this.playLineClearEffect(y);
                
                this.board.splice(y, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // 同じ行を再チェック
            }
        }
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
            this.createParticleEffect();
        }
    }
    
    /**
     * ライン消去エフェクト
     */
    playLineClearEffect(line) {
        // 効果音を再生（高音）
        this.playNote(880, 200);
        
        setTimeout(() => {
            this.render();
        }, 100);
    }
    
    /**
     * パーティクルエフェクト
     */
    createParticleEffect() {
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }
    
    /**
     * スコア更新
     */
    updateScore(linesCleared) {
        const linePoints = [0, 100, 300, 500, 800];
        const points = linePoints[linesCleared] * this.level;
        
        this.score += points;
        this.lines += linesCleared;
        
        // レベルアップ判定（10ライン毎）
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
        
        this.updateDisplay();
        
        // スコアポップアップ
        if (points > 0) {
            this.showScorePopup(points);
        }
    }
    
    /**
     * スコアポップアップ表示
     */
    showScorePopup(points) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        
        this.canvas.parentElement.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    /**
     * ディスプレイ更新
     */
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.linesElement.textContent = this.lines;
    }
    
    /**
     * 次のピース表示
     */
    renderNextPiece() {
        this.nextPieceElement.innerHTML = '';
        
        if (!this.nextPiece) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        const cellSize = 15;
        const shape = this.nextPiece.shape;
        const offsetX = (canvas.width - shape[0].length * cellSize) / 2;
        const offsetY = (canvas.height - shape.length * cellSize) / 2;
        
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j]) {
                    ctx.fillStyle = this.nextPiece.color;
                    ctx.fillRect(
                        offsetX + j * cellSize,
                        offsetY + i * cellSize,
                        cellSize - 1,
                        cellSize - 1
                    );
                    
                    // グロー効果
                    ctx.shadowColor = this.nextPiece.color;
                    ctx.shadowBlur = 5;
                }
            }
        }
        
        this.nextPieceElement.appendChild(canvas);
    }
    
    /**
     * メインレンダリング
     */
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // ボードの描画
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(
                        x * this.CELL_SIZE,
                        y * this.CELL_SIZE,
                        this.CELL_SIZE - 1,
                        this.CELL_SIZE - 1
                    );
                    
                    // グロー効果
                    this.ctx.shadowColor = this.board[y][x];
                    this.ctx.shadowBlur = 3;
                }
            }
        }
        
        // 現在のピースの描画
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            this.ctx.shadowColor = this.currentPiece.color;
            this.ctx.shadowBlur = 5;
            
            for (let i = 0; i < this.currentPiece.shape.length; i++) {
                for (let j = 0; j < this.currentPiece.shape[i].length; j++) {
                    if (this.currentPiece.shape[i][j]) {
                        const x = (this.currentPiece.x + j) * this.CELL_SIZE;
                        const y = (this.currentPiece.y + i) * this.CELL_SIZE;
                        
                        this.ctx.fillRect(x, y, this.CELL_SIZE - 1, this.CELL_SIZE - 1);
                    }
                }
            }
        }
        
        // リセット
        this.ctx.shadowBlur = 0;
    }
    
    /**
     * 一時停止の切り替え
     */
    togglePause() {
        if (!this.gameStarted || !this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.pauseModal.classList.remove('hidden');
            this.pauseModal.classList.add('modal-enter');
        } else {
            this.pauseModal.classList.add('hidden');
            this.pauseModal.classList.remove('modal-enter');
        }
    }
    
    /**
     * ゲームオーバー
     */
    gameOver() {
        this.gameRunning = false;
        this.gameStarted = false;
        this.finalScoreElement.textContent = this.score;
        
        // スタートモーダルを隠してからゲームオーバーモーダルを表示
        this.startModal.classList.add('hidden');
        this.pauseModal.classList.add('hidden');
        this.gameOverModal.classList.remove('hidden');
        this.gameOverModal.classList.add('modal-enter');
        
        // ゲームオーバー音
        this.playNote(220, 500);
        setTimeout(() => this.playNote(196, 500), 250);
        setTimeout(() => this.playNote(174, 1000), 500);
    }
    
    /**
     * ゲームリスタート
     */
    restart() {
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        this.gameStarted = true;
        this.gameRunning = true;
        this.gamePaused = false;
        this.currentNote = 0;
        
        this.gameOverModal.classList.add('hidden');
        this.pauseModal.classList.add('hidden');
        this.startModal.classList.add('hidden');
        
        this.initBoard();
        this.generateNextPiece();
        this.spawnPiece();
        this.updateDisplay();
        this.render();
    }
    
    /**
     * メインゲームループ
     */
    gameLoop() {
        const currentTime = Date.now();
        
        if (this.gameStarted && this.gameRunning && !this.gamePaused) {
            // ピースの自動落下
            if (currentTime - this.dropTime > this.dropInterval) {
                this.movePiece(0, 1);
                this.dropTime = currentTime;
            }
            
            // BGM再生
            if (this.musicPlaying && this.audioContext && 
                currentTime - this.noteTimer > this.noteDuration) {
                const frequency = this.korobeinikiMelody[this.currentNote];
                if (frequency > 0) {
                    this.playNote(frequency, this.noteDuration * 0.8);
                }
                
                this.currentNote = (this.currentNote + 1) % this.korobeinikiMelody.length;
                this.noteTimer = currentTime;
            }
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    let game = null;
    
    // Web Audio Contextの初期化のためにユーザーインタラクションが必要
    const initAudioAndStart = () => {
        if (game) {
            // すでにゲームが初期化されている場合は音声のみ初期化
            game.initAudio();
        }
        document.removeEventListener('click', initAudioAndStart);
        document.removeEventListener('keydown', initAudioAndStart);
    };
    
    document.addEventListener('click', initAudioAndStart);
    document.addEventListener('keydown', initAudioAndStart);
    
    // ゲームの初期化（スタート画面表示、ゲームループ開始も含む）
    game = new RetroTetris();
});