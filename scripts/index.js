import React from 'react'
import App from './App'
import request from 'superagent'

var prefix = 'https://ethercalc.org/log/'
var root = document.getElementById('root');
function render (id, revs) {
    React.render( <App id={id} revs={revs} onChange={onChange} />, root );
}
function load (id) {
    render(id, []);
    request.get(prefix + id).end((err, res) => {
        if (err) { return; }
        render(id, res.body);
    })
}
function onChange(event) {
    load(event.target.value);
}
load('test');
