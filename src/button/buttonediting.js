import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import ButtonCommand from './buttoncommand'
import { BUTTON } from '../const'
import '../../theme/button.css'

export default class ButtonEditing extends Plugin {
	static get requires() {
		return [Widget]
	}

	init() {
		const editor = this.editor
		this._defineSchema()
		this._defineConverters()
		editor.commands.add(BUTTON, new ButtonCommand(editor))
		this.editor.editing.mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement(editor.model, (viewElement) => viewElement.hasClass(BUTTON))
		)
	}
	_defineSchema() {
		const schema = this.editor.model.schema

		schema.register(BUTTON, {
			allowWhere: '$text',
			isInline: true,
			isObject: true,
			allowAttributes: ['id', 'name'],
		})
	}

	_defineConverters() {
		const conversion = this.editor.conversion

		conversion.for('upcast').elementToElement({
			view: {
				name: 'button',
				classes: [BUTTON],
			},
			model: (viewElement, { writer: modelWriter }) => {
				const id = viewElement.getAttribute('id')
				const name = viewElement.getAttribute('name')
				return modelWriter.createElement(BUTTON, { id, name })
			},
		})
		conversion.for('dataDowncast').elementToElement({
			model: BUTTON,
			view: (modelElement, { writer }) => createButtonElement(modelElement, writer),
		})

		conversion.for('editingDowncast').elementToElement({
			model: BUTTON,
			view: (modelElement, { writer }) => createButtonElement(modelElement, writer),
		})

		function createButtonElement(modelElement, viewWriter) {
			const id = modelElement.getAttribute('id')
			const name = modelElement.getAttribute('name')
			const buttonEl = viewWriter.createContainerElement('button', { id, name, class: BUTTON, contenteditable: false })
			viewWriter.insert(viewWriter.createPositionAt(buttonEl, 0), viewWriter.createText(name))
			return buttonEl
		}
	}
}
