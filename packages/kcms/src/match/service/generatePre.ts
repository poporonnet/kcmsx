export class GeneratePreMatchService {
  private readonly COURSE_COUNT = 3;

  async handle(data: string[]): Promise<(string | undefined)[][][]> {
    // チームをクラブ名でソートする
    const teams = data.sort();

    // コースの数でスライスする
    // 初期化時に必要な個数作っておく
    const slicedTeams: string[][] = new Array(Math.ceil(teams.length / this.COURSE_COUNT)).fill([]);
    for (let i = 0; i < Math.ceil(teams.length / this.COURSE_COUNT); i++) {
      // コース数
      slicedTeams[i] = teams.slice(i * this.COURSE_COUNT, (i + 1) * this.COURSE_COUNT);
    }

    /* スライスされた配列を転置する
     * 列数 != 行数の場合、undefinedが入るので、filterで除外している
     */
    const transpose = slicedTeams[0]
      .map((_, i) => slicedTeams.map((r) => r[i]))
      .map((r) => r.filter((v) => v !== undefined));

    // 配列の要素ごとに、右側のコースを走る相手を決める
    return transpose.map((v) => {
      if (v.length === 1) {
        console.warn('WANING: 1チームだけのコースがあります');
        return [
          [v[0], undefined],
          [undefined, undefined],
          [undefined, v[0]],
        ];
      } else if (v.length === 2) {
        console.warn('WANING: 2チームだけのコースがあります');
        return [
          [v[0], v[1]],
          [undefined, undefined],
          [v[1], v[0]],
        ];
      } else if (v.length === 3) {
        console.warn('WANING: 3チームだけのコースがあります');
        return [
          [v[0], v[2]],
          [v[1], undefined],
          [undefined, v[0]],
          [v[2], v[1]],
        ];
      } else {
        // ずらす数(floor(配列の長さ/2))
        const shift = Math.floor(v.length / 2);
        // ずらした配列を作成
        const shifted = v.slice(shift).concat(v.slice(0, shift));
        // ペアを作る
        return v.map((_, i) => [v[i], shifted[i]]);
      }
    });
  }
}
