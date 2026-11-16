import { WelcomeView } from "@/components/WelcomeView";
import { characters } from "@/content";

export const metadata = { title: "Welcome · Lafz" };

export default function Welcome() {
  return <WelcomeView characters={characters()} />;
}
