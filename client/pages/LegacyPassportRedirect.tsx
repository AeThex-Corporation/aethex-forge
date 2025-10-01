import { Navigate, useParams } from "react-router-dom";

export default function LegacyPassportRedirect() {
  const { id } = useParams<{ id?: string }>();
  const target = id ? `/passport/${id}` : "/passport/me";
  return <Navigate to={target} replace />;
}
