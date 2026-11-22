export type RomajiTable = Record<string, string>;

interface ConvertOptions {
	macron?: boolean;
	capitalize?: boolean;
	apostrophe?: string;
}

const LONG_VOWEL_KANA = { a: 'あ', u: 'う', e: 'え', o: 'おう' };
const MACRON = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };
const VOWELS = 'aiueo';
const isVowel = (c: string) => c.length === 1 && VOWELS.includes(c);

function containsKana(s: string) {
	return /[\u3041-\u3096\u30a1-\u30fa]/u.test(s);
}

function katakanaToHiragana(s: string) {
	let r = '';
	for (const ch of s) {
		const c = ch.codePointAt(0)!;
		r += c >= 0x30a1 && c <= 0x30f6 ? String.fromCodePoint(c - 0x60) : ch;
	}
	return r;
}
