import ReactDOM from "react-dom/client";
import App from "./app/App";
import ProtectedRoute from "./app/ProtectedRoute";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ProtectedRoute>
    <App />
  </ProtectedRoute>
);
