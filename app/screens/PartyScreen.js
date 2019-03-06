import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ActivityIndicator, AsyncStorage, RefreshControl, ScrollView, FlatList, Refresh, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyD-yRFqNXFkeIpfK_mhzZ-sxVwjzsRAnOE",
    authDomain: "spotify-party-queue.firebaseapp.com",
    databaseURL: "https://spotify-party-queue.firebaseio.com",
    projectId: "spotify-party-queue",
    storageBucket: "spotify-party-queue.appspot.com",
    messagingSenderId: "517089269705"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class PartyScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Your Party',
  };

  state = {
    isHost: false,
    isJoined: false,
    refreshing: false,

    devices: [],
    // USING SAMPLE DATA, must pull from DB:
    // queueSongs: [],
    queueSongs: [
              {name: 'ZEZE', artist: 'Travis', uri: 'spotify:track:7l3E7lcozEodtVsSTCkcaA'},
              {name: 'Love it', artist: 'Kanye', uri: 'spotify:track:4S8d14HvHb70ImctNgVzQQ'},
              {name: 'Digits', artist: 'Thug', uri: 'spotify:track:4cg1yakyRSIOjxKM2I7J1q'},
              {name: 'FML', artist: 'Kanye', uri: 'spotify:track:34kRg5EbCB3r20QXZbnGeY'},
              {name: 'Champions', artist: 'Queen', uri: 'spotify:track:7ccI9cStQbQdystvc6TvxD'}
            ]
  };

  getDevice = async (uri) => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        await axios.get(`https://api.spotify.com/v1/me/player/devices`, { headers: { authorization: value } })
        .then(response => {
          this.setState({ devices: response.data.devices });
          console.log(response.data.devices);
          if (this.state.devices[0]) {
            console.log(this.state.devices[0].id);
            this.playSong(this.state.devices[0].id, uri);
          } else
            this.playSong("", uri);
        })
      }
    } catch (error) {
      console.log("Error retrieving data: ", error);
    };
  }

  playSong = async (device_id, uri) => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        console.log("AUTH DATA: ", value);

        fetch("https://api.spotify.com/v1/me/player/play", {
          method: 'PUT',
          // data: { uris: ["spotify:track:7lEptt4wbM0yJTvSG5EBof"] },
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
          .then(function (json) {console.log(json)})
      }
    } catch (error) {
      console.log("Error retrieving data: ", error);
    };
  }

  createParty = () => {
    var rootref = firebaseApp.database().ref();
    let partycode = Math.random().toString(36).substring(7);
    let partyname = "default";
    this.partiesRef = rootref.getRef().child('parties');
    this.partiesRef.push({code: partycode, name: partyname});
    this.setState({ isHost: true });
  };

  joinParty = () => {
    this.setState({ isJoined: true });
  };

  getPartySongs = async () => {
    console.log("retrieving songs...");
     var songs = [{name: 'ZEZE', artist: 'Travis', uri: 'spotify:track:7l3E7lcozEodtVsSTCkcaA'}]; // GET SONGS HERE
    this.setState({ 
      refreshing: false, 
      queueSongs: songs 
    });
  }

  setCode = async (codeResult) => {
    if (codeResult.nativeEvent.text == "")
      return;
    console.log("codeResult.nativeEvent.text, ", codeResult.nativeEvent.text);
    
    await AsyncStorage.setItem('partyCode', `${codeResult.nativeEvent.text}`);
  }

  handleRefresh = async () => {
    console.log("calling handleRefresh");
    this.setState({ 
      queueSongs:[], 
      refreshing: true 
    });
    this.getPartySongs();
  };

  //  OUR OLD PLAY CALL, this call should be used if you are host of playlist, not otherwise:
  // renderItem={({item}) => {
  //     return(
  //       <TouchableHighlight onPress={() => this.getDevice(item.key)}>
  //            <Text style={styles.item}>{item.name}</Text>
  //       </TouchableHighlight>
  //     )
  //   }
  // }

  render() {
    if (this.state.refreshing) {
      return (
        //loading view while data is loading
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    if (!this.state.isHost && !this.state.isJoined) {
      return (
        <ScrollView>
          <TouchableOpacity
            style={styles.buttonHost}
            onPress={this.createParty.bind(this)}
          >
            <Text style={styles.buttonText}>
              Create a Party
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Party Code"
            onSubmitEditing={this.setCode}
            // value={this.state.partyCode}
            // onFocus={this.showSearch}
            returnKeyLabel="Done"
            returnKeyType="done"
            ref={input => { this.textInput = input }}
            style={{ width: '60%', textAlign: 'center', padding: 10, marginTop: 90, backgroundColor: '#efefef', borderRadius:10, borderWidth: 1, borderColor: '#d5d5d5' }}
          />
          <TouchableOpacity
            style={styles.buttonJoin}
            onPress={this.joinParty}
          >
            <Text style={styles.buttonText}>
              Join a Party
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    } else {
      return (
        <View style={{flex:1}}>
        <View style={styles.listcontainer}>
          <View style={{backgroundColor:"white"}}>
            <FlatList
              style={{height: '100%'}}
              data={this.state.queueSongs}
              extraData={this.state.queueSongs}
              keyExtractor={ (item, index) => index.toString() }
              renderItem={({item, index}) => {
                return(
                  <TouchableOpacity onPress={() => this.state.isHost ? this.getDevice(item.uri) : null}>
                    <Text style={styles.item}>{item.name}</Text>
                    <Text style={styles.itemartist}>{item.artist}</Text>
                  </TouchableOpacity>
                )
              }}
              renderSeparator={() => <View style={styles.separator} />}
              refreshControl = {
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                />
              }
            />
          </View>
        </View>
        </View>
      );
    }
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
  },
  listcontainer: {
    flex: 1,
    fontSize: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
  },
  buttonHost: {
    backgroundColor: '#2FD566',
    marginRight:40,
    marginLeft:40,
    marginTop:150,
    paddingTop:20,
    paddingBottom:20,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center'
  },
  buttonJoin: {
    backgroundColor: '#2FD566',
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:20,
    paddingBottom:20,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20
  },
  item: {
    paddingTop: 10,
    paddingLeft: 15,
    fontSize: 15,
    // height: 30,
    // color: '#1DB954',
  },
  itemartist: {
    paddingBottom: 10,
    paddingLeft: 15,
    fontSize: 10,
    // height: 20,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});
