# バックエンドのAPIリファレンス
> [!NOTE]
> 出力は成功した場合のみ記述してます。
> 
> 返ってくる値がなにかをわかりやすいようにコメントを記述していますが、実際の入力・出力にコメントは含まれません
## チーム一覧の取得
`Get /team`
### 入力
```
なし
```
### 出力 `200 OK`
```jsonc
{
  "teams":[
    {
      "id": "1392387",
      "name": "かに1",

      "entryCode": "1",
      // チームに所属するメンバー
      "members": [
        "メンバー1",
        "メンバー2"
      ],
      // チームの所属するクラブ(string | "")
      "clubName": "RubyClub",
      // ロボットのタイプ (robotTypes 設定依存)
      "robotType": "leg",
      // チームのカテゴリ (category 設定依存)
      "category": "elementary",
      // エントリーしたか (true | false)
      "isEntered": true
    }
  ]
}
```

## チームの登録
`POST /team`
### 入力
```jsonc
{
  // チーム名
  "name": "かに2",
  // チームメンバー
  "members": [
    "メンバー3"
  ],
  // チームの所属するクラブ(string | "")
  "clubName": "RubyClub",
  // ロボットのタイプ (robotTypes 設定依存)
  "robotType": "wheel",
  // チームのカテゴリ (category 設定依存)
  "category": "elementary"
}
```

### 出力 `200 OK`
```jsonc
{
  "id": "7549586",
  // チーム名
  "name": "かに2",
  // エントリーコード(ゼッケン番号)
  "entryCode": "2",
  // チームメンバー
  "members": [
    "メンバー3"
  ],
  // チームの所属するクラブ(なければ空文字)
  "clubName": "RubyClub",
  // ロボットのタイプ (robotTypes 設定依存)
  "robotType": "wheel",
  // チームのカテゴリ (category 設定依存)
  "category": "elementary",
  // エントリーしたか (true | false)
  "isEntered": false
}
```

## チームを取得
`GET /team/{teamID}`
### 入力
```
なし
```
### 出力 `200 OK`
```jsonc
{
  // teamId
  "id": "7549586",
  // チーム名
  "name": "かに2",
  // エントリーコード(ゼッケン番号)
  "entryCode": "2",
  // チームメンバー
  "members": [
    "メンバー3"
  ],
  // チームの所属するクラブ(なければ空文字)
  "clubName": "RubyClub",
  // ロボットのタイプ (robotTypes 設定依存)
  "robotType": "wheel",
  // チームのカテゴリ (category 設定依存)
  "category": "elementary",
  // エントリーしたか (true | false)
  "isEntered": false
}
```

## チーム登録の削除
`DELETE /team/{teamID}`
### 入力
```
なし
```
### 出力 `204 No Content`
```
レスポンスボディは存在しない
```

## チームをエントリー登録する
`POST /team/{teamID}/entry`
### 入力
```
なし
```
### 出力 `200 OK`
```
レスポンスボディは存在しない
```

## チームのエントリー登録の解除
`DELETE /team/{teamID}/entry`
### 入力
```
なし
```
### 出力 `204 No Content`
```
レスポンスボディは存在しない
```

## 試合一覧を取得
`GET /match`
### 入力
```
なし
```
### 出力 `200 OK`
```jsonc
{
  "pre": [
    {
      "id": "320984",
      // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
      "matchCode": "1-3",
      // 左チーム (空になる可能性あり)
      "leftTeam": {
        // チームのID
        "id": "45098607",
        "teamName": "チーム1"
      },
      // 右チーム (空になる可能性あり)
      "rightTeam": {
        "id": "2230392",
        "teamName": "チーム2"
      },
      // 走行結果
      "runResults": [
        {
          "id": "60980640",
          // チームID
          "teamID": "45098607",
          // 獲得したポイント
          "points": 4,
          // ゴールタイム (秒), リタイアした場合はnullが入る
          "finishedTimeSeconds": 30,
          // フィニッシュしたか ("finished" or "retired")
          "finishState": "retired"
        }
      ]
    }
  ],
  "main": [
    {
      "id": "70983405",
      // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
      "matchCode": "1-3",
      // チーム1 (空になる可能性あり)
      "team1": {
        // チームのID
        "id": "45098607",
        "teamName": "チーム1"
      },
      // チーム2 (空になる可能性あり)
      "team2": {
        "id": "2230392",
        "teamName": "チーム2"
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
          // フィニッシュしたか ("finished" or "retired")
          "finishState": "retired"
        }
      ]
    }
  ]
}
```

## 試合種別ごとの試合を取得
`GET /match/{matchType}`

