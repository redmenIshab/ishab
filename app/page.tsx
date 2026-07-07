"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";
import { WorkIndex } from "./components/WorkIndex";
import { FeaturedTile } from "./components/FeaturedTile";
import { About } from "./components/About";
import { ExperienceIndex } from "./components/ExperienceIndex";
import { Skills } from "./components/Skills";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <WorkIndex />
      <FeaturedTile />
      <About />
      <ExperienceIndex />
      <Skills />
      <section className="p-section" id="contact" />
    </div>
  );
}
