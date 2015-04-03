import React from 'react';
import moment from 'moment';

const inputStyle = {
    position: 'absolute',
    top: '5px',
    left: '5px',
    fontSize: '15px',
    fontWeight: 'bold',
    width: '140px',
    height: '20px'
}
const frameStyle = {
    position: 'absolute',
    border: 0,
    top: '20px',
    width: '100%',
    height: '100%'
}
const panelStyle = {
    position: 'absolute',
    background: 'white',
    top: '5px',
    left: '5px',
    bottom: '5px',
    width: '150px'
};
const leftStyle = {
    position: 'absolute',
    border: '0',
    background: 'transparent',
    top: '35px',
    left: '0px',
    bottom: '5px',
    width: '150px'
};
const rightStyle = {
    position: 'absolute',
    top: '5px',
    left: '160px',
    bottom: '5px',
    right: '5px',
    overflow: 'hidden',
    background: '#f9f9f9'
};
export default class App extends React.Component {
    constructor(props) {
        this.state = { rev: null }
        return super(props);
    }
    render() {
        var rev = this.props.revs.length ? this.state.rev : null;
        return (
            <div>
                <div className="panel" style={panelStyle}>
                    <input className="form-control" value={this.props.id} style={inputStyle} onChange={this.props.onChange} />
                    <RevList id="revs" revs={this.props.revs} onSelect={
                        (rev) => this.setState({ rev: rev })
                    } />
                </div>
                <div className="panel" style={rightStyle}>
                    <div className="panel-heading">
                        <div className="panel-title">
                            <b>&nbsp;{ rev ? moment.unix(rev.slice(0, -4)/1000).format(
                                "YYYY-MM-DD HH:mm:ss Z"
                            ) : '' }</b>
                        </div>
                    </div>
                    { rev ? <iframe style={frameStyle} src={"https://ethercalc.org/log/"+this.props.id+"/"+this.state.rev} /> : '' }
                    { rev ? <a className="btn btn-primary btn-fab btn-raised mdi-action-restore" style={
                        { width: '28px', height: '28px', position: 'absolute', top: 0, right: 0 }
                    } onClick={()=>{
                        alert("Not yet implemented");
                    }}/> : '' }
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
