'use client';
import WordPallete from "@/components/wordPallete";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Header from "@/components/header";
import "@/styles/hero.css";
import HeroSection from "@/components/herosection";
import Feature from "@/components/feature";
import Footer from "@/components/ui/footer";

const Home = ()=>{
  // const session = await getServerSession(authOptions);
  return (
    <div>
      <div className="hero h-screen">
        <Header />
        <HeroSection/>
      </div>
        {/* <WordPallete /> */}
      <div className="flex bg-gray-950 text-white"><Feature /></div>
      <div className="flex bg-gray-950 text-white"><Footer /></div>
        
      </div>
  );
}

export default Home;