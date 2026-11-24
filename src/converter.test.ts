import { describe, expect, it } from 'vitest';
import { getTable } from './tables';
import { convert, containsKana, isAllKatakana } from './converter';

const reiwa7 = getTable('reiwa7').table;
const showa29table1 = getTable('showa29-table1').table;
const showa29table2 = getTable('showa29-table2').table;

describe('containsKana', () => {
	it.each([
		['いざなぎのかみ', true],
		['イザナギノカミ', true],
		['イザナギの神', true],
		['伊邪那岐神', false],
		['Izanaginokami', false],
		['', false],
	])("'%s' -> %s", (input: string, expected: boolean) => {
		expect(containsKana(input)).toBe(expected);
	});
});

describe('isAllKatakana', () => {
	it.each([
		['いざなぎのかみ', false],
		['イザナギノカミ', true],
		['イザナギの神', false],
		['伊邪那岐神', false],
		['Izanaginokami', false],
		['', false],
	])("'%s' -> %s", (input: string, expected: boolean) => {
		expect(isAllKatakana(input)).toBe(expected);
	});
});

describe('examples from the 2025 notice', () => {
	it.each([
		['あんまん', 'anman'],
		['かんぱい', 'kanpai'],
		['ぎんざ', 'ginza'],
		['しんぶん', 'shinbun'],
		['ざっし', 'zasshi'],
		['てっぱん', 'teppan'],
		['にっちょく', 'nicchoku'],
		['やっきょく', 'yakkyoku'],
		['しんばし', 'shinbashi'],
		['らんま', 'ranma'],
		['てんぷら', 'tenpura'],
		['まっちゃ', 'maccha'],
		['くたにやき', 'kutaniyaki'],
		['たなかさん', 'tanakasan'],
		['しちごさん', 'shichigosan'],
	])('%s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7)).toBe(expected);
	});

	it.each([
		['かあさん', 'kāsan'],
		['まあ', 'mā'],
		['かわいい', 'kawaii'],
		['しいたけ', 'shiitake'],
		['にいさん', 'niisan'],
		['じゅうごや', 'jūgoya'],
		['ふうりゅう', 'fūryū'],
		['ええ', 'ē'],
		['ねえさん', 'nēsan'],
		['やじろべえ', 'yajirobē'],
		['ていえん', 'teien'],
		['とけいだい', 'tokeidai'],
		['へいせい', 'heisei'],
		['おおかみ', 'ōkami'],
		['ほおずき', 'hōzuki'],
		['とうほく', 'tōhoku'],
		['ぼうそう', 'bōsō'],
		['おおどうぐ', 'ōdōgu'],
		['こおりどうふ', 'kōridōfu'],
		['おおおじ', 'ōoji'],
		['じゅうどう', 'jūdō'],
		['とうきょう', 'tōkyō'],
		['おおたわら', 'ōtawara'],
	])('long vowels with a macron: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7)).toBe(expected);
	});

	it.each([
		['かあさん', 'kâsan'],
		['まあ', 'mâ'],
		['かわいい', 'kawaii'],
		['しいたけ', 'shiitake'],
		['にいさん', 'niisan'],
		['じゅうごや', 'jûgoya'],
		['ふうりゅう', 'fûryû'],
		['ええ', 'ê'],
		['ねえさん', 'nêsan'],
		['やじろべえ', 'yajirobê'],
		['ていえん', 'teien'],
		['とけいだい', 'tokeidai'],
		['へいせい', 'heisei'],
		['おおかみ', 'ôkami'],
		['ほおずき', 'hôzuki'],
		['とうほく', 'tôhoku'],
		['ぼうそう', 'bôsô'],
		['おおどうぐ', 'ôdôgu'],
		['こおりどうふ', 'kôridôfu'],
		['おおおじ', 'ôoji'],
		['じゅうどう', 'jûdô'],
		['とうきょう', 'tôkyô'],
		['おおたわら', 'ôtawara'],
	])('long vowels with a macron: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { longVowelMark: 'circumflex' })).toBe(expected);
	});

	it.each([
		['かあさん', 'kaasan'],
		['まあ', 'maa'],
		['かわいい', 'kawaii'],
		['しいたけ', 'shiitake'],
		['にいさん', 'niisan'],
		['じゅうごや', 'juugoya'],
		['ふうりゅう', 'fuuryuu'],
		['ええ', 'ee'],
		['ねえさん', 'neesan'],
		['やじろべえ', 'yajirobee'],
		['ていえん', 'teien'],
		['とけいだい', 'tokeidai'],
		['へいせい', 'heisei'],
		['おおかみ', 'ookami'],
		['ほおずき', 'hoozuki'],
		['とうほく', 'touhoku'],
		['ぼうそう', 'bousou'],
		['おおどうぐ', 'oodougu'],
		['こおりどうふ', 'kooridoufu'],
		['おおおじ', 'oooji'],
		['じゅうどう', 'juudou'],
		['とうきょう', 'toukyou'],
		['おおたわら', 'ootawara'],
	])('long vowels without a macron: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { macron: false })).toBe(expected);
	});

	it.each([
		['たんい', 'tan’i'],
		['せんいん', 'sen’in'],
		['えんゆうかい', 'en’yūkai'],
		['とんや', 'ton’ya'],
	])('apostrophe after ん: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7)).toBe(expected);
	});

	it.each([
		['たんい', "tan'i"],
		['せんいん', "sen'in"],
		['えんゆうかい', "en'yūkai"],
		['とんや', "ton'ya"],
	])('can use a plain apostrophe: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { apostrophe: "'" })).toBe(expected);
	});
});

