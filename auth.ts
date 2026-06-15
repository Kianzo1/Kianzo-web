import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const EMAILS_PERMITIDOS = ['kianzo.web@gmail.com']

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return EMAILS_PERMITIDOS.includes(user.email ?? '')
    },
    async session({ session }) {
      return session
    },
  },
  pages: {
    signIn: '/admin',
    error: '/admin',
  },
})
