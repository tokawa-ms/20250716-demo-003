# BGM実装ドキュメント - コロベイニキメロディー

## 概要

レトロテトリスのBGM実装について説明します。コロベイニキ（Korobeiniki）メロディーを正確なリズムで再生するためのシステムです。

## 実装詳細

### 音符定義

#### 正確なコロベイニキメロディー

正しいメロディー：
```
E四分,B↓八分,C八分,D四分,C八分,B↓八分,
A↓四分,A↓八分,C八分,E四分,D八分,C八分,
B↓四分,B↓八分,C八分,D四分,E四分,
C四分,A↓四分,A↓四分,休み四分
休み八分,D四分,F八分,A四分,G八分,F八分,
E四分,休み八分,C八分,E四分,D八分,C八分,
B↓四分,B↓八分,C八分,D四分,E四分
C四分,A↓四分,A↓二分
```

#### メロディー配列 (korobeinikiMelody)
```javascript
this.korobeinikiMelody = [
    659.25, 493.88, 523.25, 587.33, 523.25, 493.88,  // E B↓ C D C B↓
    440.00, 440.00, 523.25, 659.25, 587.33, 523.25,  // A↓ A↓ C E D C
    493.88, 493.88, 523.25, 587.33, 659.25,          // B↓ B↓ C D E
    523.25, 440.00, 440.00, 0,                        // C A↓ A↓ (休み)
    0, 587.33, 698.46, 880.00, 783.99, 698.46,       // (休み) D F A G F
    659.25, 0, 523.25, 659.25, 587.33, 523.25,       // E (休み) C E D C
    493.88, 493.88, 523.25, 587.33, 659.25,          // B↓ B↓ C D E
    523.25, 440.00, 440.00                            // C A↓ A↓
];
```
*配列要素数: 41個*

#### 音符長配列 (korobeinikiDurations)
```javascript
this.korobeinikiDurations = [
    400, 200, 200, 400, 200, 200,  // E四分 B↓八分 C八分 D四分 C八分 B↓八分
    400, 200, 200, 400, 200, 200,  // A↓四分 A↓八分 C八分 E四分 D八分 C八分
    400, 200, 200, 400, 400,       // B↓四分 B↓八分 C八分 D四分 E四分
    400, 400, 400, 400,            // C四分 A↓四分 A↓四分 休み四分
    200, 400, 200, 400, 200, 200,  // 休み八分 D四分 F八分 A四分 G八分 F八分
    400, 200, 200, 400, 200, 200,  // E四分 休み八分 C八分 E四分 D八分 C八分
    400, 200, 200, 400, 400,       // B↓四分 B↓八分 C八分 D四分 E四分
    400, 400, 800                  // C四分 A↓四分 A↓二分
];
```
*配列要素数: 41個*

### 音符長の定義

| 音符の種類 | 長さ (ms) | 説明 |
|------------|-----------|------|
| 八分音符 | 200ms | 基本リズムの最小単位 |
| 四分音符 | 400ms | 標準的な音符長 |
| 付点四分音符 | 600ms | 四分音符 + 八分音符 |
| 二分音符 | 800ms | 四分音符の2倍 |

### BGM再生ロジック

```javascript
// ゲームループ内のBGM再生処理（修正済み）
if (this.gameStarted && this.musicPlaying && this.audioContext) {
    if (currentTime - this.noteTimer > this.lastNoteDuration) {
        const frequency = this.korobeinikiMelody[this.currentNote];
        const currentNoteDuration = this.korobeinikiDurations[this.currentNote];
        if (frequency > 0) {
            this.playNote(frequency, currentNoteDuration);
        }
        
        // 前の音符の長さを記憶し、次の音符に進む
        this.lastNoteDuration = currentNoteDuration;
        this.currentNote = (this.currentNote + 1) % this.korobeinikiMelody.length;
        this.noteTimer = currentTime;
    }
}
```

### 重要な実装ポイント

