# Obversus (Obsidian plugin)

Select kana, run Convert selection to romaji, and the selection is replaced in
place. It works in the note body, the inline title, and property (YAML) values.

This plugin was designed initially to generate consistent romaji texts for kana names
found in Kojiki and Nihon-Shoki to use them as note title to make it easier when
writing links and references. This conversion is based purely on mapping tables
and simple rules, without any semantic analysis of the texts being processed.

## About the name

_Obversus_ is Latin for "turned toward" (from _obvertere_) and the source of the
English word _obverse_. It is pronounced ob-VER-sus. The plugin turns your kana
toward the Latin alphabet.

## Setup

1. Settings > Obversus: choose the default conversion table (2025 guideline,
   1954 Table 1/Kunrei-shiki, 1954 Table 2).
2. Settings > Hotkeys: bind keys to the commands you use. Use hotkeys (not the
   command palette) for the title and property fields, so the selection keeps
   focus.

## Using a specific table

- Right-click selected kana in the note editor:
    - **To romaji** uses the default table from settings.
    - **To romaji (2025)**, **To romaji (1954 Table 1)**, **To romaji (1954
      Table 2)** always use that table.
- The same choices exist as commands ("Convert selection to romaji (2025),"
  etc.), which also work in the inline title and property fields when bound to
  hotkeys.
- Menu and command names come from `shortLabel` in `tables.ts`.

# Build

```sh
npm install
npm run build
```

Copy `main.js` and `manifest.json` into `<vault>/.obsidian/plugins/obversus/`.

## Conversion rules

> These rules are based on the 2025 Cabinet Notice.

- All non-kana characters are preserved except ー, which marks long vowels and
  will be removed after conversion; and full-width spaces, which are normalized
  to half-width spaces.
- ん is written as n, and gets before a vowel or y an apostrophe (tan’i).
- っ is represented by repeating the following consonant. When the consonant
  is two characters, the first character (s of sh, c of ch, etc.) is
  repeated. See Known Limits about trailing っ.
- Long vowels are contracted by default:
    - A repeated vowel or vowel sequence is written with one marked vowel:
      かあ → kā, しい → shī, じゅう → jū, ええ/ていえん → ē/tēen,
      おお/とう → ō/tō.
    - `ー` after a kana ending in a vowel is contracted in the same way:
      かー → kā, ラーメン → rāmen.
    - The mark can be changed in Settings from a macron (`ā, ī, ū, ē, ō`) to
      a circumflex (`â, î, û, ê, ô`).
- Disabling **Contract long vowels** leaves both long-vowel forms expanded:
  かあ → kaasan, じゅう → juugoya, ラーメン → raamen. The marks are not used
  in this mode.
- To keep adjacent vowels separate, insert an apostrophe between them:
  こ’うし → ko’ushi, こ'うし → ko'ushi.
- Capitalization can be enabled in settings. When enabled, the first
  non-whitespace character at the start of the converted text and after each
  whitespace is uppercased (for example, `yama no kami` becomes
  `Yama no Kami`). Other characters are unchanged. The standalone word `no`
  stays lowercase when surrounded by whitespace, preserving the romanized
  particle の.
- Particles (は, へ, を) are converted literally (ha, he, o), except when
  preceded by a half- or full-width space, when they become wa, e, o. This
  also applies to katakana. Full-width spaces are normalized to half-width.

## Known limits

- A trailing っ, or a っ followed by a vowel, is left as is.
- Conversion in title and properties works only in viewing mode.
- This plugin does not support foreign sounds written in kana (for example, フェ
  ア), as such sounds are not included in the builtin tables. But these can be
  added via the Extended Table in Settings should you wish. However, converting
  foreign word written in katakana to romaji is really a bad idea as it benefits
  no one. (Imagine writing 'fair' as 'フェア' and then converting it to 'fea',
  which is unreadable for both English and Japanese speakers.)

## Sources and disclaimer

The conversion tables are based on the Cabinet notice "[ローマ字のつづり
方](https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/roma/index2.html)"
(令和7年内閣告示第4号), published by the Agency for Cultural Affairs.

The two "1954" tables are kept for backward compatibility. That notice ([昭和29
年内閣告示第1
号](https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/roma/index.html))
was abolished by the 2025 notice. Their spellings are taken from the comparison
table (対照表) of the 2025 notice.

Additional romanization data not stated in the above notices (i.e. using t forっ
before ch and m for ん before b, p, and m) were checked against [ローマ字
表](https://jgrammar.life.coocan.jp/ja/data/rohmaji2.htm).

All pages accessed 20 November 2026. The tables were transcribed and adapted for
this plugin.

Obversus isn't affiliated with or endorsed by the Agency for Cultural Affairs.
It may contain errors and isn't an authoritative source for official documents.
