# kcmsf

Matz葉がにロボコン 大会運営支援ツール  
[バックエンドはこちら](https://github.com/poporonnet/kcms)

## 開発者向け情報

### requires

- Node.js(latest)
- pnpm(latest)

依存関係のインストール

```bash
pnpm i
```

サーバの起動(開発モード)

```bash
pnpm dev
```

ビルド(プロダクション用)

```bash
pnpm build
```

## 利用者向け情報

### チームの一括登録に用いるCSVファイル

一括登録に用いることのできるCSVファイルは以下の条件を満たしているものに限ります.

- teamNameは1文字以上
- member1は3文字以上
- member2は3文字以上(0文字を除く)
- multiWalkは車輪型もしくは歩行型
- departmentはOpenもしくはElementary

### 登録できるCSVファイルの例

| teamName | member1 | member2 | multiWalk | department |
| -------- | ------- | ------- | --------- | ---------- |
| チーム1  | Suzune  | Suzu    | 車輪型    | Open       |
| チーム2  | tufusa  |         | 歩行型    | Open       |
| チーム3  | laminne | Master  | 車輪型    | Elementary |

#### CSVの例

```CSV
teamName,member1,member2,multiWalk,department
1,さくら,あお,歩行型,Open
2,ちひろ,ゆう,歩行型,Open
3,れいか,やどん,歩行型,Open
4,かに,,車輪型,Elementary
```

### Authors

see [poporonnet/kcms](https://github.com/poporonnet/kcms?tab=readme-ov-file#authorslicense).

### License

(C) 2023 Poporon Network & Other Contributors  
MIT License
