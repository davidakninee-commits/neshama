import type { Rite } from '../hazkara/types.ts';

export interface KaddishLine {
  text: string;
  /** the congregation's "אמן, יהא שמה רבה..." response - rendered distinctly */
  isResponse?: boolean;
}

export interface KaddishTemplate {
  rite: Rite;
  title: string;
  lines: KaddishLine[];
}

export type { Rite };
