/* globals __DEV__ */
import Phaser from 'phaser'
import Jedi from '../sprites/Jedi'
import Dialog from '../sprites/Dialog'

export default class extends Phaser.State {
  init (enemyName) {
    this.game.stage.backgroundColor = '#312352'

    // Name of Person that is currently encoutered
    this.enemyName = enemyName

    this.STATE = {
      NORMAL: 0,
      INSULT: 1,
      PARRY: 2
    }

    this.score = {
      enemy: 0,
      player: 0
    }
  }

  preload () {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.pageAlignHorizontally = this.game.scale.pageAlignVertically = true
  }

  create () {
    this.createAssets()
    this.groupAssets()
    this.addAssetsToGame()
    this.registerSignals()
    this.start()
  }

  createAssets () {
    this.background = this.add.sprite(0, 0, 'backgroundCombat')

    this.dialogData = this.loadDialogData(this.enemyName)
    this.playerDialogOptions = this.loadPlayerDialogOptions(this.dialogData.playerOptions)

    const defaultInsultOptions = this.game.insultCollectionsService.getDefaultInsults()
    const collectedInsultOptions = this.game.insultCollectionsService.getCollectedInsults()
    this.playerInsultOptions = [...defaultInsultOptions, ...collectedInsultOptions]

    this.enemyInsultSolutions = this.dialogData.insultSolutions
    this.enemyInsultId = null

    this.state = this.STATE.NORMAL

    this.enemy = new Jedi({
      game: this.game,
      name: this.enemyName,
      x: this.world.centerX + 120,
      y: this.world.centerY - 50,
      speechColor: 0xFF0000,
      reverseFightAnimation: true
    })

    // Set loose dialog
    switch (this.enemyName) {
      case 'markus':
        this.enemy.looseDialogId = 16
        break
      case 'damian':
        this.enemy.looseDialogId = 17
        break
      case 'stefan':
        this.enemy.looseDialogId = 18
        break
    }

    this.player = new Jedi({
      game: this.game,
      name: 'marc',
      x: this.world.centerX - 120,
      y: this.world.centerY - 50
    })

    this.player.looseDialogId = 8

    // Dialog instance
    this.dialog = new Dialog({
      game: this.game,
      x: 5,
      y: 455,
      textOptions: null
    })

    this.dialog.visible = false
    this.enemy.create()
    this.player.create()
  }

  groupAssets () {
  }

  addAssetsToGame () {
    this.game.add.existing(this.player)
    this.game.add.existing(this.enemy)
    this.game.add.existing(this.dialog)

    this.player.scale.x *= -1
    this.player.dialog.scale.x *= -1

    this.mouseCursor = this.game.add.sprite(-100, -100, 'figures', 'cursor.png')
    this.mouseCursor.anchor.setTo(0.5, 0.5)
  }

  registerSignals () {
    this.dialog.getDialogOptionClickedSignal().add(this.onDialogOptionClickedSignal, this)

    this.game.input.addMoveCallback(function (pointer, x, y) {
      this.mouseCursor.x = x
      this.mouseCursor.y = y
    }, this)
  }

  start () {
    this.dialog.setDialogOptions(this.playerDialogOptions)
    this.startIntro(this.dialogData.introText)
  }

  /**
   * Remove said gameTextId from players options
   * @param {number} gameTextId
   * @returns {array}
   */
  removeFormPlayerDialogOptions (gameTextId) {
    return this.playerDialogOptions.filter(item => item.id !== gameTextId)
  }

  /**
   * Remove said gameTextId from players insult options
   * @param {number} gameTextId
   * @returns {array}
   */
  removeFormPlayerInsultOptions (gameTextId) {
    return this.playerInsultOptions.filter(id => id !== gameTextId)
  }

  /**
   * Process dialog option clicked by player
   * @param {number} gameTextId
   */
  onDialogOptionClickedSignal (gameTextId) {
    this.dialog.visible = false

    switch (this.state) {
      case this.STATE.NORMAL :
        this.playerDialogOptions = this.removeFormPlayerDialogOptions(gameTextId)
        break
      case this.STATE.INSULT :
        const newInsultOptions = this.removeFormPlayerInsultOptions(gameTextId)
        const defaultInsultOptions = this.game.insultCollectionsService.getDefaultInsults()
        this.playerInsultOptions = [...newInsultOptions, ...defaultInsultOptions]
        break
    }

    const textObject = this.game.dialogService.getTextObject(gameTextId)
    this.player.say(textObject.text, this.onPlayerSpeechEnd.bind(this, gameTextId))
  }

