import { db } from "@/lib/prisma";
import { hash } from 'bcrypt';
import * as z from 'zod';

const userSchema = z.object({
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
})

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        const exists_user_email = await db.user.findUnique({
            where: { email: email }
        })
        if (!!exists_user_email) {
            return new Response(JSON.stringify({ user: null, message: "This email has a account associated. Please Sign in" }), {
                status: 409,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        const exists_user_username = await db.user.findFirst({
            where: { username: username }
        })
        if (!!exists_user_username) {
            return new Response(JSON.stringify({ user: null, message: "This username has already been taken up" }), {
                status: 409,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                username,
                email,
                provider: "CREDENTIALS",
                password: hashedPassword
            }
        });

        const { password: not_shown, ...rest } = newUser;
        return new Response(JSON.stringify({ user: rest, message: "User created successfully" }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Something went wrong" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}