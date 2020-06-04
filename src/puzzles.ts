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
    size: 4,
    cages: [
      '11 + A1 B1 C1 A2',
      '1 = D1',
      '1 = B2',
      '16 + C2 D2 D3 D4 C4 B4',
      '8 + A3 B3 C3',
      '3 = A4',
    ],
  },
  {
    size: 4,
    cages: ['11 + A1 A2 B1 B2', '2 = C1', '21 + D1 D2 D3 D4 C2 C3 C4 B3', '4 + A3 A4', '2 = B4'],
  },
  {
    size: 4,
    cages: ['9 + A1 A2 B1', '4 + C1 D1 D2', '9 + D3 D4 C4', '6 + A3 A4 B4', '12 + B2 B3 C2 C3'],
  },
  {
    size: 4,
    cages: ['10 + A1 A2 A3 B1 B2 C1', '30 + D1 D2 D3 D4 C2 C3 C4 B3 B4 A4'],
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
