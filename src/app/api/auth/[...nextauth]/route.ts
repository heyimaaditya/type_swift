import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { db } from '@/lib/prisma';
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.JWT_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {     //missing data
                    return null;
                }

                const existingUser = await db.user.findFirst({       //fetch user from database
                    where: {
                        email: credentials?.email
                    }
                })

                if (!existingUser) {                //no user exists in database
                    return null;
                }
                
                //check if password matches
                const passwordMatch = await bcrypt.compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    return null;
                }
                
                //successful sigin
                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username,
                    email: existingUser.email
                }
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_KEY!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async jwt({ token, user }){
            console.table([token, user]);
            if(user)
            return {
                ...token, 
                username: user.username
            }
            return token
        },
        async session({ session, token }){ 
        return{
            ...session, 
            user: {
                ...sessionStorage.user,
                username: token.username
            }
        }
    },
}
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};