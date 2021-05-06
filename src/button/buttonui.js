import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { createDropdown } from 'ckeditor5/src/ui'
import { BUTTON } from '../const'
import buttonIcon from '../../theme/icons/button.svg'
import FormView from './ui/formview'

export default class ButtonUI extends Plugin {
	init() {
		const editor = this.editor
		const command = editor.commands.get(BUTTON)

		editor.ui.componentFactory.add(BUTTON, (locale) => {
			const dropdown = createDropdown(locale)
			const buttonForm = new FormView(locale)
			this._setUpDropdown(dropdown, buttonForm, command)

			return dropdown
		})

		// this._createToolbarView()
	}

	_setUpDropdown(dropdown, form, command) {
		const editor = this.editor
		const t = editor.t
		const button = dropdown.buttonView

		dropdown.bind('isEnabled').to(command)
		dropdown.panelView.children.add(form)

		button.set({
			label: t('button'),
			icon: buttonIcon,
			tooltip: true,
		})

		button.on(
			'open',
			() => {
				form.idInputView.fieldView.select()
				form.focus()
			},
			{ priority: 'low' }
		)

		form.on('submit', () => {
			const { id, name } = form
			editor.execute(BUTTON, { id, name })
			closeUI()
		})

		dropdown.on('change:isOpen', () => form.resetFormStatus())
		dropdown.on('cancel', () => closeUI())

		function closeUI() {
			editor.editing.view.focus()
			dropdown.isOpen = false
		}
	}
}
