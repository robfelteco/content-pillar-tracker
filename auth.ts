import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Google sign-in restricted to one Google Workspace domain (AUTH_ALLOWED_DOMAIN).
// Set AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET alongside it.
//
// Everything in the app is behind this — see middleware.ts. The one deliberate
// exception is /api/sync, which Vercel Cron calls unauthenticated and which
// guards itself with CRON_SECRET / the x-vercel-cron header.

const ALLOWED_DOMAIN = process.env.AUTH_ALLOWED_DOMAIN ?? "";
if (!ALLOWED_DOMAIN) {
  throw new Error("AUTH_ALLOWED_DOMAIN is required: the Google Workspace domain allowed to sign in, e.g. yourcompany.com");
}

function emailAllowed(email?: string | null): boolean {
  if (!email) return false;
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  return email.slice(at + 1).toLowerCase() === ALLOWED_DOMAIN.toLowerCase();
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    // Reject anyone outside the workspace at the door — before a session or a
    // JWT is ever issued. Returning false sends them to the error page.
    signIn({ profile }) {
      return emailAllowed(profile?.email);
    },
    // Belt and braces: an already-issued token whose email no longer qualifies
    // (domain changed, env tightened) stops being honoured on the next request.
    session({ session }) {
      return emailAllowed(session.user?.email) ? session : { ...session, user: undefined as never };
    },
  },
  pages: {
    // Default Auth.js pages are fine, but send failures somewhere that explains
    // the domain rule rather than showing a bare "AccessDenied".
    error: "/denied",
  },
});
