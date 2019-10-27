import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, name, speechColor, reverseFightAnimation}) {
    super(game, x, y, null)
    this.anchor.setTo(0.5)
    this.speechColor = speechColor
    this.reverseFightAnimation = reverseFightAnimation
    this.name = name

    this.textArray = []
    this.maxTextLineCount = 0
    this.textLineCount = 0
    this.speechCallback = null
  }

  /**
   * @inheritDoc
   */
  create () {
    this.dialog = this.addChild(this.game.make.bitmapText(0, -200, 'gameFont', '', 16))
    this.dialog.maxWidth = 300
    this.dialog.anchor.setTo(0.5)
    this.dialog.align = 'center'

    if (this.speechColor) {
      this.dialog.tint = this.speechColor
    }

    let waveCoordinates = {
      x: +22,
      y: -42
    }

    let swordCoordinates = {
      x: -10,
      y: -20
    }

    let legCoordinates = {
      x: 5,
      y: 0
    }

    let headCoordinates = {
      x: 0,
      y: -60
    }

    this.fightArm = this.addChild(this.game.add.sprite(swordCoordinates.x, swordCoordinates.y, 'figures', this.name + '_arm_fight_02.png'))
    this.fightArm.anchor.setTo(1, 0.5)
    this.fightArm.animations.add('loose', Phaser.Animation.generateFrameNames(this.name + '_arm_loose_', 0, 3, '.png', 2), 6)

    // Player specific
    if (this.name === 'marc') {
      this.fightArmTalkAnimation = this.fightArm.animations.add('talk', Phaser.Animation.generateFrameNames(this.name + '_arm_wave_r_', 0, 3, '.png', 2), 6)
    }

    if (this.reverseFightAnimation) {
      this.fightArm.animations.add('fight', Phaser.Animation.generateFrameNames(this.name + '_arm_fight_', 0, 3, '.png', 2), 6, true)
    } else {
      this.fightArm.animations.add('fight', Phaser.Animation.generateFrameNames(this.name + '_arm_fight_', 3, 0, '.png', 2), 6, true)
    }

    this.waveArm = this.addChild(this.game.add.sprite(waveCoordinates.x, waveCoordinates.y, 'figures', this.name + '_arm_wave_01.png'))
    this.waveArm.anchor.setTo(0, 0.5)
    this.waveArm.animations.add('fight', Phaser.Animation.generateFrameNames(this.name + '_arm_wave_', 0, 3, '.png', 2), 6, true)

    this.head = this.addChild(this.game.add.sprite(headCoordinates.x, headCoordinates.y, 'figures', this.name + '_head_idle.png'))
    this.head.anchor.setTo(0.5, 1)
    this.head.animations.add('talk', Phaser.Animation.generateFrameNames(this.name + '_head_speak_', 0, 2, '.png', 2), 6, true)

    this.body = this.addChild(this.game.add.sprite(0, 0, 'figures', this.name + '_torso.png'))
    this.body.anchor.setTo(0.5, 1)

    this.legs = this.addChild(this.game.add.sprite(legCoordinates.x, legCoordinates.y, 'figures', 'legs_fight_01.png'))
    this.legs.anchor.setTo(0.5, 0)
    this.legs.animations.add('fight', Phaser.Animation.generateFrameNames('legs_fight_', 0, 2, '.png', 2), 2, true)
  }

  /**
   * @inheritDoc
   */
  update () {
  }

  /**
   * Start talk animation and display textLine
   * @param {string} textLine
   */
  playTextLine (textLine) {
    this.dialog.text = textLine
    this.game.time.events.add(Phaser.Timer.SECOND * config.SHOW_DIALOG_SECONDS, this.endSpeech, this)
    this.head.animations.play('talk')
    this.showSpeechBubble()
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
   * Start fight animation
   * @param {number} moveValue to move on x-axis
   * @param {function} callBack after fight tween has completed
   */
  fight (moveValue, callBack) {
    this.fightArm.animations.play('fight')
    this.waveArm.animations.play('fight')
    this.legs.animations.play('fight')

    this.game.add.tween(this)
      .to({x: moveValue}, 3000, Phaser.Easing.Linear.Out, true)
      .onComplete.add(function () { this.onFightMoveTweenEnd(callBack) }, this)
  }

  /**
   * Called when this Person lost combat
   * @param {array} textArray to say when combat is lost
   * @param {function} callBack after textArray completes
   */
  loose (textArray, callBack) {
    this.head.frameName = this.name + '_head_lost.png'
    this.fightArm.animations.play('loose')
    this.game.time.events.add(3000, this.onLooseTimerComplete, this, {textArray: textArray, callBack: callBack})
  }

  /**
   * Called after loose-pose timer has completed
   * @param {object} args with textArray and callBack
   */
  onLooseTimerComplete (args) {
    this.say(args.textArray, args.callBack)
  }

  /**
   * Called on stop moving
   * @param {function} callBack on tween end
   */
  onFightMoveTweenEnd (callBack) {
    this.fightArm.animations.stop('fight')
    this.waveArm.animations.stop('fight')
    this.legs.animations.stop('fight')

    if (callBack) {
      callBack()
    }
  }

  /**
   * Invoked when all textlines are played
   * @returns {*}
   */
  endSpeech () {
    this.textLineCount++
    this.head.animations.stop('talk')
    this.head.frameName = this.name + '_head_idle.png'
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
