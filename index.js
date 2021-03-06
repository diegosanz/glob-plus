'use strict'

const EventEmitter = require('events')
const { Glob } = require('glob')
const { readFile, stat } = require('fs')
const { join } = require('path')

const plus = (pattern = '**',
            options = {}) => {

    options.cwd = options.cwd || process.cwd()
    options.nodir = options.cwd || true

    const emitter = new EventEmitter()
    const glob = new Glob(pattern, options)

    let end = false, pending = 0

    glob.on('match', name => {
        pending++
        const file = join(options.cwd, name)
        stat(file, (err, stats) => {
            if (err) {
                /* possible end #1
                 * error when stating */
                emitter.emit('error', err)
                /* check after end #1 */
                if (!--pending && end) {
                    emitter.emit('end')
                }
            } else {
                readFile(file, (err, data) => {
                    if (err) {
                        /* possible end #2
                         * error when reading */
                        emitter.emit('error', err)
                    } else {
                        /* possible end #3
                         * it's all good */
                        emitter.emit('file', { name, stats, data })
                    }
                    /* check after end #2 & #3 */
                    if (!--pending && end) {
                        emitter.emit('end')
                    }
                })
            }
        })
    })

    glob.on('error', err => {
        emitter.emit('error', err)
    })

    glob.on('end', () => {
        if ((end = true) && !pending) {
            emitter.emit('end')
        }
    })

    return emitter
}

const read = (pattern = '**',
            options = {}) => {

    options.cwd = options.cwd || process.cwd()
    options.nodir = options.cwd || true

    const emitter = new EventEmitter()
    const glob = new Glob(pattern, options)

    let end = false, pending = 0

    glob.on('match', name => {
        pending++
        const file = join(options.cwd, name)
        readFile(file, (err, data) => {
            if (err) {
                /* possible end #1
                 * error when reading */
                emitter.emit('error', err)
            } else {
                /* possible end #2
                 * it's all good */
                emitter.emit('file', { name, data })
            }
            /* check after end #1 & #2 */
            if (!--pending && end) {
                emitter.emit('end')
            }
        })
    })

    glob.on('error', err => {
        emitter.emit('error', err)
    })

    glob.on('end', () => {
        if ((end = true) && !pending) {
            emitter.emit('end')
        }
    })

    return emitter
}

const stats = (pattern = '**',
            options = {}) => {

    options.cwd = options.cwd || process.cwd()
    options.nodir = options.cwd || true

    const emitter = new EventEmitter()
    const glob = new Glob(pattern, options)

    let end = false, pending = 0

    glob.on('match', name => {
        pending++
        const file = join(options.cwd, name)
        stat(file, (err, stats) => {
            if (err) {
                /* possible end #1
                 * error when statting */
                emitter.emit('error', err)
            } else {
                /* possible end #2
                 * it's all good */
                emitter.emit('file', { name, stats })
            }
            /* check after end #1 & #2 */
            if (!--pending && end) {
                emitter.emit('end')
            }
        })
    })

    glob.on('error', err => {
        emitter.emit('error', err)
    })

    glob.on('end', () => {
        if ((end = true) && !pending) {
            emitter.emit('end')
        }
    })

    return emitter
}

module.exports.plus = plus
module.exports.read = read
module.exports.stats = stats
