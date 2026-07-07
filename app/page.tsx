"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";
import { WorkIndex } from "./components/WorkIndex";
import { ExperienceIndex } from "./components/ExperienceIndex";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <WorkIndex />
      <section className="featured" />
      <section className="p-section" id="about" />
      <ExperienceIndex />
      <section className="p-section" id="skills" />
      <section className="p-section" id="contact" />
    </div>
  );
}
