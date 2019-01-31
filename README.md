# 4pm-blue-spotify

# Spartify

## Project summary

### One-sentence description of the project

A Shared Spotify Queue for Music Collaboration

### Additional information about the project

Tired of listeing to some frat bro play Mo Bamba at parties and ignoring your requests? Want to listen to some of your music? Well now you can! With the Spartify app, everyone is on aux. Add songs to a party queue and listen to what you want to hear.


## Installation

### Prerequisites

Node.js
React-Native
Expo

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

INSTALL SPOTIFY MODULE:

To add the Spotify SDK to your project, cd into your project directory and run the following commands:

`npm install --save rn-spotify-sdk`

`react-native link react-native-events`

`react-native link rn-spotify-sdk`

MANUALLY ADD SPOTIFY FRAMEWORKS for iOS within Xcode (if they do not already exist):

Manually add the frameworks from node_modules/rn-spotify-sdk/ios/external/SpotifySDK to Linked Frameworks and Libraries in your project settings. Then add ../node_modules/rn-spotify-sdk/ios/external/SpotifySDK to Framework Search Paths in your project settings.

LAUNCH PROJECT with the following steps:

cd into project folder

Run `npm start` and launch through expo or iOS similator

## Functionality

Sign in to Spotify. Then create hosted queue, share your collaboration code with others, and manage music contributions.

## Known Problems

Make sure to use your local node_modules folder. To refresh the folder copy the rn-spotify folder within node_modules, then delete node_modules and run 'npm install' within the folder. Then drop rn-spotify folder back inside if it has been removed.

Ensure your frameworks path is local to your computer.

Launch error:

https://stackoverflow.com/questions/44219152/react-native-launchpackager-command-cant-be-opened

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
