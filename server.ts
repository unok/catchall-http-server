/* eslint-disable no-console */
import express from 'express'
import { Server } from 'socket.io'
import { IncomingHttpHeaders, createServer } from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import { ParsedQs } from 'qs'

dotenv.config({ path: './.env' })

const app = express()
const PORT = process.env.PORT || 3333
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/base.css', (_req, res) => {
  res.sendFile(__dirname + '/base.css')
})
app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.get('/client.js', (_req, res) => {
  res.sendFile(__dirname + '/client.js')
})

type RequestData = {
  method: string
  headers: IncomingHttpHeaders
  body: { [key: string]: string }
  params: { [key: string]: string }
  query: { name: string; value: string | ParsedQs | string[] | ParsedQs[] | undefined }[]
  url: string
}

app.all('*', (req, res) => {
  const queries = Object.entries(req.query).map(([key, value]) => {
    return { name: key, value: value }
  })

  const requestData: RequestData = {
    method: req.method,
    headers: req.headers,
    body: req.body as { [key: string]: string },
    params: req.params,
    query: queries,
    url: req.url,
  }
  console.log('Request Data:', requestData)
  io.emit('request_data', requestData)
  res.status(200).send(JSON.stringify({ message: 'success' }))
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
