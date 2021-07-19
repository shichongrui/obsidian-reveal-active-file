import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class MyPlugin extends Plugin {
	onload() {
		this.app.workspace.on('file-open', () => {
			this.app.commands.executeCommandById('file-explorer:reveal-active-file');
		})	
	}
}
