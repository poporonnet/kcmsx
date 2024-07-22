import { Link } from "react-router-dom";
export const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to="/entrylist">参加者一覧</Link>
      <br />
      <Link to="/entry">参加者登録</Link>
      <br />
      <Link to="/matchlist">試合表</Link>
      <br />
      <Link to="/result">試合結果</Link>
      <br />
      <Link to="/ranking">ランキング</Link>
    </>
  );
};
