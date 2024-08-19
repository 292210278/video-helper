import { useNavigate } from "react-router-dom";
import Transition from "../ui/Transition";

function NotFound() {
  const navigate = useNavigate();
  return (
    <Transition>
      <div className="not-found-page">
        <h1>404</h1>
        <h2>噢！找不到页面了</h2>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          点击回到首页
        </button>
      </div>
    </Transition>
  );
}

export default NotFound;
