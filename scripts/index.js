import React from 'react'
import App from './App'
import request from 'superagent-bluebird-promise'

var root = document.getElementById('root');
function load (id) {
    history.replaceState(null, null, '?'+encodeURIComponent(id))
    React.render( <App id={id} onChange={(e) => load(e.target.value)} />, root );
}
if (/^\?([-\w]+)$/.test(location.search)) {
    load(location.search.slice(1))
}
else {
    load('')
}
