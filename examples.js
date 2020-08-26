const config = require('./config')
const xfs = require('./index')
const { writeFile, readFile } = xfs({ dir: config.dir/*,ext:'.md'*/ })

console.log(writeFile('exampleOne', { value: 100, message: 'hello world' })) // true if successful 
console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }