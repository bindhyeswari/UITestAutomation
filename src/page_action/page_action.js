/**
 * Created by bmishra on 7/22/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {broadcast} from '../modules/chromeUtilities';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.getLogger = this.getLogger.bind(this);
        this.state = {
            logs: {}
        };
    }

    getLogger() {
        broadcast({eventType: 'getLogger'}, (response) => {
            console.log(response);
            this.setState({
                logs: response
            });
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.getLogger}>Refresh Logs</button>
                <div>
                    {JSON.stringify(this.state.logs)}
                </div>
                <ul>
                    <li>Log Data Here ...</li>
                </ul>
            </div>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById('app'));
