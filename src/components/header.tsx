import logo_home from "../../public/logo_home.png";
import Image from "next/image";
import { Button } from "./ui/button";

function Header() {
    return (
        <div className="flex items-center justify-between">
            <Image src={logo_home} alt="Logo" width={100} />

            <ul className="flex list-none text-xl justify-normal space-x-6 mt-4">
                <li>Github</li>
                <li>Features</li>
                <li><Button>Get Started</Button></li>
            </ul>
        </div>
    );
}

export default Header;