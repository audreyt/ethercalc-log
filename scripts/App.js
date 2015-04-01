import React from 'react';
import moment from 'moment';

const leftStyle = {
    position: 'absolute',
    top: '5px',
    left: '5px',
    bottom: '5px',
    width: '150px'
};
const rightStyle = {
    position: 'absolute',
    top: '0px',
    left: '155px',
    bottom: '0px',
    right: '5px',
    background: '#eee'
};
export default class App extends React.Component { render() {
    return (
        <div>
            <RevList id="revs" revs={this.props.revs} />
            <div style={rightStyle}>
                Hello
                <input type="button" value="Restore this version" />
            </div>
        </div>
    );
} }

class RevList extends React.Component { render() {
    var prev = 0;
    return (
        <select style={leftStyle} size={this.props.revs.length}>{this.props.revs.map(r => {
            var tm = moment.unix(r.name.slice(0, -4)/1000);
            var delta = r.size - prev;
            if (delta > 0) { delta = '+' + delta };
            prev = r.size;
            return <option key={r.name} title={ tm.format() } >
                    { tm.fromNow() } { delta }
            </option>
        }).reverse()}</select>
    );
} }
