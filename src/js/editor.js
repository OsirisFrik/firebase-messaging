import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

const container = document.getElementById('editor')
const logContainer = document.getElementById('log')

const firebaseEditor = new JSONEditor(container, {
  mode: 'code',
  name: 'Firebase credentials'
})
const logEditor = new JSONEditor(logContainer, {
  mode: 'view',
  name: 'Log View'
})

export {
  firebaseEditor,
  logEditor
}