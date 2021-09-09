import { Plugin, Command } from 'obsidian';

export default class MyPlugin extends Plugin {
	onload() {
		this.app.workspace.on('file-open', () => {
			(this.app as any).commands.executeCommandById('file-explorer:reveal-active-file');
		})	
	}
}
