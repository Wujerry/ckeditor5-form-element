import {
	ButtonView,
	FocusCycler,
	LabeledFieldView,
	View,
	ViewCollection,
	createLabeledInputText,
	submitHandler,
} from '@ckeditor/ckeditor5-ui/src/index'
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils/src/index'
import { icons } from '@ckeditor/ckeditor5-core/src/index'

export default class FormView extends View {
	constructor(locale) {
		super(locale)

		const t = locale.t

		this.focusTracker = new FocusTracker()
		this.keystrokes = new KeystrokeHandler()
		this.set('elId', '')
		this.set('elName', 'name')

		this.idInputView = this._createInput('Button Id', 'elId')
		this.nameInputView = this._createInput('Button Name', 'elName')

		this.saveButtonView = this._createButton(t('Save'), icons.check, 'ck-button-save')
		this.saveButtonView.type = 'submit'
		this.saveButtonView.bind('isEnabled').to(this, 'elId', (value) => !!value)

		this.cancelButtonView = this._createButton(t('cancel'), icons.cancel, 'ck-button-cancel', 'cancel')

		this._focusables = new ViewCollection()
		this._focusCycler = new FocusCycler({
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				focusPrevious: 'shift + tab',
				focusNext: 'tab',
			},
		})

		this.setTemplate({
			tag: 'form',
			attributes: {
				class: ['ck', 'insert-button-form'],
				tabindex: '-1',
			},
			children: [this.idInputView, this.nameInputView, this.saveButtonView, this.cancelButtonView],
		})
	}

	render() {
		super.render()

		submitHandler({ view: this })

		const childViews = [this.idInputView, this.nameInputView, this.saveButtonView, this.cancelButtonView]
		childViews.forEach((v) => {
			this._focusables.add(v)
			this.focusTracker.add(v.element)
		})
		this.keystrokes.listenTo(this.element)

		const stopPropagation = (data) => data.stopPropagation()
		this.keystrokes.set('arrowright', stopPropagation)
		this.keystrokes.set('arrowleft', stopPropagation)
		this.keystrokes.set('arrowup', stopPropagation)
		this.keystrokes.set('arrowdown', stopPropagation)
	}

	_createInput(name, valueKey) {
		const t = this.locale.t
		const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText)
		const inputField = labeledInput.fieldView
		labeledInput.label = t(name)
		inputField.on('input', () => {
			this[valueKey] = inputField.element.value.trim()
		})
		return labeledInput
	}

	_createButton(label, icon, className, eventName) {
		const button = new ButtonView(this.locale)

		button.set({ label, icon, tooltip: true })
		button.extendTemplate({
			attributes: {
				class: className,
			},
		})
		if (eventName) {
			button.delegate('execute').to(this, eventName)
		}

		return button
	}

	focus() {
		this._focusCycler.focusFirst()
	}

	resetFormStatus() {
		this.elId = ''
		this.elName = ''
	}

	get id() {
		return this.idInputView.fieldView.element.value.trim()
	}

	get name() {
		return this.nameInputView.fieldView.element.value.trim()
	}
}
