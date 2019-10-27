import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset, speechColor}) {
    super(game, x, y, null)
    this.speechColor = speechColor
  }

  create() {
    this.dialog = this.addChild(this.game.make.bitmapText(0, -100, 'gameFont', '', 16))
    this.dialog.maxWidth = 300
    this.dialog.anchor.setTo(0.5)
    this.dialog.align = 'center'

    if (this.speechColor) {
      this.dialog.tint = this.speechColor
    }

    this.body = this.addChild(this.game.add.sprite(0, 0, 'figures', 'yoda_idle.png'))
    this.body.anchor.setTo(0.5, 0.5)

    this.body.animations.add('talk', Phaser.Animation.generateFrameNames('yoda_talk_', 0, 2, '.png', 2), 6, true)

    this.start()
  }

  start() {
    this.hover()
  }

  /**
   * Triggers hover tween
   */
  hover() {
    // Start yoda hover
    const hoverPosition = this.body.y + 20

    this.game.add.tween(this.body).to({
      y: hoverPosition
    }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  /**
   * Says lines of provided array
   * @param {array} textArray strings to say
   * @param {function} callBack after all textLines are played
   */
  say (textArray, callBack) {
    this.textArray = textArray
    this.speechCallback = callBack
    this.textLineCount = 0
    this.maxTextLineCount = textArray.length
    const textLine = this.textArray[this.textLineCount]
    this.playTextLine(textLine)
  }

  /**
   * Start talk animation and display textLine
   * @param {string} textLine
   */
  playTextLine (textLine) {
    this.dialog.text = textLine
    this.game.time.events.add(Phaser.Timer.SECOND * config.SHOW_DIALOG_SECONDS, this.endSpeech, this)
    this.body.animations.play('talk')
    this.showSpeechBubble()
  }

  endSpeech () {
    this.textLineCount++
    this.body.animations.stop('talk')
    this.hideSpeechBubble()

    const playCallback = this.textLineCount === this.maxTextLineCount
    if (playCallback) {
      if (this.speechCallback) {
        return this.speechCallback()
      }
    } else {
      this.playTextLine(this.textArray[this.textLineCount])
    }
  }

  showSpeechBubble () {
    this.dialog.visible = true
  }

  hideSpeechBubble () {
    this.dialog.visible = false
  }
}
