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
import TextField from 'material-ui/TextField';

/**
 * Displays data provider selection, and the properties related to the selected provider type
 */
class GadgetDetailsConfigurator extends Component {
    render() {
        return (
            <div style={{ margin: 10, fontFamily: 'Roboto, sans-serif', color: 'white' }}>
                <TextField
                    id='name'
                    name='name'
                    floatingLabelText='输入小部件的名称'
                    hintText='例如. 销售增长'
                    value={this.props.gadgetDetails.name}
                    onChange={e => this.props.handleGadgetDetailsChange('name', e.target.value)}
                    fullWidth
                />
                <br />
            </div>
        );
    }
}

export default GadgetDetailsConfigurator;
