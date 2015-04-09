import React from 'react'
import moment from 'moment'
import Transmit from 'react-transmit'
import request from 'superagent-bluebird-promise'
import SheetViewer from './SheetViewer'

moment.locale(window.navigator.userLanguage || window.navigator.language)

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
    overflow: 'scroll',
    border: 0,
    top: '20px',
    width: '100%',
    bottom: '0px'
}
const panelStyle = {
    position: 'absolute',
    background: 'white',
    top: '5px',
    left: '5px',
    bottom: '5px',
    width: '150px'
}
const leftStyle = {
    position: 'absolute',
    border: '0',
    background: 'transparent',
    top: '35px',
    left: '0px',
    bottom: '5px',
    width: '150px'
}
const rightStyle = {
    position: 'absolute',
    top: '5px',
    left: '160px',
    bottom: '5px',
    right: '5px',
    overflow: 'hidden',
    background: '#f9f9f9'
}
class App extends React.Component {
    static propTypes = { id: React.PropTypes.string }
    constructor(props) { super(props)
        this.state = { rev: null }
    }
    componentWillMount() { this.props.setQueryParams(this.props) }
    componentWillReceiveProps(nextProps) {
        if (nextProps.id == this.props.id) return
        this.props.setQueryParams({ id: nextProps.id })
    }
    render() {
        const {id, revs, onChange} = this.props;
        var rev = revs.length ? this.state.rev : null
        return (
            <div>
                <div className="panel" style={panelStyle}>
                <input ref={ (it) => {
                    if (it && !id) { React.findDOMNode(it).focus() }
                    }} placeholder="Enter Sheet ID" className="form-control" value={id} style={inputStyle} onChange={onChange} />
                    <RevList id="revs" revs={revs} onSelect={
                        (rev) => this.setState({ rev: rev })
                    } />
                </div>
                <div className="panel" style={rightStyle}>
                    <div className="panel-heading">
                        <div className="panel-title">
                            <b>&nbsp;{ rev && moment.unix(rev.slice(0, -4)/1000).format(
                                "YYYY-MM-DD HH:mm:ss Z"
                            ) }</b>
                        </div>
                    </div>
                    { rev && <SheetViewer style={frameStyle} src={"https://ethercalc.org/log/"+this.props.id+"/"+this.state.rev} /> }
                    { rev && <a className="btn btn-primary btn-fab btn-raised mdi-action-restore" style={
                        { width: '28px', height: '28px', position: 'absolute', top: 0, right: 0 }
                    } onClick={()=>{
                        const target = prompt("Sheet ID to restore to:", this.props.id)
                        if (target) {
                            request.get("https://ethercalc.org/log/"+this.props.id+"/"+this.state.rev)
                                .then((res) => {
                                    request.put("https://ethercalc.org/_/" + encodeURIComponent(target))
                                        .send({ snapshot: res.text })
                                        .then(() => location.href = "https://ethercalc.org/"+encodeURIComponent(target))
                                        .catch(() => alert("Restore failed"))
                                })
                        }
                    }}/> }
                </div>
            </div>
        )
    }
}

class RevList extends React.Component {
    constructor(props) { super(props)
        this.state = { selected: null }
    }
    componentWillReceiveProps(nextProps) { this.setState({ selected: null }) }
    render() {
        const {revs} = this.props
        var prev = 0
        return (
            <select value={this.state.selected} onChange={(e) => {
                this.setState({ selected: e.target.value })
                this.props.onSelect(e.target.value)
            }} style={leftStyle} size={revs.length+1}>{revs.map(r => {
                var tm = moment.unix(r.name.slice(0, -4)/1000)
                var delta = r.size - prev
                if (delta > 0) { delta = '+' + delta }
                prev = r.size
                return <option value={r.name} key={r.name} title={ tm.format() } style={
                    { cursor: 'pointer' }
                }>
                    { tm.fromNow() + ' (' + delta + ')' }
                </option>
            }).reverse()}</select>
        )
    }
}

const LogURL = 'https://ethercalc.org/log/'
export default Transmit.createContainer(App, {
    queries: {
        revs({id}) {
            if (!id) return new Promise((cb)=>cb([]))
            return request.get(LogURL + id).then((res) => res.body).catch(()=>[])
        }
    }
})

