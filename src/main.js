import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import CombatState from './states/Combat'
import IntroState from './states/Intro'
import MapState from './states/Map'
import OutroState from './states/Outro'
import StartScreen from './states/StartScreen'


import config from './config'
import DialogService from './dialogService'
import InsultCollectionService from './insultCollectionService'

class Game extends Phaser.Game {
  constructor () {
    const width = config.gameWidth
    const height = config.gameHeight

    super(width, height, Phaser.AUTO, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Intro', IntroState, false)
    this.state.add('Map', MapState, false)
    this.state.add('Combat', CombatState, false)
    this.state.add('Outro', OutroState, false)
    this.state.add('StartScreen', StartScreen, false)

    // Instantiate stateless services
    this.dialogService = new DialogService()
    this.insultCollectionsService = new InsultCollectionService()

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot')
    }
  }
}

window.game = new Game()

/**
 * CORDOVA
 */

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  }

  app.initialize()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}
