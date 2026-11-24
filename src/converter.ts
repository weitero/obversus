export type RomajiTable = Record<string, string>;
export type LongVowelMark = 'macron' | 'circumflex';

interface ConvertOptions {
	macron?: boolean;
	longVowelMark?: LongVowelMark;
	capitalize?: boolean;
	apostrophe?: string;
}

const LONG_VOWEL_KANA: Record<string, string> = { a: 'あ', u: 'う', e: 'え', o: 'おう' };
const MACRON: Record<string, string> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };
const CIRCUMFLEX: Record<string, string> = { a: 'â', i: 'î', u: 'û', e: 'ê', o: 'ô' };
const VOWELS = 'aiueo';
const isVowel = (c: string) => c.length === 1 && VOWELS.includes(c);

export function containsKana(s: string): boolean {
	return /[\u3041-\u3096\u30a1-\u30fa]/u.test(s);
}

export function isAllKatakana(s: string): boolean {
	return /[\u30a1-\u30fa]/u.test(s) && !/[\u3041-\u3096]/u.test(s);
}

function katakanaToHiragana(s: string): string {
	let r = '';
	for (const ch of s) {
		const c = ch.codePointAt(0)!;
		r += c >= 0x30a1 && c <= 0x30f6 ? String.fromCodePoint(c - 0x60) : ch;
	}
	return r;
}

export function convert(input: string, table: RomajiTable, options: ConvertOptions = {}) {
	const macron = options.macron ?? true;
	const marks = options.longVowelMark === 'circumflex' ? CIRCUMFLEX : MACRON;
	const apostrophe = options.apostrophe ?? '’';
	const text = katakanaToHiragana(input);
	const out: string[] = [];
	let lastKana = -1;

	const lookup = (i: number): { romaji: string; len: number } | null => {
		for (const len of [2, 1]) {
			const key = text.slice(i, i + len);
			if (key.length === len && table[key] !== undefined) {
				return { romaji: table[key], len };
			}
		}
		return null;
	};

	let i = 0;
	while (i < text.length) {
		const ch = text[i]!;

		if (ch === 'っ') {
			const next = lookup(i + 1);
			const firstRomaji = next?.romaji[0];
			if (firstRomaji && !isVowel(firstRomaji)) {
				out.push(firstRomaji);
				lastKana = -1;
				i += 1;
				continue;
			}
		}

		const justConverted = lastKana >= 0 && lastKana === out.length - 1;
		const prevRomaji = justConverted ? out[lastKana] : undefined;
		const prevVowel = prevRomaji?.slice(-1) ?? '';

		if (ch === 'ー' && prevRomaji && isVowel(prevVowel)) {
			out[lastKana] = macron
				? prevRomaji.slice(0, -1) + MACRON[prevVowel]
				: prevRomaji + prevVowel;
			lastKana = -1;
			i += 1;
			continue;
		}

		if (
			macron &&
			prevRomaji &&
			isVowel(prevVowel) &&
			(LONG_VOWEL_KANA[prevVowel] ?? '').includes(ch)
		) {
			out[lastKana] = prevRomaji.slice(0, -1) + marks[prevVowel];
			lastKana = -1;
			i += 1;
			continue;
		}

		if (ch === 'ん') {
			const next = lookup(i + 1);
			out.push(
				(table[ch] ?? 'n') + (next && /^[aiueoy]/.test(next.romaji) ? apostrophe : ''),
			);
			lastKana = out.length - 1;
			i += 1;
			continue;
		}

		const m = lookup(i);
		if (m) {
			out.push(m.romaji);
			lastKana = out.length - 1;
			i += m.len;
			continue;
		}

		out.push(ch);
		i += 1;
	}

	const res = out.join('');
	if (options.capitalize) {
		return res.replace(
			/(^|\s)(\S)/gu,
			(_, space: string, c: string) => space + c.toUpperCase(),
		);
	}
	return res;
}
