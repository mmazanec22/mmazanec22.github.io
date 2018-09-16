import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <div>Melanie Mazanec</div>
        </header>
        <main>
          <div id="content">
            <p>
                <span>Currently</span> a software developer for the city government of Asheville, North Carolina.
            </p>
            <p id="weirdo">
                <span>Working</span> on data visualization, <span>learning</span> about accessibility, <span>exploring</span> collaborative governance in technical projects, <span>interested</span> in everything at the intersection of technology and public service.
            </p>
            <p>
                <span>Previously</span> visualized data for a cybersecurity startup, earned a degree in trumpet performance, traveled over seven thousand miles by bicycle, and worked in a few educational roles.
            </p>
          </div>
        </main>
        <footer>
          <div>
            Last updated September 2018
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
