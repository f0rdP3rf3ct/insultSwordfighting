import Phaser from 'phaser'

export default class extends Phaser.BitmapText {

  constructor ({game, x, y, option}) {
    super(game, x, y, 'gameFont', option ? option.text : '', 14)

    this.option = option
    this.inputEnabled = true
    this.input.priorityID = 1000

    this.STATES = {
      NONE: 1,
      HOVER: 2
    }
    this.state = this.STATES.NONE
  }

  setDialogOption (option) {
    this.option = option
    this.setText(option.text)
  }

  update () {
    this.tint = 0xFFFFFF
    this.state = this.STATES.NONE

    if (this.input.pointerOver()) {
      if (this.state !== this.STATES.HOVER) {
        this.tint = 0x00FFFF
        this.state = this.STATES.HOVER
      }
    }
  }
}
