import isNumber from '../src/homepage/lib/isNumber';

test('42 is a number', () => {
    expect(isNumber(42)).toBe(true);
});
