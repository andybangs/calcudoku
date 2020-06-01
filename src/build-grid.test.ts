import buildGrid from './build-grid';
import puzzles from './puzzles';

test('builds grid from puzzle', () => {
  expect(buildGrid(puzzles[0])).toMatchInlineSnapshot(`
    Array [
      Object {
        "badge": "5+",
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "badge": "4",
        "borderBottom": true,
        "borderRight": true,
      },
      Object {
        "badge": "6+",
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "badge": "7+",
        "borderBottom": false,
        "borderRight": false,
      },
      Object {
        "borderBottom": true,
        "borderRight": true,
      },
      Object {
        "badge": "11+",
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "borderBottom": true,
        "borderRight": false,
      },
      Object {
        "borderBottom": false,
        "borderRight": false,
      },
      Object {
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "borderBottom": true,
        "borderRight": true,
      },
      Object {
        "badge": "3+",
        "borderBottom": false,
        "borderRight": false,
      },
      Object {
        "borderBottom": false,
        "borderRight": false,
      },
      Object {
        "borderBottom": false,
        "borderRight": true,
      },
      Object {
        "badge": "4",
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
