# kcmsx/config

- [kcmsx/config](#kcmsxconfig)
  - [createConfig(baseConfig, conditions)](#createconfigbaseconfig-conditions)
  - [baseConfig](#baseconfig)
    - [baseConfig.contestName](#baseconfigcontestname)
    - [baseConfig.robotTypes](#baseconfigrobottypes)
    - [baseConfig.departments](#baseconfigdepartments)
    - [baseConfig.matches](#baseconfigmatches)
    - [baseConfig.rules](#baseconfigrules)
  - [conditions](#conditions)
  - [utility](#utility)
    - [createConfig(baseConfig, conditions)](#createconfigbaseconfig-conditions-1)
    - [against(side)](#againstside)
  - [For Developers(WIP)](#for-developerswip)
    - [kcmsx/configをモノレポ内の別のパッケージから使う](#kcmsxconfigをモノレポ内の別のパッケージから使う)
    - [型定義ファイルのディレクトリ構造](#型定義ファイルのディレクトリ構造)

kcmsx各種パッケージのための共通の設定ファイルを記述するパッケージです。

`src/config.ts`を編集してください。最小のテンプレートは以下のようになります。

```ts
import { createConfig } from "./utility/createConfig";

export const config = createConfig(
  {
    contestName: "",
    robotTypes: [],
    departments: [],
    matches: [],
    rules: [],
  } as const,
  {}
);
```

## createConfig(baseConfig, conditions)

設定を作成するための関数です。第一引数が`baseConfig`、第二引数が`conditions`です。
以下で引数の詳細について説明しています。

## baseConfig

- 型: `BaseConfig`

主要なほとんどの設定を含むオブジェクトです。
`contestName`, `robotTypes`, `departments`, `matches`, `rules`プロパティが必要です。また、型推論のため末尾の`as const`が必要です。
以下でプロパティの詳細について説明しています。

### baseConfig.contestName

- 型: `string`

コンテストの名称です。主にフロントエンドでの表示に使われます。

<details open>
<summary>例:</summary>

```ts
contestName: "かにロボコン",
```

</details>

### baseConfig.robotTypes

- 型: `string[]`

ロボットの種別です。車輪型もしくは歩行型、といった種別を定義します。
1つ以上の種別が必要です。

<details open>
<summary>例: 車輪型と歩行型の2種別の場合</summary>

```ts
robotTypes: ["wheel", "leg"],
```

</details>

### baseConfig.departments

- 型: `DepartmentConfig[]`

部門の種別です。小学生部門もしくはオープン部門、といった種別を定義します。
1つ以上の種別が必要です。
以下で、配列の要素である`DepartmentConfig`のプロパティについて説明しています。

- `type`
  - 型: `string`
  - 部門の種別名です。主にプログラム中で使われます。他の部門と重複させることはできません。
- `name`
  - 型: `string`
  - 部門の表示名です。主にフロントエンドでの表示に使われます。
- `robotTypes`
  - 型: `string[]`
  - この部門にエントリーできるロボットの種別のリストです。`baseConfig.robotTypes`に指定した値以外を記述することはできません。

<details open>
<summary>例: 小学生部門とオープン部門の2種別の場合</summary>

```ts
departments: [
  {
    type: "elementary",
    name: "小学生部門",
    robotTypes: ["wheel", "leg"], // 車輪型も歩行型もエントリー可能
  },
  {
    type: "open",
    name: "オープン部門",
    robotTypes: ["leg"], // 歩行型のみエントリー可能
  },
],
```

</details>

### baseConfig.matches

- 型: `MatchConfig[]`

試合の種別です。予選もしくは本戦、といった種別を定義します。
1つ以上の種別が必要です。
以下で、配列の要素である`MatchConfig`のプロパティについて説明しています。

- `type`
  - 型: `string`
  - 試合種別の種別名です。主にプログラム中で使われます。他の試合種別と重複させることはできません。
- `name`
  - 型: `string`
  - 試合種別の表示名です。主にフロントエンドでの表示に使われます。
- `limitSeconds`
  - 型: `number`
  - 試合の制限時間です。単位は秒です。

<details open>
<summary>例: 予選と本戦の2種別の場合</summary>

```ts
matches: [
  {
    type: "pre",
    name: "予選",
    limitSeconds: 180,
  },
  {
    type: "main",
    name: "本戦",
    limitSeconds: 180,
  },
],
```

</details>

### baseConfig.rules

- 型: `RuleBase[]`

試合の採点ルールを表現するオブジェクトです。主に試合ページ(`/match`)で使われます。
以下で、配列の要素である`RuleBase`のプロパティについて説明しています。

- `name`
  - 型: `string`
  - ルールの名称です。主にプログラム中で使われます。他のルールの名称と重複させることはできません。
- `label`
  - 型: `string`
  - ルールの表示名です。主にフロントエンドでの表示に使われます。
- `type`
  - 型: `"single" | "countable"`
  - ルールのタイプです。`"single"`は「達成した/していない」のように真理値のみを状態に持つもの、`"countable"`は「n個持ち帰った」のように数値を状態に持つものを表します。
- `initial`
  - 型: `boolean | number`
  - ルールの状態の初期値です。`type`が`"single"`なら`boolean`、`"countable"`なら`number`で指定します。
- `point`
  - 型: `(arg: boolean | number) => number`
  - ルールの得点を計算する関数です。`arg`はこのルールの状態であり、`type`が`"single"`なら`boolean`、`"countable"`なら`number`になります。返り値が得点となります。
- `validate` (オプショナル)
  - 型: `(arg: boolean | number) => boolean`
  - ルールの状態をバリデーションする関数です。`arg`はこのルールの状態であり、`type`が`"single"`なら`boolean`、`"countable"`なら`number`になります。返り値がバリデーション結果です。
    採点プログラムは、この関数が指定されていれば状態を変化させる前に呼び出し、その状態に移行できるかをチェックします。例えば、「n個持ち帰った」などのルールの最小値/最大値を定めることができます。
    この関数が`false`を返すと、試合ページの採点UIがインタラクトできなくなります。

<details open>
<summary>例: 「スタートエリアを出た」「ゴールした」「ボールの数」の3ルールで採点する場合</summary>

```ts
rules: [
  {
    name: "leaveBase",
    label: "スタートエリアを出た",
    type: "single", // 出たか否か
    initial: false, // 開始時はスタートエリアを出ていない
    point: (done: boolean) => (done ? 1 : 0), // 出たら1点、でなければ0点
  },
  {
    name: "goal",
    label: "ゴール",
    type: "single", // ゴールしたか否か
    initial: false, // 開始時はゴールしていない
    point: (done: boolean) => (done ? 1 : 0), // ゴールしたら1点、でなければ0点
  },
  {
    name: "bringBall",
    label: "ボールの数",
    type: "countable", // ボールの個数は数値
    initial: 0, // 開始時の持ち帰ったボールの個数は0個
    point: (count: number) => count, // count個持ち帰ったらcount点(1個につき1点)
    validate: (value: number) => 0 <= value && value <= 3, // 持ち帰ることのできるボールの個数は0個以上かつ3個以下
  },
];
```

</details>

## conditions

- 型: `ConditionsConfig`

`baseConfig.rules`についてのより高度な制約を記述するためのオブジェクトです。`baseConfig.rules`で指定した各`name`をキーとして、`RuleCondition`オブジェクトを値に記述します。また、型推論の都合上末尾の`as const`は付与しないようにする必要があります。
以下で、レコードの値である`RuleCondition`のプロパティについて説明しています。

- `visible` (オプショナル)
  - 型: `(state: PremiseState) => boolean`
  - 試合ページでの表示/非表示を決める関数です。`state`は現在の試合の各種状態を含んだ`PremiseState`オブジェクトです。詳細はサンプルを参照してください。
    この関数が指定されていて、かつ`false`を返すと、試合ページの採点UIとして表示されません。
- `changeable` (オプショナル)
  - 型: `(state: PremiseState) => boolean`
  - 状態を変更できるかを決める関数です。
    `baseConfig.rules`の`validate`プロパティと似ていますが、そのルールの状態のみでなく`PremiseState`が持つ他の状態も参照して決めることができる点が異なります。試合ページの採点UIのインタラクト不可に影響する点は同じです。
- `scorable` (オプショナル)
  - 型: `(state: PremiseState) => boolean`
  - 得点が加算されるかを決める関数です。得点を計算する際、この関数が`false`を返すと、`baseConfig.rules`の`point`による得点が合計得点に加算されません。
    例えば、「ある部門のときのみ加算される」といったようなルールを記述することができます。

<details open>
<summary>例: <code>multiWalk</code>というルールを常に非表示、<code>goal</code>というルールを「本戦時のみ、先にルールしたチームのみに点数を与える」ようにする場合</summary>

```ts
{
  multiWalk: {
    visible: () => false, // 常に非表示
  },
  goal: {
    scorable: (state) => {
      if (state.matchInfo?.matchType !== "main") return false; // 本戦以外では先ゴールに得点を与えない

      const selfTime = state.matchState[state.side].getGoalTimeSeconds(); // 自分のゴールタイム
      const otherTime = state.matchState[against(state.side)].getGoalTimeSeconds(); // 相手のゴールタイム

      if (selfTime == null) return false; // 自分がゴールしていないなら先ゴールでない
      if (otherTime == null) return true; // 自分がゴールしていて、相手がゴールしていないなら先ゴール
      return selfTime < otherTime; // どちらもゴールしていて、自分のゴールタイムのほうが小さければ先ゴール
    },
  },
}
```

</details>

## utility

`utility`ディレクトリ以下に、設定を記述する際に便利な関数群が置かれています。

### createConfig(baseConfig, conditions)

- `baseConfig`: `BaseConfig`
- `conditions`: `ConditionsConfig`
- 戻り値の型: `Config`

設定を作成する関数です。詳細は上記の通りです。

### against(side)

- `side`: `"left" | "right"`
- 戻り値の型: `"left" | "right"`

`side`が`"left"`なら`"right"`を、`"right"`なら`"left"`を返します。

## For Developers(WIP)

開発者向けの情報集です。

### kcmsx/configをモノレポ内の別のパッケージから使う

kcmsx/configを使いたいパッケージで以下のコマンドを実行してください。

```bash
pnpm add config --workspace
```

以下のように`import`して使えます。

```ts
import { config, MatchInfo } from "config";
```

### 型定義ファイルのディレクトリ構造

型定義は`src/types`ディレクトリ以下に置かれています。

- `src/types/*.ts`が、`config.ts`に型制約をつけるための"導出型"です。
- `src/types/derived/*.ts`が、`config.ts`に記述された設定から導出された、可能な限りリテラル型で表現されている"被導出型"です。

型をインポートする場合は、基本的に`src/types/derived`ディレクトリに置かれているものを使用するほうが好ましいです。そのため、パッケージのルートからエクスポートされている型は`src/types/derived`ディレクトリにあるもののみです。`types`直下の型が必要な場合は、ファイルパスで`import`することができます。

<details open>
  <summary>例:</summary>

  ```ts
  import { RuleType } from "config/src/types/rule";
  ```

</details>
