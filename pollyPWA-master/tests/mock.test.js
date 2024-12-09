const { add, multiply } = require("../../somefunctions");

test("adds 2 + 2 to equal 4", () => {
  expect(add(2, 2)).toBe(4);
});

test("multiplies 3 * 3 to equal 9", () => {
  expect(multiply(3, 3)).toBe(9);
});
