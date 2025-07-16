# 🎮 レトロテトリス - 80年代風パズルゲーム

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **GitHub Copilot** を活用して開発された、80年代のレトロゲーム風デザインのテトリスゲーム

## 🎯 **[▶️ ゲームを始める](./src/index.html)** ← ここをクリック！

## 📋 概要

80年代のアーケードゲームの雰囲気を再現した、レトロ風デザインのテトリスゲームです。ネオンカラーのグロー効果、ドット絵風のピクセルアート、そしてコロベイニキのメロディーで懐かしのゲーム体験をお楽しみください。

### ✨ 主な特徴

- 🎮 **クラシックテトリス** - 本格的なテトリスゲームロジック実装
- 🌈 **80年代レトロデザイン** - ネオンカラーとグロー効果による美しいビジュアル
- 🎵 **コロベイニキBGM** - Web Audio APIによる本格的なメロディー再生
- 📱 **レスポンシブ対応** - PC・タブレット・スマホ全てで快適プレイ
- ⚡ **ブラウザで即プレイ** - インストール不要、HTMLファイルを開くだけ
- 🕹️ **直感的操作** - キーボード操作とタッチ操作両対応

## 🛠️ 技術スタック

### ゲーム実装

| 技術                                     | バージョン | 用途                         |
| ---------------------------------------- | ---------- | ---------------------------- |
| HTML5 Canvas                             | Latest     | ゲーム描画エンジン           |
| CSS3                                     | Latest     | レトロ風ビジュアルエフェクト |
| [Tailwind CSS](https://tailwindcss.com/) | 3.x (CDN)  | レスポンシブUIフレームワーク |
| JavaScript ES6+                         | Latest     | ゲームロジック・音楽制御     |
| Web Audio API                            | Latest     | BGM・効果音再生              |

### デザイン要素

- **80年代レトロ風カラーパレット** - ネオングリーン、シアン、マゼンタ
- **ピクセルパーフェクト描画** - ドット絵風の美しいグラフィック
- **CRTモニター風エフェクト** - スキャンライン効果とグロー
- **レトロフォント** - Orbitron フォントファミリー使用

## 📁 プロジェクト構造

```
📦 レトロテトリス/
├── 📄 README.md                 # プロジェクト概要
├── 📄 .github/
│   └── 📄 copilot-instructions.md  # GitHub Copilot 設定
├── 📁 src/                      # ゲームソースコード
│   ├── 📄 index.html            # メインゲーム画面
│   ├── 📁 css/                  # スタイルシート
│   │   └── 📄 styles.css        # レトロ風CSSエフェクト
│   ├── 📁 js/                   # JavaScript
│   │   └── 📄 script.js         # ゲームロジック・音楽制御
│   └── 📁 assets/               # ゲームリソース
│       └── 📁 images/           # 画像ファイル（今後追加予定）
└── 📁 docs/                     # ドキュメント（今後追加予定）
```

## 🚀 プレイ方法

### 前提条件

- 📌 モダンな Web ブラウザ (Chrome 90+, Firefox 88+, Safari 14+)
- 📌 Web Audio API対応（BGM再生のため）
- 📌 キーボードまたはタッチ操作対応デバイス

### 🎮 操作方法

#### キーボード操作
- **← →** : ブロックを左右に移動
- **↓** : ブロックを高速落下
- **↑** : ブロックを回転
- **SPACE** : ゲーム一時停止/再開

#### モバイル・タッチ操作
- 画面下部のボタンで操作
- **←** **→** : 左右移動
- **↻** : 回転
- **↓** : 高速落下
- **PAUSE** : 一時停止

### ゲームルール

1. **テトロミノ配置** - 7種類の形状ブロックが上から落下
2. **ライン消去** - 横一列が埋まると消去され、スコア獲得
3. **レベルアップ** - 10ライン消去毎にレベルが上昇し、落下速度が増加
4. **ゲームオーバー** - ブロックが画面上部に到達するとゲーム終了

### スコアシステム

- **1ライン消去**: 100点 × レベル
- **2ライン消去**: 300点 × レベル  
- **3ライン消去**: 500点 × レベル
- **4ライン消去**: 800点 × レベル（テトリス！）

## 🎵 音楽とサウンド

### BGM - コロベイニキ
- **オリジナルメロディー** - ロシア民謡「コロベイニキ」をワンコーラス再生
- **Web Audio API** - ブラウザネイティブの音楽生成技術
- **レトロサウンド** - 80年代風のスクエア波による演奏
- **音楽ON/OFF** - ゲーム中に音楽の切り替え可能

### 効果音
- **ライン消去音** - ラインが消える際の爽快サウンド
- **ゲームオーバー音** - 緊張感のある終了音
- **操作音** - ブロック移動・回転時の軽快な音

## 🎨 ゲーム機能

### コアゲームプレイ
- ✅ **7種類のテトロミノ** - I, O, T, S, Z, J, L型ブロック
- ✅ **ブロック操作** - 移動、回転、高速落下
- ✅ **ライン消去** - 完成ラインの自動削除
- ✅ **スコア計算** - レベル連動スコアシステム
- ✅ **難易度調整** - レベルアップによる速度増加

### ビジュアルエフェクト
- ✅ **ネオングロー** - ブロックとUIの美しい発光効果
- ✅ **パーティクル** - ライン消去時の華やかなエフェクト
- ✅ **スコアポップアップ** - 得点時のアニメーション
- ✅ **スキャンライン** - CRTモニター風の表示効果

### UI/UX機能
- ✅ **次ブロック表示** - 戦略的なゲームプレイ支援
- ✅ **リアルタイム統計** - スコア、レベル、ライン数表示
- ✅ **一時停止機能** - いつでもゲーム中断可能
- ✅ **ゲームオーバー処理** - スコア表示と再開機能

## 📱 レスポンシブデザイン対応

このゲームは以下の画面サイズで最適化されています：

- 📱 **スマートフォン**: 320px〜768px（タッチ操作ボタン表示）
- 📊 **タブレット**: 768px〜1024px（ハイブリッド操作）
- 💻 **デスクトップ**: 1024px以上（キーボード操作推奨）

### デバイス別最適化
- **モバイル**: 縦画面専用設計、大きなタッチボタン
- **タブレット**: 横画面対応、キーボード・タッチ両対応
- **PC**: フルスクリーン表示、高解像度対応

## 🔧 技術的特徴

### パフォーマンス最適化
- **Canvas描画** - ハードウェアアクセラレーション活用
- **アニメーション** - requestAnimationFrame使用
- **メモリ管理** - 効率的なオブジェクト再利用

### ブラウザ互換性
- **モダンブラウザ** - Chrome, Firefox, Safari, Edge対応
- **Web Standards** - HTML5, CSS3, ES6+準拠
- **フォールバック** - Web Audio API非対応時の適切な処理

## 🔒 セキュリティとベストプラクティス

### 安全な実装
- ✅ **クライアントサイド完結** - サーバー通信なしで安全
- ✅ **依存関係最小化** - CDNからの軽量ライブラリ使用
- ✅ **エラーハンドリング** - 堅牢なエラー処理実装

### コード品質
- ✅ **ES6+準拠** - モダンJavaScript記法
- ✅ **適切なコメント** - 保守性の高いコード
- ✅ **セキュリティ考慮** - XSS・その他脆弱性対策

## 🎯 今後の拡張予定

### 機能追加予定
- 🔮 **ハイスコア保存** - ローカルストレージ活用
- 🔮 **カスタムテーマ** - 複数のレトロテーマ選択
- 🔮 **マルチプレイ** - 2人対戦モード
- 🔮 **追加エフェクト** - より豊富なビジュアルエフェクト

### 技術改善予定  
- 🔮 **PWA対応** - オフライン動作とインストール
- 🔮 **WebGL描画** - より高速な描画処理
- 🔮 **音楽拡張** - 複数BGM選択機能

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

### 貢献可能な分野
- 🎮 **新機能追加** - ゲームプレイ機能の拡張
- 🎨 **デザイン改善** - ビジュアルエフェクトの追加
- 🎵 **音楽・効果音** - 新しいBGMや効果音の実装
- 📱 **UI/UX改善** - より良いユーザー体験の提案
- 🐛 **バグ修正** - 不具合の発見と修正
- 📚 **ドキュメント** - 説明文書の改善

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🆘 サポートとリソース

- 📖 **テトリス仕様**: [テトリス公式ルール](https://tetris.fandom.com/wiki/Tetris_Guideline)
- 💬 **Web Audio API**: [MDN Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
- 🎨 **Canvas API**: [MDN Canvas Tutorial](https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial)
- 🐛 **Issue 報告**: [Issues](https://github.com/tokawa-ms/20250716-demo-003/issues)

## 🎮 開発者から

このゲームは80年代のアーケードゲームへのオマージュとして作成されました。シンプルながらも奥深いテトリスの魅力を、レトロな雰囲気とともにお楽しみください。

**高得点を目指して、ぜひ何度でもチャレンジしてください！**

## 📊 プロジェクト統計

![GitHub stars](https://img.shields.io/github/stars/tokawa-ms/20250716-demo-003?style=social)
![GitHub forks](https://img.shields.io/github/forks/tokawa-ms/20250716-demo-003?style=social)
![GitHub issues](https://img.shields.io/github/issues/tokawa-ms/20250716-demo-003)

---

<div align="center">
  <strong>🎮 レトロゲームの世界へようこそ！ 🕹️</strong><br>
  Made with ❤️ and GitHub Copilot<br><br>
  
  **🎯 [今すぐプレイする！](./src/index.html)**
</div>
