import Link from "next/link";
import { Contact, H2, LegalPage } from "@/components/LegalPage";
import { accountsEnabled } from "@/lib/config";

export const metadata = { title: "Help · Lafz" };

/** Support page (App Store "Support URL"): short FAQ and how to reach us. */
export default function Support() {
  return (
    <LegalPage title="Help">
      <p>
        Lafz is a free Urdu course for families: speaking, listening and reading. Questions, a phrase that sounds wrong, or
        a bug? Write to <Contact />. We read everything.
      </p>

      <H2>Is Lafz really free?</H2>
      <p>Yes. No ads, no subscription, nothing locked. Every unit is open from day one.</p>

      <H2>Do I need an account?</H2>
      <p>
        No. Lafz works fully without one.{" "}
        {accountsEnabled()
          ? "On the website you can optionally sign in with Google to back up your progress and use it on other devices."
          : "Your progress is saved on your phone."}
      </p>

      <H2>Where is my progress saved? How do I move to a new phone?</H2>
      <p>
        On your device. To move it, open <strong>Me → Your data → Export backup</strong>, send the file to your new
        phone, and use <strong>Restore</strong> there. Family voice recordings travel in the same file.
      </p>

      <H2>I can&apos;t hear the audio</H2>
      <p>
        Check the volume, and on iPhone check the ring/silent switch: silent mode also mutes Lafz. Each phrase has a normal
        and a slow (🐢) version.
      </p>

      <H2>Do I have to speak out loud?</H2>
      <p>
        No. Speaking exercises ask for the microphone the first time; you can say no, or tap <strong>Can&apos;t speak
        now</strong> on any of them. Recordings stay on your device.
      </p>

      <H2>How should I spell Roman Urdu?</H2>
      <p>
        However you normally would. &quot;shukriya&quot;, &quot;shukria&quot; and &quot;shukrya&quot; all count. Lafz
        only insists where the spelling changes the meaning (mera / meri, khana / kehna).
      </p>

      <H2>What happens when I get something wrong?</H2>
      <p>
        Nothing bad. There are no hearts or lives. The question comes back a little later, and getting it right then
        earns a comeback bonus. Missed phrases also collect under <strong>Practice → Trouble words</strong>.
      </p>

      <H2>I think a phrase is wrong</H2>
      <p>
        Every phrase is checked against dictionaries (Platts, Rekhta, Wiktionary) and the sources are recorded, but families
        talk in many ways. Write to <Contact /> with the phrase and what you&apos;d say instead.
      </p>

      <H2>How do I delete my data?</H2>
      <p>
        <strong>Me → Your data → Erase everything on this device.</strong>
        {accountsEnabled() ? (
          <>
            {" "}
            If you signed in on the website, see <Link className="underline" href="/delete-account/">Delete your account</Link>.
          </>
        ) : null}{" "}
        More in the <Link className="underline" href="/privacy/">privacy policy</Link>.
      </p>
    </LegalPage>
  );
}
