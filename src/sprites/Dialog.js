import Phaser from 'phaser'
import DialogOption from './DialogOption'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, textOptions}) {
    super(game, x, y)

    this.options = []
    this.dialogOptionClickedSignal = new Phaser.Signal()

    this.SHOW_OPTIONS = 4
    this.optionDisplayObjects = []

    this.next = 0

    if (textOptions !== null) {
      this.setDialogOptions(textOptions)
    }

    this.createOptionSlots()
    this.createButtons()
  }

  /**
   * Create slots for the DialogOptions
   */
  createOptionSlots () {
    for (let i = 0; i < this.SHOW_OPTIONS; i++) {
      const opt = new DialogOption({game: this.game, x: 100, y: i * 30, option: null})
      this.addChild(opt)
      this.optionDisplayObjects.push(opt)
    }
  }

  createButtons () {
    this.upButton = this.game.add.button(0, 0, 'gameAssets', this.onArrowUpClick, this, 'arrow_up', 'arrow_up', 'arrow_up')
    this.downButton = this.game.add.button(0, 50, 'gameAssets', this.onArrowDownClick, this, 'arrow_down', 'arrow_down', 'arrow_down')

    this.upButton.x = 30
    this.downButton.x = 30

    this.upButton.visible = false
    this.downButton.visible = false

    this.addChild(this.upButton)
    this.addChild(this.downButton)
  }

  onArrowUpClick () {
    this.next = this.next - 1
    this.assignOptions(this.next)
  }

  onArrowDownClick () {
    this.next = this.next + 1
    this.assignOptions(this.next)
  }

  /**
   * Calculates dialog options that are shown.
   * @param {number} startIndex of available text options
   */
  assignOptions (startIndex) {
    let optionIndex = 0

    if (startIndex + this.SHOW_OPTIONS >= this.options.length) {
      this.downButton.visible = false
    } else {
      this.downButton.visible = true
    }

    if (startIndex + this.SHOW_OPTIONS <= this.SHOW_OPTIONS) {
      this.upButton.visible = false
    } else {
      this.upButton.visible = true
    }

    for (let i = startIndex; i < startIndex + this.SHOW_OPTIONS; i++) {
      if (this.options[i]) {
        let opt = this.optionDisplayObjects[optionIndex]
        opt.setDialogOption(this.options[i])

        let nextOption = this.optionDisplayObjects[optionIndex + 1]

        const dialogOffset = 10

        if (typeof nextOption !== 'undefined') {
          nextOption.y = opt.y + opt.height + dialogOffset
        }

        // Register new option with DialogOption
        opt.events.onInputUp.removeAll()
        opt.events.onInputUp.add(this.handleInputUpEvent, this, 0, {optionId: this.options[i].id})

        optionIndex++
      } else {
        let opt = this.optionDisplayObjects[optionIndex]
        opt.setDialogOption({text: ''})
      }
    }
  }

  /**
   * Set all OptionDisplayObjects to empty text
   */
  resetOptionDisplayObjects () {
    this.optionDisplayObjects.forEach(optionDisplayObject => optionDisplayObject.setDialogOption({text: ''}))
    this.next = 0
  }

  /**
   * Erase old Dialog options and create a new set
   * @param options {array}
   */
  setDialogOptions (options) {
    this.resetOptionDisplayObjects()
    this.options = options
    this.assignOptions(0)
  }

  /**
   * Dispatches signal that player has chosen a text option
   * @param {number} optionId chosen text option
   */
  handleInputUpEvent (optionId) {
    const args = arguments[3]
    this.dialogOptionClickedSignal.dispatch(args.optionId)
  }

  /**
   * Return dialogOptionClickedSignal
   */
  getDialogOptionClickedSignal () {
    return this.dialogOptionClickedSignal
  }

  update () {
    for (let child of this.children) {
      child.update()
    }
  }
}
