# Spartify

<a href="https://travis-ci.org/ucsb-cs48-w19/4pm-spotify">
<img src="https://travis-ci.org/ucsb-cs48-w19/4pm-spotify.svg?branch=master" alt="Build Status">
</a>

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

npm install

npm install --save expo-cli

### Running Steps

In the app directory, run the following commands to being development and running on your device:

expo start

## How to Use MVP

1) Download the Expo Client app on your smartphone if you don't have an ios simulator on your device
2) Clone this repo to your device
3) cd into the cloned repo on your device then cd into app
4) Follow the installation steps above
5) Create a Spotify Developer Account (You must have a spotify premium account for this to work)
6) Copy your new client id from the your developer account and paste it into the "CLIENT_ID" variable in 
   screens/Homescreen.js.  Then, in your spotify developer account, go to settings and copy/paste https://auth.expo.io/@[your expo username]/Spartify-Queue, substituting your expo username for [your expo username]
   into the "Redirect URIs" section.
9) Open the spotify app with your premium account logged in on your device 
10) Run "expo start" and scan the QR code when it comes up to build and launch the app on your smartphone or run it on an iOS simulator if you have one. Toggle between LAN and Tunnel if you have problems.
11) On the homepage, follow the steps to sign in to your spotify account
12) Using the navbar on the bottom of the screen, go to the Party queue page where you will join or host a party and then see a list of songs in the party.
13) As the host, tap any of the song URIs in this list and treat your ears to this lovely, diverse playlist of songs
14) Navigate to the Serach page in order to find and add new songs to the queue.
14) If it says your device isn't active, try going back to your spotify app and playing a song and then pausing it to activate it and then tap a URI again and it should start playing.

## Functionality

Sign in to Spotify. Then create hosted queue, share your collaboration code with others, and manage music contributions. 

## Known Problems

TODO: Describe any known issues, bugs, odd behaviors or code smells. 
Provide steps to reproduce the problem and/or name a file or a function where the problem lives.


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

#Unit Testing
site: https://travis-ci.org/ucsb-cs48-w19/4pm-spotify


## License

MIT license: <https://choosealicense.com/licenses/mit/>
