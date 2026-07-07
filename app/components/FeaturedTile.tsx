import { Reveal } from "./Reveal";

export function FeaturedTile() {
  return (
    <section className="featured">
      <Reveal>
        {/* Swap this striped placeholder for a real <img src="/featured.png" .../> when available. */}
        {/* <div className="featured-ph">[ featured — product hero shot, 21:9 ]</div> */}
         <img src="/featured.png" alt="Featured Product" />
      </Reveal>
    </section>
  );
}
