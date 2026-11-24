import { Editor, Notice, Plugin } from 'obsidian';
import { containsKana, convert } from './converter';
import { getTable, DEFAULT_TABLE_ID, TABLES, TableID } from './tables';
import { DEFAULT_SETTINGS, RomajiSettings, RomajiSettingTab, TABLE_IDS } from './settings';

export default class KanaRomajiPlugin extends Plugin {
	settings: RomajiSettings = { ...DEFAULT_SETTINGS };

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'convert-selection-to-romaji',
			name: 'Convert selection to romaji',
			callback: () => this.convertSelection(),
		});
		for (const id of TABLE_IDS) {
			this.addCommand({
				id: `convert-selection-to-romaji-${id}`,
				name: `Convert selection to romaji (${TABLES[id].shortLabel})`,
				callback: () => this.convertSelection(id),
			});
		}

		this.registerEvent(
			this.app.workspace.on('editor-menu', (menu, editor) => {
				if (!containsKana(editor.getSelection())) return;
				menu.addItem((item) =>
					item
						.setTitle('To romaji')
						.setIcon('languages')
						.setSection('obversus')
						.onClick(() => this.convertInEditor(editor)),
				);
				for (const id of TABLE_IDS) {
					menu.addItem((item) =>
						item
							.setTitle(`To romaji (${TABLES[id].shortLabel})`)
							.setIcon('languages')
							.setSection('obversus')
							.onClick(() => this.convertInEditor(editor, id)),
					);
				}
			}),
		);

		this.addSettingTab(new RomajiSettingTab(this.app, this));
	}

	toRomaji(text: string, tableId: TableID = this.settings.tableId): string {
		return convert(text, getTable(tableId).table, {
			macron: this.settings.macron,
			longVowelMark: this.settings.longVowelMark,
			capitalize: this.settings.capitalize,
			apostrophe: this.settings.plainApostrophe ? "'" : '’',
		});
	}

	convertSelection(tableId?: TableID) {
		const active = activeDocument.activeElement;
		const inNoteInput =
			(active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) &&
			!active.closest('.prompt, .modal');

		if (inNoteInput) {
			this.convertInInput(active, tableId);
		} else if (
			active instanceof HTMLElement &&
			active.isContentEditable &&
			!active.closest('.cm-editor, .prompt, .modal')
		) {
			this.convertInContentEditable(active, tableId);
		} else {
			this.convertInEditor(this.app.workspace.activeEditor?.editor, tableId);
		}
	}

	private convertInEditor(editor: Editor | undefined, tableId?: TableID) {
		const selection = editor?.getSelection();
		if (!editor || !selection) {
			new Notice('Select some kana characters first.');
			return;
		}
		editor.replaceSelection(this.toRomaji(selection, tableId));
	}

	private convertInInput(input: HTMLInputElement | HTMLTextAreaElement, tableId?: TableID) {
		const start = input.selectionStart ?? 0;
		const end = input.selectionEnd ?? 0;
		if (start === end) {
			new Notice('Select some kana characters first.');
			return;
		}
		const replaced = this.toRomaji(input.value.slice(start, end), tableId);
		if (!activeDocument.execCommand('insertText', false, replaced)) {
			input.setRangeText(replaced, start, end, 'end');
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}

	private convertInContentEditable(el: HTMLElement, tableId?: TableID) {
		const selection = activeWindow.getSelection();
		const text = selection?.toString() ?? '';
		if (!selection || selection.isCollapsed || !text) {
			new Notice('Select some kana characters first.');
			return;
		}
		const replaced = this.toRomaji(text, tableId);
		if (!activeDocument.execCommand('insertText', false, replaced)) {
			const range = selection.getRangeAt(0);
			range.deleteContents();
			range.insertNode(activeDocument.createTextNode(replaced));
			el.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}

	async loadSettings() {
		const saved = (await this.loadData()) as Partial<RomajiSettings> | null;
		this.settings = {
			...DEFAULT_SETTINGS,
			...saved,
		};
		if (!(this.settings.tableId in TABLES)) {
			this.settings.tableId = DEFAULT_TABLE_ID;
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
