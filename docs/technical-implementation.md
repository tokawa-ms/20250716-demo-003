# レトロテトリス - 技術実装ドキュメント

## 実装概要

このドキュメントでは、レトロテトリスゲームの技術的な実装詳細について説明します。

## アーキテクチャ

### システム構成
```
Frontend (Browser)
├── HTML5 (index.html)
│   ├── Canvas Element (ゲーム描画)
│   ├── UI Elements (スコア、ボタン等)
│   └── Responsive Layout (Tailwind CSS)
├── CSS3 (styles.css)
│   ├── Retro Visual Effects
│   ├── Animations & Transitions
│   └── Mobile Responsive Design
└── JavaScript ES6+ (script.js)
    ├── Game Logic Engine
    ├── Audio System (Web Audio API)
    ├── Input Handler
    └── Rendering System
```

### クラス設計

#### RetroTetris クラス
メインゲームロジックを管理するクラス

```javascript
class RetroTetris {
    // ゲーム状態管理
    constructor()
    init()
    
    // ゲーム制御
    gameLoop()
    restart()
    togglePause()
    
    // テトロミノ管理
    generateRandomPiece()
    spawnPiece()
    movePiece(dx, dy)
    rotatePiece()
    placePiece()
    
    // ゲームロジック
    checkCollision(x, y, shape)
    clearLines()
    updateScore(linesCleared)
    
    // 描画システム
    render()
    renderNextPiece()
    
    // 音楽システム
    playNote(frequency, duration)
    toggleMusic()
}
```

## 主要機能の実装

### 1. ゲームボード管理

#### データ構造
```javascript
// 20行 × 10列の2次元配列
this.board = Array(20).fill().map(() => 
    Array(10).fill(0)
);

// 0: 空のセル
// 色文字列: 配置済みブロック (例: "#00ff00")
```

#### Canvas描画
```javascript
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
            }
        }
    }
}
```

### 2. テトロミノシステム

#### テトロミノ定義
```javascript
this.tetrominoes = {
    'I': {
        shape: [[1, 1, 1, 1]],
        color: '#00ffff'
    },
    'O': {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '#ffff00'
    },
    // ... 他のテトロミノ
};
```

#### 回転アルゴリズム
```javascript
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
```

#### 衝突判定
```javascript
checkCollision(x, y, shape) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                const newX = x + j;
                const newY = y + i;
                
                // 境界チェック
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
```

### 3. ライン消去システム

#### ライン検出と削除
```javascript
clearLines() {
    let linesCleared = 0;
    
    for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
        if (this.board[y].every(cell => cell !== 0)) {
            // ライン消去エフェクト
            this.playLineClearEffect(y);
            
            // ライン削除と上のブロック落下
            this.board.splice(y, 1);
            this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
            linesCleared++;
            y++; // 同じ行を再チェック
        }
    }
    
    if (linesCleared > 0) {
        this.updateScore(linesCleared);
    }
}
```

#### スコア計算
```javascript
updateScore(linesCleared) {
    const linePoints = [0, 100, 300, 500, 800];
    const points = linePoints[linesCleared] * this.level;
    
    this.score += points;
    this.lines += linesCleared;
    
    // レベルアップ (10ライン毎)
    const newLevel = Math.floor(this.lines / 10) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
    }
}
```

### 4. 音楽システム

#### Web Audio API実装
```javascript
initAudio() {
    try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API is not supported');
    }
}

playNote(frequency, duration) {
    if (!this.audioContext || !this.musicPlaying) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'square'; // レトロ風音質
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
}
```

#### コロベイニキメロディー
```javascript
// MIDI音階での定義
this.korobeinikiMelody = [
    659.25, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, // E D C B C D A
    440.00, 523.25, 659.25, 587.33, 523.25, 493.88, 523.25, // A C E D C B C
    587.33, 659.25, 523.25, 440.00, 440.00, 0, // B E C A A (rest)
    // ... 続く
];
```

### 5. イベント処理システム

