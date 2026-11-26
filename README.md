# Obversus (Obsidian plugin)

Select kana, run Convert selection to romaji, and the selection is replaced in
place. It works in the note body, the inline title, and property (YAML) values.



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
- Vowels are written out by default; long vowels are not inferred from kana (as
  it is impossible to infer precisely without knowing the meaning of the word).
  For example, こうし becomes `koushi`.
    - To mark a long vowel, use ー: コーシ/こーし becomes `kōshi` or `kôshi`,
      depending on the conversion table. Using ー in hiragana is unconventional;
      here it simply helps the plugin identify long vowels.
        - Long vowels in い-row or え-row are recommended to be written out like
          '-ii' or '-ei'.
    - To keep adjacent vowels separate, put ’ or ' between them: こ’うし becomes
      `ko’ushi`, and こ'うし becomes `ko'ushi`.
- Capitalization can be enabled in settings.
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

All pages accessed 20 November 2026. The tables were transcribed and adapted for
this plugin.

Obversus isn't affiliated with or endorsed by the Agency for Cultural Affairs.
It may contain errors and isn't an authoritative source for official documents.
