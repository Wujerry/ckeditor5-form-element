import Command from '@ckeditor/ckeditor5-core/src/command'

import { BUTTON } from '../const'

export default class ButtonCommand extends Command {
	constructor(editor) {
		super(editor)

		this.attributeKey = BUTTON
	}

	refresh() {
		const model = this.editor.model
		const selection = model.document.selection

		const isAllowed = model.schema.checkChild(selection.focus.parent, BUTTON)

		this.isEnabled = isAllowed
	}

	execute({ id, name }) {
		const editor = this.editor
		const model = editor.model
		// const doc = model.document
		// const selection = doc.selection

		model.change((writer) => {
			const buttonEl = writer.createElement(BUTTON, { id, name })
			editor.model.insertContent(buttonEl)
		})
	}
}
