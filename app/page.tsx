import { Hero } from "@/components/sections/hero/hero";
import { Manifesto } from "@/components/sections/manifesto/manifesto";
import { Bioluminescence } from "@/components/sections/bioluminescence/bioluminescence";
import { MinimalPause } from "@/components/sections/minimal-pause/minimal-pause";
import { Outro } from "@/components/sections/outro/outro";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Bioluminescence />
      <MinimalPause />
      <Outro />
    </main>
  );
}
