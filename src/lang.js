import idiom from 'idiom.js'

const lang = idiom({
  'default': {
    'welcome': 'Welcome to SW: Insult Fighting'
  },
  'DE-ch': {
    'welcome': 'Welcome to SW: Insult Fighting'
  }
})

export default lang(window.navigator.language)
