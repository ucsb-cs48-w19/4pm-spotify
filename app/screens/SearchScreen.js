import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, AsyncStorage } from 'react-native';
import axios from 'axios';
const firebase = require('firebase');
const database = firebase.database();
// import {pcode} from '../screens/PartyScreen';
export default class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Add Songs',
  };

  state = {
    searchData: [],
    search : '',
    showSearch: false
  }

  toggleShowSearch = async (value) => {
      this.setState({ showSearch: value });
  }

  searchShit = async (queryData) => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        var q = queryData; var type = 'track'; var market = 'US'; // "type": 'album,track,artist,playlist'
        await axios.get(`https://api.spotify.com/v1/search?q=`+q+`&type=`+type+`&market=`+market,
          {
            headers: {
              authorization: value,
              'Content-Type': 'application/json'
            },
            // data: JSON.stringify({  "q": 'abba', "type": 'track', "market": 'US'  }),
          })
          .then(response => {
            this.state.searchData = [];
            for(i = 0; i < response.data.tracks.items.length; i++) {
              this.state.searchData.push( { "name": response.data.tracks.items[i].name, "artist": response.data.tracks.items[i].artists[0].name, "uri": response.data.tracks.items[i].uri} );
            }
            // https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
            // https://reactjs.org/docs/react-component.html#forceupdate
            this.forceUpdate();
          })
      }
    } catch (error) {
      console.log("Error retrieving data: ", error);
    };
  };

  onSearch = async (searchResult) => {
    if (searchResult.nativeEvent.text == "")
      return;

    console.log("search: ", searchResult.nativeEvent.text);
    
    this.setState({ search: searchResult.nativeEvent.text });
    // this.setState({search: searchResult.nativeEvent.text }, () => { this.searchShit(searchResult.nativeEvent.text); });
    this.searchShit(searchResult.nativeEvent.text);
  }
  showSearch = async () => {
    this.toggleShowSearch(true);
  }
  cancelSearch = async () => {
    this.toggleShowSearch(false);
    this.textInput.clear();
    this.state.searchData = [];
    // https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
    // https://reactjs.org/docs/react-component.html#forceupdate
    this.forceUpdate();
  }

  sendSongToQueue = async (song) => {
    console.log("Sending song: ",song);
    var isJoined = await AsyncStorage.getItem("isJoined");
    console.log("isJoined", isJoined);
    if (isJoined == '0'){
      console.log("ppoo");
      var joined = false; }
    else
      var joined = true;
    console.log("isJoined", isJoined);
    console.log("joined", joined);
    if (joined)
      var pcode = await AsyncStorage.getItem("partyCode");
    else
      var pcode = await AsyncStorage.getItem("pcode");

    var songRef = database.ref().child("parties/" +pcode).push().key;
    database.ref().child("parties/" +pcode).push({
      title: song.name,
      artist: song.artist,
      uri: song.uri,
    });

  }

  render() {
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={{flexDirection:'row', backgroundColor:"#fcfcfc"}}>
          <TextInput
            placeholder="Search Spotify"
            onSubmitEditing={this.onSearch}
            onFocus={this.showSearch}
            returnKeyLabel="Search"
            returnKeyType="search"
            ref={input => { this.textInput = input }}
            style={{ width: this.state.showSearch ? '86%' : '100%', textAlign: 'center', padding: 10 }}
          />
          <TouchableOpacity hide={this.state.showSearch ? false : true} onPress={() => this.cancelSearch()}>
            <Text style={{ width: '100%', textAlign: 'center', padding: 10, fontSize: 17, color: "gray" }}>    X</Text>
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:"white"}}>
          <FlatList
            data={this.state.searchData}
            extraData={this.state.searchData}
            keyExtractor={ (item, index) => index.toString() }
            renderItem={({item, index}) => {
              return(
                <TouchableOpacity onPress={() => this.sendSongToQueue(item)}>
                  <Text style={styles.item}>{item.name}</Text>
                  <Text style={styles.itemartist}>{item.artist}</Text>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
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
});


