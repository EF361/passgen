export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  mode: "password" | "passphrase";
  passphraseWords: number;
  passphraseSeparator: string;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  colorClass: string;
  bgClass: string;
  percentage: number;
  entropy: number;
}

export interface PasswordStats {
  uppercase: number;
  lowercase: number;
  digits: number;
  symbols: number;
  total: number;
}

/**
 * Curated 512-word list for xkcd-style passphrases.
 */
export const WORD_LIST: string[] = [
  "able","acid","aged","also","area","army","away","baby","back","ball",
  "band","bank","base","bath","bear","beat","been","bell","best","bird",
  "bite","blow","blue","boat","body","bomb","bond","bone","book","born",
  "both","bowl","bulk","burn","calm","came","camp","care","case","cash",
  "cast","cave","cell","chin","chip","city","clap","clay","clip","club",
  "coal","coat","code","coil","cold","come","cook","cool","cope","copy",
  "core","corn","cost","coup","crew","crop","cure","curl","cute","dark",
  "data","date","dawn","deal","dear","debt","deep","deny","desk","dial",
  "diet","disk","does","done","door","dose","down","draw","drop","drug",
  "drum","dual","dull","dump","dust","duty","each","earn","ease","east",
  "edge","else","even","ever","evil","exam","exit","face","fact","fail",
  "fair","fall","fame","farm","fast","fate","fear","feed","feel","fell",
  "felt","file","fill","film","find","fire","fish","fist","five","flag",
  "flat","flew","flip","flow","foam","fold","folk","fond","font","food",
  "fool","foot","ford","fore","fork","form","fort","four","free","from",
  "fuel","full","fund","fury","fuse","gain","game","gate","gave","gear",
  "gift","girl","give","glad","glow","glue","goes","gold","golf","gone",
  "good","grab","gray","grew","grid","grin","grip","grow","gulf","guru",
  "gust","half","hall","hand","hang","hard","harm","hash","hate","have",
  "head","heal","heap","heat","heel","held","help","herb","here","hero",
  "high","hill","hint","hire","hold","hole","holy","home","hood","hook",
  "hope","horn","hour","huge","hulk","hung","hunt","hurt","icon","idea",
  "idle","into","iris","iron","item","jail","jerk","join","joke","jump",
  "jury","just","keep","kick","kind","king","kiss","knee","knew","knit",
  "know","lack","lake","lamp","land","lane","last","late","lawn","lead",
  "leaf","lean","left","lend","lens","lift","like","lime","line","link",
  "lion","list","live","load","loan","lock","loft","lone","long","look",
  "loop","lore","lose","loss","lost","love","luck","lung","made","mail",
  "main","make","male","mall","malt","many","mark","mars","mask","mass",
  "mast","math","maze","meal","mean","meat","meet","melt","menu","mesh",
  "mild","milk","mind","mine","miss","mode","mold","moon","more","most",
  "move","much","myth","nail","name","navy","need","nest","next","nice",
  "nick","nine","node","none","norm","nose","note","nova","null","oath",
  "once","only","open","oral","oven","over","pace","pack","page","pain",
  "pair","palm","park","part","pass","past","path","peak","peel","peer",
  "pick","pier","pine","pipe","plan","play","plot","plug","plus","poem",
  "poet","pole","poll","pond","pool","poor","port","pose","post","pour",
  "prep","prey","prod","pull","pump","pure","push","quiz","race","rack",
  "rage","rail","rain","rank","rate","read","real","reap","reef","reel",
  "rely","rent","rest","rice","rich","ride","ring","riot","rise","risk",
  "road","roam","roar","rock","role","roll","roof","room","root","rope",
  "rose","rows","rule","rush","rust","safe","sage","sail","salt","sand",
  "save","scan","seed","self","sell","send","sets","shed","ship","shoe",
  "shop","shot","show","shut","side","sign","silk","sing","sink","site",
  "size","skin","skip","slam","slim","slip","slow","slug","snap","snow",
  "soak","sock","soft","soil","sole","some","song","sort","soul","soup",
  "span","spin","spot","spur","star","stay","step","stem","stew","stop",
  "such","suit","surf","swap","swim","tale","talk","tall","tank","tape",
  "task","team","tend","term","test","text","than","that","them","then",
  "they","thin","this","tide","time","tire","toll","tone","tool","tour",
  "town","trap","tree","trim","trio","trip","true","tube","tune","turn",
  "twin","type","unit","upon","used","user","vain","vale","vast","very",
  "view","vine","void","volt","vote","wade","wage","wake","walk","wall",
  "ward","warm","warp","wash","wave","wear","weed","well","went","were",
  "west","what","when","whom","wide","wife","wild","will","wind","wine",
  "wire","wise","wish","with","wolf","word","wore","work","worn","wrap",
  "yard","year","your","zero","zone",
];

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
export function getSecureRandomInt(max: number): number {
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

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  includeUppercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
}

