import { Authsignal } from "@authsignal/node";
import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authsignal = new Authsignal({
  secret: process.env.AUTHSIGNAL_TENANT_SECRET!,
  apiBaseUrl: process.env.NEXT_PUBLIC_AUTHSIGNAL_BASE_URL,
});


export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    CredentialsProvider({
      name: "webauthn",
      credentials: {},
      async authorize(cred) {
        const { signInToken } = cred as { signInToken: string };

        if (!signInToken) {
          return null;
        }

        const result = await authsignal.validateChallenge({
          token: signInToken,
        });



        return null;
      },
    }),
  ],
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