  onEnemyIntroEnd () {
    this.dialog.visible = true
  }

  /**
   * @param {string} turnOutcome 'win' or 'loose'
   */
  onEnemySpeechEnd (turnOutcome) {
    switch (this.state) {
      case this.STATE.NORMAL :

        this.dialog.setDialogOptions(this.playerDialogOptions)
        this.dialog.visible = true

        break

      case this.STATE.INSULT :
        switch (turnOutcome) {
          case 'parryLoose':
            // Enemy could not parry
            this.enemy.fight(this.enemy.x + 10, this.onEnemyParryLoose.bind(this))
            this.player.fight(this.player.x + 10)
            break
          case 'parryWin':
            // Enemy was able to parry
            this.score.enemy++
            this.enemy.fight(this.enemy.x - 10, this.onEnemyParryWin.bind(this))
            this.player.fight(this.player.x - 10)
            break
          case 'waitingForPlayer':
            // Enemy just insulted the player
            this.startPlayerParryTurn()
            break
        }
        break
    }
  }

  onEnemyParryLoose () {
    const dialogOptions = this.loadPlayerDialogOptions(this.playerInsultOptions)
    this.dialog.setDialogOptions(dialogOptions)
    this.dialog.visible = true
  }

  onEnemyParryWin () {
    if (!this.checkWinCondition()) {
      this.startEnemyInsultTurn()
    }
  }

  /**
   * @param {number} gameTextId of spoken text
   */
  onPlayerSpeechEnd (gameTextId) {
    this.dialog.visible = false
    switch (this.state) {
      case this.STATE.NORMAL:
        this.onPlayerNormalSpeechEnd(gameTextId)
        break
      case this.STATE.INSULT:
        this.onPlayerInsultSpeechEnd(gameTextId)
        break
      case this.STATE.PARRY:
        this.onPlayerParrySpeechEnd(gameTextId)
        break
    }
  }

  /**
   * Starts a new player parry turn
   */
  startPlayerParryTurn () {
    const playerParryOptions = this.game.insultCollectionsService.getCollectedParryOptions()
    const textObjects = this.game.dialogService.getTextObjects(playerParryOptions)
    this.dialog.setDialogOptions(textObjects)
    this.dialog.visible = true
    this.state = this.STATE.PARRY
  }

  /**
   * Starts a new player insult turn
   */
  startPlayerInsultTurn () {
    const dialogOptions = this.loadPlayerDialogOptions(this.playerInsultOptions)
    this.dialog.setDialogOptions(dialogOptions)
    this.dialog.visible = true
    this.state = this.STATE.INSULT
  }

  /**
   * Starts a new enemy insult turn
   */
  startEnemyInsultTurn () {
    this.enemyInsultId = Phaser.ArrayUtils.getRandomItem(this.dialogData.insultOptions)
    this.game.insultCollectionsService.collectInsult(this.enemyInsultId)
    const textObject = this.game.dialogService.getTextObject(this.enemyInsultId)
    this.enemy.say(textObject.text, this.onEnemySpeechEnd.bind(this, 'waitingForPlayer'))
    this.state = this.STATE.INSULT
  }

  /**
   * Decides what action to take and starts it
   * @param {string} action
   */
  performAction (action) {
    switch (action) {
      case 'quit' :
        this.game.state.start('Map')
        break
      case 'startFight':
        this.state = this.STATE.INSULT
        this.startPlayerInsultTurn()
        break
    }
  }

  /**
   * Response handler on STATE.NORMAL
   * @param {number} gameTextId
   */
  onPlayerNormalSpeechEnd (gameTextId) {
    const actionResponse = this.game.dialogService.getActionResponse(gameTextId, this.dialogData.actionMapping)
    if (actionResponse !== null) {
      this.performAction(actionResponse)
    } else {
      const responseTextId = this.game.dialogService.getTextResponseId(gameTextId, this.dialogData.textMapping)
      if (responseTextId !== null) {
        const textObject = this.game.dialogService.getTextObject(responseTextId)
        this.enemy.say(textObject.text, this.onEnemySpeechEnd.bind(this))
      }
    }
  }

