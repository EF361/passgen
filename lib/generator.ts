export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  colorClass: string;
  bgClass: string;
  percentage: number;
  entropy: number;
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

// Ambiguous characters commonly confused with each other
const AMBIGUOUS_CHARS = new Set(["i", "l", "1", "I", "o", "0", "O", "|", "`", "'", '"']);

function filterAmbiguous(charset: string): string {
  return charset
    .split("")
    .filter((char) => !AMBIGUOUS_CHARS.has(char))
    .join("");
}

/**
 * Generates a cryptographically secure random integer in range [0, max - 1].
 * Uses rejection sampling / uniform distribution to prevent modulo bias.
 */
function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const range = 0x100000000; // 2^32
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);

  let randomVal: number;
  do {
    globalThis.crypto.getRandomValues(buffer);
    randomVal = buffer[0];
  } while (randomVal >= limit);

  return randomVal % max;
}

/**
 * Fisher-Yates shuffle using cryptographically secure random numbers.
 */
function secureShuffle(array: string[]): string[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generatePassword(options: GeneratorOptions): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
  } = options;

  let upper = includeUppercase ? UPPERCASE_CHARS : "";
  let lower = includeLowercase ? LOWERCASE_CHARS : "";
  let numbers = includeNumbers ? NUMBER_CHARS : "";
  let symbols = includeSymbols ? SYMBOL_CHARS : "";

  if (excludeAmbiguous) {
    upper = filterAmbiguous(upper);
    lower = filterAmbiguous(lower);
    numbers = filterAmbiguous(numbers);
    symbols = filterAmbiguous(symbols);
  }

  const selectedSets: string[] = [];
  if (upper) selectedSets.push(upper);
  if (lower) selectedSets.push(lower);
  if (numbers) selectedSets.push(numbers);
  if (symbols) selectedSets.push(symbols);

  // If no character set is selected, return empty
  if (selectedSets.length === 0 || length <= 0) {
    return "";
  }

  const passwordChars: string[] = [];
  const fullPool = selectedSets.join("");

  // Guarantee at least one character from each selected set if length allows
  for (const set of selectedSets) {
    if (passwordChars.length < length) {
      const idx = getSecureRandomInt(set.length);
      passwordChars.push(set[idx]);
    }
  }

  // Fill the remainder from the combined pool
  while (passwordChars.length < length) {
    const idx = getSecureRandomInt(fullPool.length);
    passwordChars.push(fullPool[idx]);
  }

  // Cryptographically shuffle the characters so guaranteed set positions aren't predictable
  return secureShuffle(passwordChars).join("");
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "Very Weak",
      colorClass: "text-zinc-400 dark:text-zinc-500",
      bgClass: "bg-zinc-300 dark:bg-zinc-700",
      percentage: 0,
      entropy: 0,
    };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  // Approximate Shannon entropy: length * log2(poolSize)
  const entropy = Math.round(password.length * (poolSize > 0 ? Math.log2(poolSize) : 0));

  let score: 0 | 1 | 2 | 3 | 4;
  let label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  let colorClass: string;
  let bgClass: string;
  let percentage: number;

  if (password.length < 8 || entropy < 30) {
    score = 1;
    label = "Very Weak";
    colorClass = "text-rose-500 dark:text-rose-400";
    bgClass = "bg-rose-500";
    percentage = 20;
  } else if (password.length < 10 || entropy < 50) {
    score = 1;
    label = "Weak";
    colorClass = "text-amber-500 dark:text-amber-400";
    bgClass = "bg-amber-500";
    percentage = 40;
  } else if (password.length < 14 || entropy < 70) {
    score = 2;
    label = "Fair";
    colorClass = "text-yellow-500 dark:text-yellow-400";
    bgClass = "bg-yellow-500";
    percentage = 65;
  } else if (password.length < 18 || entropy < 90) {
    score = 3;
    label = "Good";
    colorClass = "text-sky-500 dark:text-sky-400";
    bgClass = "bg-sky-500";
    percentage = 85;
  } else {
    score = 4;
    label = "Strong";
    colorClass = "text-emerald-500 dark:text-emerald-400";
    bgClass = "bg-emerald-500";
    percentage = 100;
  }

  return {
    score,
    label,
    colorClass,
    bgClass,
    percentage,
    entropy,
  };
}
