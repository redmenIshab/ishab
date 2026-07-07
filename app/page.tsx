import { Nav } from "./components/Nav";

export default function Home() {
  return (
    <div className="p-root">
      <Nav />
      <header className="p-hero" id="home" />
      <section className="p-section" id="work" />
      <section className="featured" />
      <section className="p-section" id="about" />
      <section className="p-section" id="experience" />
      <section className="p-section" id="skills" />
      <section className="p-section" id="contact" />
    </div>
  );
}
