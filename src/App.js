import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";

import './App.css';
import firebase from './firebase.js';


class Poll extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showVoting: false,
      selectedOption: -1
    }

    this.showVoting = this.showVoting.bind(this);
    this.closeVoting = this.closeVoting.bind(this);
    this.submitVote = this.submitVote.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  showVoting() {
    this.setState({showVoting: true});
  }

  closeVoting() {
    this.setState({showVoting: false, selectedOption:-1});
  }

  handleOptionChange(e) {
    this.setState({selectedOption: e.target.value});
    //gets the index
  }

  submitVote() { 
      var title = this.props.poll.title;


      if (this.state.selectedOption === -1)
      {
        alert("Please select an option");
      }
      else if(localStorage.getItem(title))
      {
        alert("You've already voted for this!");
        this.closeVoting();

      }
      else {
         var selected = this.state.selectedOption;
         var numVotes = this.props.poll.options[selected].numVotes + 1;

         const pollsRef = firebase.database().ref('polls').child(title).child('options').child(selected);
         pollsRef.update({numVotes: numVotes});
         localStorage.setItem(title, true);
        this.closeVoting();
      }
      
  }

  mouseOver() {
  document.getElementById(this.props.poll.title).style.color = "gray";
}
  mouseOut() {
  document.getElementById(this.props.poll.title).style.color = "black";

}

  render() {
    return (
      <div>
        <h4 id={this.props.poll.title} onClick={this.showVoting} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
        {this.props.index}. {this.props.poll.title}</h4>
        
        <Modal show={this.state.showVoting} onHide={this.closeVoting} bsSize="lg">
          <Modal.Header closeButton>
          <Modal.Title> {this.props.poll.title} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
          {this.props.poll.options.map((option, ind) => (
            <div> Option {ind+1}. {option.option}  <input type="radio" name="vote" value={ind} onChange={this.handleOptionChange}/> <br/></div>))}
          </form>
          </Modal.Body>
          <Modal.Footer> 
            <Button onClick={this.submitVote}>Submit Vote</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }


}



class NewPoll extends Component {

  constructor(props) {
     super(props);

     this.state = {
       showNewPoll : false,
       currentPoll: {title: "", options:[{option:"", numVotes: 0},{option:"", numVotes: 0}] },

     }

     this.handleTitleInput = this.handleTitleInput.bind(this);
     this.handleOptionInput = this.handleOptionInput.bind(this);
     this.showNewPoll = this.showNewPoll.bind(this);
     this.closeNewPoll = this.closeNewPoll.bind(this);
     this.addOption = this.addOption.bind(this);
     this.savePoll = this.savePoll.bind(this);
  }

  showNewPoll() {
    this.setState({showNewPoll: true});

  }

  closeNewPoll () {
    this.setState({
      showNewPoll: false,
      currentPoll: {title: "", options:[{option:"", numVotes: 0},{option:"", numVotes: 0}]}
    });
  }

  handleTitleInput(e) {
    console.log(this.state.currentPoll);
    var poll = this.state.currentPoll;
    poll.title = e.target.value;
    this.setState({currentPoll: poll});
  }

  handleOptionInput(e,index) {
    var poll = this.state.currentPoll;
    poll.options[index].option = e.target.value;
    this.setState({currentPoll: poll});
  }

  addOption() {
    var poll = this.state.currentPoll;
    poll.options.push({option:"", numVotes: 0});
    this.setState({currentPoll: poll});
  }

  savePoll() {
      console.log("ops", this.state.currentPoll.options)
      const pollsRef = firebase.database().ref('polls').child(this.state.currentPoll.title);
      const item = {
        title: this.state.currentPoll.title,
        options: this.state.currentPoll.options
      }
      pollsRef.set(item);

      this.setState({
        currentPoll: {title: "", options:[{option:"", numVotes: 0},{option:"", numVotes: 0}]}
      });


      this.closeNewPoll();


  }
  render() {
    return (
      <div>

      <button onClick={this.showNewPoll}> Create Poll </button>
      <Modal show={this.state.showNewPoll} onHide={this.closeNewPoll} bsSize="lg">
        <Modal.Header closeButton>
        <Modal.Title> New Poll </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         Title <br/><input onChange={this.handleTitleInput} /> <br/>
         {this.state.currentPoll.options.map((options, ind) => (
           <div>
           Option {ind+1}<br/> <input value={options.option} onChange={(e) => this.handleOptionInput(e,ind)}/>
            </div>
         ))}
         <br/><Button onClick={this.addOption}> Add Option </Button>
        </Modal.Body>

        <Modal.Footer> 
          <Button onClick={this.savePoll}>Save</Button>
        </Modal.Footer>
      </Modal>
      </div>

      );
  }
}

class SignUp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showSignUp: false,

    }

    this.showSignUp = this.showSignUp.bind(this);
    this.closeSignUp = this.closeSignUp.bind(this);
  }

  showSignUp() {
  this.setState({showSignUp: true});
}
  closeSignUp() {
  this.setState({showSignUp: false});
}

  render() {
    return (
      <div>
          <button className="sign-up-button" onClick={this.showSignUp}> Sign Up to make Polls </button><br/>
          <Modal show={this.state.showSignUp} onHide={this.closeSignUp} bsSize="lg">
            <Modal.Header closeButton>
            <Modal.Title> SignUp </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            Username<br/><input/> <br/>
            Password<br/><input/>
            </Modal.Body>

            <Modal.Footer> 
              <Button onClick={this.closeSignUp}>Submit</Button>
            </Modal.Footer>
          </Modal>
      </div>
      );
}
}
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      savedPolls: [],
    };
  }

  componentDidMount() {
    var pollsRef = firebase.database().ref('polls');
    pollsRef.on('value', (snapshot) => {
      let polls = snapshot.val();
      let newState = [];
      for(let poll in polls) {
        newState.push({
          id: poll,
          title: polls[poll].title,
          options: polls[poll].options
        });
      }
      this.setState({
        savedPolls: newState
      });
    })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Votr: for voting </h1>
          <SignUp />
        </header>
        <br/>
        <div>   
        <div class="newPoll-container">
            <NewPoll />

              </div>
        <br/>
        <div>             
        <h4>Saved Polls</h4> <br/>
          {this.state.savedPolls.map((polls,ind) => (
            <div>  
            <Poll index={ind+1} poll={polls}/>
            </div>

            ))}
        </div>
   
        </div>
      </div>
    );
  }
}

export default App;
