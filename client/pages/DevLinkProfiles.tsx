import { useNavigate } from "react-router-dom";

export default function DevLinkProfiles() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dev-link")}
          className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 transition flex items-center gap-2"
        >
          ← Back to Dev-Link
        </button>

        {/* Fullscreen iframe */}
        <iframe
          src="https://dev-link.me"
          className="w-full h-full border-0"
          title="Dev-Link Platform"
        />
      </div>
    </div>
  );
}
