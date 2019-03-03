import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, AsyncStorage, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
  static navigationOptions = {
    title: 'Party',
  };

  state {
    partycode = null;
    partyname = null;
  };

  createParty = () => {
    var rootref = firebaseApp.database().ref();
    let randcode = Math.random().toString(36).substring(7);
    this.state.partycode = randcode;
    this.partiesRef = this.getRef().child('parties');
    this.partiesRef.push({ this.state.partycode: this.state.partyname });
  };

  render() {
    return (
      <ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={this.createParty}
        >
          <Text style={styles.buttonText}>
            Create a Party
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.joinParty}
        >
          <Text style={styles.buttonText}>
            Join a Party
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20
  }
});
