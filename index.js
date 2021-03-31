const fs = require('fs')
const path = require('path')
const { performance } = require('perf_hooks')
const yaml = require('js-yaml')

try {
  const file = process.argv.slice(2)
  const t0 = performance.now()
  const doc = yaml.load(fs.readFileSync(path.resolve(__dirname, file[0]), 'utf8'))
  const size = roughSizeOfObject(doc)
  const t1 = performance.now()
  console.log(JSON.stringify(doc))
  console.log(`Call took ${(t1 - t0).toFixed(2)} milliseconds.`)
  console.log(`bytes: ${size}`)
} catch (e) {
  console.log(e)
}

function roughSizeOfObject (object) {
  const objectList = []
  const recurse = function (value) {
    let bytes = 0
    if (typeof value === 'boolean') {
      bytes = 4
    } else if (typeof value === 'string') {
      bytes = value.length * 2
    } else if (typeof value === 'number') {
      bytes = 8
    } else if
    (
      typeof value === 'object' &&
          !objectList.includes(value)
    ) {
      objectList[objectList.length] = value
      for (const i in value) {
        bytes += 8
        bytes += recurse(value[i])
      }
    }
    return bytes
  }
  return recurse(object)
}
