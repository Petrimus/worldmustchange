const config = require('./utils/config')
const app = require('./app')
const http = require('http')
const { downloadData } = require('./dataCollection');

(async function data() {
   await downloadData()
        
})()


const server = http.createServer(app)

server.listen(config.PORT, () => {  
  
  console.log(`Server running on port ${config.PORT}`)
})