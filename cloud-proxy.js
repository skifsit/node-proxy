const fs = require('fs')
const http = require('http')
const https = require('https')
const port = process.env.PORT || 9993
const url = require('url')
const net = require('net')

const options = {
  key: fs.readFileSync('server_key.pem'),
  cert: fs.readFileSync('server_cert.pem'),
  ca: fs.readFileSync('ca_cert.pem'),
  requestCert: true,
  rejectUnauthorized: true
}

const server = https.createServer(options, (req, res) => {
  console.log(req.method, req.url)
  const reqUrl = req.url
  const result = reqUrl.includes('//')
    ? url.parse(reqUrl)
    : url.parse(`//${reqUrl}`, false, true)
  const options = {
    hostname: result.hostname,
    port: result.port,
    path: result.path,
    method: req.method,
    headers: req.headers,
  }

  const proxyReq = http.request(options, (resProxy) => { // TCP -> HTTP
    res.writeHead(resProxy.statusCode, resProxy.statusMessage, resProxy.headers)
    resProxy.pipe(res)
  })
  req.pipe(proxyReq).on('error', (err) => {
    console.error(err)
  })
})

server.on('connect', (req, clientSocket) => {
  console.log(req.method, req.url)
  const reqUrl = req.url
  const result = reqUrl.includes('//')
    ? url.parse(reqUrl)
    : url.parse(`//${reqUrl}`, false, true)

  const serverSocket = net.connect(result.port, result.hostname) // TCP
  serverSocket.on('connect', () => {
    clientSocket.write([
      'HTTP/1.1 200 Connection Established',
      'Proxy-agent: Node-Proxy'
    ].join('\r\n'))
    clientSocket.write('\r\n\r\n')

    clientSocket.on('error', (err) => console.error(err))
    serverSocket.pipe(clientSocket)
    clientSocket.pipe(serverSocket)
  })
  serverSocket.on('error', (err) => console.error(err))
})

const listener = server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }
  const info = listener.address()
  console.log(`Server is listening on address ${info.address} port ${info.port}`)
})