import { H2, LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Credits · Lafz" };

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="underline" href={href}>
    {children}
  </a>
);

export default function Credits() {
  return (
    <LegalPage title="Credits">
      <p>Lafz stands on the work of many people. Thank you.</p>
      <H2>Voices</H2>
      <ul className="list-disc pl-5">
        <li>
          <strong>Matcha-TTS Urdu</strong> (male and female voices) by Ahsan Talal:{" "}
          <A href="https://huggingface.co/AhsanTalal/urdu-matcha-tts">AhsanTalal/urdu-matcha-tts</A> and{" "}
          <A href="https://huggingface.co/AhsanTalal/urdu-matcha-tts-female">-female</A>, Apache-2.0. Built on Matcha-TTS
          (Mehta et al., ICASSP 2024).
        </li>
        <li>
          <strong>Vocos</strong> vocoder, 22 kHz checkpoint by BSC-LT:{" "}
          <A href="https://huggingface.co/BSC-LT/vocos-mel-22khz">BSC-LT/vocos-mel-22khz</A>, Apache-2.0 (Lee et al., ICLR 2024).
        </li>
        <li>
          Training data behind the voices: <strong>UrduSpeech</strong> (ASLP-lab), CC-BY-4.0. Attia Nafees ul Haq, Zeyu Zhu,
          Jingbin Hu, ChunJiang He and Lei Xie, “UrduSpeech: A 156-Hour Urdu Speech Corpus with 12-Dimension Paralinguistic
          Annotations”, arXiv:2605.17846 (2026). <A href="https://huggingface.co/datasets/ASLP-lab/UrduSpeech">Dataset</A>.
        </li>
        <li>
          <strong>Rasa</strong> (AI4Bharat), CC-BY-4.0. Praveen Srinivasa Varadhan, Ashwin Sankar, Giri Raju and Mitesh M.
          Khapra, “Rasa: Building Expressive Speech Synthesis Systems for Indian Languages in Low-resource Settings”, Proc.
          Interspeech 2024. <A href="https://github.com/AI4Bharat/Rasa">github.com/AI4Bharat/Rasa</A>.
        </li>
        <li>Audio clips were generated offline and checked with OpenAI Whisper (MIT licence).</li>
      </ul>
      <H2>On-device AI</H2>
      <ul className="list-disc pl-5">
        <li>
          Smart search: <strong>all-MiniLM-L6-v2</strong> (sentence-transformers), Apache-2.0, run with{" "}
          <A href="https://github.com/huggingface/transformers.js">transformers.js</A> (Apache-2.0).
        </li>
        <li>Speech recognition fallback: <strong>Whisper base</strong> (OpenAI, MIT), ONNX build by onnx-community.</li>
      </ul>
      <H2>Urdu references</H2>
      <ul className="list-disc pl-5">
        <li>
          John T. Platts, <em>A Dictionary of Urdu, Classical Hindi, and English</em> (1884), via{" "}
          <A href="https://dsal.uchicago.edu/dictionaries/platts/">Digital Dictionaries of South Asia, University of Chicago</A>.
        </li>
        <li><A href="https://www.rekhta.org/">Rekhta</A> and the Rekhta Dictionary.</li>
        <li><A href="https://en.wiktionary.org/">Wiktionary</A> (CC BY-SA), as a secondary reference.</li>
      </ul>
      <H2>Poetry</H2>
      <p>
        Couplets by <strong>Mirza Ghalib</strong> (1797–1869), <strong>Allama Iqbal</strong> (1877–1938) and{" "}
        <strong>Mir Taqi Mir</strong> (1723–1810), all in the public domain. Texts checked against Rekhta.
      </p>
      <H2>Fonts</H2>
      <ul className="list-disc pl-5">
        <li><strong>Noto Nastaliq Urdu</strong>, SIL Open Font License 1.1.</li>
        <li><strong>Fraunces</strong>, SIL Open Font License 1.1.</li>
      </ul>
      <H2>Software</H2>
      <p>
        Built with Next.js, React, Tailwind CSS, Zod, idb and Capacitor (all MIT), and Supabase for optional accounts. Code:{" "}
        <A href="https://github.com/surmud/lafz">github.com/surmud/lafz</A>.
      </p>
      <H2>Characters and art</H2>
      <p>The cast (Khala, Nani, Bilal and the rest), their portraits and the app icon are original to Lafz.</p>
    </LegalPage>
  );
}
