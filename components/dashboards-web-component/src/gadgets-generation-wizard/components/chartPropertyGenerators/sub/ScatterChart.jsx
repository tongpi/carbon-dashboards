/*
 *  Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

import React, { Component } from 'react';
// Material UI Components
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add';
import ClearButton from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
// App Components
import ColorProperty from '../../inputTypes/ColorProperty';
import TextProperty from '../../inputTypes/TextProperty';
import StreamProperty from '../../inputTypes/StreamProperty';
// App Utils
import Types from '../../../utils/Types';

/**
 * Represents a sub chart of scatter chart
 */
class Scatter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
        };
    }

    render() {
        return (
            <div>
                <Paper>
                    <div style={{ margin: 20 }}>
                        <StreamProperty
                            id="x"
                            value={this.props.configuration.x}
							fieldName="X 轴*"                            onChange={(id, value) => this.props.handleSubChartPropertyChange(id, value)}
                            metadata={this.props.metadata}
                            fullWidth
                        />
                        <br />
                        <StreamProperty
                            id="y"
                            value={this.props.configuration.y}
							fieldName="Y 轴*"                            filter={Types.dataset.metadata.linear}
                            onChange={(id, value) => this.props.handleSubChartPropertyChange(id, value)}
                            metadata={this.props.metadata}
                            fullWidth
                        />
                        <br />
                        <StreamProperty
                            id="color"
                            value={this.props.configuration.color}
                            fieldName="颜色字段。基于该字段来确定颜色分类"
                            metadata={this.props.metadata}
                            onChange={(id, value) => this.props.handleSubChartPropertyChange(id, value)}
                            fullWidth
                        />
                        <br />
                        <StreamProperty
                            id="size"
                            value={this.props.configuration.size}
                            fieldName="大小字段。 基于该字段来确定标记大小"
                            metadata={this.props.metadata}
                            filter={Types.dataset.metadata.linear}
                            onChange={(id, value) => this.props.handleSubChartPropertyChange(id, value)}
                            fullWidth
                        />
                        <br />
                        <TextProperty
                            id="maxLength"
                            value={this.props.configuration.maxLength}
                            fieldName="要显示的数据的最大长度*"
                            onChange={(id, value) => this.props.handleSubChartPropertyChange(id, value)}
                            number
                            fullWidth
                        />
                        <br />
                        {(this.props.configuration.color !== '') ?
                            (<IconButton onClick={() => this.props.handleSubChartPropertyChange('color', '')}>
                                <ClearButton />
                            </IconButton>) :
                            (null)
                        }
                        <br />
                        {/* When no selection has been made for 'color' */}
                        {(this.props.configuration.color === '') ?
                            (<div>
                                <br />
                                <ColorProperty
                                    id="fill"
                                    value={this.props.configuration.fill}
                                    fieldName="要绘制的数据的颜色"
                                    onChange={(id, value) => this.props.handleSubChartPropertyChange(id, value)}
                                />
                                <br />
                            </div>) : (null)
                        }
                        <br />
                        <a>图表中使用的颜色</a>
                        {(this.props.configuration.colorScale.length === 0) ?
                            (
                                <a>
                                    &nbsp; &nbsp;
                                    <FlatButton
                                        primary
                                        label="缺省"
                                        onClick={() => this.props.addColorMember('colorScale')}
                                    />
                                </a>
                            ) : (null)}
                        <Table>
                            <TableBody displayRowCheckbox={false}>
                                {this.props.configuration.colorScale.map((color, index) =>
                                    (<TableRow key={index}>
                                        <TableRowColumn>
                                            <ColorProperty
                                                id={'colorScale' + index}
                                                value={color}
                                                onChange={(id, value) =>
                                                    this.props.handleSubChartColorMemberChange(
                                                        'colorScale', index, value)}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <IconButton onClick={() =>
                                                this.props.removeSubChartColorMember('colorScale', index)}
                                            >
                                                <ClearButton />
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                        <br />

                        {(this.props.configuration.colorScale.length !== 0) ?
                            (
                                <IconButton onClick={() => this.props.addColorMember('colorScale')}>
                                    <AddButton />
                                </IconButton>
                            ) : (null)}

                        {(this.props.configuration.color !== '') ?
                            (<div>
                                <br />
                                <br />
                                <a>If certain categories are required to be grouped in a certain color</a>
                                <Table>
                                    <TableBody displayRowCheckbox={false}>
                                        {this.props.configuration.colorDomain.map((colorDomainMember, index) =>
                                            (<TableRow key={index}>
                                                <TableRowColumn>
                                                    <TextProperty
                                                        id={'colorDomain' + index}
                                                        value={colorDomainMember}
                                                        onChange={(id, value) =>
                                                            this.props.handleSubChartColorMemberChange(
                                                                'colorDomain', index, value)}
                                                    />
                                                    <br />
                                                </TableRowColumn>
                                                <TableRowColumn>
                                                    <IconButton onClick={() =>
                                                        this.props.removeSubChartColorMember('colorDomain', index)}
                                                    >
                                                        <ClearButton />
                                                    </IconButton>
                                                </TableRowColumn>
                                            </TableRow>))}
                                    </TableBody>
                                </Table>
                                <IconButton onClick={() => this.props.addColorMember('colorDomain')}>
                                    <AddButton />
                                </IconButton>
                                <br />
                                <br />
                            </div>) :
                            (null)}
                        <br />
                        <FlatButton label="删除图表" onClick={() => this.props.removeChart()} primary />
                        <br />
                        <br />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default Scatter;