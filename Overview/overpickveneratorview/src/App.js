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
    if (this.props.items) {   return (
      <ul>
      {
        this.props.items.map(function(item) {
          return <li key={item}>{item}</li>
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
        items: ['NONE'],
        currentItem: ''
      };
  }

  filterList(event){
    var updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  }

	getInitialState(){
     return {
       initialItems: [
       'NONE'],
      }

   }

   Getfunction() {
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
      let newItems = [];
      if (response.status == 0) { newitems: ['NONE'];} else {newitems: [response.text]; }
      this.setState((prevState, props) => ({
          items: newItems
      }));

      return response.text()
    }
    , function(error) {
      console.log(error.message); //=> String
    })
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
                    onClick = { () => this.Getfunction() }>

              Refresh
          </button>
					<List items={this.state.items}/>
						<input type="text" placeholder="Search" onChange={this.filterList}/>


					</div>

          <div className="App-footer">
            <img src={logo} className="App-plain" alt="logo" />
          </div>
        </div>
    );
  }

}


export default App;
