import Link from "next/link";
import { Contact, H2, LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy · Lafz" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="18 November 2026">
      <p>
        Short version: Lafz keeps your learning on your own device. There are no ads and no tracking, and nothing is sold. A
        few optional features send data, and only when you turn them on.
      </p>

      <H2>On your device (always)</H2>
      <p>
        Your progress, settings and any voice recordings you or your family make are stored in your browser or the app on
        this device. They don&apos;t leave it unless you export a backup file yourself. You can erase all of it at any time
        under <strong>Me → Your data → Erase everything on this device</strong>.
      </p>

      <H2>If you sign in (optional)</H2>
      <p>
        You can sign in with Google (or Apple, in the iPhone app) to back up your progress and use it on another device. If
        you do, we store your email address, the name your account provider shares, and a copy of your learning progress
        (which lessons you&apos;ve done, XP, streak, review schedule). This is held by Supabase, our database provider, and is
        readable only by your account. <strong>Voice recordings are never uploaded.</strong> You can delete your account and
        everything stored with it from inside the app, or see <Link className="underline" href="/delete-account/">how to delete your account</Link>.
      </p>

      <H2>Anonymous statistics (optional, off by default)</H2>
      <p>
        If this copy of Lafz has statistics enabled, you can choose to share an anonymous summary to help improve the course:
        counts and accuracy rates by skill, your estimated level, and which lessons you finished and how long they took,
        with a random install ID. No names, nothing you typed, no recordings. You can read the exact summary under{" "}
        <strong>Me → Insights</strong> before turning it on, and turn it off again there.
      </p>

      <H2>Tips</H2>
      <p>
        On the website you can leave a tip through Stripe. Stripe processes the payment under its own privacy policy; we
        receive the amount and the receipt details Stripe provides, not your card number. Tips are not offered in the mobile
        apps.
      </p>

      <H2>Other services Lafz talks to</H2>
      <ul className="list-disc pl-5">
        <li>The website is hosted on GitHub Pages, which keeps standard server logs (such as IP addresses).</li>
        <li>
          Optional on-device AI (smart search, and speech recognition where your browser lacks it) downloads open models from
          jsDelivr and Hugging Face the first time you use it. Those services see a normal download request. Your words and
          audio are processed on your device and are not sent anywhere.
        </li>
        <li>Sharing buttons (WhatsApp, your phone&apos;s share sheet) only send what you choose to share.</li>
      </ul>

      <H2>Children</H2>
      <p>Lafz is meant for people aged 13 and over. We don&apos;t knowingly collect personal data from younger children.</p>

      <H2>Your rights</H2>
      <p>
        You can see, export and delete your data yourself in the app. For anything else, including access or deletion
        requests about a signed-in account, contact <Contact />.
      </p>

      <H2>Changes</H2>
      <p>If this policy changes, the date at the top changes too. Significant changes will be shown in the app.</p>
    </LegalPage>
  );
}
