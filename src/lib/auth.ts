import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // After Google login, register/check user in Google Sheets
      try {
        const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl) return true;

        const email = user.email;
        const name = user.name || "";

        // Check if user exists
        const checkRes = await fetch(
          `${scriptUrl}?action=getUser&email=${encodeURIComponent(email!)}`
        );
        const checkData = await checkRes.json();

        if (!checkData.found) {
          // New user - add to sheet as pending
          await fetch(
            `${scriptUrl}?action=addUser&email=${encodeURIComponent(email!)}&name=${encodeURIComponent(name)}`
          );
        } else {
          // Existing user - update last login
          await fetch(
            `${scriptUrl}?action=updateLogin&email=${encodeURIComponent(email!)}`
          );
        }

        return true;
      } catch (error) {
        console.error("Error checking user:", error);
        return true; // Allow login even if sheet check fails
      }
    },
    async session({ session }) {
      // Add user status to session
      try {
        const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
        if (!scriptUrl || !session.user?.email) return session;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `${scriptUrl}?action=getUser&email=${encodeURIComponent(session.user.email)}`,
          { signal: controller.signal, redirect: "follow" }
        );
        clearTimeout(timeout);
        const data = await res.json();

        if (data.found) {
          (session as any).userStatus = data.status;
        } else {
          (session as any).userStatus = "pending";
        }
      } catch {
        (session as any).userStatus = "pending";
      }

      // Admin check
      (session as any).isAdmin = !!session.user?.email && ADMIN_EMAILS.includes(session.user.email);

      return session;
    },
  },
});
