const fieldTypes = {
  0: 'shortAnswer',
  1: 'paragraph',
  2: 'multipleChoice',
  3: 'checkbox',
  4: 'dropdown',
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
  const fieldType = fieldTypes[field[3]] || field[3]
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
      height: mediaData[2][1]
    }
  }

  const answerData = field[4]?.[0]
  if (answerData) {
    fieldData.id = answerData[0]
    fieldData.rule = {
      required: answerData[2] == 1
    }

    const options = answerData[1]
    if (options && options.length > 0)
      fieldData.answers = options.map(answer => answer[0])

    const validations = answerData[4]?.[0]
    if (validations) {
      const type = validationTypes[validations[0]]
      const mode = validationModes[validations[1]]
      const values = validations[2]
      const message = validations[3]
      
      fieldData.rule.type = type
      switch (type) {
        case 'string':
          if (['url', 'email'].includes(mode)) fieldData.rule.type = mode
          else {
            fieldData.rule.validator = {
              name: mode,
              values: values
            }
          }
        break
        case 'length':
          fieldData.rule.type = 'string'
          fieldData.rule[mode] = values[0]
        break
        case 'number':
          if (mode === 'between') {
            fieldData.rule.min = values[0]
            fieldData.rule.max = values[1]
          } else if (mode !== 'isNumber') {
            fieldData.rule.validator = {
              name: mode,
              values: values
            }
          }
        break
        case 'regExp':
          delete fieldData.rule.type
          fieldData.rule.pattern = values[0]
        break
      }
      fieldData.rule.message = message
    }
  }

  return fieldData
}

export const toForm = data => (
  {
    id: data[14],
    name: data[1][8],
    desc: data[1][0],
    fields: data[1][1].map(toFieldData)
  }
)
