import React from 'react';
import { Card, Select } from 'antd';
import * as D3Demos from './../../components/d3/index';
const { Option } = Select;
class ChartDemo extends React.Component {
    state = {
        activeDemo: 'D3Chart',
    }

    render() {
        const Chart = D3Demos[this.state.activeDemo];
        return (
            <div className="chart-d3">
                <Card 
                    title="d3 demo"
                >   
                    <div>
                        <Select
                            style={{minWidth:'300px'}}
                            value={this.state.activeDemo}
                            onChange={(value)=>{this.setState({activeDemo:value})}}
                        >
                            {
                                Object.keys(D3Demos).map(key=>(
                                    <Option key={`${key}`}>{key}</Option>     
                                ))
                            }
                        </Select>
                    </div>
                    { Chart ? (<Chart />) : 'not fund'}
                </Card>
            </div>
        )
    }
}
export default ChartDemo;