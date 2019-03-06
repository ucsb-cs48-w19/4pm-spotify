import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, Text, View, TextInput, Image, ActivityIndicator, AsyncStorage, RefreshControl, ScrollView, FlatList, Refresh, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
const firebase = require('firebase');
const pcode = Math.random().toString(36).substring(7);
export{pcode};
const firebaseConfig = {
    apiKey: "AIzaSyDEy5DxvDRX5vM6t1S_QfKLVFa74asLPq8",
    authDomain: "spartify-queue.firebaseapp.com",
    databaseURL: "https://spartify-queue.firebaseio.com",
    projectId: "spartify-queue",
    storageBucket: "spartify-queue.appspot.com",
    messagingSenderId: "500027844157"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export default class PartyScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    const params = navigation.state.params || {};

    return {
      title:       params.title,
      headerRight: params.headerRight,
    }
  }

  _setDefaultNavigationParams() {
    let title       = 'Join Party';
    let headerRight = null;

    this.props.navigation.setParams({ 
      title,
      headerRight, 
    });
  }

  _setPartyNavigationParams() {
    let title       = 'Active Party';
    let headerRight = (
      <Button
        onPress={this._leaveParty.bind(this)}
        title="Leave"
      />
    )

    this.props.navigation.setParams({ 
      title,
      headerRight, 
    });
  }

  componentWillMount() {
    this._setDefaultNavigationParams();
  }

  _leaveParty() {
    console.log('Leaving current party');
    this.setState({ isJoined: false });
    this.setState({ isHost: false });
    this._setDefaultNavigationParams();
  }

  state = {
    isHost: false,
    isJoined: false,
    refreshing: false,
    nullInputCode: true,
    partycode: 0,

    devices: [],
    // USING SAMPLE DATA, must pull from DB:
    // queueSongs: [],
    queueSongs: [
              {name: 'Your songs here!', artist: ' ', uri: 'spotify:track:7l3E7lcozEodtVsSTCkcaA'},
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

  createParty = async () => {
    var pcode = Math.random().toString(36).substring(7);
    await AsyncStorage.setItem('pcode', pcode);
    this.setState({ partycode: pcode });
    this.partiesRef = database.ref().child('parties').push().key;
    var updates = {};
    updates['/parties/' + pcode] = pcode;
    database.ref().update(updates);

    console.log("Party Created...");
    this.setState({ isHost: true }, () => { this._setPartyNavigationParams(); });
  };

  joinParty = async () => {
    if (this.state.nullInputCode) {
      return;
    }
    const partyCode = await AsyncStorage.getItem("partyCode");
    this.setState({ partycode: partyCode });
    this.state.nullInputCode = true;

    var join;
    database.ref('/parties/' + partyCode).once('value', function(snapshot){
        console.log("snapshot",snapshot.val()); 
        if(snapshot.val() == null){
          console.log("this sucks");
          join = false;
          // this.state.isJoined = false;
        }
        else{
          join = true;
        }
        this.setState({ isJoined: join });
        console.log(this.state.isJoined);
    }.bind(this));
    this._setPartyNavigationParams();
    this.getPartySongs();
  };

  getPartySongs = async () => {
    console.log("retrieving songs...");
    var songs = []; // GET SONGS HERE
    if(this.state.isJoined)
      var pcode = await AsyncStorage.getItem("partyCode");
    else if(this.state.isHost)
      var pcode = await AsyncStorage.getItem("pcode");

    database.ref('/parties/' + pcode).once('value', function(snapshot){
      let data = snapshot.val();
      if (data != null){
        let items = Object.values(data);
        for(let i =0; i<items.length; i++){
          let item = Object.values(items[i]);
          songs.push({"name": item[1], "artist": item[0], "uri": item[2]});
        }
      }
    });
    this.setState({ 
      refreshing: false, 
      queueSongs: songs 
    });
  }

  setCode = async (codeResult) => {
    if (codeResult.nativeEvent.text == "")
      return;
    // console.log("codeResult.nativeEvent.text, ", codeResult.nativeEvent.text);
    this.state.nullInputCode = false;
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
        <View style={styles.container}>
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
        </View>
        </ScrollView>
      );
    } else {
      return (
        <View style={{flex:1}}>
          <View style={styles.userInfo}>
            <View>
              <Text style={styles.userInfoText}>
                Your Shareable Party Code: {this.state.partycode}
              </Text>
            </View>
          </View>
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
