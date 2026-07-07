import { projects } from "../lib/content";
import { IndexRow } from "./IndexRow";
import { Reveal } from "./Reveal";

export function WorkIndex() {
  return (
    <section className="p-section" id="work">
      <div className="index-head">
        <span>~/work — THINGS I&apos;VE SHIPPED</span>
        <span>2019 — 2026</span>
      </div>
      {projects.map((p, i) => (
        <Reveal key={p.name} delay={i * 0.05}>
          <IndexRow num={p.index} title={p.name} meta={p.tag} action={p.action} href={p.url} />
        </Reveal>
      ))}
    </section>
  );
}
