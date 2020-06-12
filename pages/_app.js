import '../public/main.css'
import React from 'react'
import fs from 'fs'
const glob = require('glob')
const path = require('path')
let pages = []

function App({ Component, pages }) {
    return <Component pages={pages} />
}

App.getInitialProps = async () => {
    pages = pages.length > 0 ? [] : pages
    if (fs && typeof fs.readdirSync === 'function') {
        const files = glob.sync('pages/**/*.tsx')
        for (const file of files) {
            const filename = path.basename(file).split('.')[0]
            if (filename !== 'index') {
                pages.push(filename)
            }
        }
    }
    return { pages }
}

export default App
