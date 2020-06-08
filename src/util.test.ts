import { buildGrid, parseCages, cageValid, gridValid } from './util';
import puzzles from './puzzles';

test('buildGrid', () => {
  expect(buildGrid(puzzles[0])).toMatchInlineSnapshot(`
    Array [
      Object {
        "badge": "5+",
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "badge": "3+",
        "borderBottom": true,
        "borderRight": false,
      },
      Object {
        "borderBottom": true,
        "borderRight": false,
      },
      Object {
        "borderBottom": true,
        "borderRight": true,
      },
      Object {
        "badge": "3",
        "borderBottom": true,
        "borderRight": true,
      },
      Object {
        "badge": "4+",
        "borderBottom": false,
        "borderRight": false,
      },
      Object {
        "badge": "3+",
        "borderBottom": false,
        "borderRight": false,
      },
      Object {
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "borderBottom": false,
        "borderRight": false,
      },
    ]
  `);
});

test('parseCages', () => {
  expect(parseCages(puzzles[0])).toMatchInlineSnapshot(`
    Array [
      Object {
        "cells": Array [
          0,
          3,
        ],
        "operator": "+",
        "result": 5,
      },
      Object {
        "cells": Array [
          1,
          2,
        ],
        "operator": "+",
        "result": 3,
      },
      Object {
        "cells": Array [
          4,
        ],
        "operator": "=",
        "result": 3,
      },
      Object {
        "cells": Array [
          5,
          8,
        ],
        "operator": "+",
        "result": 4,
      },
      Object {
        "cells": Array [
          6,
          7,
        ],
        "operator": "+",
        "result": 3,
      },
    ]
  `);
});

describe('cageValid', () => {
  test('[add] valid', () => {
    expect(cageValid(5, '+', [2, 3])).toBe(true);
  });

  test('[add] invalid', () => {
    expect(cageValid(100, '+', [2, 3])).toBe(false);
  });

  test('[subtract] valid', () => {
    // order of operands does not matter
    expect(cageValid(3, '-', [1, 3, 7])).toBe(true);
    expect(cageValid(3, '-', [7, 3, 1])).toBe(true);
    expect(cageValid(3, '-', [1, 7, 3])).toBe(true);
  });

  test('[subtract] invalid', () => {
    expect(cageValid(90, '-', [100, 11])).toBe(false);
    expect(cageValid(3, '-', [11, 100])).toBe(false);
  });

  test('[multiply] valid', () => {
    expect(cageValid(24, '*', [2, 3, 4])).toBe(true);
  });

  test('[multiply] invalid', () => {
    expect(cageValid(25, '*', [2, 3, 4])).toBe(false);
  });

  test('[divide] valid', () => {
    expect(cageValid(4, '/', [8, 2])).toBe(true);
    expect(cageValid(4, '/', [2, 8])).toBe(true);
  });

  test('[divide] invalid', () => {
    expect(cageValid(5, '/', [8, 2])).toBe(false);
  });

  test('[equals] valid', () => {
    expect(cageValid(6, '=', [6])).toBe(true);
  });

  test('[equals] invalid', () => {
    expect(cageValid(6, '=', [7])).toBe(false);
    expect(cageValid(6, '=', [6, 7])).toBe(false);
  });
});

describe('gridValid', () => {
  test('1', () => {
    expect(gridValid([1])).toBe(true);
  });

  test('2x2', () => {
    expect(gridValid([1, 2, 2, 1])).toBe(true);
    expect(gridValid([1, 2, 1, 2])).toBe(false);
    expect(gridValid([3, 4, 5, 6])).toBe(false);
  });

  test('3x3', () => {
    expect(gridValid([1, 2, 3, 2, 3, 1, 3, 1, 2])).toBe(true);
    expect(gridValid([1, 2, 3, 1, 2, 3, 1, 2, 3])).toBe(false);
    expect(gridValid([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(false);
  });

  test('4x4', () => {
    expect(gridValid([2, 4, 1, 3, 3, 1, 2, 4, 4, 2, 3, 1, 1, 3, 4, 2])).toBe(true);
    expect(gridValid([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4])).toBe(false);
  });
});
