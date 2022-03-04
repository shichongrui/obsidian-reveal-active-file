import { Plugin, Command } from 'obsidian';
declare module "obsidian" {
	interface WorkspaceLeaf {
		width: Number;
	}
}
export default class MyPlugin extends Plugin {
	onload() {
		this.app.workspace.on('file-open', () => {
			const workspace = this.app.workspace;
			workspace.iterateAllLeaves((leaf) => {
				if(leaf.getViewState().type == "file-explorer" && leaf.width > 0)
				{
					(this.app as any).commands.executeCommandById('file-explorer:reveal-active-file');
				}
			});

		})
	}
}
