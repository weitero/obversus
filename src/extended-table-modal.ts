import { App, Modal, Setting, TextComponent } from 'obsidian';
import type { RomajiTable } from './converter';
import { EXTENDED_TABLE, addEntry, removeEntry } from './tables';

export class ExtendedTableModal extends Modal {
	private table: RomajiTable;
	private onSave: (table: RomajiTable) => Promise<void>;
	private onDone: () => void;
	private listEl!: HTMLElement;
	private messageEl!: HTMLElement;

	constructor(
		app: App,
		table: RomajiTable,
		onSave: (table: RomajiTable) => Promise<void>,
		onDone: () => void,
	) {
		super(app);
		this.table = { ...table };
		this.onSave = onSave;
		this.onDone = onDone;
	}

	onOpen() {
		this.titleEl.setText('Extended table');
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('p', {
			cls: 'setting-item-description',
			text: 'Add as many spellings as you like. They override all other tables and are saved as you add them.',
		});

		let kana!: TextComponent;
		let romaji!: TextComponent;

		const add = async () => {
			const result = addEntry(this.table, kana.getValue(), romaji.getValue());
			if (!result.ok) {
				this.messageEl.setText(result.error);
				return;
			}
			this.table = result.table;
			await this.onSave(this.table);
			this.messageEl.setText(result.message);
			kana.setValue('');
			romaji.setValue('');
			this.renderList();
			kana.inputEl.focus();
		};

		new Setting(contentEl)
			.addText((text) => {
				kana = text;
				text.setPlaceholder('Kana, e.g. くゎ');
				text.inputEl.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' && !e.isComposing) romaji.inputEl.focus();
				});
			})
			.addText((text) => {
				romaji = text;
				text.setPlaceholder('Romaji, e.g. kwa');
				text.inputEl.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' && !e.isComposing) void add();
				});
			})
			.addButton((button) =>
				button
					.setButtonText('Add')
					.setCta()
					.onClick(() => void add()),
			);

		this.messageEl = contentEl.createDiv({ cls: 'setting-item-description' });
		this.listEl = contentEl.createDiv();
		this.renderList();

		new Setting(contentEl)
			.addButton((button) =>
				button.setButtonText('Restore defaults').onClick(async () => {
					this.table = { ...EXTENDED_TABLE };
					await this.onSave(this.table);
					this.messageEl.setText('Restored the default entries.');
					this.renderList();
				}),
			)
			.addButton((button) =>
				button
					.setButtonText('Done')
					.setCta()
					.onClick(() => this.close()),
			);

		kana.inputEl.focus();
	}

	private renderList() {
		this.listEl.empty();
		const entries = Object.entries(this.table);
		if (entries.length === 0) {
			this.listEl.createEl('p', { cls: 'setting-item-description', text: 'No entries.' });
			return;
		}
		for (const [kana, romaji] of entries) {
			new Setting(this.listEl).setName(`${kana} -> ${romaji}`).addExtraButton((button) =>
				button
					.setIcon('trash')
					.setTooltip('Remove')
					.onClick(async () => {
						this.table = removeEntry(this.table, kana);
						await this.onSave(this.table);
						this.messageEl.setText(`Removed ${kana}`);
						this.renderList();
					}),
			);
		}
	}

	onClose() {
		this.containerEl.empty();
		this.onDone();
	}
}
