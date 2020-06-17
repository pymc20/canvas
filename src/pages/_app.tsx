import '../../public/main.css'
import React from 'react'
import fs from 'fs'

const glob: any = require('glob')
const path: any = require('path')
let pages: any = []

function App({ Component, pages }) {
    return <Component pages={pages} />
}

App.getInitialProps = async () => {
    pages = pages.length > 0 ? [] : pages
    if (fs && typeof fs.readdirSync === 'function') {
        const files: any = glob.sync('src/pages/**/*.tsx')
        for (const file of files) {
            const filename = path.basename(file).split('.')[0]
            if (filename !== 'index' && filename !== '_app') {
                pages.push(filename)
            }
        }
    }
    return { pages }
}

export default App
