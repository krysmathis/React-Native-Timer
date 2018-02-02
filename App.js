/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FormLabel, FormInput,
  Button, TextInput,
  TouchableOpacity, Picker
} from 'react-native';
import TimerList from './TimerList.js';
import * as firebase from "firebase";



// Initialize Firebase
var config = {
  apiKey: "AIzaSyC8XhJs3X_-vpoOmvS6HShJPZdwjaE_39k",
  authDomain: "react-timer-c4024.firebaseapp.com",
  databaseURL: "https://react-timer-c4024.firebaseio.com",
  projectId: "react-timer-c4024",
  storageBucket: "",
  messagingSenderId: "990870043209"
};

firebase.initializeApp(config);
const database = firebase.database();

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      storedTimers: [],
      showTimers: false,
      showForm: false,
      isLoading: true,
      title: "",
      time: ""
    }
    // handle the binding of the input forms 'this' is available
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  // Updating the record of when the user logs in
  componentWillMount(){
    const ref = database.ref('/timer/');
    // Attach an asynchronous callback to read the data at our posts reference
      ref.on("value", (snapshot) => {

        let data = snapshot.val();
        if (data === null) {
          return;
        }
        // convert the object into an array of values
        let timers = Object.keys(data).map(key => {
            data[key].id = key;
            return data[key];
        });
        this.setState({
          storedTimers: timers,
          isLoading: false
        });
          
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
  }
  
  
    
  
  // Send data up to the database
  handlePost(name, time) {
    const ref = database.ref('/timer/');
    ref.push({
      "name": name,
      "limit": time
    })
  }

    // Send data up to the database
  handleDelete(id) {
    const ref = database.ref('/timer/' + id);
    ref.remove();
  }

  // for the renderer to render a timer for each of the storedTimers
  generateTimers() {
        return <TimerList timers={this.state.storedTimers} post={this.handlePost} delete={this.handleDelete}/>
  }

  // tied to the name input
  handleNameChange = (text) => {
    this.setState({title: text});
  }

  // tied to the time input
  handleTimeChange = (text) => {
    this.setState({time: text});
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  // Preparing the data for the post request
  handleSubmit = () => {

      if (this.state.title.length > 0 && this.isNumeric(this.state.time)) {
          this.handlePost(this.state.title, this.state.time);
          this.setState({
            title: "",
            time: ""
          });
      }

  }

  /*
     iOS uses TextInput fields to hold data input
  */
  displayForm() {
  

    return (
        <View>
              <TextInput type="text" placeholder="Name" name="title" label="Timer Name" value={this.state.title} onChangeText={this.handleNameChange} />
              <TextInput type="text" placeholder="Timing" name="time" label="Time Limit" value={this.state.time} onChangeText={this.handleTimeChange} />
             
              <TouchableOpacity
               style = {styles.submitButton}
               onPress = {this.handleSubmit}>
               <Text style = {styles.submitButtonText}> Submit </Text>
              </TouchableOpacity>
              {/* <Button title="Click" floating large className='red' waves='light' icon='add' type="submit" onPress={this.handleSubmit} value="">Click</Button> */}

        </View>
          
    );
  }
  
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          ReactTimer
        </Text>
        {this.state.isLoading===true ? <Text>Loading...</Text> : this.generateTimers() }
        { this.displayForm() }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  container: {
    paddingTop: 23
  },
  input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
  },
  submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 15,
      height: 40,
  },
  submitButtonText:{
      color: 'white'
  }
});
