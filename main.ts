import { FileView, Plugin, WorkspaceLeaf } from 'obsidian';
declare module "obsidian" {
	interface WorkspaceLeaf {
		containerEl: Element;
	}
}

export default class MyPlugin extends Plugin {
	private is_file_explorer_open_previously = false;
	private current_open_file_leaf: WorkspaceLeaf | null;

	private is_file_explorer_open()
	{
		const workspace = this.app.workspace;
		let is_open = false;
		workspace.iterateAllLeaves((leaf) => {
			if(leaf.getViewState().type === "file-explorer" && window.getComputedStyle(leaf.containerEl, null).display !== "none")
			{
				is_open = true;
			}
		});
		return is_open;

	}
	private async reveal()
	{
		(this.app as any).commands.executeCommandById('file-explorer:reveal-active-file');
		await this.wait_active_leaf_change();
		this.app.workspace.setActiveLeaf(this.current_open_file_leaf, { focus: true });
	}

	private is_file(leaf: WorkspaceLeaf) 
	{
		// This code does not verify whether it represents all files.
		return (leaf.view as FileView).allowNoFile === true;
	}

	private is_file_explorer(leaf: WorkspaceLeaf) 
	{
		return leaf.getViewState().type === "file-explorer";
	}

	onload() {
		this.is_file_explorer_open_previously = this.is_file_explorer_open();

		this.app.workspace.on('file-open', async (file) => {
			if(!file) {
				return;
			}

			const is_file_explorer_open_now = this.is_file_explorer_open();
			if(is_file_explorer_open_now)
			{
				this.reveal();
			}
		});

		this.app.workspace.on('active-leaf-change', async (leaf) => {
			if(!leaf) {
				return;
			}

			this.resolve_wait_active_leaf_change()
			const is_file_explorer_open_now = this.is_file_explorer_open();
			console.log(`is_file_explorer_open_previously: ${this.is_file_explorer_open_previously}, is_file_explorer_open_now: ${is_file_explorer_open_now}`);
			if(this.is_file_explorer(leaf))
			{
				if(is_file_explorer_open_now && ! this.is_file_explorer_open_previously)
				{
					this.reveal();
				}
			}
			this.is_file_explorer_open_previously = is_file_explorer_open_now;

			if(this.is_file(leaf)) 
			{
				this.current_open_file_leaf = leaf;
			}
		})
	}

	// for waiting active-leaf-change event 
	private active_leaf_change_queue: (()=>void)[] = []
	private wait_active_leaf_change() {
		let resolver = null
		const promise = new Promise<void>((resolve) => {
			resolver = resolve;
		});
		this.active_leaf_change_queue.push(resolver)
		return promise;
	}
	private resolve_wait_active_leaf_change() {
		this.active_leaf_change_queue.shift()?.();
	}
}
