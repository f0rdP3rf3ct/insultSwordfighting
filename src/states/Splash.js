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
    this.load.atlas('enemy', 'assets/spriteSheets/enemy.png', 'assets/spriteSheets/enemy.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
    this.load.atlas('figures', 'assets/spriteSheets/figuresSpritesheet.png', 'assets/spriteSheets/figuresSpritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
    // Images
    this.load.image('backgroundCombat', 'assets/spriteSheets/combat_background_800x600.png')
    this.load.image('map', 'assets/spriteSheets/map_800x600.jpg')
    this.load.image('playerMap', 'assets/spriteSheets/player-map-16x36.png')
    this.load.image('muensterMap', 'assets/spriteSheets/map_muenster.png')
  }

  create () {

    const textObject = this.game.cache.getJSON('text')
    const dialogObject = this.game.cache.getJSON('dialog')

    this.game.dialogService.setTextObject(textObject)
    this.game.dialogService.setDialogObject(dialogObject)

    this.state.start('Intro')
  }
}
