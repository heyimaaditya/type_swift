import React from "react";
import type { Metadata } from "next";
import AuthLayout from "../layout";

export const metadata: Metadata = {
    title: "Login",
    description: "Login for website if user have account"
}

export default function Login() {
    return (
    <AuthLayout>
        <>
            <h1>Hello</h1>
        </>
    </AuthLayout>
    )
}