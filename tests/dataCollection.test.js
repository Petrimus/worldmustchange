const { downloadData } = require('../dataCollection')


describe('test for data collection', () => {
  let countryData

  beforeAll(async () => {
    const data = await downloadData()
    // console.log('Country data ready')
    // console.log('type of data', typeof data)
    countryData = data
  })

  test('countryData is not empty', () => {
    const data = countryData
    expect(data).not.toBeNull()
  })

  test('array[31] name is Bhutan', () => {
    const data = countryData
    expect(data[31].name).toBe('Botswana')
  })

  test('array[228] name is East Asia & Pacific (IDA & IBRD countries)', () => {
    const data = countryData
    expect(data[228].name).toBe('East Asia & Pacific (IDA & IBRD countries)')
  })

  test('array onject has correct properties', () => {
    const data = countryData[139]
    expect(data).toEqual(expect.objectContaining({
      name: expect.any(String),
      population: expect.any(Array),
      emissions: expect.any(Array)
    }))
  })
})