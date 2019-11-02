import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.game.stage.backgroundColor = '#312352'
  }

  preload () {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.pageAlignHorizontally = this.game.scale.pageAlignVertically = true
  }

  create () {
    this.createAssets()
    this.registerSignals()
    this.start()
  }

  createAssets () {
    this.introText = this.game.add.bitmapText(400, 300, 'gameFont', 'z Bärn ir Autstadt...', 18)
    this.introText.anchor.x = this.introText.anchor.y = 0.5

    this.startButton = this.game.add.button(400, 300, 'startButton', this.onStartButtonClick, this, 1, 0, 0)
    this.startButton.anchor.x = this.startButton.anchor.y = 0.5

    this.mouseCursor = this.game.add.sprite(-100, -100, 'figures', 'cursor.png')
    this.mouseCursor.anchor.setTo(0.5, 0.5)
  }

  onStartButtonClick () {
    this.introText.visible = true;
    this.startButton.visible = false;

    this.introText.alpha = 0;

    const introTextTween = this.game.add.tween(this.introText).to( { alpha: 1 }, 2000, 'Linear', true)
    introTextTween.yoyo(true, 3000)
    introTextTween.onComplete.add( this.onIntroTextTweenComplete, this)
  }

  onIntroTextTweenComplete () {
    this.game.state.start('Intro')
  }

  registerSignals() {
    this.game.input.addMoveCallback(function (pointer, x, y) {
      this.mouseCursor.x = x
      this.mouseCursor.y = y
    }, this)
  }

  start () {
    this.introText.visible = false
  }
}
