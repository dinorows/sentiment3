import React, {Component} from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Polarity from "./components/Polarity";
// import queryString from 'query-string';
// import ReactDOM from "react-dom";
// import {
  // BrowserRouter as Router,
  // Switch,
  // useLocation
// } from "react-router-dom";
// import {withRouter} from 'react-router';

const style = {
    marginLeft: 12,
};

// option 1
var qs = (function(a) {
	if (a === "") return {};
	var b = {};
	for (var i = 0; i < a.length; ++i)
	{
		var p=a[i].split('=', 2);
		if (p.length === 1)
			b[p[0]] = "";
		else
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
	}
	return b;
})(window.location.search.substr(1).split('&'));

// option 2
// function getParameterByName(name, url = window.location.href) {
	// name = name.replace(/[\[\]]/g, '\\$&');
	// var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		// results = regex.exec(url);
	// if (!results) return null;
	// if (!results[2]) return '';
	// return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sentence: '',
            polarity: undefined,
        };
    };
	
	async componentdidmount() {
		console.log(qs["webapp"]);
	}
	
    analyzeSentenceLocal() {
        fetch('http://localhost:8080/sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sentence: this.textField.getValue()})
        })
            .then(response => response.json())
            .then(data => this.setState(data));
    }
	
    analyzeSentence() {
		console.log(qs["webapp"]);
        fetch(qs["webapp"] + '/sentiment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sentence: this.textField.getValue()})
        })
            .then(response => response.json())
            .then(data => this.setState(data));
    }
	
    testCommsSpringboot() {
		console.log(qs["webapp"]);
        fetch(qs["webapp"] + '/testHealth', {mode: 'cors'})
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                console.log('Request successful', text);
                alert(text);
            })
            .catch(function(error) {
                console.log('Request failed', error)
            });
    }
    testCommsFlask() {
        fetch('http://localhost:5050/testHealth', {mode: 'cors'})
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                console.log('Request successful', text);
                alert(text);
            })
            .catch(function(error) {
                console.log('Request failed', error)
            });
    }

    onEnterPress = e => {
        if (e.key === 'Enter') {
            this.analyzeSentence();
        }
    };

    render() {
		//const location = useLocation();
		
        const polarityComponent = this.state.polarity !== undefined ?
            <Polarity sentence={this.state.sentence} polarity={this.state.polarity}/> :
            null;

        return (
            <MuiThemeProvider>
                <div className="centerize">
                    <Paper zDepth={1} className="content">
                        <h2>Sentiment Analyser</h2>
                        <TextField ref={ref => this.textField = ref} onKeyUp={this.onEnterPress.bind(this)}
                                   hintText="Type your sentence."/>
                        <RaisedButton  label="Send" style={style} onClick={this.analyzeSentence.bind(this)}/>
                        <RaisedButton  label="SendLocal" style={style} onClick={this.analyzeSentenceLocal.bind(this)}/>
		                <RaisedButton  label="Comms Sb" style={style} onClick={this.testCommsSpringboot.bind(this)}/>
                        <RaisedButton  label="Comms Fl" style={style} onClick={this.testCommsFlask.bind(this)}/>
                        {polarityComponent}
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;