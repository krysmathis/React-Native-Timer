import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    SectionList,
    ActivityIndicator,
    Vibration,
    StatusBar,
    Alert,
    NavigatorIOS,
    Image,
    TouchableOpacity
  } from 'react-native';

/*
    The TimerList component generates the TimerListItems
*/
class TimerList extends React.Component {
    constructor(props) {
        super(props);
    }
    
    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#607D8B",
            }}
          />
        );
      }
    
    render() {
        if (this.props.timers !== undefined){
            // const listTimers = timers.map((timer, index) => 
            //     <View key={timer.id}><TimerItem name={timer.name} limit={timer.limit} id={timer.id} delete={props.delete} /></View>
            // );
            return (
                <View>
                   
                <FlatList
                    data = {this.props.timers}
                    ItemSeparatorComponent = {this.FlatListItemSeparator}
                    renderItem={({item}) =><TimerItem  name={item.name} limit={item.limit} id={item.key} delete={this.props.delete} update={this.props.update} key={item.id}/> }
                />
                </View>
            );
        } else {
            return null;
        }
    }
    
}

export default TimerList;


/*
    The timer item calls the actual timer itself
    State: 
        - runTimer: a toggle on and off that controls the rendering of 
                    the timer component
*/
class TimerItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            runTimer: false
        }

    }
    
    // Allow the user to toggle the timer on an off
    toggleRun = () => {
        if (this.state.runTimer) {
            this.setState({runTimer: false});
        } else {
            this.setState({runTimer:true});
        }

    }

    handleDelete = () => {
        this.props.delete(this.props.id);
    }

    makeUpdate = () => {
        console.log(this.props);
        
        const obj = {
            title: this.props.name,
            time: this.props.limit,
            id: this.props.id
        }
        
        this.props.update(obj);
        
    }

    // If the user does not click on the timer item, a timer will not render
    render() {
        return (
            <View>
            <View className="timerItem" style={styles.rowText}>
                <View>
                    <Text style={styles.titleText} onPress={this.toggleRun} title="Timer">{this.props.name} - {this.props.limit}s </Text>
                </View>
                <View style={styles.actionItems}>
                    <TouchableOpacity className="updateListing" onPress={this.makeUpdate} style={styles.updateBtn}>
                    <Image
                        style={styles.button}
                        source={require('./Resources/ic_update.png')}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity className="deleteListing" onPress={this.handleDelete}>
                    <Image
                        style={styles.button}
                        source={require('./Resources/ic_delete.png')}
                    />
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {this.state.runTimer ? <Timer name={this.props.name} limit={this.props.limit}/> : null}
            </View>
            </View>
        );
    }
}

/*
    Timer component:
    Props: 
        - name set by App.js
        - limit set by App.js
*/
class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
        }
    }
    
    /*
        Mount the timer and start the clock. This method uses
        Object.assign to copy the current state, which contains time
        and set a new value for time using the previous time value
    */
    componentWillMount() {
        
        this.timerId = setInterval(() => {
            const prevState = Object.assign({}, this.state);
            this.setState({
                time: prevState.time += 1,
            });
        }, 1000);
        console.log(this.props);
    }

    // When the component is removed from the DOM, clear the setInterval
    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    playSound() {
        var Sound = require('react-native-sound');
    }

    timesUp() {
        Alert.alert(
            'Finshed',
            'Timer is Done',
            [
              {text: 'OK', onPress: () => console.log('Ask me later pressed')},
            ],
            { cancelable: false }
          )
    }
    // This function ensures the component knows when it has exceede the time limit
    isExpired = () => this.state.time >= this.props.limit ? true : false;

    // Toggle function for updating the display based on how much time
    // has passed relative to the time limit
    displayTime = () => {
        if (this.isExpired() === true) {
            clearInterval(this.timerId);
            Vibration.vibrate();
            this.timesUp();
            return (<Text>Timer Expired</Text>);
        } else {
            return <View style={styles.activity}>
                    <Text>Time remaining: {this.props.limit - this.state.time}</Text>
                    <ActivityIndicator size="small" color="black" />
                </View>
        }
    }

    render() {
        return(
            <View style={styles.timer}>
                {this.displayTime()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    baseText: {
      fontFamily: 'Cochin',
    },
    titleText: {
      fontSize: 16,
      fontWeight: 'bold',
    },

    rowText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingLeft: 10
      },
      actionItems: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingLeft: 10,
        paddingRight: 20

      },
      updateBtn: {
        paddingRight: 10
      },
    timer: {
        display: 'flex',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BADA55'
    },
    activity: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        width: "1em",
        height: "1em",
        
      }
});
