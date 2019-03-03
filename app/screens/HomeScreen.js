import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const CLIENT_ID = '09b7b0f745014fb0950ee5bf040fbe3a';

export default class App extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  state = {
    userInfo: null,
    didError: false
  };

  handleSpotifyLogin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    var scope = 'playlist-read-private user-modify-playback-state user-read-recently-played user-read-currently-playing app-remote-control user-read-playback-state streaming user-library-read user-read-email';
    let results = await AuthSession.startAsync({
      authUrl: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scope)}&response_type=token`
    });
    if (results.type !== 'success') {
      console.log(results.type);
      this.setState({ didError: true });
    } else {
      const userInfo = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          "Authorization": `Bearer ${results.params.access_token}`
        }
      });
      try {
        await AsyncStorage.setItem('Authorization', `Bearer ${results.params.access_token}`);
      } catch (error) {
        // Error saving data
      }
      this.setState({ userInfo: userInfo.data });
    }
  };

  displayError = () => {
    return (
      <View style={styles.userInfo}>
        <Text style={styles.errorText}>
          There was an error, please try again.
        </Text>
      </View>
    );
  }

  displayResults = () => {
    { return this.state.userInfo ? (
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.userInfoText}>
            Username: {this.state.userInfo.id}
          </Text>
          <Text style={styles.userInfoText} >
            Email: {this.state.userInfo.email}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.userInfo}></View>
    )}
  }

  render() {
    return (
      <View style={styles.container}>
        <FontAwesome
          name="spotify"
          color="#2FD566"
          size={128}
        />
        <TouchableOpacity
          hide={this.state.userInfo ? true : false}
          style={styles.button}
          onPress={this.handleSpotifyLogin}
          disabled={this.state.userInfo ? true : false}
        >
          <Text style={styles.buttonText}>
            Login with Spotify
          </Text>
        </TouchableOpacity>

        {
          this.state.didError ?
          this.displayError() :
          this.displayResults()
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2FD566',
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20
  },
  userInfo: {
    height: 250,
    width: 200,
    alignItems: 'center',
    textAlign: 'center',
  },
  userInfoText: {
    color: '#bcbcbc',
    fontSize: 18,
    width: '100%',
    padding: 10
  },
  errorText: {
    color: '#fff',
    fontSize: 18
  },
  profileImage: {
    height: 64,
    width: 64,
    marginBottom: 32
  }
});
