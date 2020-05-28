// promise内部封装一个异步的任务，成功的时候，调用resolve  失败的时候调用reject
const fs = require('fs')
function readFile(file) {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/' + file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// 读取a,b,c,d四个文件
async function read() {
  // try ... catch
  try {
    let res = await readFile('a.text1')
    console.log(res)
    let res2 = await readFile('b.text')
    console.log(res2)
    let res3 = await readFile('c.text')
    console.log(res3)
    let res4 = await readFile('d.text')
    console.log(res4)
  } catch(e) {
    console.log('读文件失败', e)
  }

}

read()


// this.$confirm()    axios()
// readFile('a.text').then(res => {
//   console.log(res)
//   return readFile('b.text')
// }).then(res => {
//   console.log(res)
//   return readFile('c.text')
// }).then(res => {
//   console.log(res)
//   return readFile('d.text')
// }).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err)
// })
