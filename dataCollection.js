const request = require('request')
const _ = require('highland')
const zipper = require('unzipper')

const reg = /^(?!Metadata).*$/

const download = (url, type, lineCheck) => {

  return new Promise((resolve) => {

    let countries = []
    _(request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url,
      headers: {
        'Accept': 'text/html,application/zip,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
      },
      /* GZIP true for most of the websites now, disable it if you don't need it */
      gzip: true
    })
      .pipe(zipper.ParseOne(reg)))
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
        if (isNaN(lines[lineCheck])) {
          name = lines[0] + lines[1]
        } else {
          name = lines[0]
        }
        return ({
          name: name,
          startYear: 1960,
          [type]: lineValues
        })
      })
      .each(x => {
        countries.push(x)
      })
      .done(() => {
        // console.log('stream finnished')
        resolve(countries)
      })
  })
}

const parseObjects = (population, emissions) => {
  // console.log(typeof population)
  // console.log(typeof emission)

  let countries = null

  _(population)
    .map(land => {
      // console.log(land)    
      const emis = emissions.find(c => c.name === land.name)
      // console.log(land.name)
      // console.log(emis.singleEmissions)    

      land.emissions = emis.emissions
      // console.log(land)
      return land
    })
    .toArray(result => {
      // console.log('result', typeof result)
      // console.log('result66', result)
      countries = result
    })

  // console.log('parseObject', typeof countries)

  return countries
}


// console.log('caountry data', countrydata)
let countryData = null

const downloadData = async () => {  
  // console.log('country data', countryData)
  if (!countryData) {
    const POPULATION_URI = 'http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv'
    const EMISSION_URI = 'http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv'

    const population = await download(POPULATION_URI, 'population', 5)
    const emission = await download(EMISSION_URI, 'emissions', 4)
    const finishedData = parseObjects(population, emission)
    // eslint-disable-next-line require-atomic-updates
    countryData = finishedData
    
  }

  return countryData
}

module.exports = { downloadData }