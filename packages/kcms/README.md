# kcms

[フロントエンドはこちら](../kcmsf/README.md)

## 開発者向け情報

### requires

- [bun](https://bun.sh/) (latest)

### サーバーを動作させる

上記必要なものをインストールしてください。

以下の内容で`.env`というファイルを作成してください。

```properties
KCMS_ADMIN_USERNAME=<管理者ユーザ名>
KCMS_ADMIN_PASSWORD=<管理者パスワード>
KCMS_COOKIE_TOKEN_KEY=<Cookieのキー>
KCMS_COOKIE_MAX_AGE=<Cookieの有効期間>
```

- `<Cookieのキー>`は、特に理由がなければ`kcms-token`を推奨します。
- `<Cookieの有効期間>`には、有効期間を数値(秒)で指定します。この期間が、ログイン状態が持続する時間になります。

認証用シークレットの生成
```bash
pnpm generate:secrets
```
出力された結果を`.env`にコピーしてください。  
注意: 初回起動の前に必ず実行してください。また、適切なタイミングで再生成して値を置き換えることを強く推奨します。

依存関係のインストール

```bash
bun i
```

サーバーの起動 (プロダクション向け)

```bash
bun run build
bun start
```

サーバーの起動 (開発向け)

```bash
bun dev
```

### Authors/License

| <img src="https://github.com/laminne.png" width="100px"> | <img src="https://github.com/kiharu3112.png" width="100px"> | <img src="https://github.com/tufusa.png" width="100px"> |
| :------------------------------------------------------: | :---------------------------------------------------------: | :-----------------------------------------------------: |
|            **laminne (T. YAMAMOTO)**<br>🔧 🦀            |                   **kiharu3112**<br>🔧 🦀                   |                   **tufusa**<br>🔧 🦀                   |

| <img src="https://github.com/speak-mentaiko.png" width="100px"> | <img src="https://github.com/suzune2741.png" width="100px"> | <img src="https://github.com/C4N4242.png" width="100px"> |
| :-------------------------------------------------------------: | :---------------------------------------------------------: | :------------------------------------------------------: |
|                    **speak-mentaiko**<br>🔧                     |                    **suzune2741**<br>🔧                     |                    **C4N4242**<br>🔧                     |

🔧: KCMS/KCMSFの開発  
🦀: 書き込みツール開発

(C) 2023 Poporon Network & Other Contributors  
MIT License

## API Reference

[APIリファレンスはこちら](/docs/api.md)

## リンク

[書き込みツール フロントエンド](https://github.com/poporonnet/kanicon-writer-front)

[書き込みツール コンパイルサーバ](https://github.com/poporonnet/kanicc)