試合種別(matchType): pre, main の区分
### 入力
```
なし
```
### 出力 `200 OK`
#### `pre`の場合
```jsonc
[
  {
    "id": "320984",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // 左チーム (空になる可能性あり)
    "leftTeam": {
      // チームのID
      "id": "45098607",
      "teamName": "チーム1"
    },
    // 右チーム (空になる可能性あり)
    "rightTeam": {
      "id": "2230392",
      "teamName": "チーム2"
    },
    // 走行結果
    "runResults": [
      {
        "id": "60980640",
        // チームID
        "teamID": "45098607",
        // 獲得したポイント
        "points": 4,
        // ゴールタイム (秒), リタイアした場合はnullが入る
        "goalTimeSeconds": 30,
        // フィニッシュしたか ("finished" or "retired")
        "finishState": "retired"
      }
    ]
  }
]
```
`main`の場合
```jsonc
[
  {
    "id": "70983405",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // 左チーム (空になる可能性あり)
    "leftTeam": {
      // チームのID
      "id": "45098607",
      "teamName": "チーム1"
    },
    // 右チーム (空になる可能性あり)
    "rightTeam": {
      "id": "2230392",
      "teamName": "チーム2"
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
        // フィニッシュしたか ("finished" or "retired")
        "finishState": "finished"
      }
    ]
  }
]
```
## ある試合種別の試合を取得
`GET /match/{matchType}/{matchID}`
### 入力
```
なし
```
### 出力 `200 OK`
`pre`の場合
```jsonc
{
  "id": "70983405",
  // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
  "matchCode": "1-3",
  // 左チーム (空になる可能性あり)
  "leftTeam": {
    // チームのID
    "id": "45098607",
    "teamName": "チーム1"
  },
  // 右チーム (空になる可能性あり)
  "rightTeam": {
    "id": "2230392",
    "teamName": "チーム2"
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
      // フィニッシュしたか ("finished" or "retired")
      "finishState": "retired"
    }
  ]
}
```
`main`の場合
```jsonc
{
  "id": "70983405",
  // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
  "matchCode": "1-3",
  // 左チーム (空になる可能性あり)
  "team1": {
    // チームのID
    "id": "45098607",
    "teamName": "チーム1"
  },
  // 右チーム (空になる可能性あり)
  "team2": {
    "id": "2230392",
    "teamName": "チーム2"
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
      // フィニッシュしたか ("finished" or "retired")
      "finishState": "retired"
    }
  ]
}
```

## 試合種別・部門種別ごとに、試合表を生成
`POST /match/{matchType}/{departmentType}/generate`
### 入力
```
なし
```
## 出力 `200 OK`
`pre`の場合
```jsonc
[
  {
    "id": "320984",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // ロボットのタイプ (robotTypes 設定依存)
 	  "robotType": "wheel",
		// 左チームのID (空になる可能性あり)
    "leftTeamID": "45098607",
    // 右チームのID (空になる可能性あり)
    "rightTeamID": "2230392",
    // 走行結果 (生成直後は必ず空になる)
    "runResults": [
    ]
  }
]
```
`main`の場合
```jsonc
[
  {
    "id": "70983405",
    // 試合コード `${コース番号}-${そのコースでの試合番号}` どちらも1始まり
    "matchCode": "1-3",
    // ロボットのタイプ (robotTypes 設定依存)
    "leftTeamID": "45098607",
    // 右チームのID (空になる可能性あり)
    "rightTeamID": "2230392",
    // 勝者のID
    "winnerID": "",
    // 走行結果 (生成直後は必ず空になる)
    "runResults": [
    ]
  }
]
```

## ある試合の走行結果をすべて取得
`GET /match/{matchType}/{matchID}/run_result`
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
    "goalTimeSeconds": 30,
    // フィニッシュしたか ("finished" or "retired")
    "finishState": "finished"
  }
]
```

## 試合の走行結果を複数送信
`POST /match/{matchType}/{id}/run_result`
### 入力
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
    "goalTimeSeconds": 30,
    // フィニッシュしたか ("finished" or "retired")
    "finishState": "finished"
  }
]
```
### 出力 `200 OK`
```
レスポンスボディは存在しない
```

## 試合種別・部門種別ごとに、エントリーしたチームの(現在時点での)ランキングを返す
> [!WARNING]
> このAPIはmockでも未実装です
`GET /contest/{matchType}/{departmentType}/ranking`
### 入力
```
なし
```
### 出力 `200 OK`
```jsonc
[
  {
    "rank": 1,
    // チームID
    "teamID": "3098230883",
    // チーム名
    "teamName": "Team 1",
    // 獲得したポイントの合計
    "points": 60,
    // ゴールタイムの最も短いもの
    "goalTimeSeconds": 30
  }
]
```

## スポンサー
`GET /sponsor`
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
      "url": "https://cdn.example.com/poporonnet.png"
    }
  ]
}
```
