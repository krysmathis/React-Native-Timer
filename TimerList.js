import React from 'react';
import {CollectionItem, Icon} from 'react-materialize'
import say from './speech';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    SectionList
  } from 'react-native';

/*
    The TimerList component generates the TimerListItems
*/
function TimerList (props) {

        const timers= props.timers;
        if (timers.length > 0){
            const listTimers = timers.map((timer, index) => 
                <View key={timer.id}><TimerItem name={timer.name} limit={timer.limit} id={timer.id} delete={props.delete} /></View>
            );
            return (listTimers);
        } else {
            return null;
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
        console.log("deleting", this.props.id);
        this.props.delete(this.props.id);
    }

    // If the user does not click on the timer item, a timer will not render
    render() {
        return (
            <View className="timerItem">
                <Text onPress={this.toggleRun} title="Timer">Timer: {this.props.name} Length: {this.props.limit}s </Text>
                {this.state.runTimer ? <Timer name={this.props.name} limit={this.props.limit}/> : null}
                <Button className="deleteListing" title="Delete" onPress={this.handleDelete}><Text>Delete</Text></Button>
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

    // This function ensures the component knows when it has exceede the time limit
    isExpired = () => this.state.time >= this.props.limit ? true : false;

    // Toggle function for updating the display based on how much time
    // has passed relative to the time limit
    displayTime = () => {
        if (this.isExpired() === true) {
            clearInterval(this.timerId);
            return (<Text>Timer Expired</Text>);
        } else {
            return <Text>Time remaining: {this.props.limit - this.state.time}</Text>
        }
    }

    render() {
        return(this.displayTime());
    }
}
