"use client";

import { Nav } from "./components/Nav";
import { WireframeHero } from "./components/WireframeHero";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <WireframeHero />
      <section className="p-section" id="work" />
      <section className="featured" />
      <section className="p-section" id="about" />
      <section className="p-section" id="experience" />
      <section className="p-section" id="skills" />
      <section className="p-section" id="contact" />
    </div>
  );
}
