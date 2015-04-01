import React from 'react';
import moment from 'moment';

const inputStyle = {
    position: 'absolute',
    top: '5px',
    left: '5px',
    width: '140px',
    height: '20px'
}
const leftStyle = {
    position: 'absolute',
    top: '35px',
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
export default class App extends React.Component {
    constructor(props) {
        this.state = { rev: null }
        return super(props);
    }
    render() {
        return (
            <div>
                <input value={this.props.id} style={inputStyle} onChange={this.props.onChange} />
                <RevList id="revs" revs={this.props.revs} onSelect={
                    (rev) => this.setState({ rev: rev })
                } />
                <div style={rightStyle}>
                    {this.state.rev}
                    <input type="button" value="Restore this version" />
                </div>
            </div>
        );
    }
}

class RevList extends React.Component {
    constructor(props) {
        this.state = { selected: props.revs.length ? props.revs[0].name : null };
        return super(props);
    }
    render() {
        var prev = 0;
        return (
            <select value={this.state.selected} onChange={(e) => {
                this.setState({ selected: e.target.value });
                this.props.onSelect(e.target.value);
            }} style={leftStyle} size={this.props.revs.length}>{this.props.revs.map(r => {
                var tm = moment.unix(r.name.slice(0, -4)/1000);
                var delta = r.size - prev;
                if (delta > 0) { delta = '+' + delta };
                prev = r.size;
                return <option value={r.name} key={r.name} title={ tm.format() } >
                    { tm.fromNow() + ' (' + delta + ')' }
                </option>
            }).reverse()}</select>
        );
    }
}
