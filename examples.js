// const config = require('./config')
const xfs = require('./index')

function ExampleOne() {
   
    const { writeFile, readFile,checkFilePermissions, listFolders } = xfs(
        () => ({ dir: __dirname, path: './logs', ext: '.json'}),
        // { ext: '.json', dir:... } // NOTE  would be overriten by cb
    )
    console.log(listFolders())
   // console.log(writeFile('exampleOne', { value: 100, message: 'hello world23' })) // true if successful 
    //console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }
    //console.log(JSON.stringify(checkFilePermissions('exampleOne'),null,2))
}
 ExampleOne()

function ExampleTwo() {

    const path = require('path')
    const { writeFile, readFile,removeFile } = xfs({ ext: '.json', dir: __dirname, path: './logs/cache', pretty:true })
   //console.log(writeFile('exampleOne', {data:{ value: 100, message: 'hello world', array:[1,2,3,4]  }})) // true if successful 
   // console.log(readFile('exampleOne')) // { value: 100, message: 'hello world' }

    //console.log('removeFile',removeFile('exampleOne'))
}
//ExampleTwo()


function ExampleThree() {

    const {loadFileBatch,fullPath } = xfs( () => ({ dir: __dirname, path: './logs/cache' }) );
    loadFileBatch('example'/**,otherDir */) // returns [,,,] parsed data of all available json files
    console.log(fullPath({'fileName':'./test'}))
}; //ExampleThree()


function ExampleFour() {

    const {dirList } = xfs( () => ({ dir: __dirname, path: './logs/cache' }) );
    console.log(dirList())
}; //ExampleFour()