#### 1. 配列の整合性
- `korobeinikiMelody`と`korobeinikiDurations`は同じ要素数（41個）である必要があります
- 配列のインデックスが対応しており、`melody[i]`と`durations[i]`は同じ音符を表します

#### 2. 音符の再生時間
- `playNote(frequency, duration)`で音符の正確な長さを制御
- 休符（frequency = 0）の場合は音を再生しません
- 音符間の自然な区切りはWeb Audio APIのゲインエンベロープで実現

#### 3. BGM再生タイミング
- ゲーム開始後はゲームプレイ状態に関わらず継続的にBGM再生
- 一時停止中やゲームオーバー中でもBGMは継続
- `noteTimer`でタイミングを正確に管理

#### 3. Web Audio API使用
- `oscillator.type = 'square'`でレトロゲーム風の音質を実現
- ゲイン（音量）を時間経過とともに減衰させて自然な音を作成

## 修正履歴

### 2025年7月17日 - BGM再生ロジック修正

#### 修正された問題
1. **音符長の不正確性**: 音符が期待より短く再生されていた問題
2. **BGM再生タイミング**: ゲーム状態によってBGMが停止する問題
3. **配列要素数の誤記**: ドキュメントで35個と記載されていたが実際は41個
4. **❌ 重要な修正 (2025年7月17日)**: **BGM再生タイミングロジックの根本的な誤り**

#### 実施した修正
1. **音符長の正確化**
   - `playNote(frequency, currentNoteDuration * 0.8)` → `playNote(frequency, currentNoteDuration)`
   - 音符間の間隔はWeb Audio APIのゲインエンベロープで自然に実現

2. **BGM再生ロジックの改善**
   - BGM再生をゲームプレイ状態から独立させ、ゲーム開始後は継続的に再生
   - `noteTimer`の初期化タイミングを修正

3. **🔧 BGM再生タイミングロジックの根本修正**
   - **問題**: `if (currentTime - this.noteTimer > currentNoteDuration)` 
     - これは「現在再生しようとしている音符の長さ」で判定していた
   - **解決**: `if (currentTime - this.noteTimer > this.lastNoteDuration)`
     - 「前に再生した音符の長さ」で判定するように修正
   - **追加変数**: `this.lastNoteDuration` を追加して前の音符の長さを記憶
   - **初期化**: ゲーム開始時とリスタート時に適切に初期化

4. **Web Audio APIの最適化**
   - ゲインエンベロープの改善により自然な音符の減衰を実現
   - 音量レベルの調整（0.1 → 0.05）

#### 修正結果
- ✅ 音符長が楽譜通りの正確な長さで再生される
- ✅ コロベイニキメロディーが意図した通りのリズムで演奏される
- ✅ 総演奏時間: 12.8秒のループ再生
- ✅ 一時停止中やメニュー表示中でもBGMが継続再生
- ✅ **BGMのリズムが正確になり、期待通りのタイミングで再生される**

## トラブルシューティング

### よくある問題

#### 1. 配列長の不一致
```javascript
// 検証用コード
console.log('Melody length:', this.korobeinikiMelody.length);
console.log('Duration length:', this.korobeinikiDurations.length);
```

#### 2. 音が再生されない
- Web Audio APIの初期化確認
- `this.musicPlaying`フラグの状態確認
- ブラウザの自動再生ポリシー対応

#### 3. リズムが正しくない
- `korobeinikiDurations`の値を確認
- ゲームループのタイミング確認

## メンテナンス時の注意事項

### 音符の追加・変更時
1. `korobeinikiMelody`と`korobeinikiDurations`の両方を更新
2. 配列の要素数が一致することを確認
3. テンポと音符長の比率を維持

### パフォーマンス考慮
- Web Audio APIオブジェクトの適切な破棄
- 音符生成の頻度制御
- メモリリークの防止

## 今後の拡張案

- 複数BGMトラックの対応
- 音符長のリアルタイム調整機能
- ボリューム制御の細分化
- 楽器音色の選択機能