"use client";

import React from "react";
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
import { useRouter } from "next/navigation";


export default function Login() {
    const router = useRouter();

    //validate form
    const FormSchema = z.object({
        email: z.string()
            .min(1, "Email is required")
            .email("Invalid Email"),

        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password cannot be less than 8 characters"),

        username: z
            .string()
            .min(1, "Username cannot be empty")
            .regex(/^[a-zA-Z0-9]*$/)
            .max(20, "Username should be less than 20 characeters"),

        confirmPassword: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password cannot be less than 8 characters")
    })
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'],
            message: 'Password do not match'
        })

        // default values
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof FormSchema>)=>{
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: values.username,
                email: values.email,
                password: values.password
            })
        })
        console.log(response);

        if(response.ok)
        {
            router.push('/login');
        }
        else
        {
            console.error(`Registration failed.`)
        }
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
                        <div className="bg-slate-200 rounded-xl text-lg pl-12 pt-7 pb-8 ">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

                                    {/* Username */}
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Username" type="text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                        {/* email */}
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

                                    {/* Password */}
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

                                    {/* Confirm Password */}
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Re-enter Password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Sign Up</Button>
                                </form>
                                <div className='mx-auto my-3 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400 pr-12'>
                                    or
                                </div>

                                {/* Sign in Prompt */}
                                <p className='text-center text-sm text-gray-900 pt-3'>
                                    If you have an account, please&nbsp;
                                    <Link className='text-blue-500 hover:underline font-bold' href='/login'>Sign in</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}