const fs = require('fs')
const net = require('net')
const tls = require('tls')
const port = process.env.PORT || 9192
const PROXY_HOST = process.env.PROXY_HOST || 'localhost'
const PROXY_PORT = process.env.PROXY_PORT || 443

const server = net.createServer(clientSocket => {
  const serverSocket = tls.connect({
    host: PROXY_HOST,
    port: PROXY_PORT,
    key: fs.readFileSync('client_key.pem'),
    cert: fs.readFileSync('client_cert.pem'),
    ca: fs.readFileSync('ca_cert.pem'),
  })
  clientSocket.pipe(serverSocket)
  serverSocket.pipe(clientSocket)
  clientSocket.on('error', (err) => console.error(err))
  serverSocket.on('error', (err) => console.error(err))
})

const listener = server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }
  const info = listener.address()
  console.log(`Server is listening on address ${info.address} port ${info.port}`)
})