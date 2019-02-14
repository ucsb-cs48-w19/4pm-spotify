# 4pm-blue-spotify

# Spartify

## Project summary

### One-sentence description of the project

A Shared Spotify Queue for Music Collaboration

### Additional information about the project

Tired of listeing to some frat bro play Mo Bamba at parties and ignoring your requests? Want to listen to some of your music? Well now you can! With the Spartify app, everyone is on aux. Add songs to a party queue and listen to what you want to hear.


## Installation

### Prerequisites

Node.js,
React-Native,
Expo
Spotify Premium Account
iOS Device

### Gems

None

### Installation Steps

Run the following commands to install expo and react:

`npm install -g expo-cli`

`npm install -g react-native`

`npm install -g react-native-cli`

new instructions:

INSTALL nav bar tool:

`npm install react-native-navbar --save`

https://github.com/react-native-community/react-native-navbar#examples

INSTALL navigation tool for multi-page:

`npm install --save react-navigation`

https://facebook.github.io/react-native/docs/navigation

## How to Use MVP

1) Follow the installation steps above
2) Download the Expo Client app on your smartphone if you don't have an ios simulator on your device
3) Clone this repo to your device
4) cd into the cloned repo on your device
5) Create a Spotify Developer Account (You must have a spotify premium account for this to work)
6) Copy your new client id from the your developer account and paste it into the "CLIENT_ID" variable in 
   screens/Homescreen.js and screens/Linkscreen.js.  Then, in your spotify developer account, go to settings and copy/paste https://auth.expo.io/[your expo username]/Spartify-Queue, substituting your expo username for [your expo username]
   into the "Redirect URIs" section.
8) cd to Spartify-Queue
9) Open the spotify app with your premium account logged in on your device 
10) Run "expo start" and scan the QR code when it comes up to build and launch the app on your smartphone or run it on an iOS simulator if you have one
11) On the homepage, follow the steps to sign in to your spotify account
12) Using the navbar on the bottom of the screen, go to the linkscreen page where you will see a list of song URIs.
13) Tap any of the song URIs in this list and treat your ears to Rick Astley's classic "Never Gonna Give You Up"
14) If it says your device isn't active, try going back to your spotify app and playing a song and then pausing it to activate it and
    then tap a URI again and it should start playing.

## Functionality

Sign in to Spotify. Then create hosted queue, share your collaboration code with others, and manage music contributions. 

## Known Problems

TODO: Describe any known issues, bugs, odd behaviors or code smells. 
Provide steps to reproduce the problem and/or name a file or a function where the problem lives.


## Contributing

TODO: Leave the steps below if you want others to contribute to your project.

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT license: <https://choosealicense.com/licenses/mit/>