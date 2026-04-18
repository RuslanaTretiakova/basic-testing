import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 5, b: 3, action: Action.Add, expected: 8 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 5, b: 3, action: Action.Multiply, expected: 15 },
  { a: 6, b: 3, action: Action.Divide, expected: 2 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 3, action: 'invalid', expected: null },
  { a: '5', b: 3, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected for $action with a=$a and b=$b',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
