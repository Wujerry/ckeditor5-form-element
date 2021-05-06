import { Plugin } from 'ckeditor5/src/core'

import ButtonEditing from './buttonediting'
import ButtonUI from './buttonui'

export default class Button extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ButtonEditing, ButtonUI]
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'button'
	}
}
