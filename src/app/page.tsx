import { HomeView } from "@/components/HomeView";
import { characters, courseMeta, packs } from "@/content";

export default function Home() {
  return <HomeView units={courseMeta()} characters={characters()} packs={packs()} />;
}
