// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clearLog = () => {
  document.getElementById('logs').innerHTML = ''
  return true
}

// eslint-disable-next-line no-undef
const socket = io()
socket.on('request_data', (data) => {
  const li = document.createElement('li')
  const pre = document.createElement('pre')

  li.classList.add('new-log')

  setTimeout(() => {
    li.classList.remove('new-log')
    li.classList.add('old-log')
  }, 10000)

  const now = new Date()

  pre.innerText = `Date:    ${now.toLocaleDateString()} ${now.toLocaleTimeString()}
Method:  ${data.method}  Url: ${data.url}
Headers: ${JSON.stringify(data.headers, null, 2)}
Params:  ${JSON.stringify(data.params, null, 2)}
Query:   ${JSON.stringify(data.query, null, 2)}
Body:    ${JSON.stringify(data.body, null, 2)}`
  li.appendChild(pre)
  document.getElementById('logs').prepend(li)
})
