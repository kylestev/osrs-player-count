const Axios = require('axios')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

const PORT = process.env.PORT || 8080

const osrsClient = Axios.create({
  baseURL: 'https://oldschool.runescape.com'
})

function playerCountChecker() {
  let count = 0
  let lastChecked = 0

  return {
    check: () => {
      osrsClient.get('/')
        .then(({
          data
        }) => {
          const matches = /<p class='player-count'>There are currently ([0-9,]+) people playing!<\/p>/.exec(data)
          count = parseInt(matches[1].replace(",", ""))
          lastChecked = Date.now()
        })
        .catch(err => console.error(err))
    },
    currentCount: () => {
      return { count, lastChecked }
    }
  }
}

const checker = playerCountChecker()

checker.check()

setInterval(() => checker.check(), 5e3)

app.get('/', (req, res) => {
  res.send(checker.currentCount())
})

app.listen(PORT, () => console.log(`Running on port: ${PORT}`))
