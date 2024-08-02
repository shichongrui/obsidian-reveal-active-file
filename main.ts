import { Plugin, Command, Workspace } from 'obsidian';
declare module "obsidian" {
	interface WorkspaceLeaf {
		containerEl: Element;
	}
}
export default class MyPlugin extends Plugin {
	private is_file_explorer_open_previously = false;

	private is_file_explorer_open()
	{
		const workspace = this.app.workspace;
		let is_open = false;
		workspace.iterateAllLeaves((leaf) => {
			if(leaf.getViewState().type == "file-explorer" && window.getComputedStyle(leaf.containerEl, null).display !== "none")
			{
				is_open = true;
			}
		});
		return is_open;

	}
	private reveal()
	{
		(this.app as any).commands.executeCommandById('file-explorer:reveal-active-file');
	}

	onload() {
		this.is_file_explorer_open_previously = this.is_file_explorer_open();

		this.app.workspace.on('file-open', () => {
			if(this.is_file_explorer_open())
			{
				this.reveal();
			}
		})

		this.app.workspace.on('active-leaf-change', async () => {
			const is_file_explorer_open_now = this.is_file_explorer_open();
			console.log(`is_file_explorer_open_previously: ${this.is_file_explorer_open_previously}, is_file_explorer_open_now: ${is_file_explorer_open_now}`);
			if(is_file_explorer_open_now && ! this.is_file_explorer_open_previously)
			{
				this.reveal();
			}
			this.is_file_explorer_open_previously = is_file_explorer_open_now;
		})
	}
}
