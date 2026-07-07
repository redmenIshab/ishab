import type { ReactNode } from "react";

export function IndexRow({
  num,
  title,
  meta,
  action,
  href,
}: {
  num: string;
  title: ReactNode;
  meta: string;
  action: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="index-num">{num}</span>
      <span className="index-title">{title}</span>
      <span className="index-meta">{meta}</span>
      <span className="index-action">{action}</span>
    </>
  );
  if (href) {
    return (
      <a className="index-row" href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return <div className="index-row">{inner}</div>;
}
