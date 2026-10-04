import assert from "node:assert";
import test from "node:test";
import { generatePassword, calculatePasswordStrength, generatePassphrase } from "./lib/generator.ts";

test("Password generator length", () => {
  for (const len of [6, 12, 16, 24, 32, 64]) {
    const password = generatePassword({
      length: len,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      mode: "password",
      passphraseWords: 4,
      passphraseSeparator: "-",
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
      mode: "password",
      passphraseWords: 4,
      passphraseSeparator: "-",
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
      mode: "password",
      passphraseWords: 4,
      passphraseSeparator: "-",
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
      mode: "password",
      passphraseWords: 4,
      passphraseSeparator: "-",
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
      mode: "password",
      passphraseWords: 4,
      passphraseSeparator: "-",
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

test("Passphrase generator supports uppercase, numbers, and symbols", () => {
  // 1. Word count & separator
  const basic = generatePassphrase({
    wordCount: 4,
    separator: "-",
    includeUppercase: false,
    includeNumbers: false,
    includeSymbols: false,
  });
  const parts = basic.split("-");
  assert.strictEqual(parts.length, 4);
  assert.match(basic, /^[a-z]+(-[a-z]+){3}$/);

  // 2. Capitalize words (Title Case)
  const titled = generatePassphrase({
    wordCount: 3,
    separator: ".",
    includeUppercase: true,
    includeNumbers: false,
    includeSymbols: false,
  });
  assert.match(titled, /^[A-Z][a-z]+(\.[A-Z][a-z]+){2}$/);

  // 3. Include numbers
  for (let i = 0; i < 10; i++) {
    const withNumbers = generatePassphrase({
      wordCount: 4,
      separator: "-",
      includeUppercase: true,
      includeNumbers: true,
      includeSymbols: false,
    });
    assert.match(withNumbers, /[0-9]/, "Passphrase must contain digits when includeNumbers is true");
  }

  // 4. Include symbols
  for (let i = 0; i < 10; i++) {
    const withSymbols = generatePassphrase({
      wordCount: 4,
      separator: "-",
      includeUppercase: true,
      includeNumbers: false,
      includeSymbols: true,
    });
    assert.match(withSymbols, /[!@#$%^&*?]/, "Passphrase must contain symbols when includeSymbols is true");
  }

  // 5. High-security combined (Title case + numbers + symbols + symbol separator)
  const fullSec = generatePassword({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
    mode: "passphrase",
    passphraseWords: 5,
    passphraseSeparator: "#",
  });
  assert.match(fullSec, /[A-Z]/, "Has uppercase");
  assert.match(fullSec, /[a-z]/, "Has lowercase");
  assert.match(fullSec, /[0-9]/, "Has numbers");
  assert.match(fullSec, /[#]/, "Has custom symbol separator");
  const strength = calculatePasswordStrength(fullSec);
  assert.strictEqual(strength.score, 4, "High-security passphrase should score Strong");
});

test("Password strength evaluation", () => {
  const weak = calculatePasswordStrength("abc");
  assert.strictEqual(weak.score <= 1, true);

  const strong = calculatePasswordStrength("K9#xP!2mQ$9vL@zR");
  assert.strictEqual(strong.score >= 3, true);
  assert.strictEqual(strong.entropy > 60, true);
});
