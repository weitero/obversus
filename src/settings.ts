import { App, PluginSettingTab, Setting } from 'obsidian';
import { LongVowelMark, RomajiTable } from './converter';
import { ExtendedTableModal } from './extended-table-modal';
import type KanaRomajiPlugin from './main';
import { DEFAULT_TABLE_ID, EXTENDED_TABLE, TableID, TABLES } from './tables';

export interface KanaRomajiSettings {
	tableId: TableID;
	macron: boolean;
	longVowelMark: LongVowelMark;
	capitalize: boolean;
	capitalizeKatakana: boolean;
	plainApostrophe: boolean;
	extendedTable: RomajiTable;
}

export const DEFAULT_SETTINGS: KanaRomajiSettings = {
	tableId: DEFAULT_TABLE_ID,
	macron: true,
	longVowelMark: 'macron',
	capitalize: false,
	capitalizeKatakana: true,
	plainApostrophe: false,
	extendedTable: { ...EXTENDED_TABLE },
};

export const TABLE_IDS = Object.keys(TABLES) as TableID[];

export class RomajiSettingTab extends PluginSettingTab {
	plugin: KanaRomajiPlugin;

	constructor(app: App, plugin: KanaRomajiPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Default conversion table')
			.setDesc(
				'Used by "to romaji" and "convert selection to romaji". The other entries always use their own table.',
			)
			.addDropdown((dropdown) => {
				for (const id of TABLE_IDS) {
					dropdown.addOption(id, TABLES[id].label);
					dropdown.setValue(this.plugin.settings.tableId).onChange(async (value) => {
						this.plugin.settings.tableId = value as TableID;
						await this.plugin.saveSettings();
					});
				}
			});

		new Setting(containerEl)
			.setName('Mark long vowels with macrons')
			.setDesc(
				'Write ā, ū, ē, ō for long vowels. When off, vowels are written out (aa, uu, ee, ou',
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.macron).onChange(async (value) => {
					this.plugin.settings.macron = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName('Long vowel mark')
			.setDesc('Which mark to use when long vowels are marked: macron (¯) or circumflex (ˆ).')
			.addDropdown((dropdown) => {
				dropdown.addOption('macron', 'Macron (¯)');
				dropdown.addOption('circumflex', 'Circumflex (ˆ)');
				dropdown.setValue(this.plugin.settings.longVowelMark).onChange(async (value) => {
					this.plugin.settings.longVowelMark = value as LongVowelMark;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Capitalize each word')
			.setDesc(
				'Capitalize the first letter of each space-separated word. Handy for names and titles.',
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.capitalize).onChange(async (value) => {
					this.plugin.settings.capitalize = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName('Capitalize katakana')
			.setDesc(
				'When the selection is all katakana (for example a name or loanword), capitalize the first letter of each word.',
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.capitalizeKatakana).onChange(async (value) => {
					this.plugin.settings.capitalizeKatakana = value;
					await this.plugin.saveSettings();
				}),
			);

		new Setting(containerEl)
			.setName('Use a plain apostrophe')
			.setDesc("Write ' instead of ’ after ん before a vowel of y (tan'i instead of tan’i)")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.plainApostrophe).onChange(async (value) => {
					this.plugin.settings.plainApostrophe = value;
					await this.plugin.saveSettings();
				}),
			);

		const count = Object.keys(this.plugin.settings.extendedTable).length;
		new Setting(containerEl)
			.setName('Extended table')
			.setDesc(
				`Your own kana-to-romaji spellings. They override all other tables. Currently ${count} ${count === 1 ? 'entry' : 'entries'}.`,
			)
			.addButton((button) =>
				button.setButtonText('Edit entries').onClick(() => {
					new ExtendedTableModal(
						this.app,
						this.plugin.settings.extendedTable,
						async (table) => {
							this.plugin.settings.extendedTable = table;
							await this.plugin.saveSettings();
						},
						() => this.display(),
					).open();
				}),
			);
	}
}
