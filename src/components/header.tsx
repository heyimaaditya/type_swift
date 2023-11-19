'use client';
import Image from "next/image";
import image from "../../public/logo_home.png";
import { Button } from "./ui/button";
import Link from "next/link";

function Header() {
    function handleClick(){
        window.scrollTo(0, 800);
    }
    return (
        <div className="flex justify-items-center items-center justify-between mb-6">
            <div className="logo mt-3 ml-8">
                <Image
                    alt="Background image"
                    src={image}
                    // height={60}
                    width={120}
                    className="object-cover ">
                </Image>
            </div>
            <div className="flex">
                <ul className="menu flex list-none font-serif text-xl justify-normal space-x-6 mt-4 text-white">
                    <li><Link href='/'>Home</Link></li>
                    <li >Github</li>
                    <li onClick={handleClick}>Features</li>
                    <li className="gap-2">Testimonials</li>
                    <li><Button className='mr-11 text-xl text-black' variant="outline">Get Started</Button></li>
                </ul>
            </div>
        </div>
    )
}

export default Header;