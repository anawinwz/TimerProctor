import cheerio from 'cheerio'
const fieldTypes = {
  0: 'shortAnswer',
  1: 'paragraph',
  2: 'multipleChoice',
  4: 'checkbox',
  3: 'dropdown',
  13: 'fileUpload',
  5: 'linearScale',
  6: 'title',
  7: 'gridChoice',
  8: 'section',
  9: 'date',
  10: 'time',
  11: 'image',
  12: 'youtube'
}

const alignments = {
  0: 'left',
  1: 'center',
  2: 'right'
}

const validationTypes = {
  1: 'number',
  2: 'string',
  4: 'length',
  6: 'regExp'
}

const validationModes = {
  1: 'gt',
  2: 'gte',
  3: 'lt',
  4: 'lte',
  5: 'equal',
  6: 'nEqual',
  7: 'between',
  8: 'notBetween',
  9: 'isNumber',
  10: 'integer',
  
  100: 'includes',
  101: 'notIncludes',
  102: 'email',
  103: 'url',

  202: 'max',
  203: 'min',

  299: 'contains',
  300: 'notContains',
  301: 'match',
  302: 'notMatch'
}

const toFieldData = field => {
  const fieldTypeId = field[3]
  const fieldType = fieldTypes[fieldTypeId] || fieldTypeId
  let fieldData = {
    type: fieldType,
    title: field[1],
    desc: field[2]
  }

  if (['image', 'youtube'].includes(fieldType)) {
    const mediaData = field[6]
    fieldData.media = {
      id: (fieldType === 'image') ? mediaData[0] : mediaData[3],
      width: mediaData[2][0],
      height: mediaData[2][1],
      align: alignments[mediaData[2][2]]
    }
  }

  const answerData = field[4]?.[0]
  if (answerData) {
    fieldData.id = answerData[0]
    fieldData.rules = []

    const isRequired = answerData[2] == 1
    if (isRequired)
      fieldData.rules.push({ required: answerData[2] == 1 })

    const options = answerData[1]
    if (options && options.length > 0)
      fieldData.answers = options.map(answer => answer[0])

    if (fieldType === 'date') {
      fieldData.showTime = answerData[7][0] == 1
      fieldData.showYear = answerData[7][1] == 1
    } else if (fieldType === 'time') {
      fieldData.isDuration = answerData[6][0] == 1
    }

    const validations = answerData[4]?.[0]
    if (validations) {
      let rule = {}
      const type = validationTypes[validations[0]]
      const mode = validationModes[validations[1]]
      const values = validations[2]
      const message = validations[3]
      
      rule.type = type
      switch (type) {
        case 'string':
          if (['url', 'email'].includes(mode)) rule.type = mode
          else {
            rule.validator = {
              name: mode,
              values: values
            }
          }
        break
        case 'length':
          rule.type = 'string'
          rule[mode] = values[0]
        break
        case 'number':
          if (mode === 'between') {
            rule.min = values[0]
            rule.max = values[1]
          } else if (mode === 'integer') {
            rule.type = 'integer'
          } else if (['gt', 'gte', 'lt', 'lte'].includes(mode)) {
            const ruleMode = ['gt', 'gte'].includes(mode) ? 'min' : 'max'
            rule[ruleMode] = parseInt(values[0], 10) + (mode.endsWith('e') ? 0 : 1)
          } else if (mode !== 'isNumber') {
            rule.validator = {
              name: mode,
              values: values
            }
          }
        break
        case 'regExp':
          delete rule.type
          if (['contains', 'match'].includes(mode)) {
            rule.pattern = values[0]
          } else {
            rule.validator = {
              name: `regExp_${mode}`,
              values: values
            }
          }
        break
      }

      rule.message = message
      fieldData.rules.push(rule)
    }
  }

  return fieldData
}

const toSections = fields => {
  let sections = []
  const breaks = fields.filter(field => field.type === 'section')
  if (breaks.length === 0) {
    return [fields]
  } else {
    let thisSection = []
    for (const field of fields) {
      if (field.type === 'section') {
        sections.push(thisSection)
        thisSection = []
      }
      thisSection.push(field)
    }
    sections.push(thisSection)
    return sections
  }
}

export const toForm = data => {
  const fields = data[1][1].map(toFieldData)
  return {
    id: data[14],
    name: data[1][8],
    desc: data[1][0],
    fields: fields,
    sections: toSections(fields)
  }
}

export const getDataFromHTML = html => {
  const $ = cheerio.load(html)
  
  const scriptElm = $('script').filter((idx, elm) => $(elm).html().includes('var FB_PUBLIC_LOAD_DATA_'))
  if (!scriptElm) throw new Error('script element not found.')

  const json = JSON.parse(scriptElm.html().replace(/^var FB_PUBLIC_LOAD_DATA_ = (.*);$/s, '$1'))
  return json
}
