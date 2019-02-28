import React from 'react';
import { Image, Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { WebBrowser, AuthSession } from 'expo';
// import { WebBrowser, AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    devices: [],
    // USING SAMPLE DATA, must pull from DB:
    // queueSongs: [],
    queueSongs: [
              {name: 'ZEZE', artist: 'Travis', uri: 'spotify:track:7l3E7lcozEodtVsSTCkcaA'},
              {name: 'Love it', artist: 'Kanye', uri: 'spotify:track:4S8d14HvHb70ImctNgVzQQ'},
              {name: 'Digits', artist: 'Thug', uri: 'spotify:track:4cg1yakyRSIOjxKM2I7J1q'},
              {name: 'FML', artist: 'Kanye', uri: 'spotify:track:34kRg5EbCB3r20QXZbnGeY'},
              {name: 'Champions', artist: 'Queen', uri: 'spotify:track:7ccI9cStQbQdystvc6TvxD'}
            ],
    searchData: [],
    search : '',
    showSearch: false
  }

  toggleShowSearch = async (value) => {
      this.setState({ showSearch: value });
  }

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
          }
          else
            this.playSong("", uri);
        })

      }
    } catch (error) {
      console.log("Error retrieving data: ", error);
    };
  }

  searchShit = async (queryData) => {
    try {
      const value = await AsyncStorage.getItem('Authorization');
      if (value !== null) {
        var q = 'abba'; var type = 'track'; var market = 'US'; // "type": 'album,track,artist,playlist'
        await axios.get(`https://api.spotify.com/v1/search?q=`+q+`&type=`+type+`&market=`+market,
          {
            headers: {
              authorization: value,
              'Content-Type': 'application/json'
            },
            // data: JSON.stringify({  "q": 'abba', "type": 'track', "market": 'US'  }),
          })
          .then(response => {
            // console.log("response: \n", response.data);
            this.state.searchData = [];
            for(i = 0; i < response.data.tracks.items.length; i++) {
              this.state.searchData.push( { "name": response.data.tracks.items[i].name, "artist": response.data.tracks.items[i].artists[0].name, "uri": response.data.tracks.items[i].uri } );
              // dataArray[response.data.tracks.items[i]] = [response.data.tracks.items[i].name, response.data.tracks.items[i].artists[0].name, response.data.tracks.items[i].uri];
            }
            // this.setState({ searchedData: dataArray });
            console.log(this.state.searchData);

            // https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
            // https://reactjs.org/docs/react-component.html#forceupdate
            this.forceUpdate()
          })

      }
    } catch (error) {
      console.log("Error retrieving data: ", error);
      // Error retrieving data
    };
  };

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
      }
    } catch (error) {
        console.log("Error retrieving data: ", error);
      // Error retrieving data
    };
  }

  onSearch = async (val) => {
    let searchText = val.nativeEvent.text;
    this.setState({ search: searchText });
    console.log(this.state.search);
    this.searchShit(this.state.search);
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
    this.forceUpdate()
  }

  sendSongToQueue = async (song) => {
    console.log(song, "\n", song.name, "\n", song.artist, "\n", song.uri);
  }

  getQueueSongs = async () => {
    console.log("retrieving songs...");
    var songs = []; // GET SONGS HERE
    this.setState({ queueSongs: songs });
  }

  // OUR OLD PLAY CALL, this call should be used if you are host of playlist, not otherwise:
  // renderItem={({item}) => {
  //     return(
  //       <TouchableHighlight onPress={() => this.getDevice(item.key)}>
  //            <Text style={styles.item}>{item.name}</Text>
  //       </TouchableHighlight>
  //     )
  //   }
  // }

  render() {
    return (
      <ScrollView>
      <View style={styles.container}>
        <View style={{flexDirection:'row', backgroundColor:"white"}}>
          <TextInput
            placeholder="Search Spotify"
            onSubmitEditing={this.onSearch}
            onFocus={this.showSearch}
            // onCancel={this.cancelSearch}
            // onBlur={this.cancelSearch}
            returnKeyLabel="Search"
            returnKeyType="search"
            ref={input => { this.textInput = input }}
            style={{ width: this.state.showSearch ? '80%' : '100%', textAlign: 'center', padding: 10 }}
          />
          <TouchableHighlight hide={this.state.showSearch ? false : true} onPress={() => this.cancelSearch()}>
            <Text style={{ width: '100%', textAlign: 'center', padding: 10, fontSize: 10 }}>Cancel</Text>
          </TouchableHighlight>
        </View>

        <View style={{backgroundColor:"white"}}>
          <FlatList
            data={this.state.showSearch ? this.state.searchData : this.state.queueSongs}
            extraData={this.state.showSearch ? this.state.searchData : this.state.queueSongs}
            keyExtractor={ (item, index) => index }
            renderItem={({item, index}) => {
              return(
                <TouchableHighlight onPress={() => this.state.showSearch ? this.sendSongToQueue(item) : null}>
                  <Text style={styles.item}>{item.name}</Text>
                </TouchableHighlight>
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
    fontSize: 15,
    height: 44,
    // color: '#1DB954',
  },
});
