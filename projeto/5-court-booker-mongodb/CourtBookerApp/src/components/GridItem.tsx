import { ReactNode } from "react";
import { AtLeastOne } from "../types/AtLeastOne";
import { OnlyOne } from "../types/OnlyOne";
import styled from "styled-components";

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

type GridItemProps = { children: ReactNode } & OnlyOne<{
  span: Cols;
  rSpan: AtLeastOne<{
    [K in "xs" | "sm" | "md" | "lg" | "xl"]: Cols
  }>;
  abs: [Cols, Cols];
  rAbs: AtLeastOne<{
    [K in "xs" | "sm" | "md" | "lg" | "xl"]: [Cols, Cols]
  }>;
}>

export const GridItem = styled.div<GridItemProps>`
  position: relative;

  // 0-599px - xs+
  grid-column: ${({ span, rSpan, abs, rAbs }) => {
    if (span)
      return `span ${span}`
    else if (rSpan)
      return `span ${rSpan.xs ?? 1}`
    else if (abs)
      return `${abs[0]} / ${abs[1]}`
    else if (rAbs)
      return `
          ${rAbs.xs ? rAbs.xs[0] : 0} / ${rAbs.xs ? rAbs.xs[1] : 0}
        `
  }};
    
  @media (min-width: 600px) {
    ${({ rSpan, rAbs }) => {
    if (rSpan)
      return `grid-column: span ${rSpan.sm ?? 1}`
    else if (rAbs)
      return `
          grid-column: ${rAbs.sm ? rAbs.sm[0] : 0} / ${rAbs.sm ? rAbs.sm[1] : 0}
        `
  }}
  }

  @media (min-width: 905px) {
    ${({ rSpan, rAbs }) => {
    if (rSpan)
      return `grid-column: span ${rSpan.md ?? 1}`
    else if (rAbs)
      return `
          grid-column: ${rAbs.md ? rAbs.md[0] : 0} / ${rAbs.md ? rAbs.md[1] : 0}
        `
  }}
  }

  @media (min-width: 1240px) {
    ${({ rSpan, rAbs }) => {
    if (rSpan)
      return `grid-column: span ${rSpan.lg ?? 1}`
    else if (rAbs)
      return `
          grid-column: ${rAbs.lg ? rAbs.lg[0] : 0} / ${rAbs.lg ? rAbs.lg[1] : 0}
        `
  }}
  }

  @media (min-width: 1440px) {
    ${({ rSpan, rAbs }) => {
    if (rSpan)
      return `grid-column: span ${rSpan.xl ?? 1}`
    else if (rAbs)
      return `
          grid-column: ${rAbs.xl ? rAbs.xl[0] : 0} / ${rAbs.xl ? rAbs.xl[1] : 0}
        `
  }}
  }
`