  /**
   * Player Response handler on STATE.INSULT
   * @param {number} gameTextId of spoken insult
   */
  onPlayerInsultSpeechEnd (gameTextId) {
    const responseTextId = this.game.dialogService.getEnemyParryTextObjectId(gameTextId, this.enemyInsultSolutions)

    if (responseTextId !== null) {

      // Enemy has answer - say it (Enemy wins turn)
      const textObject = this.game.dialogService.getTextObject(responseTextId)
      this.game.insultCollectionsService.collectParryOption(responseTextId)
      this.enemy.say(textObject.text, this.onEnemySpeechEnd.bind(this, 'parryWin'))

    } else {
      // Enemy has no answer - respond with bad counter (Enemy looses turn)
      const textObject = this.game.dialogService.getTextObject(7)
      // Was not able to parry - point for player
      this.score.player++

      if (!this.checkWinCondition()) {
        this.enemy.say(textObject.text, this.onEnemySpeechEnd.bind(this, 'parryLoose'))
      } else {
        this.looseCombat(this.enemy)
      }
    }
  }

  /**
   * Player Responds handler on STATE.PARRY
   * @param {number} gameTextId
   */
  onPlayerParrySpeechEnd (gameTextId) {
    const isCorrect = this.game.dialogService.isCorrectAnswer(this.enemyInsultId, gameTextId)
    if (isCorrect) {
      this.score.player++
      this.enemy.fight(this.enemy.x + 10)
      this.player.fight(this.player.x + 10, this.onPlayerParryWin.bind(this))
    } else {
      // Was not able to parry - point for enemy
      this.score.enemy++
      this.enemy.fight(this.enemy.x - 10)
      this.player.fight(this.player.x - 10, this.onPlayerParryLoose.bind(this))
    }
  }

  onPlayerParryLoose () {
    if (!this.checkWinCondition()) {
      this.startEnemyInsultTurn()
    } else {
      this.looseCombat(this.player)
    }
  }

  onPlayerParryWin () {
    if (!this.checkWinCondition()) {
      this.startPlayerInsultTurn()
    } else {
      this.looseCombat(this.enemy)
    }
  }

  onGameEnd () {
    this.game.state.start('Map')
  }

  /**
   * Triggers loose event on looser
   * @param {Jedi} looserJedi
   */
  looseCombat (looserJedi) {
    console.log('lost: ', looserJedi)
    const textObjecId = looserJedi.looseDialogId
    const textObject = this.game.dialogService.getTextObject(textObjecId)

    // Store beaten enemy-jedis on game
    if (typeof this.game.wins === 'undefined') {
      this.game.wins = []
    }

    if (!this.game.wins.includes(looserJedi.name) && looserJedi.name !== 'marc') {
      this.game.wins.push(looserJedi.name)
    }

    if (typeof textObject !== 'undefined') {
      // Say text if there is any..
      looserJedi.loose(textObject.text, this.onGameEnd.bind(this))
    } else {
      // exit right away..
      this.onGameEnd()
    }
  }

  checkWinCondition () {
    let gameOver = false
    if (this.score.enemy >= 3 || this.score.player >= 3) {
      gameOver = true
    }
    return gameOver
  }

  /**
   * Loads Playerdata to enemy and populates dialog options
   * @param {string} enemyName used to load dialog data
   */
  loadDialogData (enemyName) {
    return this.game.dialogService.getPersonDialogData(enemyName)
  }

  /**
   * Load dialog options for player from a dialog config
   * @param {object} dialogConfig
   */
  loadPlayerDialogOptions (dialogConfig) {
    return this.game.dialogService.getTextObjects(dialogConfig)
  }

  /**
   * Start playing dialog of enemy
   * @param {number} gameTextId of intro
   */
  startIntro (gameTextId) {
    const textObject = this.game.dialogService.getTextObject(gameTextId)
    this.enemy.say(textObject.text, this.onEnemyIntroEnd.bind(this))
  }

  render () {
    if (__DEV__) {
    }
  }
}
