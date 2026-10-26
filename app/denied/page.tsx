const DOMAIN = process.env.AUTH_ALLOWED_DOMAIN || "your workspace";

export const metadata = { title: "Access denied" };

// Shown when Google sign-in succeeds but the account is outside the allowed
// workspace. Auth.js sends failures here via the `pages.error` config.
export default function Denied() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <h1 className="text-xl font-semibold">Access denied</h1>
      <p className="mt-3 text-sm text-neutral-500">
        This tool is limited to @{DOMAIN} accounts. Sign in with your @{DOMAIN} Google account.
      </p>
      <a
        href="/api/auth/signin"
        className="mt-6 inline-block rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
      >
        Try again
      </a>
    </main>
  );
}
