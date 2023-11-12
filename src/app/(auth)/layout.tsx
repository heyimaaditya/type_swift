import { FC, ReactNode } from 'react';
import Image from "next/image";
import image from "../../../public/background.jpg";
import logo from "../../../public/logo_trans.png"

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> =  ({children})=>{
    return (
        <>
            {/* // Background Image */}
            <div className="-z-10 h-full w-full">
                <Image
                    alt="Background image"
                    src={image}
                    fill
                    className="object-cover brightness-[0.4]">
                </Image>
            </div>

            <div className="absolute z-0 h-4/5 w-4/5 bg-sla=te-600 ml-36 mt-20">
                <div className="flex flex-row">
                    <div className="basis-1/2">
                        <Image
                            alt="Logo"
                            src={logo}
                            className="w-2/4 mt-52">
                        </Image>
                        <p className="text-white text-xl font-serif ml-4">Sign in or Create an Account</p>
                    </div>
                    <div className="basis-1/2">
                        {children}
                    </div>
                </div>
            </div>

        </>
    )
}

export default AuthLayout;