import React from 'react'
import Transmit from 'react-transmit'
import request from 'superagent-bluebird-promise'

class SheetViewer extends React.Component {
    componentWillMount() { this.props.setQueryParams(this.props) }
    componentWillReceiveProps(nextProps) { this.props.setQueryParams(nextProps) }
    render() {
        const {style, sheet, src} = this.props;
        return <pre style={style}>{sheet}</pre>
    }
}
export default Transmit.createContainer(SheetViewer, {
    queries: {
        sheet({src}) {
            if (!src) return new Promise((cb)=>cb(''))
            return request.get(src).then((res) => res.text)
        }
    }
})

