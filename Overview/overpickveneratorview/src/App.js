import React, { Component } from 'react';
import logo from './logo1.png';
import './App.css';

var obj = {
  method: 'GET' ,
  mode : 'no-cors',
  headers: {
      'Content-Type': 'application/json'
  }
};

class List extends Component {
  render(){
    console.log(this.props.currentItem);
    var self = this;
    if (this.props.items) {   return (
      <ul>
      {
        this.props.items.map(function(item) {
          console.log(self.props.currentItem)
          return (item === self.props.currentItem) ?
                      <li className='App-currentItem' key={item}>{item}</li>
                    : <li key={item}>{item}</li>
        })
       }
      </ul>
	   ); } else { return  ("None") }

  }
}

class Pickers extends Component {
  constructor(props) {
      super(props);
      this.state = {
      items: ["picker1"],
      currentPicker: ""
     };
  }
}

class ListPickers extends Component {
  render(){
    console.log(this.props.currentItem);
    var self = this;
    if (this.props.items) {   return (
      <ul>
      {
        this.props.items.map(function(item) {
          console.log(self.props.currentItem)
          return (item === self.props.currentItem) ?
                      <li className='App-currentItem' key={item}>{item}</li>
                    : <li key={item}>{item}</li>
        })
       }
      </ul>
	   ); } else { return  ("None") }

  }

}


class App extends Component {
	  constructor(props) {
        super(props);
        this.state = {
        items: ["NONE"],
        currentItem: ""
      };
  }

  filterList(event){
    var updatedList = this.state.items;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: this.state.items});
  }

	getInitialState(){
     return {
       initialItems: [
       "NONE"],
      }
   }

  reponseStatus = (value, a, b) => {
     if (value == 0){
       return a;
     } else
     {
       return b
     }
  }

   FetchCurrent() {
     var self = this;
     console.log("FetchCurrent");
     this.setState((prevState, props) => ({
         currentItem: this.reponseStatus( 1, "NONE", "Bosch 123")
         }));
    console.log(this.state.currentItem);
    return this.state.currentItem
     /*
     fetch(`http://10.10.10.87/api/activeled`, {
       mode: 'no-cors',
       method: 'GET',
       headers: {'Content-Type': 'application/text'}
  }).then(function(response) {
      console.log(response.status);     //=> number 100–599
      console.log(response.statusText); //=> String
      console.log(response.headers);    //=> Headers
      console.log(response.url);        //=> String
      console.log(response.text);
      var newItems = this.reponseStatus(response.status, ['NONE'], [response.text]);
      console.log('Getfunction');
      console.log(newItems);
      this.setState((prevState, props) => ({
          items: newItems
      }));

      return response.text()
    }
    , function(error) {
      console.log(error.message); //=> String
    })
    */
  }

  FetchPickList() {
    var newItems = this.reponseStatus(1, [], ['Hollow Tech ABC','Bosch 123','Samsung abc']);
    console.log('FetchPickList');
    console.log(newItems);
    this.setState((prevState, props) => ({
        items: newItems
        }));
   return 'Hollow'
    /*
    fetch(`http://10.10.10.87/api/ShowPicklists`, {
      mode: 'no-cors',
      method: 'GET',
      headers: {'Content-Type': 'application/text'}
  }).then(function(response) {
     console.log(response.status);     //=> number 100–599
     console.log(response.statusText); //=> String
     console.log(response.headers);    //=> Headers
     console.log(response.url);        //=> String
     console.log(response.text);
     var newItems = this.reponseStatus(response.status, ['NONE'], [response.text]);
     console.log('Getfunction');
     console.log(newItems);
     this.setState((prevState, props) => ({
         items: newItems
     }));

     return response.text()
   }
   , function(error) {
     console.log(error.message); //=> String
   })
   */
  }

   componentDidMount() {
     /*
        fetch(`http://10.10.10.87/api/activeled`, obj)
            .then(result=> {
                console.log('fetch');
                console.log(result);
            });
            */
    }

    RefreshButtonClick() {
      console.log("RefreshButtonClick");
      this.FetchPickList();
      console.log("this.FetchPickList");
      this.FetchCurrent();
      this.forceUpdate()
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">

          <h1 className="App-title">Pick Overview</h1>
        </header>
        <p className="App-intro">
          Currently Picking.
        </p>
					<div>
					  <button className = "pressMe"
                    onClick = { () => this.RefreshButtonClick() }>
              Refresh
            </button>

					  <List items={this.state.items}/>
					  <input type="text" placeholder="Search" onChange={this.filterList}/>

					</div>

          <div className="App-footer">
            <img src={logo} className="App-logo-plain" alt="logo" />
          </div>
        </div>
    );
  }

}


export default App;
