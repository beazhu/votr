import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showNewPoll: false,
      savedPolls: [],
      currentPoll: {title: "", option1: "", option2: ""},
    };

    this.showNewPoll = this.showNewPoll.bind(this);
    this.closeNewPoll = this.closeNewPoll.bind(this);
    this.savePoll = this.savePoll.bind(this);
    this.handleTitleInput = this.handleTitleInput.bind(this);

  }

  showNewPoll() {
    this.setState({showNewPoll: true});

  }

  closeNewPoll () {
    this.setState({showNewPoll: false});
  }

  savePoll() {
      console.log("saved",this.state.savedPolls);

      var updateSaved = this.state.savedPolls;
      updateSaved.push(this.state.currentPoll);
      console.log("curr", updateSaved);
      this.setState({
        savedPolls: updateSaved,
        currentPoll: {title: "", option1: "", option2: ""}});


  }

  handleTitleInput(e) {
    console.log(this.state.currentPoll);
    var poll = this.state.currentPoll;
    poll.title = e.target.value;
    this.setState({currentPoll: poll});

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Votr</h1>
        </header>
        <br/>
        <div>   
        <button onClick={this.showNewPoll}> Create Poll </button>
        <br/>
        <button> Confirm </button>
        <div> 
          {this.state.savedPolls.map((polls) => (
            <div> {polls.title} </div>
            ))}
        </div>


        <div class="newPoll-container">
              <Modal show={this.state.showNewPoll} onHide={this.closeNewPoll} bsSize="lg">
                <Modal.Header closeButton>
                <Modal.Title> New Poll </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                 Title <input onChange={this.handleTitleInput} /> <br/>
                 Option 1 <input/> <br/>
                 Option 2 <input/> <br/>
                </Modal.Body>

                <Modal.Footer> 
                  <Button onClick={this.savePoll}>Save</Button>
                </Modal.Footer>
              </Modal>

              </div>

        
        </div>
      </div>
    );
  }
}

export default App;
