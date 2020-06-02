export type Puzzle = {
  size: number;
  cages: string[];
};

let puzzles: Puzzle[] = [
  {
    size: 4,
    cages: [
      '5 + A1 A2',
      '4 = B1',
      '6 + C1 C2 C3',
      '7 + D1 D2',
      '11 + B2 B3 B4 A3 A4',
      '4 = C4',
      '3 + D3 D4',
    ],
  },
  {
    size: 6,
    cages: [
      '11 + A1 A2',
      '2 / B1 C1',
      '20 * D1 D2',
      '6 * E1 F1 F2 F3',
      '3 - B2 C2',
      '3 / E2 E3',
      '240 * A3 A4 B3 B4',
      '6 * C3 D3',
      '6 * C4 C5',
      '7 + D4 D5 E5',
      '30 * E4 F4',
      '6 * A5 B5',
      '9 + F5 F6',
      '8 + A6 B6 C6',
      '2 / D6 E6',
    ],
  },
];

export default puzzles;
