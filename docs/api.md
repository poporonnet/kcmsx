# kcms APIリファレンス

> [!NOTE]
> 出力は成功した場合のみ記述しています。
>
> 返ってくる値がわかりやすいようにコメントを記述していますが、実際の入力・出力にコメントは含まれません。

> [!IMPORTANT]
> `/login` `/logout`を除くすべてのエンドポイントで認証が必要です。詳しくは[`/login`](#ログイン-get-login)を参照してください。

## ログイン `GET /login`

### 入力

- ヘッダ
  ```
  Authorization: Basic <credentials>
  ```
- ボディ
  ```
  なし
  ```

### 出力 `200 OK`

- ヘッダ
  ```
  Set-Cookie: ...
  ```
- ボディ
  ```
  なし
  ```

Basic認証を行います。リクエストヘッダの`<credentials>`には、ユーザ名とパスワードをコロン区切りで繋げた文字列`<username>:<password>`を、Base64エンコードしたものを使用します。

ログインが成功した場合、レスポンスヘッダの`Set-Cookie`フィールドに発行されたJWTを含んだレスポンスが返ります。`/login`と`/logout`以外では、このトークンをリクエストヘッダの`Cookie`フィールドに含めて通信を行う必要があります。

## ログアウト `GET /logout`

### 入力

```
なし
```

### 出力 `200 OK`

```
なし
```

ログアウトするようブラウザに指示します。

## チーム一覧の取得 `Get /team`

### 入力

```
なし
```

### 出力 `200 OK`

```jsonc
{
  "teams": [
    {
      // teamID
      "id": "1392387",
      // チーム名
      "name": "かに1",
      // エントリーコード(ゼッケン番号)
      "entryCode": "1",
      // チームに所属するメンバー
      "members": ["メンバー1", "メンバー2"],
      // チームの所属するクラブ(string | "")
      "clubName": "RubyClub",
      // ロボットのタイプ (robotTypes 設定依存)
      "robotType": "leg",
      // チームのカテゴリ (departmentType 設定依存)
      "departmentType": "elementary",
      // エントリーしたか (true | false)
      "isEntered": true,
    },
  ],
}
```

## チームの登録 `POST /team`

### 入力

```jsonc
[
  {
    // チーム名
    "name": "かに2",
    // チームメンバー
    "members": ["メンバー3"],
    // チームの所属するクラブ(string | "")
    "clubName": "RubyClub",
    // ロボットのタイプ (robotTypes 設定依存)
    "robotType": "wheel",
    // チームのカテゴリ (departmentType 設定依存)
    "departmentType": "elementary",
  },
]
```

### 出力 `200 OK`

```jsonc
[
  {
    // teamID
    "id": "7549586",
    // チーム名
    "name": "かに2",
    // エントリーコード(ゼッケン番号)
    "entryCode": "2",
    // チームメンバー
    "members": ["メンバー3"],
    // チームの所属するクラブ(なければ空文字)
    "clubName": "RubyClub",
    // ロボットのタイプ (robotTypes 設定依存)
    "robotType": "wheel",
    // チームのカテゴリ (departmentType 設定依存)
    "departmentType": "elementary",
    // エントリーしたか (true | false)
    "isEntered": false,
  },
]
```

## チームを取得 `GET /team/{teamID}`

### 入力

```
なし
```

### 出力 `200 OK`

```jsonc
{
  // teamID
  "id": "7549586",
  // チーム名
  "name": "かに2",
  // エントリーコード(ゼッケン番号)
  "entryCode": "2",
  // チームメンバー
  "members": ["メンバー3"],
  // チームの所属するクラブ(なければ空文字)
  "clubName": "RubyClub",
  // ロボットのタイプ (robotTypes 設定依存)
  "robotType": "wheel",
  // チームのカテゴリ (departmentType 設定依存)
  "departmentType": "elementary",
  // エントリーしたか (true | false)
  "isEntered": false,
}
```

## チーム登録の削除 `DELETE /team/{teamID}`

### 入力

```
なし
```

### 出力 `204 No Content`

```
レスポンスボディは存在しない
```

## チームをエントリー登録する `POST /team/{teamID}/entry`

### 入力

```
なし
```

### 出力 `200 OK`

```
レスポンスボディは存在しない
```

## チームのエントリー登録の解除 `DELETE /team/{teamID}/entry`

### 入力

```
なし
```

### 出力 `204 No Content`

```
レスポンスボディは存在しない
```

## 試合一覧を取得 `GET /match`

### 入力

```
なし
```

### 出力 `200 OK`

```jsonc
{
  "pre": [
    {
      // matchID
      "id": "320984",
      // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
      "matchCode": "1-3",
      // 試合種別 (matchType 設定依存)
      "matchType": "pre",
      // チームのカテゴリ (departmentType 設定依存)
      "departmentType": "elementary",
      // 左チーム (空になる可能性あり 空の場合undefined)
      "leftTeam": {
        // チームのID
        "id": "45098607",
        // チーム名
        "teamName": "チーム1",
      },
      // 右チーム (空になる可能性あり空の場合undefined)
      "rightTeam": {
        // チームのID
        "id": "2230392",
        // チーム名
        "teamName": "チーム2",
      },
      // 走行結果
      "runResults": [
        {
          // 走行結果ID
          "id": "60980640",
          // チームID
          "teamID": "45098607",
          // 獲得したポイント
          "points": 4,
          // ゴールタイム (秒), リタイアした場合はnullが入る
          "goalTimeSeconds": 30,
          // フィニッシュしたか ("finished" or "goal")
          "finishState": "goal",
        },
      ],
    },
  ],
  "main": [
    {
      // matchID
      "id": "70983405",
      // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
      "matchCode": "1-3",
      // 試合種別 (matchType 設定依存)
      "matchType": "main",
      // チームのカテゴリ (departmentType 設定依存)
      "departmentType": "elementary",
      // チーム1 (空になる可能性あり 空の場合undefined)
      "team1": {
        // チームのID
        "id": "45098607",
        // チーム名
        "teamName": "チーム1",
      },
      // チーム2 (空になる可能性あり 空の場合undefined)
      "team2": {
        // チームID
        "id": "2230392",
        // チーム名
        "teamName": "チーム2",
      },
      // 勝者のID
      "winnerID": "45098607",
      /* 走行結果
       * その試合がまだ行われていない場合は空配列になる
       */
      "runResults": [
        {
          // 走行結果ID
          "id": "60980640",
          // チームID
          "teamID": "45098607",
          // 獲得したポイント
          "points": 4,
          // ゴールタイム (秒), リタイアした場合はnullが入る
          "goalTimeSeconds": 30,
          // フィニッシュしたか ("finished" or "goal")
          "finishState": "finished",
        },
      ],
    },
  ],
}
```

## 試合種別ごとの試合を取得 `GET /match/{matchType}`

試合種別(matchType): `pre`, `main` の区分

### 入力

```
なし
```

### 出力 `200 OK`

#### `pre`の場合

```jsonc
[
  {
    // matchID
    "id": "320984",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // 試合種別 (matchType 設定依存)
    "matchType": "pre",
    // チームのカテゴリ (departmentType 設定依存)
    "departmentType": "elementary",
    // 左チーム (空になる可能性あり 空の場合undefined)
    "leftTeam": {
      // チームのID
      "id": "45098607",
      // チーム名
      "teamName": "チーム1",
    },
    // 右チーム (空になる可能性あり 空の場合undefined)
    "rightTeam": {
      // チームのID
      "id": "2230392",
      // チーム名
      "teamName": "チーム2",
    },
    // 走行結果
    "runResults": [
      {
        // 走行結果ID
        "id": "60980640",
        // チームID
        "teamID": "45098607",
        // 獲得したポイント
        "points": 4,
        // ゴールタイム (秒), リタイアした場合はnullが入る
        "goalTimeSeconds": 30,
        // フィニッシュしたか ("finished" or "goal")
        "finishState": "goal",
      },
    ],
  },
]
```

`main`の場合

```jsonc
[
  {
    // matchID
    "id": "70983405",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // 試合種別 (matchType 設定依存)
    "matchType": "main",
    // チームのカテゴリ (departmentType 設定依存)
    "departmentType": "elementary",
    // 左チーム (空になる可能性あり 空の場合undefined)
    "Team1": {
      // チームのID
      "id": "45098607",
      // チーム名
      "teamName": "チーム1",
    },
    // 右チーム (空になる可能性あり 空の場合undefined)
    "Team2": {
      // チームのID
      "id": "2230392",
      // チーム名
      "teamName": "チーム2",
    },
    // 勝者のID
    "winnerID": "45098607",
    /* 走行結果
     * その試合がまだ行われていない場合は空配列になる
     */
    "runResults": [
      {
        // 走行結果ID
        "id": "60980640",
        // チームID
        "teamID": "45098607",
        // 獲得したポイント
        "points": 4,
        // ゴールタイム (秒), リタイアした場合はnullが入る
        "goalTimeSeconds": 30,
        // フィニッシュしたか ("finished" or "goal")
        "finishState": "finished",
      },
    ],
  },
]
```

## ある試合種別の試合を取得 `GET /match/{matchType}/{matchID}`

### 入力

```
なし
```

### 出力 `200 OK`

`pre`の場合

```jsonc
{
  // matchID
  "id": "70983405",
  // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
  "matchCode": "1-3",
  // 試合種別 (matchType 設定依存)
  "matchType": "pre",
  // チームのカテゴリ (departmentType 設定依存)
  "departmentType": "elementary",
  // 左チーム (空になる可能性あり 空の場合undefined)
  "leftTeam": {
    // チームのID
    "id": "45098607",
    // チーム名
    "teamName": "チーム1",
  },
  // 右チーム (空になる可能性あり 空の場合undefined)
  "rightTeam": {
    // チームのID
    "id": "2230392",
    // チーム名
    "teamName": "チーム2",
  },
  /* 走行結果
   * その試合がまだ行われていない場合は空配列になる
   */
  "runResults": [
    {
      // 走行結果ID
      "id": "60980640",
      // チームID
      "teamID": "45098607",
      // 獲得したポイント
      "points": 4,
      // ゴールタイム (秒), リタイアした場合はnullが入る
      "goalTimeSeconds": 30,
      // フィニッシュしたか ("finished" or "goal")
      "finishState": "goal",
    },
  ],
}
```

`main`の場合

```jsonc
{
  // matchID
  "id": "70983405",
  // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
  "matchCode": "1-3",
  // 試合種別 (matchType 設定依存)
  "matchType": "main",
  // チームのカテゴリ (departmentType 設定依存)
  "departmentType": "elementary",
  // 左チーム (空になる可能性あり 空の場合undefined)
  "team1": {
    // チームのID
    "id": "45098607",
    // チーム名
    "teamName": "チーム1",
  },
  // 右チーム (空になる可能性あり 空の場合undefined)
  "team2": {
    // チームのID
    "id": "2230392",
    // チーム名
    "teamName": "チーム2",
  },
  // 勝者のID
  "winnerID": "45098607",
  /* 走行結果
   * その試合がまだ行われていない場合は空配列になる
   */
  "runResults": [
    {
      // 走行結果ID
      "id": "60980640",
      // チームID
      "teamID": "45098607",
      // 獲得したポイント
      "points": 4,
      // ゴールタイム (秒), リタイアした場合はnullが入る
      "goalTimeSeconds": 30,
      // フィニッシュしたか ("finished" or "goal")
      "finishState": "finished",
    },
  ],
}
```

## 試合種別・部門種別ごとに、試合表を生成 `POST /match/{matchType}/{departmentType}/generate`

### 入力

```
なし
```

## 出力 `200 OK`

`pre`の場合

```jsonc
[
  {
    // matchID
    "id": "320984",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // 試合種別 (matchType 設定依存)
    "matchType": "pre",
    // チームのカテゴリ (departmentType 設定依存)
    "departmentType": "elementary",
    // 左チームのID (空になる可能性あり 空の場合undefined)
    "leftTeamID": "45098607",
    // 右チームのID (空になる可能性あり 空の場合undefined)
    "rightTeamID": "2230392",
    // 走行結果 (生成直後は必ず空になる)
    "runResults": [],
  },
]
```

`main`の場合

```jsonc
[
  {
    "id": "70983405",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // チームのカテゴリ (departmentType 設定依存)
    "departmentType": "elementary",
    // チーム1のID (空になる可能性あり 空の場合undefined)
    "Team1ID": "45098607",
    // チーム1のID (空になる可能性あり 空の場合undefined)
    "Team2ID": "2230392",
    // 勝者のID
    "winnerID": "",
    // 走行結果 (生成直後は必ず空になる 空の場合undefined)
    "runResults": [],
  },
]
```

## ある試合の走行結果をすべて取得 `GET /match/{matchType}/{matchID}/run_result`

### 入力

```
なし
```

### 出力 `200 OK`

```jsonc
[
  {
    // 走行結果ID
    "id": "60980640",
    // チームID
    "teamID": "45098607",
    // 獲得したポイント
    "points": 4,
    // ゴールタイム (秒), リタイアした場合はnullが入る
    "goalTimeSeconds": null,
    // フィニッシュしたか ("finished" or "goal")
    "finishState": "finished",
  },
]
```

## 試合の走行結果を複数送信 `POST /match/{matchType}/{matchID}/run_result`

### 入力

```jsonc
[
  {
    // チームID
    "teamID": "45098607",
    // 獲得したポイント
    "points": 4,
    // ゴールタイム (秒), リタイアした場合はnullが入る
    "goalTimeSeconds": 30,
    // フィニッシュしたか ("finished" or "goal")
    "finishState": "goal",
  },
]
```

### 出力 `200 OK`

```
レスポンスボディは存在しない
```

## 試合種別・部門種別ごとに、エントリーしたチームの(現在時点での)ランキングを返す `GET /contest/{matchType}/{departmentType}/ranking`

> [!WARNING]
> このAPIはmockでも未実装です

### 入力

```
なし
```

### 出力 `200 OK`

```jsonc
[
  {
    // 順位
    "rank": 1,
    // チームID
    "teamID": "3098230883",
    // チーム名
    "teamName": "Team 1",
    // 獲得したポイントの合計
    "points": 60,
    // ゴールタイムの最も短いもの
    "goalTimeSeconds": 30,
  },
]
```

## スポンサー `GET /sponsor`

### 入力

```
なし
```

### 出力 `200 OK`

画像のパス(URL) + クラス(ゴールド・シルバーetc)

```jsonc
{
  "sponsors": [
    {
      // スポンサー名
      "name": "team Poporon Network",
      // スポンサーの格
      "class": "Gold",
      // スポンサーのurl
      "url": "https://cdn.example.com/poporonnet.png",
    },
  ],
}
```
