import { Navigate, useLocation } from "react-router-dom";

export default function SignupRedirect() {
  const location = useLocation();
  const search = location.search || "";
  return <Navigate to={`/login${search}`} replace />;
}
