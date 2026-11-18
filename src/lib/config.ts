/**
 * Founder-supplied configuration. Every value is read at build time from NEXT_PUBLIC_* environment
 * variables (GitHub Actions repository variables in CI). Anything unset ships dormant: the feature
 * is simply not shown. See PROGRESS.md "Needs founder".
 */
const env = (v: string | undefined): string => (v ?? "").trim();

export const config = {
  /** Stripe Payment Link for "Buy me a chai". */
  chaiUrl: env(process.env.NEXT_PUBLIC_CHAI_URL),
  supabaseUrl: env(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: env(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  /** "1" once Sign in with Apple is set up in Supabase (required on iOS when Google is offered). */
  appleSignIn: env(process.env.NEXT_PUBLIC_APPLE_SIGNIN) === "1",
  /** Contact address for privacy and deletion requests. */
  contactEmail: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  /** "1" in the Capacitor (iOS/Android) build. */
  native: env(process.env.NEXT_PUBLIC_NATIVE) === "1",
  /** "1" once native OAuth (system browser + app.lafz:// deep link) is wired; see docs/RELEASE.md. */
  nativeAuth: env(process.env.NEXT_PUBLIC_NATIVE_AUTH) === "1",
};

/** Google blocks OAuth inside app web views, so native builds keep accounts off until nativeAuth is set. */
export const accountsEnabled = (): boolean =>
  config.supabaseUrl !== "" && config.supabaseAnonKey !== "" && (!config.native || config.nativeAuth);
/** Tips are web-only for now: the stores require in-app purchase for tips (Apple 3.1.1, Play billing). */
export const tipsEnabled = (): boolean => config.chaiUrl !== "" && !config.native;