#### キーボード入力
```javascript
setupEventListeners() {
    document.addEventListener('keydown', (e) => {
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
}
```

#### タッチ操作（モバイル）
```javascript
// 各ボタンにイベントリスナーを設定
document.getElementById('btn-left')?.addEventListener('click', () => {
    if (this.gameRunning && !this.gamePaused) this.movePiece(-1, 0);
});

document.getElementById('btn-right')?.addEventListener('click', () => {
    if (this.gameRunning && !this.gamePaused) this.movePiece(1, 0);
});
```

### 6. ビジュアルエフェクト

#### CSS3アニメーション
```css
@keyframes glow {
    0%, 100% {
        text-shadow: 
            0 0 5px #00ff00,
            0 0 10px #00ff00,
            0 0 15px #00ff00;
    }
    50% {
        text-shadow: 
            0 0 10px #00ff00,
            0 0 20px #00ff00,
            0 0 30px #00ff00;
    }
}

.retro-text {
    animation: glow 2s ease-in-out infinite alternate;
}
```

#### パーティクルエフェクト
```javascript
createParticleEffect() {
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
```

### 7. レスポンシブデザイン

#### Tailwind CSS グリッドレイアウト
```html
<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- 左サイドパネル -->
    <div class="lg:col-span-1 space-y-4">
        <!-- 次のピース、操作説明 -->
    </div>
    
    <!-- ゲームボード -->
    <div class="lg:col-span-2 flex justify-center">
        <canvas id="game-board"></canvas>
    </div>
    
    <!-- 右サイドパネル -->
    <div class="lg:col-span-1 space-y-4">
        <!-- スコア、レベル、ライン数 -->
    </div>
</div>
```

#### 画面サイズ別最適化
```css
@media (max-width: 768px) {
    #game-board {
        width: 250px !important;
        height: 500px !important;
    }
    
    .retro-text {
        font-size: 2rem !important;
    }
}

@media (max-width: 480px) {
    #game-board {
        width: 200px !important;
        height: 400px !important;
    }
}
```

## パフォーマンス最適化

### 1. 描画最適化
- `requestAnimationFrame`を使用した効率的な描画ループ
- Canvas APIのハードウェアアクセラレーション活用
- 不要な再描画の防止

### 2. メモリ管理
- オブジェクトの再利用（テトロミノ、パーティクル）
- 適切なイベントリスナーの削除
- 音楽オブジェクトの適切な破棄

### 3. 音楽パフォーマンス
- Web Audio APIの効率的な使用
- 音符生成の最適化
- 不要なオーディオノードの削除

## エラーハンドリング

### 1. Web Audio API対応
```javascript
initAudio() {
    try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API is not supported');
        // 音楽なしでゲーム続行
    }
}
```

### 2. Canvas対応チェック
```javascript
if (!this.canvas.getContext) {
    console.error('Canvas not supported');
    return;
}
```

### 3. 適切なフォールバック
- Web Audio API非対応時は音楽なしで動作
- Canvas非対応時は適切なエラーメッセージ表示
- 古いブラウザでの適切な動作保証

## セキュリティ考慮事項

### 1. XSS対策
- DOMの直接操作時のサニタイゼーション
- innerHTML使用時の注意

### 2. CSP対応
- Content Security Policy準拠
- インラインスクリプトの最小化

### 3. 依存関係セキュリティ
- CDNからの読み込み時の整合性チェック
- 外部依存関係の最小化

## 今後の技術改善計画

### v1.1.0
- [ ] ローカルストレージを使用したハイスコア保存
- [ ] ServiceWorkerによるオフライン対応
- [ ] より高度なビジュアルエフェクト

### v1.2.0
- [ ] WebGLを使用した高速描画
- [ ] WebWorkerによるゲームロジック並列化
- [ ] 複数BGMトラックの実装

### v2.0.0
- [ ] PWA（Progressive Web App）対応
- [ ] WebRTCを使用したマルチプレイ機能
- [ ] WebAssemblyによる高速化