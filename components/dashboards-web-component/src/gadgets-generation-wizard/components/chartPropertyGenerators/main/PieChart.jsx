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
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add';
import ClearButton from 'material-ui/svg-icons/content/clear';
import SwitchProperty from '../../inputTypes/SwitchProperty';
// App Components
import TextProperty from '../../inputTypes/TextProperty';
import SelectProperty from '../../inputTypes/SelectProperty';
import ColorProperty from '../../inputTypes/ColorProperty';
import StreamProperty from '../../inputTypes/StreamProperty';
// App Utilities
import Types from '../../../utils/Types';
import Constants from '../../../utils/Constants';

/**
 * Represents a Pie chart
 */
class Pie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configuration: props.configuration,
            expandAdvanced: false,
        };
    }

    /**
     * Assigns value for the main chart's main property, that has the given key
     * @param key
     * @param value
     */
    handleChartPropertyChange(key, value) {
        const state = this.state;
        state.configuration[key] = value;
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    /**
     * Assigns value for the main chart's style property, that has the given key
     * @param key
     * @param value
     */
    handleChartStylePropertyChange(key, value) {
        const state = this.state;
        state.configuration.style[key] = value;
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    /**
     * Assigns value for the property with the given key, under the charts array
     * @param key
     * @param value
     */
    handleInnerChartPropertyChange(key, value) {
        const state = this.state;
        state.configuration.charts[0][key] = value;
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    /**
     * Adds an empty color member
     * @param parentName
     * @param subChartIndex
     */
    addColorMember(parentName) {
        const state = this.state;
        state.configuration.charts[0][parentName].push('');
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    /**
     * Assigns changed value of a color member denoted with the given index, belonging to the sub chart with
     * the given index
     * @param parentName
     * @param memberIndex
     * @param value
     */
    handleColorMemberChange(parentName, memberIndex, value) {
        const state = this.state;
        state.configuration.charts[0][parentName][memberIndex] = value;
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    /**
     * Removes the color member that has the given index
     * @param parentName
     * @param colorMemberIndex
     */
    removeColorMember(parentName, colorMemberIndex) {
        const state = this.state;
        state.configuration.charts[0][parentName].splice(colorMemberIndex, 1);
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    render() {
        return (
            <div>
                <StreamProperty
                    id="x"
                    value={this.state.configuration.charts[0].x}
                    fieldName="数据字段*"
                    filter={Types.dataset.metadata.linear}
                    onChange={(id, value) => this.handleInnerChartPropertyChange(id, value)}
                    metadata={this.props.metadata}
                    fullWidth
                />
                <br />
                <SelectProperty
                    id="chartType"
                    value={this.state.configuration.chartType}
                    fieldName="图表类型*"
                    options={{
                        values: [Types.chart.pie, Types.chart.donut, Types.chart.gauge],
                        texts: [Constants.CHART_NAMES.PIE_CHART, Constants.CHART_NAMES.DONUT_CHART,
                            Constants.CHART_NAMES.GAUGE_CHART],
                    }}
                    onChange={(id, value) => this.handleChartPropertyChange(id, value)}
                    fullWidth
                />
                <br />
                <StreamProperty
                    id="color"
                    value={this.props.configuration.charts[0].color}
                    fieldName="颜色类别字段*"
                    filter={Types.dataset.metadata.ordinal}
                    onChange={(id, value) => this.handleInnerChartPropertyChange(id, value)}
                    metadata={this.props.metadata}
                    fullWidth
                />
                <br />
                <br />
                <SwitchProperty
                    id="legend"
                    value={this.state.configuration.legend}
                    fieldName="显示图例"
                    onChange={(id, value) => this.handleChartPropertyChange(id, value)}
                />
                <br />
                <br />
                {/* Optional configuration properties */}
                <Card
                    style={this.state.expandAdvanced ? { padding: 30 } : { padding: 10 }}
                    expanded={this.state.expandAdvanced}
                    onExpandChange={e => this.setState({ expandAdvanced: e })}
                >
                    <CardHeader
                        title="高级设置"
                        actAsExpander
                        showExpandableButton
                    />
                    <CardMedia
                        expandable
                    >
                        <br />
                        <br />
                        <SwitchProperty
                            id="append"
                            value={this.state.configuration.append}
                            fieldName="添加新数据到图表"
                            onChange={(id, value) => this.handleChartPropertyChange(id, value)}
                        />
                        <br />
                        <br />
                        <SelectProperty
                            id="legendOrientation"
                            value={this.state.configuration.legendOrientation}
                            fieldName="相对于图表的图例位置"
                            options={{
                                values: ['top', 'bottom', 'left', 'right'],
                                texts: ['上方', '下方', '左边', '右边'],
                            }}
                            onChange={(id, value) => this.handleChartPropertyChange(id, value)}
                            fullWidth
                        />
                        <br />
                        <br />
                        <a style={{ verticalAlign: 'center' }}>Color set to use in the charts</a>
                        {(this.props.configuration.charts[0].colorScale.length === 0) ?
                            (
                                <a>
                                    &nbsp; &nbsp;
                                    <FlatButton
                                        primary
                                        label="缺省"
                                        onClick={() => this.addColorMember('colorScale')}
                                    />
                                </a>
                            ) : (null)}
                        <Table>
                            <TableBody displayRowCheckbox={false}>
                                {this.props.configuration.charts[0].colorScale.map((color, index) =>
                                    (<TableRow key={index}>
                                        <TableRowColumn>
                                            <ColorProperty
                                                id={'colorScale' + index}
                                                value={color}
                                                onChange={(id, value) =>
                                                    this.handleColorMemberChange('colorScale', index, value)}
                                            />
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <IconButton onClick={() =>
                                                this.removeColorMember('colorScale', index)}
                                            >
                                                <ClearButton />
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                        <br />
                        {(this.props.configuration.charts[0].colorScale.length !== 0) ?
                            (<div>
                                <IconButton onClick={() => this.addColorMember('colorScale')}>
                                    <AddButton />
                                </IconButton>
                                <br />
                            </div>) : (null)}
                        <br />
                        <a>如果某些类别需要按特定颜色分组</a>
                        <Table>
                            <TableBody displayRowCheckbox={false}>
                                {this.props.configuration.charts[0].colorDomain.map((colorDomainMember, index) =>
                                    (<TableRow key={index}>
                                        <TableRowColumn>
                                            <TextProperty
                                                id={'colorDomain' + index}
                                                value={colorDomainMember}
                                                onChange={(id, value) =>
                                                    this.handleColorMemberChange('colorDomain', index, value)}
                                            />
                                            <br />
                                        </TableRowColumn>
                                        <TableRowColumn>
                                            <IconButton onClick={() =>
                                                this.removeColorMember('colorDomain', index)}
                                            >
                                                <ClearButton />
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>))}
                            </TableBody>
                        </Table>
                        <div>
                            <IconButton onClick={() => this.addColorMember('colorDomain')}>
                                <AddButton />
                            </IconButton>
                            <br />
                        </div>
                        <h3>样式</h3>
                        <ColorProperty
                            id="legendTitleColor"
                            value={this.state.configuration.style.legendTitleColor}
                            fieldName="图例标题色"
                            onChange={(id, value) => this.handleChartStylePropertyChange(id, value)}
                            fullWidth
                        />
                        <br />
                        <ColorProperty
                            id="legendTextColor"
                            value={this.state.configuration.style.legendTextColor}
                            fieldName="图例文本色"
                            onChange={(id, value) => this.handleChartStylePropertyChange(id, value)}
                            fullWidth
                        />
                        <br />
                    </CardMedia>
                </Card>
            </div>
        );
    }
}

export default Pie;
