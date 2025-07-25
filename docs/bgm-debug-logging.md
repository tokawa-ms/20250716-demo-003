# BGMデバッグログ機能

## 概要
テトリスゲームのBGM再生をデバッグするために、音符の再生情報をコンソールにログ出力する機能を実装しました。

## 実装内容
- **ファイル**: `src/js/script.js`
- **対象行**: 735行目（L734のコメント後）
- **追加したコード**: 
  ```javascript
  console.log(`BGM Debug: ${currentTime.toFixed(2)}/${frequency}/${currentNoteDuration}`);
  ```

## ログ出力形式
```
BGM Debug: [現在の時間]/[音の高さ]/[音の長さ]
```

### 出力例
```
BGM Debug: 1752759604482.00/659.25/400
BGM Debug: 1752759604699.00/493.88/200
BGM Debug: 1752759604916.00/523.25/200
```

## ログの詳細
- **現在の時間**: `currentTime.toFixed(2)` - ミリ秒精度のタイムスタンプ
- **音の高さ**: `frequency` - Hz単位の周波数（コロベイニキのメロディー）
- **音の長さ**: `currentNoteDuration` - ミリ秒単位の音符の長さ

## 使用方法
1. ゲームを開始する
2. ブラウザの開発者ツール（F12）でコンソールを開く
3. BGMが再生されると、自動的にログが出力される
4. frequency > 0 の場合のみログが出力される（無音部分は除外）

## 動作確認済み
- ゲーム開始後にBGMが正常に再生される
- コンソールに期待通りのフォーマットでログが出力される
- ゲーム機能に影響なし