describe('katakana', () => {
	it.each([['ラーメン', 'rāmen']])(
		'long vowels with a macron: %s -> %s',
		(input: string, expected: string) => {
			expect(convert(input, reiwa7)).toBe(expected);
		},
	);

	it.each([['ラーメン', 'raamen']])(
		'long vowels with a macron: %s -> %s',
		(input: string, expected: string) => {
			expect(convert(input, reiwa7, { macron: false })).toBe(expected);
		},
	);
});

describe('capitalization', () => {
	it.each([
		['いざなぎのかみ', 'Izanaginokami'],
		['あまてらす おおみかみ', 'Amaterasu Ōmikami'],
		['すさのを-の-みこと', 'Susanoo-no-mikoto'],
	])('%s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { capitalize: true })).toBe(expected);
	});
});

describe('1954 Table 1', () => {
	it.each([
		['しち', 'siti'],
		['つしま', 'tusima'],
		['ふじ', 'huzi'],
		['おじいさん', 'oziisan'],
		['おぢいさん', 'oziisan'],
		['しゃく', 'syaku'],
		['まんようしゅう', 'man’yōsyū'],
		['しょうゆ', 'syōyu'],
		['まっちゃ', 'mattya'],
		['ちゅうあい', 'tyūai'],
		['ぶちょう', 'butyō'],
		['じんじゃ', 'zinzya'],
		['じょうじゅ', 'zyōzyu'],
		['ぢゃ', 'zya'],
		['ぢゅ', 'zyu'],
		['ぢょ', 'zyo'],
	])('%s -> %s', (input: string, expected: string) => {
		expect(convert(input, showa29table1)).toBe(expected);
	});
});

describe('1954 Table 2', () => {
	it.each([
		['すさのを', 'susanowo'],
		['おぢいさん', 'odiisan'],
		['あづき', 'aduki'],
		['ぢゃ', 'dya'],
		['ぢゅ', 'dyu'],
		['ぢょ', 'dyo'],
		['かいだん', 'kwaidan'],
		['がいこく', 'gwaikoku'],
	])('%s -> %s', (input: string, expected: string) => {
		expect(convert(input, showa29table2)).toBe(expected);
	});
});
