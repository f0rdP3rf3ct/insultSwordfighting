export default class dialogService {
  /**
   * @param {object} textObject
   * @param {object} dialogObject
   */
  constructor (textObject, dialogObject) {
    this.textObject = textObject
    this.dialogObject = dialogObject
  }

  setTextObject (textObject) {
    this.textObject = textObject
  }

  setDialogObject (dialogObject) {
    this.dialogObject = dialogObject
  }

  /**
   * Returns dialog data to given person
   * @param {object} name of person
   */
  getPersonDialogData (name) {
    return this.dialogObject.people.find(p => p.name === name)
  }

  /**
   * Returns textobjects matching the ids in given array
   * @param {array} dialogIds
   */
  getTextObjects (dialogIds) {
    return this.textObject.gameText.filter(e => dialogIds.includes(e.id))
  }

  /**
   * Returns a single textobject
   * @param {number} dialogId
   */
  getTextObject (dialogId) {
    return this.textObject.gameText.find(e => e.id === dialogId)
  }

  /**
   * Looks for action attached to textObjectId
   * @param {number} textObjectId
   * @param {array} actionMapping
   * @returns {*}
   */
  getActionResponse (textObjectId, actionMapping) {
    let result = null

    actionMapping.forEach((mapping) => {
      if (mapping.requestTextIds.includes(textObjectId)) {
        result = mapping.responseAction
      }
    })

    return result
  }

  /**
   * Looks for response to textObjectId
   * @param {number} textObjectId
   * @param {array} textMapping
   * @returns {*}
   */
  getTextResponseId (textObjectId, textMapping) {
    let result = null

    textMapping.forEach((mapping) => {
      if (mapping.requestTextIds.includes(textObjectId)) {
        result = mapping.responseTextId
      }
    })

    return result
  }

  /**
   * @param textObjectId
   * @param enemySolutionIds
   * @returns {null}
   */
  getEnemyParryTextObjectId (textObjectId, enemySolutionIds) {
    let solutionId = null

    enemySolutionIds.forEach( (enemySolutionId) => {
      const correct = this.isCorrectAnswer(textObjectId, enemySolutionId)
      if (correct) {
        solutionId = enemySolutionId
      }
    })

    return solutionId
  }

  /**
   * @param {number} insultTextObjectId
   * @param {number} responseTextObjectId
   * @returns {boolean}
   */
  isCorrectAnswer (insultTextObjectId, responseTextObjectId) {
    const insultSolution = this.textObject.insultSolutions.find(textObject => textObject.id === insultTextObjectId)
    return insultSolution.solutionId === responseTextObjectId
  }
}
