export default class insultCollectionService {

  constructor () {
    this.collectedInsults = []
    this.collectedParryOptions = [2001, 2002, 2003]
    this.defaultInsultOptions = [1001, 1002, 1003]
  }

  /**
   * Add insult to collection
   * @param textObjectId
   */
  collectInsult (textObjectId) {
    if (!this.collectedInsults.includes(textObjectId)) {
      this.collectedInsults.push(textObjectId)
    }
  }

  /**
   * Add parryOption to collection
   * @param textObjectId
   */
  collectParryOption (textObjectId) {
    if (!this.collectedParryOptions.includes(textObjectId)) {
      this.collectedParryOptions.push(textObjectId)
    }
  }

  /**
   * Returns collected insults of player
   * @returns {number[]}
   */
  getCollectedInsults () {
    return this.collectedInsults
  }

  /**
   * Returns collected parries of player
   * @returns {number[]}
   */
  getCollectedParryOptions () {
    return this.collectedParryOptions
  }

  /**
   * Get the default set of insults of player
   * @returns {number[]}
   */
  getDefaultInsults () {
    return this.defaultInsultOptions
  }
}
