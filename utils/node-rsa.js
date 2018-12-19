// utils/node-rsa.js
const NodeRSA = require('node-rsa')
const fs = require('fs')

// Generate new 512bit-length key
let key = new NodeRSA({b: 512})
key.setOptions({encryptionScheme: 'pkcs1'})

let privatePem = key.exportKey('pkcs1-private-pem')
let publicDer = key.exportKey('pkcs8-public-der')
let publicDerStr = publicDer.toString('base64')

const pem = {
  savePem () {
    //保存返回到前端的公钥
    fs.writeFile('./pem/public.pem', publicDerStr, (err) => {
      if (err) throw err
      console.log('公钥已保存！')
    })
    //保存私钥
    fs.writeFile('./pem/private.pem', privatePem, (err) =>{
      if (err) throw err
      console.log('私钥已保存！')
    })
  }
}

module.exports = { pem }
