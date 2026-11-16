import { DevGallery } from "@/components/DevGallery";
import { characters, pickPhrases } from "@/content";

export const metadata = { title: "UI gallery · Lafz", robots: { index: false } };

export default function DevUi() {
  return <DevGallery characters={characters()} phrases={pickPhrases(["u01.salam", "u01.aap-kaise-hain", "u03.bas-bas"])} />;
}
