import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector'

import Button from '../src/button/button'
ClassicEditor.create(document.querySelector('#editor'), {
	plugins: [Table, TableToolbar,Essentials, Paragraph, Button],
	toolbar: ['form-button', 'insertTable'],
})
	.then((editor) => {
		console.log('Editor was initialized', editor)

		CKEditorInspector.attach('editor', editor)

		window.editor = editor
	})
	.catch((error) => {
		console.error(error.stack)
	})
