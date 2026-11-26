import { describe, expect, it } from 'vitest';
import { containsKana, convert, isAllKatakana } from './converter';
import { getTable } from './tables';

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
		['かーさん', 'kāsan'],
		['まー', 'mā'],
		['かわいー', 'kawaī'],
		['しーたけ', 'shītake'],
		['にーさん', 'nīsan'],
		['じゅーごや', 'jūgoya'],
		['ふーりゅー', 'fūryū'],
		['えー', 'ē'],
		['ねーさん', 'nēsan'],
		['やじろべー', 'yajirobē'],
		['てーえん', 'tēen'],
		['とけーだい', 'tokēdai'],
		['へーせー', 'hēsē'],
		['おーかみ', 'ōkami'],
		['ほーずき', 'hōzuki'],
		['とーほく', 'tōhoku'],
		['ぼーそー', 'bōsō'],
		['おーどーぐ', 'ōdōgu'],
		['こーりどーふ', 'kōridōfu'],
		['おーおじ', 'ōoji'],
		['じゅーどー', 'jūdō'],
		['とーきょー', 'tōkyō'],
		['おーたわら', 'ōtawara'],
	])('long vowels with a macron: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { longVowelMark: 'macron' })).toBe(expected);
	});

	it.each([
		['かーさん', 'kâsan'],
		['まー', 'mâ'],
		['かわいー', 'kawaî'],
		['しーたけ', 'shîtake'],
		['にーさん', 'nîsan'],
		['じゅーごや', 'jûgoya'],
		['ふーりゅー', 'fûryû'],
		['えー', 'ê'],
		['ねーさん', 'nêsan'],
		['やじろべー', 'yajirobê'],
		['てーえん', 'têen'],
		['とけーだい', 'tokêdai'],
		['へーせー', 'hêsê'],
		['おーかみ', 'ôkami'],
		['ほーずき', 'hôzuki'],
		['とーほく', 'tôhoku'],
		['ぼーそー', 'bôsô'],
		['おーどーぐ', 'ôdôgu'],
		['こーりどーふ', 'kôridôfu'],
		['おーおじ', 'ôoji'],
		['じゅーどー', 'jûdô'],
		['とーきょー', 'tôkyô'],
		['おーたわら', 'ôtawara'],
	])('long vowels with a circumflex: %s -> %s', (input: string, expected: string) => {
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
		expect(convert(input, reiwa7)).toBe(expected);
	});

	it.each([
		['たんい', 'tan’i'],
		['せんいん', 'sen’in'],
		['えんゆうかい', 'en’yuukai'],
		['とんや', 'ton’ya'],
	])('apostrophe after ん: %s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7)).toBe(expected);
	});

	it.each([
		['たんい', "tan'i"],
		['せんいん', "sen'in"],
		['えんゆうかい', "en'yuukai"],
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
		'long vowels without a macron: %s -> %s',
		(input: string, expected: string) => {
			expect(convert(input, reiwa7, { macron: false })).toBe(expected);
		},
	);
});

describe('capitalization', () => {
	it.each([
		['いざなぎのかみ', 'Izanaginokami'],
		['あまてらす おおみかみ', 'Amaterasu Oomikami'],
		['すさのを-の-みこと', 'Susanoo-no-mikoto'],
	])('%s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { capitalize: true })).toBe(expected);
	});
});

describe('capitalize katakana', () => {
	it.each([
		['イザナギノカミ', 'Izanaginokami'],
		['アマテラス オオミカミ', 'Amaterasu Oomikami'],
		['スサノヲ-ノ-ミコト', 'Susanoo-no-mikoto'],
	])('%s -> %s', (input: string, expected: string) => {
		expect(convert(input, reiwa7, { capitalize: false, capitalizeKatakana: true })).toBe(
			expected,
		);
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
		['まんようしゅう', 'man’yousyuu'],
		['しょうゆ', 'syouyu'],
		['まっちゃ', 'mattya'],
		['ちゅうあい', 'tyuuai'],
		['ぶちょう', 'butyou'],
		['じんじゃ', 'zinzya'],
		['じょうじゅ', 'zyouzyu'],
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
