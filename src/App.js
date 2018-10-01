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
    this.deleteOption = this.deleteOption.bind(this);
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

  deleteOption(ind) {
  console.log("ind", ind);
  const pollsRef = firebase.database().ref('polls').child(this.props.poll.title).child('options').child(ind);

  pollsRef.remove();
}

//doesnt work on your polls
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
          <Modal.Title> {this.props.poll.title} - {this.props.poll.user}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
          {this.props.poll.options.map((option, ind) => (
            <div>  {option.option}  <input type="radio" name="vote" 
            value={ind} 
            onChange={this.handleOptionChange}/> 
            <DeleteOption isUser={this.props.isUser} 
            optiondelete={this.deleteOption}
            option={ind}/>
            <br/>
            <Results isUser={this.props.isUser} option={option} />
            </div>
            ))}
          
          </form>
          </Modal.Body>
          <Modal.Footer> 
            <DeletePoll isUser={this.props.isUser}/>
            <Button onClick={this.submitVote}>Submit Vote</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }

}

function DeletePoll (props) {
  if (props.isUser) {
    return (<Button> Delete Poll </Button>);
  }
  return null;
}

function Results (props) {
  if (props.isUser) {
    return (<div> {props.option.numVotes} votes</div>);
  }
  return null;
}

//todo: add check for at least two option
function DeleteOption (props) {
  if (props.isUser) {
    return (<Button className="delete-option-button" onClick={() => props.optiondelete(props.option)}> Delete </Button>);
  }
  return null;
}

class NewPoll extends Component {

  constructor(props) {
     super(props);

     this.state = {
       showNewPoll : false,
       currentPoll: {title: "", user: "", options:[{option:"", numVotes: 0},{option:"", numVotes: 0}] },

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
      currentPoll: {title: "", user: "", options:[{option:"", numVotes: 0},{option:"", numVotes: 0}]}
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
        user: localStorage.getItem('user'),
        options: this.state.currentPoll.options
      }
      pollsRef.set(item);

      this.setState({
        currentPoll: {title: "", user: "", options:[{option:"", numVotes: 0},{option:"", numVotes: 0}]}
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
           <div >
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
      user: "",
      pass: "",

    }

    this.showSignUp = this.showSignUp.bind(this);
    this.closeSignUp = this.closeSignUp.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  showSignUp() {
  this.setState({showSignUp: true});
}
  closeSignUp() {
  this.setState({showSignUp: false});
}

  handleUserChange(e) {
  this.setState({user: e.target.value});
}
  handlePassChange(e) {
  this.setState({pass: e.target.value});
}
  submitSignUp() {
  localStorage.setItem('user', this.state.user)
  // put into database
  var userRef = firebase.database().ref('users').child(this.state.user);
  const newUser = {
    user: this.state.user,
    pass: this.state.pass
  }
  userRef.set(newUser);
  this.setState({
      user: "",
      pass: ""});


  this.closeSignUp();
  window.location.reload();

}

  render() {
    return (
      <div>
          <button className="login-button" onClick={this.showSignUp}> Sign Up to make Polls </button><br/>
          <Modal show={this.state.showSignUp} onHide={this.closeSignUp} bsSize="lg">
            <Modal.Header closeButton>
            <Modal.Title> Sign Up </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            Username<br/><input onChange={this.handleUserChange}/> <br/>
            Password<br/><input onChange={this.handlePassChange}/>
            </Modal.Body>

            <Modal.Footer> 
              <Button onClick={this.submitSignUp}>Submit</Button>
            </Modal.Footer>
          </Modal>
      </div>
      );
}
}

class SignIn extends Component {

  constructor(props) {
  super(props);
  this.state = {
    showSignIn: false,
    user: "",
    pass: "",
  }
  this.showSignIn = this.showSignIn.bind(this);
  this.closeSignIn = this.closeSignIn.bind(this);
  this.handleUserChange = this.handleUserChange.bind(this);
  this.handlePassChange = this.handlePassChange.bind(this);
  this.submitSignIn = this.submitSignIn.bind(this);
}

  showSignIn() {
  this.setState({showSignIn: true});
}
  closeSignIn() {
  this.setState({showSignIn: false});
}
  handleUserChange(e) {
  this.setState({user: e.target.value});
}
  handlePassChange(e) {
  this.setState({pass: e.target.value});
}

  submitSignIn() {

  var userRef = firebase.database().ref('users');
  userRef.orderByChild('user').equalTo(this.state.user)
    .once("value", snapshot => {
      if(snapshot.exists()) {
        userRef.orderByChild('pass').equalTo(this.state.pass)
        .once("value",snapshot => {
          if (snapshot.exists()) {
            localStorage.setItem('user', this.state.user);
            this.closeSignIn();
            window.location.reload();

          }
          else {
            alert("Wrong user/pass combo");
          }
        })
      }
      else {
        alert("Wrong user/pass combo");

      }

    })
  
 
  console.log("signed in",localStorage.getItem('user'));
}
//check if signed in to not render sign in/up buttons
  render() {
    return (
      <div>
        <button className="login-button" onClick={this.showSignIn}> Sign In </button>
        <Modal show={this.state.showSignIn} onHide={this.closeSignIn} bsSize="lg">
          <Modal.Header closeButton>
          <Modal.Title> Sign In </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Username<br/><input onChange={this.handleUserChange}/> <br/>
          Password<br/><input onChange={this.handlePassChange}/>
          </Modal.Body>

          <Modal.Footer> 
            <Button onClick={this.submitSignIn}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
      );
}
}

function SignOut(props) {
  if(localStorage.getItem('user') !== null)
  {
    return (<button className="login-button" onClick={props.signOut}> Sign Out </button>);

  }
  return null;
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      savedPolls: [],
      yourPolls: [],
    };
    this.signOut = this.signOut.bind(this);
  }

  componentDidMount() {
    var pollsRef = firebase.database().ref('polls');
    pollsRef.on('value', (snapshot) => {
      let polls = snapshot.val();
      let newState = [];
      for(let poll in polls) {
        newState.push({
          id: poll,
          user: polls[poll].user,
          title: polls[poll].title,
          options: polls[poll].options
        });
      }
      this.setState({
        savedPolls: newState
      });
    })

    if (localStorage.getItem('user') !== null)
    {
      pollsRef.orderByChild('user').equalTo(localStorage.getItem('user'))
      .on('value', (snapshot) => {

      let polls = snapshot.val();
      let yourPolls = [];
      for(let poll in polls) {
        yourPolls.push({
          id: poll,
          user: polls[poll].user,
          title: polls[poll].title,
          options: polls[poll].options
        });
      }
      //move to one setstate
      this.setState({
        yourPolls: yourPolls
      });
    });

    }
  }

  signOut() {
    localStorage.removeItem('user');
    window.location.reload();
}


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Votr: for voting </h1>
          <SignUp />
          <SignIn />
          <SignOut signOut={this.signOut}/>
        </header>
        <br/>
        <div>   
        <div className="newPoll-container">
            <NewPoll />

              </div>
        <br/>
        <div className="polls-container">
        <div className="saved-polls">             
        <h4>Open Polls</h4> <br/>
          {this.state.savedPolls.map((polls,ind) => (
            <div>  
            <Poll index={ind+1} poll={polls} isUser={false}/>
            </div>

            ))}
          </div>
         <div className="user-polls">
         <h4>Your Polls</h4> <br/> 
         {this.state.yourPolls.map((polls,ind) => (
           <div >  
           <Poll index={ind+1} poll={polls} isUser={true}/>
           </div>

           ))}
         </div>
        </div>
   
        </div>
      </div>
    );
  }
}

export default App;
