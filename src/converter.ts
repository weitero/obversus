export type RomajiTable = Record<string, string>;
export type LongVowelMark = 'macron' | 'circumflex';

interface ConvertOptions {
	contractLongVowels?: boolean;
	longVowelMark?: LongVowelMark;
	capitalize?: boolean;
	capitalizeKatakana?: boolean;
	apostrophe?: string;
	tBeforeCh?: boolean;
	mBeforeLabial?: boolean;
}

const LONG_VOWEL_KANA: Record<string, string> = { a: 'あ', i: 'い', u: 'う', e: 'えい', o: 'おう' };
const MACRON: Record<string, string> = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };
const CIRCUMFLEX: Record<string, string> = { a: 'â', i: 'î', u: 'û', e: 'ê', o: 'ô' };
const SPACED_PARTICLES: Record<string, string> = { は: 'わ', へ: 'え', を: 'お' };
const VOWELS = 'aiueo';
const isVowel = (c: string) => c.length === 1 && VOWELS.includes(c);

export function containsKana(s: string): boolean {
	return /[\u3041-\u3096\u30a1-\u30fa]/u.test(s);
}

export function isAllKatakana(s: string): boolean {
	return /[\u30a1-\u30fa]/u.test(s) && !/[\u3041-\u3096]/u.test(s);
}

export function katakanaToHiragana(s: string): string {
	let r = '';
	for (const ch of s) {
		const c = ch.codePointAt(0)!;
		r += c >= 0x30a1 && c <= 0x30f6 ? String.fromCodePoint(c - 0x60) : ch;
	}
	return r
		.replace(
			/([ \u3000])([はへを])(?![\u3041-\u3096\u30a1-\u30fa])/gu,
			(_match, space: string, particle: string) => space + SPACED_PARTICLES[particle],
		)
		.replace(/[ \u3000]+/gu, ' ');
}

export function capitalize(s: string) {
	return s.replace(
		/(^|\s)(\S)/gu,
		(match: string, boundary: string, c: string, offset: number, text: string) => {
			const wordStart = offset + boundary.length;
			const before = wordStart > 0 ? text[wordStart - 1] : undefined;
			const after = text[wordStart + 2];
			const isSpacedNo =
				c.toLowerCase() === 'n' &&
				text.slice(wordStart, wordStart + 2).toLowerCase() === 'no' &&
				before !== undefined &&
				/\s/u.test(before) &&
				after !== undefined &&
				/\s/u.test(after);

			return isSpacedNo ? match : boundary + c.toUpperCase();
		},
	);
}

export function convert(input: string, table: RomajiTable, options: ConvertOptions = {}) {
	const contractLongVowels = options.contractLongVowels ?? true;
	const marks = options.longVowelMark === 'circumflex' ? CIRCUMFLEX : MACRON;
	const apostrophe = options.apostrophe ?? '’';
	const tBeforeCh = options.tBeforeCh ?? false;
	const mBeforeLabial = options.mBeforeLabial ?? false;

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
				out.push(tBeforeCh && firstRomaji === 'c' ? 't' : firstRomaji);
				lastKana = -1;
				i += 1;
				continue;
			}
		}

		const justConverted = lastKana >= 0 && lastKana === out.length - 1;
		const prevRomaji = justConverted ? out[lastKana] : undefined;
		const prevVowel = prevRomaji?.slice(-1) ?? '';

		if (ch === 'ー' && prevRomaji && isVowel(prevVowel)) {
			out[lastKana] = contractLongVowels
				? prevRomaji.slice(0, -1) + marks[prevVowel]
				: prevRomaji + prevVowel;
			lastKana = -1;
			i += 1;
			continue;
		}

		if (
			contractLongVowels &&
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
				(mBeforeLabial && next && /^[bpm]/.test(next.romaji) ? 'm' : 'n') +
					(next && /^[aiueoy]/.test(next.romaji) ? apostrophe : ''),
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
	return res;
}
