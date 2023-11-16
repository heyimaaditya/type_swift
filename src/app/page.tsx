import WordPallete from "@/components/wordPallete";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Home =async()=>{
  const session = await getServerSession(authOptions);
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative text-lg pointer-events-none bg-zinc-700">
        <WordPallete />
      </div>
  );
}

export default Home;