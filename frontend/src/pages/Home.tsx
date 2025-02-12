import { useNavigate } from "react-router-dom";

export default function Home() {
  const router = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="mt-7">Click 'Start a Return' to begin the process.</div>
        <button
          onClick={() => router("/options")}
          className="bg-[#5986E7] text-white px-4 mt-8 py-2 rounded-md"
        >
          Start a Return
        </button>
      </div>
    </div>
  );
}
