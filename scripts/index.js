import React from 'react'
import App from './App'
import request from 'superagent'

var id = "test"
var prefix = 'https://ethercalc.org/log/'
request.get(prefix + id).end((err, res) => {
    React.render(
        <App id={id} revs={res.body} />,
        document.getElementById('root')
    );
})
