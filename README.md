# kcms

Matz葉ガニロボコン 大会運営支援ツール

## 開発者向け情報

### requires

- bun(latest)

### サーバーを動作させる

上記必要なものをインストールしてください.

依存関係のインストール

```bash
bun i
```

サーバーの起動 (プロダクション向け)

```bash
bun run build
bun start
```

サーバーの起動

```bash
bun dev
```

### Authors/License

(C) 2023 Poporon Network & Other Contributors  
MIT License

## Api Reference

### endpoint list

- `POST /entry` エントリー
- `DELETE /entry/{id}` エントリーの取り消し
- `GET /entry` 全エントリーの取得
- `GET /match/{categoryType}/{matchType}` 部門の(予選/本選)対戦表
- `POST /match/{categoryType}/{matchType}` 部門の対戦表を生成

### `POST /entry`

エントリーします

#### 入力

body: `application/json`

| 項目名      | 型(TS表記)                       | 説明                   | 備考                                     |
| ----------- | -------------------------------- | ---------------------- | ---------------------------------------- |
| teamName    | `string`                         | チーム名               | 重複するとエラー                         |
| members     | `[string, string]`               | メンバーの名前         | 小学生部門: 1 or 2人 / オープン部門: 1人 |
| isMultiWalk | `boolean`                        | ロボットが多足歩行型か |                                          |
| category    | `"Elementary" or "Open"` (union) | 出場する部門           |                                          |

#### 出力

##### `200 OK`

```json
{
  "id": "39440930485098",
  "teamName": "ニカ.reverse()",
  "members": ["木下竹千代", "織田幸村"],
  "isMultiWalk": false,
  "category": "Elementary"
}
```

##### `400 Bad Request`

- `TOO_MANY_MEMBERS`: メンバー数が多すぎる

```json
{
  "error": "TOO_MANY_MEMBERS"
}
```

### `DELETE /entry/{id}`

エントリーを取り消します

#### 入力

パスパラメータ

- `id`: `string`
  - 取り消すエントリーのID

body: `application/json`

```json
{}
```

#### 出力

##### `204 No Content`

取り消しました.
※レスポンスボディはありません

### `GET /entry`

全エントリーを取得します

#### 出力

##### `200 OK`

```json
[
  {
    "id": "39440930485098",
    "teamName": "ニカ.reverse()",
    "members": ["木下竹千代", "織田幸村"],
    "isMultiWalk": false,
    "category": "Elementary"
  }
]
```

### `GET /match/{categoryType}/{matchType}`

各部門の本選、予選対戦表を取得します

#### 入力

パスパラメータ

- `categoryType`: `"Elementary"|"Open"`
  - 部門名
- `matchType`: `"primary" | "final"`
  - 対戦の種類 (`primary`: 予選, `"final"`: 本選)

#### 出力

##### `200 OK`

```jsonc
[
  {
    // 試合ID
    "id": "43945095",
    // 試合するチームのID
    "teams": ["30495883404", "93454093"],
    // 対戦の種類
    "matchType": "primary",
    // チームごとの得点 (teamsと同じ順で入る)
    "points": [2, 5],
    // チームごとのゴール時間(秒)
    "time": [50, 61],
    // 勝利チームのID
    "winnerID": "93454093"
  }
]
```

##### `404 Not Found`

- `UNKNOWN_CATEGORY`: 存在しないカテゴリ
- `UNKNOWN_MATCH_TYPE`: 存在しない対戦種類

### `POST /match/{categoryType}/{matchType}`

各部門の本選、予選対戦表を生成します

#### 入力

パスパラメータ

- `categoryType`: `"Elementary"|"Open"`
  - 部門名
- `matchType`: `"primary" | "final"`
  - 対戦の種類 (`primary`: 予選, `"final"`: 本選)
    body: `application/json`

```json
{}
```

#### 出力

##### `200 OK`

```jsonc
[
  {
    // 試合ID
    "id": "43945095",
    // 試合するチームのID
    "teams": ["30495883404", "93454093"],
    // 対戦の種類
    "matchType": "primary",
    // チームごとの得点 (teamsと同じ順で入る)
    "points": [2, 5],
    // チームごとのゴール時間(秒)
    "time": [50, 61],
    // 勝利チームのID
    "winnerID": "93454093"
  }
]
```

##### `404 Not Found`

- `UNKNOWN_CATEGORY`: 存在しないカテゴリ
- `UNKNOWN_MATCH_TYPE`: 存在しない対戦種類
