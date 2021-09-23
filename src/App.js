import 'regenerator-runtime/runtime'
import React from 'react'
import './global.css'
import 'bulma/css/bulma.min.css';

import NavComp from './Components/Navbar';

export default class App extends React.Component {

  render() {
    return (
      <div>
        <NavComp></NavComp>
      </div>
    )
  }
}