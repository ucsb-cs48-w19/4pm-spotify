import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, AsyncStorage } from 'react-native';
import { AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const CLIENT_ID = '1b256be8537d49249f3785fd1c05012c';

export default class App extends Component {
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

        // <Image
        //   style={styles.profileImage}
        //   source={ {'uri': this.state.userInfo.images[0].url} }
        // />

  displayResults = () => {
    { return this.state.userInfo ? (
      <View style={styles.userInfo}>
        <View>
          <Text style={styles.userInfoText}>
            Username:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.userInfo.id}
          </Text>
          <Text style={styles.userInfoText}>
            Email:
          </Text>
          <Text style={styles.userInfoText}>
            {this.state.userInfo.email}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>
          Login to Spotify to see user data.
        </Text>
      </View>
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
          style={styles.button}
          onPress={this.handleSpotifyLogin}
          disabled={this.state.userInfo ? true : false}
        >
          <Text style={styles.buttonText}>
            Login with Spotify
          </Text>
        </TouchableOpacity>
        {this.state.didError ?
          this.displayError() :
          this.displayResults()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: '#2FD566',
    padding: 20
  },
  buttonText: {
    color: '#000',
    fontSize: 20
  },
  userInfo: {
    height: 250,
    width: 200,
    alignItems: 'center',
  },
  userInfoText: {
    color: '#fff',
    fontSize: 18
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
