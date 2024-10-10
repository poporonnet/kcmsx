import { Link } from "react-router-dom";
export const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to="/team">参加者一覧</Link>
      <br />
      <Link to="/register">参加者登録</Link>
      <br />
      <Link to="/register/bulk">参加者一括登録</Link>
      <br />
      <Link to="/matchlist">試合表</Link>
      <br />
      <Link to="/result">試合結果</Link>
      <br />
      <Link to="/ranking">ランキング</Link>
      <br />
      <Link to="/match">エキシビション</Link>
    </>
  );
};
