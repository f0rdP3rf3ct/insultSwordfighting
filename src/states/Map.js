/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

  init () {
    // Static background
    this.background = this.add.sprite(0, 0, 'map')
    this.backgroundSound = this.game.add.audio('backgroundSound', 1)

    // const
    this.ENEMY_SPAWN_SEED = ['damian', 'markus', 'stefan']
    this.ENEMY_SPAWN_TARGET_NAVPOINTS = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm']
    this.MAP_FONT = 'gameFont'
    this.MAP_FONT_SIZE = 16
    this.SPAWN_ENEMY_RATE_SEC = Phaser.Timer.SECOND * 7
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
  }

  createAssets () {
    // NavPoints
    this.navPoints = {
      a: {x: 130, y: 457},
      b: {x: 142, y: 347},
      c: {x: 148, y: 250},
      d: {x: 277, y: 250},
      e: {x: 367, y: 252},
      f: {x: 622, y: 245},
      g: {x: 791, y: 232},
      h: {x: 636, y: 291},
      i: {x: 387, y: 327},
      k: {x: 276, y: 337},
      l: {x: 215, y: 337},
      m: {x: 215, y: 297}
    }

    // NavPoint Lookup
    this.navJoints = {
      a: {a: 'a', b: 'b', c: 'b', d: 'b', e: 'b', f: 'b', g: 'b', h: 'b', i: 'b', k: 'b', l: 'b', m: 'b'},
      b: {a: 'a', b: 'b', c: 'c', d: 'c', e: 'c', f: 'c', g: 'c', h: 'l', i: 'l', k: 'l', l: 'l', m: 'l'},
      c: {a: 'b', b: 'b', c: 'c', d: 'd', e: 'd', f: 'd', g: 'd', h: 'd', i: 'd', k: 'd', l: 'b', m: 'b'},
      d: {a: 'k', b: 'k', c: 'c', d: 'd', e: 'e', f: 'e', g: 'e', h: 'e', i: 'k', k: 'k', l: 'k', m: 'k'},
      e: {a: 'd', b: 'd', c: 'd', d: 'd', e: 'e', f: 'f', g: 'f', h: 'f', i: 'i', k: 'd', l: 'd', m: 'd'},
      f: {a: 'h', b: 'h', c: 'e', d: 'e', e: 'e', f: 'f', g: 'g', h: 'h', i: 'h', k: 'h', l: 'h', m: 'h'},
      g: {a: 'f', b: 'f', c: 'f', d: 'f', e: 'f', f: 'f', g: 'g', h: 'f', i: 'f', k: 'f', l: 'f', m: 'f'},
      h: {a: 'i', b: 'i', c: 'f', d: 'f', e: 'f', f: 'f', g: 'f', h: 'h', i: 'i', k: 'i', l: 'i', m: 'i'},
      i: {a: 'k', b: 'k', c: 'k', d: 'k', e: 'k', f: 'h', g: 'h', h: 'h', i: 'i', k: 'k', l: 'k', m: 'k'},
      k: {a: 'l', b: 'l', c: 'l', d: 'd', e: 'd', f: 'd', g: 'i', h: 'i', i: 'i', k: 'k', l: 'l', m: 'l'},
      l: {a: 'b', b: 'b', c: 'b', d: 'k', e: 'k', f: 'k', g: 'k', h: 'k', i: 'k', k: 'k', l: 'l', m: 'm'},
      m: {a: 'l', b: 'l', c: 'l', d: 'l', e: 'l', f: 'l', g: 'l', h: 'l', i: 'l', k: 'l', l: 'l', m: 'l'}
    }

    // Create group for enemy sprites and enable for collision
    this.enemyGroup = this.game.add.physicsGroup()
    this.enemyGroup.inputEnableChildren = true

    this.setupPlayer()

    if (!this.checkWinCondition()) {
      this.spawnEnemy()
      this.game.time.events.loop(this.SPAWN_ENEMY_RATE_SEC, this.spawnEnemy, this)
    } else {
      this.spawnYoda()
    }

    this.setupTopLayer()

    // Spawn new enemies every n seconds
    this.backgroundSound.play()
  }

  checkWinCondition () {
    if (typeof this.game.wins !== 'undefined') {
      return this.game.wins.includes('stefan') && this.game.wins.includes('damian') && this.game.wins.includes('markus')
    }
    return false
  }

  setupPlayer () {
    // Player start position
    const startingPoint = this.lookupNavPointCoord('a')

    // Sprite props
    this.playerSprite = this.add.sprite(startingPoint.x, startingPoint.y, 'playerMap')
    this.game.physics.arcade.enable(this.playerSprite)
    this.playerSprite.enableBody = true

    // Tween props
    this.playerSprite.startingNavPoint = 'a'
    this.playerSprite.tweenDuration = 600
    this.playerSprite.destroyOnTarget = false

    this.game.physics.arcade.enable(this.playerSprite)
  }

  spawnEnemy () {
    const randomStartNavPoint = Phaser.ArrayUtils.getRandomItem(this.ENEMY_SPAWN_TARGET_NAVPOINTS)
    const startingPoint = this.lookupNavPointCoord(randomStartNavPoint)

    // Create new enemy
    const enemy = this.add.sprite(startingPoint.x, startingPoint.y, 'playerMap')
    // Register input events
    enemy.events.onInputOver.add(this.onInputOverEnemy, this)
    enemy.events.onInputOut.add(this.onInputOutEnemy, this)
    this.enemyGroup.add(enemy)
    // Tween props
    enemy.startingNavPoint = randomStartNavPoint
    enemy.targetNavPoint = Phaser.ArrayUtils.getRandomItem(this.ENEMY_SPAWN_TARGET_NAVPOINTS)
    enemy.tweenDuration = 4500
    enemy.destroyOnTarget = true

    // get random type
    const type = Phaser.ArrayUtils.getRandomItem(this.ENEMY_SPAWN_SEED)
    enemy.name = type
    enemy.type = type

    this.startNewTweenToNavPoint(enemy, enemy.startingNavPoint, enemy.targetNavPoint, enemy.tweenDuration)
  }

  spawnYoda () {
    const startingPoint = this.lookupNavPointCoord('m')
    const yoda = this.add.sprite(startingPoint.x, startingPoint.y, 'playerMap')
    yoda.events.onInputOver.add(this.onInputOverEnemy, this)
    yoda.events.onInputOut.add(this.onInputOutEnemy, this)
    this.enemyGroup.add(yoda)
    yoda.name = yoda.type = 'yoda'
  }

  /**
   * Top Layer = Sprites that always should be on top
   */
  setupTopLayer () {
    this.muensterSprite = this.add.sprite(283, 272, 'muensterMap')

    // Create BitmapText to display information about sprites
    this.typeText = this.game.add.bitmapText(0, 0, this.MAP_FONT, 'BitmapText', this.MAP_FONT_SIZE)
    this.typeText.visible = false
    this.typeText.anchor.x = 0.5
  }

  /**
   * @param {Phaser.Sprite} sprite
   */
  onNavPointReached (sprite) {
    const reachedNavPoint = sprite.nextNavPoint
    sprite.startingNavPoint = reachedNavPoint

    // Check if the reached navpoint is target - else create new tween
    if (reachedNavPoint !== sprite.targetNavPoint) {
      this.startNewTweenToNavPoint(sprite, sprite.startingNavPoint, sprite.targetNavPoint, sprite.tweenDuration)
    } else {
      if (sprite.destroyOnTarget) {
        this.typeText.visible = false
        sprite.destroy()
      }
    }
  }

  onInputOutEnemy () {
    this.typeText.visible = false
  }

  /**
   * @param {Phaser.Sprite} enemy
   */
  onInputOverEnemy (enemy) {
    // Display information about enemy
    this.typeText.visible = true
    this.typeText.setText(enemy.type)
  }

  /**
   * @param {Phaser.Sprite} player
   * @param {Phaser.Sprite} enemy
   */
  onOverlap (player, enemy) {
    this.backgroundSound.destroy()
    if (enemy.type === 'yoda') {
      this.state.start('Outro')
    } else {
      this.state.start('Combat', true, false, enemy.type)
    }
  }

  /**
   * Start new Tween for Sprite to move between two navPoints
   * @param {Phaser.Sprite} sprite
   * @param {string }startNavPoint
   * @param {string} targetNavPoint
   * @param {number} duration
   */
  startNewTweenToNavPoint (sprite, startNavPoint, targetNavPoint, duration) {
    // Look for next navpoint on way to target
    const nextNavPoint = this.lookupNavJoint(startNavPoint, targetNavPoint)

    if (typeof nextNavPoint === 'undefined') {
      throw console.error('No navPointJoint found. startNavPoint: ' + startNavPoint + ' endNavPoint: ' + targetNavPoint)
    }

    // Get coordinate of next navpoint
    const nextCoord = this.lookupNavPointCoord(nextNavPoint)

    if (typeof nextCoord === 'undefined') {
      throw console.error('No coordinate to navPoint found. navPoint: ' + nextNavPoint + ' coordinate: ' + nextCoord)
    }

    if (typeof sprite === 'undefined') {
      throw console.error('No sprite provided to store navpoint')
    }

    // Store next navpoint on sprite
    sprite.nextNavPoint = nextNavPoint

    sprite.navTween = this.game.add.tween(sprite).to({
      x: nextCoord.x,
      y: nextCoord.y
    }, duration, Phaser.Easing.Linear.In, true)

    sprite.navTween.onComplete.add(this.onNavPointReached, this, sprite)
  }

  /**
   * Get closest navPoint to coordinate
   * @param {object} point
   * @returns {*}
   */
  getClosestNavPoint (point) {
    let distance
    let closest

    // loop through navpoints and find closest to click coordinate
    for (var prop in this.navPoints) {
      if (Object.prototype.hasOwnProperty.call(this.navPoints, prop)) {
        const navPointCoord = this.navPoints[prop]
        const newDistance = Phaser.Math.distance(point.x, point.y, navPointCoord.x, navPointCoord.y)

        if (typeof distance === 'undefined') {
          distance = newDistance
          closest = prop
        }

        if (newDistance < distance) {
          distance = newDistance
          closest = prop
        }
      }
    }

    return closest
  }

  groupAssets () {
  }

  addAssetsToGame () {
    this.mouseCursor = this.game.add.sprite(-100, -100, 'figures', 'cursor.png')
    this.mouseCursor.anchor.setTo(0.5, 0.5)
  }

  registerSignals () {
    this.game.input.addMoveCallback(function (pointer, x, y) {
      this.mouseCursor.x = x
      this.mouseCursor.y = y
      console.log(`x: ${x}  / y: ${y}`)
    }, this)
  }

  /**
   * Get coordinate of navPoint
   * @param {string} navPoint to look up
   * @returns {(object|undefined)}
   */
  lookupNavPointCoord (navPoint) {
    return this.navPoints[navPoint]
  }

  /**
   * Look up next navPoint on way to target
   * @param {string} start
   * @param {string} target
   * @returns {(string|undefined)}
   */
  lookupNavJoint (start, target) {
    return this.navJoints[start][target]
  }

  update () {
    this.game.physics.arcade.collide(this.playerSprite, this.enemyGroup, this.onOverlap, null, this)

    this.typeText.x = this.game.input.mousePointer.x
    this.typeText.y = this.game.input.mousePointer.y + 20

    if (this.game.input.activePointer.isDown) {
      const closestNavPointToClick = this.getClosestNavPoint({
        x: this.mouseCursor.x,
        y: this.mouseCursor.y
      })

      if (typeof this.playerSprite.navTween === 'undefined') {
        this.playerSprite.targetNavPoint = closestNavPointToClick
        this.startNewTweenToNavPoint(this.playerSprite, this.playerSprite.startingNavPoint, this.playerSprite.targetNavPoint, this.playerSprite.tweenDuration)
      }

      if (this.playerSprite.targetNavPoint !== closestNavPointToClick) {
        this.playerSprite.targetNavPoint = closestNavPointToClick
      }

      if (!this.playerSprite.navTween.isRunning) {
        this.playerSprite.targetNavPoint = closestNavPointToClick
        this.startNewTweenToNavPoint(this.playerSprite, this.playerSprite.startingNavPoint, this.playerSprite.targetNavPoint, this.playerSprite.tweenDuration)
      }
    }
  }

  render () {
    if (__DEV__) {
    }
  }
}
