# Phaser CE: Konfigurierbarer Beleidungsschwertkampf in monkey island style

![ingame image](https://battleship.marcgruber.ch/splash.png)

## Features
- Dialogoptionen über JSON konfigurierbar
- Webpack

# Konfigurationen JSON

### /assets/gamedata/text.json

Alle Dialoge sind in text.json abgelegt.
Allgemeine Spieletexte in "gameText" Array:

   - text: Array of strings, welche nacheinander abgespielt werden

    "gameText" : [
        {
            "id": 1,
            "text": ["Hello my name is Peter", "nice to meet you"]
        }

Beleidungstexte in "insultSolutions" Array:
   
   - id: Eine gameText id
   - solutionId: gameText id für erfolgreiches parrieren

    "insultSolutions" : [
        {
            "id": 1001 // gameText id,
            "solutionId": 2001 // Parry gameText id
        }

### /assets/gamedata/dialog.json

Alle Personen-Konfigurationen sind in dialog.json abgelegt

        {
            "name" : "Peter", // name of character
            "textMapping" : [
                {
                    "requestTextIds": [1], // gameText ids recievied from sender
                    "responseTextId" : 2 // response to requestTextId
                },
                {
                  "requestTextIds": [2],
                  "responseTextId" : 12
                }
            ],
            "actionMapping" : [
                {
                    "requestTextIds": [1,4], // gameTest ids recieved from sender
                    "responseAction": "startFight" // action called in response
                },
                {
                    "requestTextIds": [3],
                    "responseAction" : "quit"
                }
            ],
            "looseText" : 9, // gameText id played when combat is lost
            "introText" : 100, // gameText id played on encounter
            "playerOptions" : [1,2,3,4], // gameText ids provided to player to select
            "insultOptions" : [1005,1006,1007,1009], // gameText ids providing insult options for character
            "insultSolutions" : [2001,2002,2003,2005,2007,2009] // gameText ids known parry options
        },

# Setup
Folgende Schritte...

## 1. Dieses Repo klonen:

in Workspace klonen:
```git clone https://github.com/f0rdP3rf3ct/insultSwordfighting.git```

## 2. node.js & npm installieren:

https://nodejs.org/en/


## 3. Dependencies installieren ([yarn](https://yarnpkg.com/)):

Navigate to the cloned repo's directory.

npm:

```npm install``` 

yarn: 

```yarn```

## 4. Dev-Server starten:

Run:

```npm run dev```

http://localhost:3000 um das Spiel anzusehen.
Filewatch & Auto Reload werden gsestartet.


## Build deployment:

Run:

```npm run deploy```

Optmiert und minimized bundles

## Credits
Das Spiel wurde mit dieser Boilerplate umgesetzt:
```git clone https://github.com/lean/phaser-es6-webpack.git```
