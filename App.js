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
  TouchableOpacity, Picker, FlatList,
  NavigatorIOS,
  AsyncStorage
} from 'react-native';
import TimerList from './TimerList.js';

// uuid Generatory
const uuidGenerator = function* () {
  while (true) {
      let time = new Date().getTime()
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
          const random = (time + Math.random() * 16) % 16 | 0
          return (char === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
      })
      yield uuid
  }
}

// Create instance of generator
const TimerId = uuidGenerator()

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
      time: "",
      id: "",
      updateMode: false
    }
    // handle the binding of the input forms 'this' is available
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }


  /*
    For debugging use the following to create a new timer
    let localTimers = []

    let newTimer = {
      key: TimerId.next().value,
      limit: "60",
      name: "newTimer"
    }
    
    // push the timer to the file
    localTimers.push(newTimer); 
    AsyncStorage.setItem("timers", JSON.stringify(localTimers)).then((r) => {
      console.log("timers stored");
    }).done();
  */

  // Updating the record of when the user logs in
  componentWillMount(){
    
    //check async storage and if there are records there add them to the list
    // key will be timers value will be an array of timers with a list of id
    // create an array to store the timers
    let localTimers = []
    // create a new timer
    
    // get the timers from async storage
    AsyncStorage.getItem("timers").then((value) => {
        
        this.setState({
          storedTimers: JSON.parse(value),
          isLoading: false
        });
        console.log(JSON.parse(value));

    }).done();

  }
  
  // Send data up to the database
  handlePost(name, time) {
    
    let timerArray = [];

    AsyncStorage.getItem("timers").then((value) => {
      
      // handle the situation where there are no existing timers
      if (value === null) {
        timerArray = [];
      } else {        
        // parse the value into a javascript array - sli
        timerArray = JSON.parse(value); 
      }

        // new timer
        const newTimer = {
          key: TimerId.next().value,
          name: name,
          limit: time
        }
        // push to array
        timerArray.push(newTimer);

        // store it again
        AsyncStorage.setItem("timers", JSON.stringify(timerArray)).then((r) => {
          
          this.setState({
            storedTimers: timerArray,
            updateMode: false
          });
    
          console.log("timer added - is it displayed?");
        }).done();
        
      }).done();
  }

  handlePut = () => {

    const name = this.state.title;
    const limit = this.state.time;

    AsyncStorage.getItem("timers").then((value) => {
      
      // parse the value
      timerArray = JSON.parse(value);

      // pull the old timer and update it
      const index = timerArray.findIndex(i => i.key === this.state.id);
      
      timerArray[index].name = name;
      timerArray[index].limit = limit;

        // store it again
        AsyncStorage.setItem("timers", JSON.stringify(timerArray)).then((r) => {
          
          this.setState({
            storedTimers: timerArray,
            updateMode: false
          });
    
        }).done();
        
      }).done();

  
  }
 
  // remove the 
  handleDelete = (id) => {
    
    // pull the timers from async storage
    AsyncStorage.getItem("timers").then((value) => {
      
      // parse the array value
      timerArray = JSON.parse(value);

      // pull the old timer and update it
      const index = timerArray.findIndex(i => i.key === id);
      
      timerArray.splice(index,1);

        // store it again
        AsyncStorage.setItem("timers", JSON.stringify(timerArray)).then((r) => {
          
          this.setState({
            storedTimers: timerArray,
            updateMode: false
          });
    
        }).done();
        
      }).done();

  }

  handleUpdate = (timerObj) => {
    
    this.setState({
      updateMode: true,
      title: timerObj.title,
      time: timerObj.time,
      id: timerObj.id
    });

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
    // handle post or update
      if (this.state.updateMode === true) {
         this.handlePut();
      } else {
         this.handlePost(this.state.title, this.state.time);
      }
      
      this.setState({
        title: "",
        time: ""
      });
    }
    
  }
  
  generateTimers() {
    return <TimerList timers={this.state.storedTimers} delete={this.handleDelete} update={this.handleUpdate}/>
  }
  
  displayForm() {  
    /*
    iOS uses TextInput fields to hold data input
    */
    return (
        <View>
            
          <View>
            <View style={styles.row}>
              <TextInput style={styles.nameInput} type="text" placeholder="Name" name="title" label="Timer Name" value={this.state.title} onChangeText={this.handleNameChange} />
              <TextInput style={styles.input} type="text" placeholder="Timing" name="time" label="Time Limit" value={this.state.time} onChangeText={this.handleTimeChange} />
            </View>
          </View>
              <TouchableOpacity
                  style = {styles.submitButton}
                  onPress = {this.handleSubmit}>
               <Text style = {styles.submitButtonText}> Add New </Text>
              </TouchableOpacity>
              {/* <Button title="Click" floating large className='red' waves='light' icon='add' type="submit" onPress={this.handleSubmit} value="">Click</Button> */}

        </View>
          
    );
  }
  
  
  render() {
    return (
     
      <View style={styles.container}>
       <NavigatorIOS
          style={styles.navigation}
          initialRoute={{
          title: 'My Timers',
          component: TimerList,
          }}/>
        
        { this.displayForm() }
        {this.state.isLoading === true ? <Text>Loading...</Text> : this.generateTimers() }

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
  navigation: {
    flex: 2,
  },
  container: {
    paddingTop: 23
  },
  input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderBottomWidth: 2,
      width: 125
  },
  submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 15,
      height: 40,
  },
  submitButtonText:{
      color: 'white'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50
  },
  nameInput: {
    margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderBottomWidth: 2,
      width: 175
  }
});
