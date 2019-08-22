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
// App Components
import TextProperty from '../../inputTypes/TextProperty';
import SwitchProperty from '../../inputTypes/SwitchProperty';
import StreamProperty from '../../inputTypes/StreamProperty';
// App Utilities
import Types from '../../../utils/Types';

/**
 * Represents a Number chart
 */
class Number extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configuration: props.configuration,
        };
    }

    /**
     * Assigns value for the main chart's main property, that has the given key
     * @param key
     * @param value
     */
    handlePropertyChange(key, value) {
        const state = this.state;
        state.configuration[key] = value;
        this.setState(state);
        this.props.onConfigurationChange(state.configuration);
    }

    render() {
        return (
            <div>
                <StreamProperty
                    id="x"
                    value={this.state.configuration.x}
                    fieldName="要显示的数字字段*"
                    filter={Types.dataset.metadata.linear}
                    onChange={(id, value) => this.handlePropertyChange(id, value)}
                    metadata={this.props.metadata}
                    fullWidth
                />
                <br />
                <TextProperty
                    id="title"
                    value={this.state.configuration.title}
                    fieldName="图表的标题*"
                    onChange={(id, value) => this.handlePropertyChange(id, value)}
                    fullWidth
                />
                <br />
                <br />
                <br />
                <SwitchProperty
                    id="showDifference"
                    value={this.state.configuration.showDifference}
                    fieldName="显示相对于上一个数字的变化"
                    onChange={(id, value) => this.handlePropertyChange(id, value)}
                />
                <br />
                <br />
                <SwitchProperty
                    id="showPercentage"
                    value={this.state.configuration.showPercentage}
                    fieldName="显示相对于上一个数字的变化百分比"
                    onChange={(id, value) => this.handlePropertyChange(id, value)}
                />
                <br />
            </div>
        );
    }
}

export default Number;
