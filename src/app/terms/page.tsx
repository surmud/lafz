import Link from "next/link";
import { Contact, H2, LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms · Lafz" };

export default function Terms() {
  return (
    <LegalPage title="Terms of use" updated="18 November 2026">
      <p>By using Lafz you agree to these terms. They&apos;re short.</p>
      <H2>Free to use</H2>
      <p>
        Lafz is free, with no ads and nothing locked. You may use it for your own learning and to help your family learn.
      </p>
      <H2>Accuracy</H2>
      <p>
        We check the Urdu against reputable dictionaries and record our sources, but Lafz is a learning aid, not a translation
        service. Don&apos;t rely on it for medical, legal or emergency situations. The voices are computer-generated and may
        not always sound like a native speaker.
      </p>
      <H2>Accounts</H2>
      <p>
        Accounts are optional. Keep your sign-in secure. You can delete your account at any time. We may remove accounts that
        are used to abuse the service.
      </p>
      <H2>Tips</H2>
      <p>
        Tips are voluntary gifts to support the project. They don&apos;t buy features, content or priority, and they are not
        refundable except where the law requires.
      </p>
      <H2>Content you make</H2>
      <p>
        Recordings you make stay on your device and remain yours. Only record other people with their permission.
      </p>
      <H2>No warranty</H2>
      <p>
        Lafz is provided as is, without warranties of any kind. To the extent the law allows, we aren&apos;t liable for losses
        arising from using it, including lost progress. Export a backup if your progress matters to you.
      </p>
      <H2>Credits and licences</H2>
      <p>
        Third-party voices, fonts, models and references are used under their own licences; see{" "}
        <Link className="underline" href="/credits/">Credits</Link>.
      </p>
      <H2>Contact</H2>
      <p>
        Questions: <Contact />.
      </p>
    </LegalPage>
  );
}
