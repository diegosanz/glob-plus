'use strict'

const glob = require('./')

const plus = glob.plus('**', { ignore: 'node_modules/**' })

plus.on('file', ({ name, stats, data }) => {
    console.log(`Found file '${name}' with size ${stats.size}`)
})

plus.on('error', err => {
    console.error(err)
})

plus.on('end', () => {
    console.log('Done!')
})
