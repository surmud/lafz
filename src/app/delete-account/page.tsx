import { Contact, H2, LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Delete your account · Lafz" };

export default function DeleteAccount() {
  return (
    <LegalPage title="Delete your account" updated="18 November 2026">
      <p>
        You don&apos;t need an account to use Lafz. If you created one (by signing in with Google or Apple), you can delete
        it and everything stored with it at any time.
      </p>
      <H2>In the app (immediate)</H2>
      <ol className="list-decimal pl-5">
        <li>Open Lafz and go to <strong>Me</strong>.</li>
        <li>Under <strong>Account</strong>, tap <strong>Delete account and data</strong>.</li>
        <li>Confirm. Your account and its saved progress are deleted straight away.</li>
      </ol>
      <H2>Without the app</H2>
      <p>
        Contact <Contact /> from the email address you signed in with, asking for your Lafz account to be deleted. We&apos;ll
        delete it within 30 days and confirm.
      </p>
      <H2>What is deleted</H2>
      <ul className="list-disc pl-5">
        <li>Your account (email address and the name from your sign-in provider).</li>
        <li>The copy of your learning progress stored with the account.</li>
      </ul>
      <p>Nothing is kept afterwards, apart from what the law requires us to keep (for example, records of tips for tax purposes).</p>
      <H2>What stays on your device</H2>
      <p>
        Deleting your account doesn&apos;t touch the progress and recordings on your phone. To erase those too, go to{" "}
        <strong>Me → Your data → Erase everything on this device</strong>, or uninstall the app.
      </p>
    </LegalPage>
  );
}