/**
 * Generates an enhanced xkcd-style passphrase from the word list,
 * supporting Title Case / uppercase, cryptographic number injection, and symbol injection.
 */
export function generatePassphrase(
  optionsOrCount: number | PassphraseOptions,
  legacySeparator: string = "-"
): string {
  let wordCount: number;
  let separator: string;
  let includeUppercase = true;
  let includeNumbers = false;
  let includeSymbols = false;
  let excludeAmbiguous = false;

  if (typeof optionsOrCount === "number") {
    wordCount = optionsOrCount;
    separator = legacySeparator;
  } else {
    wordCount = optionsOrCount.wordCount;
    separator = optionsOrCount.separator;
    includeUppercase = optionsOrCount.includeUppercase ?? true;
    includeNumbers = optionsOrCount.includeNumbers ?? false;
    includeSymbols = optionsOrCount.includeSymbols ?? false;
    excludeAmbiguous = optionsOrCount.excludeAmbiguous ?? false;
  }

  if (wordCount <= 0) return "";

  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    let word = WORD_LIST[getSecureRandomInt(WORD_LIST.length)];
    if (includeUppercase) {
      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      word = word.toLowerCase();
    }
    words.push(word);
  }

  // Inject numbers if requested (e.g. Blue-Lion-Star42-Peak)
  if (includeNumbers && words.length > 0) {
    const targetIdx = getSecureRandomInt(words.length);
    let digitChars = excludeAmbiguous ? filterAmbiguous(NUMBER_CHARS) : NUMBER_CHARS;
    if (digitChars.length === 0) digitChars = NUMBER_CHARS;
    const num = `${digitChars[getSecureRandomInt(digitChars.length)]}${digitChars[getSecureRandomInt(digitChars.length)]}`;
    words[targetIdx] = `${words[targetIdx]}${num}`;
  }

  // Inject symbols if requested (e.g. Blue!-Lion-Star42-Peak)
  if (includeSymbols && words.length > 0) {
    const symbolPool = excludeAmbiguous ? filterAmbiguous("!@#$%^&*?") : "!@#$%^&*?";
    if (symbolPool.length > 0) {
      const sym = symbolPool[getSecureRandomInt(symbolPool.length)];
      // Choose an index different from target index if possible
      const symTargetIdx = words.length > 1 ? (getSecureRandomInt(words.length - 1) + 1) % words.length : 0;
      words[symTargetIdx] = `${words[symTargetIdx]}${sym}`;
    }
  }

  return words.join(separator);
}

export function generatePassword(options: GeneratorOptions): string {
  if (options.mode === "passphrase") {
    return generatePassphrase({
      wordCount: options.passphraseWords,
      separator: options.passphraseSeparator,
      includeUppercase: options.includeUppercase,
      includeNumbers: options.includeNumbers,
      includeSymbols: options.includeSymbols,
      excludeAmbiguous: options.excludeAmbiguous,
    });
  }

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

export function getPasswordStats(password: string): PasswordStats {
  let uppercase = 0, lowercase = 0, digits = 0, symbols = 0;
  for (const char of password) {
    if (/[A-Z]/.test(char)) uppercase++;
    else if (/[a-z]/.test(char)) lowercase++;
    else if (/[0-9]/.test(char)) digits++;
    else symbols++;
  }
  return { uppercase, lowercase, digits, symbols, total: password.length };
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
