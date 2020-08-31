// const config = require('./config')
const xfs = require('./index')

function ExampleOne() {
   
    const { writeFile, readFile } = xfs(
        () => ({ dir: __dirname, path: './logs/cache', ext: '.md' }),
        // { ext: '.json', dir:... } // NOTE  would be overriten by cb
    )
    console.log(writeFile('exampleOne', { value: 100, message: 'hello world' })) // true if successful 
    console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }
}
//ExampleOne()

function ExampleTwo() {

    const path = require('path')
    const { writeFile, readFile } = xfs({ ext: '.md', dir: path.join(__dirname, './logs/cache') })
    console.log(writeFile('exampleOne', { value: 100, message: 'hello world' })) // true if successful 
    console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }
}
ExampleTwo()

