
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TabBarIOS, StyleSheet, ScrollView, FlatList, Button, NavigatorIOS, Text, View, TouchableHighlight} from 'react-native';
import Spotify from 'rn-spotify-sdk';

export default class NavigatorIOSApp extends React.Component {
  _handleSettingsRequest() {
    this.refs.nav.push({
      component: MyView,
      title: 'Settings',
      passProps: {myProp: 'genius'},
    });
  }

  render() {
    return (
      <NavigatorIOS
        ref="nav"
        initialRoute={{
          //ref="nav",
          component: MyScene,
          title: 'Spartify Queue',
          passProps: {index: 1},
          rightButtonTitle: 'Settings',
          onRightButtonPress: () => this._handleSettingsRequest(),
        }}
        style={{flex: 1}}
      />
    );
  }
}

class MyView extends React.Component {
  _handleBackPress() {
    this.props.navigator.pop();
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }

  render() {
    const nextRoute = {
      component: MyView,
      title: 'Bar That',
      passProps: {myProp: 'bar'},
    };
    return (
      <TouchableHighlight onPress={() => this._handleNextPress(nextRoute)}>
        <Text style={{marginTop: 200, alignSelf: 'center'}}>
          See you on the other nav {this.props.myProp}!
        </Text>
      </TouchableHighlight>
    );
  }
}



class MyScene extends React.Component {
  static propTypes = {
    route: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }),
    navigator: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this._onForward = this._onForward.bind(this);
  }

  _onForward() {
    let nextIndex = ++this.props.index;
    this.props.navigator.push({
      component: MyScene,
      title: 'Scene ' + nextIndex,
      passProps: {index: nextIndex},
    });
  }

  render() {
    return (
      <ScrollView>
      <View>
        <FlatList
          data={[
            {key: 'Song1'},
            {key: 'Song2'},
            {key: 'Song3'},
            {key: 'Song4'},
            {key: 'Song5'},
            {key: 'Song6'},
            {key: 'Song7'},
            {key: 'Song8'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
      </ScrollView>
    );
  }
}
        /*<Text>Current Scene: {this.props.title}</Text>
        <Button
          onPress={this._onForward}
          title="Tap me to load the next scene"
        />*/

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

