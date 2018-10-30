const Axios = require('axios')
const express = require('express')

const app = express()

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
          const matches = /<p class='player-count'>There are currently (\d+) people playing!<\/p>/.exec(data)
          // console.log(matches[1])
          count = +matches[1]
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
