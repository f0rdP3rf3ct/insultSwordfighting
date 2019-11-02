import Phaser from 'phaser'
import Yoda from '../sprites/Yoda'
import Jedi from '../sprites/Jedi'

export default class extends Phaser.State {

  preload () {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.pageAlignHorizontally = this.game.scale.pageAlignVertically = true
  }

  init () {
    this.game.stage.backgroundColor = '#312352'
  }

  create () {
    this.createAssets()
    this.addAssetsToGame()
    this.start()
  }

  createAssets () {
    this.yoda = new Yoda({
      game: this.game,
      x: this.world.centerX + 120,
      y: this.world.centerY - 50,
      speechColor: '0x00FF00'
    })

    this.yoda.anchor.setTo(0.5, 0.5)

    this.player = new Jedi({
      game: this.game,
      name: 'marc',
      x: this.world.centerX - 120,
      y: this.world.centerY - 50
    })

    this.yoda.create()
    this.player.create()
  }

  addAssetsToGame () {
    this.game.add.existing(this.yoda)
    this.game.add.existing(this.player)

    // Mirror Player sprites
    this.player.scale.x *= -1
    this.player.dialog.scale.x *= -1
  }

  start () {
    this.player.fightArm.loadTexture('figures', 'marc_arm_wave_r_02.png')
    const textObject = this.game.dialogService.getTextObject(19)
    this.yoda.say(textObject.text, this.onYodaSpeechEnd.bind(this))
  }

  onYodaSpeechEnd () {
    this.player.waveArm.animations.play('fight')
    this.player.fightArm.animations.play('talk', 6, true)
    const textObject = this.game.dialogService.getTextObject(20)
    this.player.say(textObject.text, this.onPlayerSpeechEnd.bind(this))
  }

  onYodaSpeechEnd2 () {
    const textObject = this.game.dialogService.getTextObject(21)
    this.yoda.say(textObject.text, this.onPlayerSpeechEnd2.bind(this))
  }

  onPlayerSpeechEnd () {
    this.player.waveArm.animations.stop('fight')
    this.player.fightArm.animations.stop('talk')

    this.onYodaSpeechEnd2()
  }

  onPlayerSpeechEnd2 () {
    this.player.waveArm.animations.stop('fight')
    this.player.fightArm.animations.stop('talk')
    this.game.state.start('StartScreen')
  }

}
