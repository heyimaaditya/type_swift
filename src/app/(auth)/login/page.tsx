"use client";

import React from "react";
// import type { Metadata } from "next";
import Image from "next/image";
import image from "../../../../public/background.jpg";
import logo from "../../../../public/logo_trans.png"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";

// export const metadata: Metadata = {
//     title: "Login",
//     description: "Login for website if user have account"
// }

export default function Login() {    
    
    const FormSchema = z.object({
        email: z.string()
        .min(1, "Email is required")
        .email("Invalid Email"),

        password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password cannot be less than 8 characters")
    })
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password:""
        }})

    const onSubmit = (values: z.infer<typeof FormSchema>)=>{
        console.log({values});
    }

    return (
        <>
            {/* // Background Image */}
            <div className="-z-10 h-full w-full">
                <Image
                    alt="Background image"
                    src={image}
                    fill
                    className="object-cover brightness-[0.5]">
                </Image>
            </div>

            <div className="absolute z-0 h-4/5 w-4/5 bg-s late-600 ml-36 mt-20">
                <div className="flex flex-row">
                    <div className="basis-1/2 hidden md:block">
                        <Image
                            alt="Logo"
                            src={logo}
                            className="w-2/4 mt-52">
                        </Image>
                        <p className="text-white text-sm md:text-lg lg:text-xl xl:text-2xl font-serif ml-4">Sign in or Create an Account</p>
                    </div>
                    <div className="basis-6/12 rounded">
                        <div className="bg-slate-200 rounded-xl text-lg pl-12 pt-7 pb-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Email" type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Sign in</Button>
                                </form>
                                <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                                    or
                                </div>

                                {/* Social Network Login */}
                                <span>
                                    <span className='text-center text-sm text-black mt-2'>Sign up with &nbsp;</span>
                                    <button className="pl-3 text-3xl text-blue-700"><FaFacebookF /></button>
                                    <button className="pl-3 text-3xl"><FcGoogle /></button>
                                    <button className="pl-3 text-3xl"><SiGithub /></button>
                                </span>

                                {/* Sign Up Prompt */}
                                <p className='text-center text-sm text-gray-900 mt-4'>
                                    New to Type Swift? Please &nbsp;
                                    <Link className='text-blue-500 hover:underline' href='/register'>
                                        Sign up
                                    </Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}