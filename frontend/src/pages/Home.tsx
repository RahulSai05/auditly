import { useNavigate } from "react-router-dom";

export default function Home() {
    const router = useNavigate()
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                Auditly offers an AI-driven solution to simplify and enhance your product return <br />
                process. Experience efficiency and transparency like never before.
                <div className="mt-7">
                    Click 'Start a Return' to begin the process.
                </div>
                <button onClick={()=>router('/options')} className="bg-[#5986E7] text-white px-4 mt-8 py-2 rounded-md">
                    Start a Return
                </button>
            </div>
        </div>
    );
}
