import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';
// import { WebBrowser, AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';  // 'npm install axios --save'
import { MonoText } from '../components/StyledText';

const CLIENT_ID = '09b7b0f745014fb0950ee5bf040fbe3a';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  handleSpotifyLogin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let results = await AuthSession.startAsync({
      authUrl: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=user-read-email&response_type=token`
    });
    // if (results.type !== 'success') {
    //   console.log(results.type);
    //   this.setState({ didError: true });
    // } else {
    //   const userInfo = await axios.get(`https://api.spotify.com/v1/me`, {
    //     headers: {
    //       "Authorization": `Bearer ${results.params.access_token}`
    //     }
    //   });
    //   this.setState({ userInfo: userInfo.data });
    // }
  };

  playSong = async () => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        // We have data:
        console.log("DATA: ", value);
        // fetch("https://api.spotify.com/v1/me/player/play?")
        //   .then((response) => response.json())
        //   .then((responseData) => {
        //     return fetch(api.searchservice + responseData)
        //       .then((response) => response.json())
        //       .then((responseData) => {
        //         console.log("dddd: ", responseData);
        //       })
        //   })
        //   .catch(function (err) {
        //     return err;
        //   });

        fetch("https://api.spotify.com/v1/me/player/play?", {
          method: 'PUT',
          data: '{"uris": ["spotify:track:7lEptt4wbM0yJTvSG5EBof"]}',
          headers: {
            authorization: value,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // "device_ids": [  ],
            // "play": true,
            "uris": ["spotify:track:7lEptt4wbM0yJTvSG5EBof"]
          }),
         })
          // .then (function (response) {console.log( response.json() ); return response.json()})
          // .then(function (json) {console.log(json)/* Here is your json */})
          // .catch(function (error) {console.log(error)/*Handle error*/});
          .then((response) => response.json())
          .then((responseData) => {
            return fetch(/*api.searchservice + */responseData)
              .then((response) => response.json())
              .then((responseData) => {
                console.log(responseData);
              })
          })
          .catch(function (error) {
            console.log(error);
            return error;
          });
        console.log(value);
      }
    } catch (error) {
        console.log("Error retrieving data: ", error);
      // Error retrieving data
    };
    console.log("NO DATA...");

    // $.ajax({
    //    url: "https://api.spotify.com/v1/me/player/play?", //device_id=" + device_id,
    //    type: "PUT",
    //    data: '{"uris": ["spotify:track:5ya2gsaIhTkAuWYEMB0nw5"]}',
    //    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    //    success: function(data) { 
    //      console.log(data)
    //    }
    // });
  }

  loginSpotify() {

  }

  render() {
    return (
      <ScrollView>
      <View>
        <FlatList
          data={[
            {key: 'spotify:track:7lEptt4wbM0yJTvSG5EBof'},
            {key: 'spotify:track:11dFghVXANMlKmJXsNCbNl'},
            {key: 'URI #3'},
            {key: 'Song4'},
            {key: 'Song5'},
            {key: 'Song6'},
            {key: 'Song7'},
            {key: 'Song8'},
          ]}
          // renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
          renderItem={({item}) => {
              return(
                <TouchableHighlight onPress={() => this.playSong()}>
                     <Text >{item.key}</Text>
                </TouchableHighlight>
              )
            }
          }
        />
      </View>
      </ScrollView>
      // <View style={styles.container}>
      //   <FontAwesome
      //     name="spotify"
      //     color="#2FD566"
      //     size={128}
      //   />
      //   <TouchableOpacity
      //     style={styles.button}
      //     onPress={this.handleSpotifyLogin}
      //     disabled={this.state.userInfo ? true : false}
      //   >
      //     <Text style={styles.buttonText}>
      //       Login with Spotify
      //     </Text>
      //   </TouchableOpacity>
      //   {this.state.didError ?
      //     this.displayError() :
      //     this.displayResults()
      //   }
      // </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*justifyContent: 'center',
    alignItems: 'center',*/
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    // color: '#1DB954',
  },
});