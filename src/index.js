import React from 'react'
import ReactDOM from 'react-dom'
import './main.scss'

import {Home} from './components/Home'
import {Portfolio} from './components/Portfolio'


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);


function App(){
    let username = window.location.href.split('?')[1]
    return username ? <Portfolio username={username}/> : <Home/>
}