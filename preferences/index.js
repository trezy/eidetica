let Config = require('electron-config')
let config = new Config





function handleInput (event) {
  let input = event.target
  let prefName = input.getAttribute('name')

  config.set(prefName, input.value)
}

function setInputValue (input) {
  let prefName = input.getAttribute('name')
  let pref = config.get(prefName)

  input.value = pref || ''
}

let inputs = document.querySelectorAll('input')

for (let i = 0, length = inputs.length; i < length; i++) {
  let input = inputs[i]

  setInputValue(input)

  input.addEventListener('input', handleInput)
}
