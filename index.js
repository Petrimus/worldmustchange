const fs = require('fs')
const _ = require('highland')

const stream = fs.createReadStream('popuonlyone.csv', 'utf8')

let countries = []

 _(stream)
  .split()
  .compact()
  //.split('\r\n')
  .filter(line => line.length > 50)
  .map(str => str.replace(/"/g, ''))
  .map(line => line.split(','))
  .filter(line => line[0] !== 'Country Name')
  .map(lines => {
    const lineValues = lines.reduce((values, value) => {
      if (!isNaN(value)) {
        if (Number(value) === 0) {
          values.push(null)
        } else {
          values.push(Number(value))
        }
      }
      return values
    }, [])

    let name = ''
    if (isNaN(lines[4])) {
      name = lines[0] + lines[1]     
  } else {
      name = lines[0]     
  }
    return ({
      name: name,
      startYear: 1960,     
      population: lineValues
    })
  }) 
  .toArray(x => {
  countries = x
  console.log('fetching population done')  
  })
 
   
    
  
  

