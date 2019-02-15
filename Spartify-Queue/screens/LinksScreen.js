import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';
// import { WebBrowser, AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';  // 'npm install axios --save'
import { MonoText } from '../components/StyledText';

const CLIENT_ID = '1b256be8537d49249f3785fd1c05012c';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    devices: []
  }

  getDevice = async (uri) => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        // fetch("https://api.spotify.com/v1/me/player/devices", {
        //   method: 'GET',
        //   headers: { authorization: value, },
        //  }) .then(function (json) { })
        await axios.get(`https://api.spotify.com/v1/me/player/devices`, { headers: { authorization: value } })
        .then(response => {
          this.setState({ devices: response.data.devices });
          console.log(response.data.devices);
          if (this.state.devices[0]) {
            console.log(this.state.devices[0].id);
            this.playSong(this.state.devices[0].id, uri);
          }
          else
            this.playSong("", uri);
        })

      }
    } catch (error) {
      console.log("Error retrieving data: ", error);
      // Error retrieving data
    };
  }

  playSong = async (device_id, uri) => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        // We have data:
        console.log("DATA: ", value);

        fetch("https://api.spotify.com/v1/me/player/play", {
          method: 'PUT',
          // data: {
          //   uris: ["spotify:track:7lEptt4wbM0yJTvSG5EBof"]
          // },
          headers: {
            authorization: value,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "device_ids": [ device_id ],
            "play": true,
            "uris": [uri]
          }),
         })
          // .then (function (response) {console.log( response.json() ); return response.json()})
          .then(function (json) {console.log(json)/* Here is your json */})
          // .catch(function (error) {console.log(error)/*Handle error*/});

          // .then((response) => response.json())
          // .then((responseData) => {
          //   return fetch(/*api.searchservice + */responseData)
          //     .then((response) => response.json())
          //     .then((responseData) => {
          //       console.log(responseData);
          //     })
          // })
          // .catch(function (error) {
          //   console.log(error);
          //   return error;
          // });
      }
    } catch (error) {
        console.log("Error retrieving data: ", error);
      // Error retrieving data
    };

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

  render() {
    return (
      <ScrollView>
      <View style={styles.container}>
        <FlatList
          data={[
            {name: 'ZEZE', key: 'spotify:track:7l3E7lcozEodtVsSTCkcaA'},
            {name: 'Love it', key: 'spotify:track:4S8d14HvHb70ImctNgVzQQ'},
            {name: 'Digits', key: 'spotify:track:4cg1yakyRSIOjxKM2I7J1q'},
            {name: 'FML', key: 'spotify:track:34kRg5EbCB3r20QXZbnGeY'},
            {name: 'Champions', key: 'spotify:track:7ccI9cStQbQdystvc6TvxD'},
          ]}
          // renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
          renderItem={({item}) => {
              return(
                <TouchableHighlight onPress={() => this.getDevice(item.key)}>
                     <Text style={styles.item}>{item.name}</Text>
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
    fontSize: 20,
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
