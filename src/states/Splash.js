import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    this.game.stage.backgroundColor = '#312352'
  }

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    // JSON
    this.load.json('text', 'assets/gamedata/text.json')
    this.load.json('dialog', 'assets/gamedata/dialog.json')
    // Fonts
    this.game.load.bitmapFont('gameFont', 'assets/font/font.png', 'assets/font/font.fnt')
    // Sprites
    this.load.atlas('gameAssets', 'assets/spriteSheets/gameAssets.png', 'assets/spriteSheets/gameAssets.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
    this.load.atlas('figures', 'assets/spriteSheets/figuresSpritesheet.png', 'assets/spriteSheets/figuresSpritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
    this.load.spritesheet('startButton', 'assets/spriteSheets/startButton.png', 152, 48)

    // Images
    this.load.image('backgroundCombat', 'assets/spriteSheets/combat_background_800x600.png')
    this.load.image('map', 'assets/spriteSheets/map_800x600.jpg')
    this.load.image('player_map', 'assets/spriteSheets/player-map-16x36.png')
    this.load.image('markus_map', 'assets/spriteSheets/markus-map-16x36.png')
    this.load.image('damian_map', 'assets/spriteSheets/damian-map-16x36.png')
    this.load.image('stefan_map', 'assets/spriteSheets/stefan-map-16x36.png')
    this.load.image('yoda_map', 'assets/spriteSheets/yoda-map-16x36.png')
    this.load.image('muensterMap', 'assets/spriteSheets/map_muenster.png')
  }

  create () {
    const textObject = this.game.cache.getJSON('text')
    const dialogObject = this.game.cache.getJSON('dialog')

    this.game.dialogService.setTextObject(textObject)
    this.game.dialogService.setDialogObject(dialogObject)

    this.state.start('StartScreen')
  }
}
