import assert from "node:assert";
import test from "node:test";
import { generatePassword, calculatePasswordStrength } from "./lib/generator.ts";

test("Password generator length", () => {
  for (const len of [6, 12, 16, 24, 32, 64]) {
    const password = generatePassword({
      length: len,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
    });
    assert.strictEqual(password.length, len);
  }
});

test("Password generator respects character sets", () => {
  // Only numbers
  for (let i = 0; i < 20; i++) {
    const numOnly = generatePassword({
      length: 16,
      includeUppercase: false,
      includeLowercase: false,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    assert.match(numOnly, /^[0-9]+$/);
  }

  // Only lowercase
  for (let i = 0; i < 20; i++) {
    const lowerOnly = generatePassword({
      length: 16,
      includeUppercase: false,
      includeLowercase: true,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    assert.match(lowerOnly, /^[a-z]+$/);
  }

  // Only uppercase
  for (let i = 0; i < 20; i++) {
    const upperOnly = generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: false,
      includeNumbers: false,
      includeSymbols: false,
      excludeAmbiguous: false,
    });
    assert.match(upperOnly, /^[A-Z]+$/);
  }
});

test("Password generator excludes ambiguous characters when requested", () => {
  const ambiguousChars = ["i", "l", "1", "I", "o", "0", "O", "|", "`", "'", '"'];
  for (let i = 0; i < 50; i++) {
    const password = generatePassword({
      length: 32,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: true,
    });
    for (const amb of ambiguousChars) {
      assert.strictEqual(
        password.includes(amb),
        false,
        `Password should not include ambiguous character: ${amb}`
      );
    }
  }
});

test("Password strength evaluation", () => {
  const weak = calculatePasswordStrength("abc");
  assert.strictEqual(weak.score <= 1, true);

  const strong = calculatePasswordStrength("K9#xP!2mQ$9vL@zR");
  assert.strictEqual(strong.score >= 3, true);
  assert.strictEqual(strong.entropy > 60, true);
});
