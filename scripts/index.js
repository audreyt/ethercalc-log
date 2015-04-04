import React from 'react'
import App from './App'
import request from 'superagent-bluebird-promise'

var root = document.getElementById('root');
function load (id) {
    React.render( <App id={id} onChange={(e) => load(e.target.value)} />, root );
}
load('test')
