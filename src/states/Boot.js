import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.game.stage.backgroundColor = "#312352"
  }

  preload () {
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  render () {
    this.state.start('Splash')
  }
}
