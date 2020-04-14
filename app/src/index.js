const http = require('http')
const fs = require('fs')
const path = require('path')
const dns = require('dns')
const util = require('util')

const PORT = process.env.PORT || 8080

const server = http.createServer()

const resolve = util.promisify(dns.resolve)
const readFile = util.promisify(fs.readFile)

server.on('request', async (req, res) => {
  const filePath = path.join(__dirname, 'index.html')

  res.writeHead(200, {
    'Content-Type': 'text/html'
  })

  let hasConnection = true
  try {
    await resolve('www.google.com')
  } catch (e) {
    hasConnection = false
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  const info = {
    href: url.href,
    origin: url.origin,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    search: url.search,
    hash: url.hash,
    hasConnection: hasConnection ? 'success' : 'failure'
  }

  let content
  try {
    content = await readFile(filePath, 'utf8')
  } catch (e) {
    console.error('Received error while reading index.html:', e)
    res.writeHead(500)
    res.end('An unknown error occurred')
    return
  }

  let filledContent = content

  for (const key in info) {
    filledContent = filledContent.replace(new RegExp(`{{${key}}}`, 'g'), info[key])
  }

  res.end(filledContent)

})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
