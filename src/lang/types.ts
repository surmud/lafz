/**
 * A language pack: everything that is specific to the language being taught. The app, engine and
 * scripts read these through `pack` (src/lang/index.ts) instead of hard-coding Urdu. Urdu is the
 * only pack today; docs/ADDING_A_LANGUAGE.md explains how to add another.
 */
export interface LanguagePack {
  /** BCP 47 code, also the content folder name: content/<code>/. */
  code: string;
  name: string;
  nativeName: string;
  script: {
    /** Name shown to learners for the native script ("Nastaliq"). */
    name: string;
    dir: "rtl" | "ltr";
    /** lang attribute on native-script text. */
    lang: string;
    /** CSS font-family stack for the native script. */
    fontFamily: string;
    /** Matches any character of the native script (content validation, speech transcripts). */
    chars: RegExp;
    /** Loose normalisation of native-script text for comparisons (diacritics, letter variants). */
    normalise: (text: string) => string;
  };
  romanization: {
    /** What learners call the Latin-letter spelling ("Roman Urdu"). */
    name: string;
    /** Phonetic folding of one normalised Latin token, so spelling variants collapse to one key. */
    fold: (token: string) => string;
    /** Short or irregular words: equivalence classes, canonical spelling first. */
    lexicon: readonly (readonly string[])[];
    /** Real word pairs that fold close together but mean different things. */
    confusables: readonly (readonly [string, string])[];
    /** True when a word's final vowel carries grammar (mera/meri), so it is never forgiven. */
    finalVowelIsGrammar: boolean;
  };
  speech: {
    /** Web Speech API recognition language. */
    recognition: string;
    /** Whisper language code (on-device fallback and the audio audit). */
    whisper: string;
  };
  voices: {
    /** Audio-file voice ids (part of each clip's hash key). */
    female: string;
    male: string;
    /** Characters whose lines use the male voice. */
    maleSpeakers: readonly string[];
  };
}
