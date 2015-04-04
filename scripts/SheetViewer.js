import React from 'react'
import Transmit from 'react-transmit'
import request from 'superagent-bluebird-promise'

class SheetViewer extends React.Component {
    componentWillMount() { this.props.setQueryParams(this.props) }
    componentWillReceiveProps(nextProps) {
        if (nextProps.src == this.props.src) return
        this.props.setQueryParams(nextProps)
    }
    render() {
        const {style, sheet, src} = this.props
        return <div style={style}><table className="table table-striped"><tbody>{
            socialcalc_to_aoa(sheet).map((row) =>
                <tr>{ row.map((col) => <td style={{ background: "white" }}>{ decodeFromSave(col) }</td> ) }</tr>
            ) }
        </tbody></table></div>
    }
}

function decodeFromSave(s) {
    if (typeof s != "string") return s;
    if (s.indexOf("\\")==-1) return s; // for performace reasons: replace nothing takes up time
    var r=s.replace(/\\c/g,":");
    r=r.replace(/\\n/g,"\n");
    return r.replace(/\\b/g,"\\");
}

// Source: https://github.com/SheetJS/js-harb/blob/master/bits/70_socialcalc.js
// Copyright (C) 2014 SheetJS http://www.apache.org/licenses/LICENSE-2.0
function socialcalc_to_aoa(str) {
        var records = str.split('\n'), R = -1, C = -1, ri = 0, arr = [];
        for (; ri !== records.length; ++ri) {
                var record = records[ri].trim().split(":");
                if(record[0] !== 'cell') continue;
                var addr = decode_cell(record[1]);
                if(arr.length <= addr.r) for(R = arr.length; R <= addr.r; ++R) if(!arr[R]) arr[R] = [];
                R = addr.r; C = addr.c;
                switch(record[2]) {
                        case 't': arr[R][C] = record[3]; break;
                        case 'v': arr[R][C] = +record[3]; break;
                        case 'vtc': case 'vtf':
                                switch(record[3]) {
                                        case 'nl': arr[R][C] = +record[4] ? true : false; break;
                                        default: arr[R][C] = +record[4]; break;
                                } break;
                }
        }
        return arr;
};
function decode_row(rowstr) { return parseInt(rowstr,10) - 1; }
function decode_col(colstr) { var c = colstr, d = 0, i = 0; for(; i !== c.length; ++i) d = 26*d + c.charCodeAt(i) - 64; return d - 1; }
function split_cell(cstr) { return cstr.replace(/(\$?[A-Z]*)(\$?\d*)/,"$1,$2").split(","); }
function decode_cell(cstr) { var splt = split_cell(cstr); return { c:decode_col(splt[0]), r:decode_row(splt[1]) }; }



export default Transmit.createContainer(SheetViewer, {
    queries: {
        sheet({src}) {
            if (!src) return new Promise((cb)=>cb(''))
            return request.get(src).then((res) => res.text)
        }
    }
})

