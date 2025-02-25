import { useRouteError, useNavigate } from "react-router-dom";
import "./ErrorPage.css"; // 필요하면 스타일 추가

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1>😢 페이지를 찾을 수 없습니다.</h1>
      <p>{error?.statusText || error?.message || "알 수 없는 오류가 발생했습니다."}</p>
      <button onClick={() => navigate("/")}>홈으로 이동</button>
    </div>
  );
};

export default ErrorPage;
