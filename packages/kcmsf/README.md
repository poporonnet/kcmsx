# kcmsf

Matz葉がにロボコン 大会運営支援ツール

## 開発者向け情報

### requires

- Node.js(latest)

#### 依存関係のインストール

```bash
pnpm i
```

#### サーバの起動(開発モード)

```bash
pnpm dev
```

#### ビルド(プロダクションモード)

```bash
pnpm build
```

#### サーバの起動(プロダクションモード)

```bash
pnpm start
```

## 利用者向け情報

### チームの一括登録に用いるCSVファイル

一括登録に用いることのできるCSVファイルは以下の条件を満たしているものに限ります.

- teamNameは1文字以上
- member1は3文字以上
- member2は3文字以上(0文字を除く)
- robotTypeはconfigで設定された値のいずれか
- departmentはconfigで設定された値のいずれか
- clubNameは0文字以上

### 登録できるCSVファイルの例

| teamName | member1 | member2 | robotType | department | clubName        |
| -------- | ------- | ------- | --------- | ---------- | --------------- |
| チーム1  | Suzune  | Suzu    | leg       | open       |                 |
| チーム2  | tufusa  |         | leg       | open       | poporon network |
| チーム3  | laminne | Master  | wheel     | elementary |                 |

#### CSVの例

```CSV
teamName,member1,member2,robotType,department,clubName
1,さくら,あお,leg,open,club1
2,ちひろ,ゆう,leg,open,
3,れいか,やどん,leg,open,club2
4,かに,,wheel,elementary,
```

### Authors

see [poporonnet/kcms](https://github.com/poporonnet/kcms?tab=readme-ov-file#authorslicense).

### License

(C) 2023 Poporon Network & Other Contributors  
MIT License
