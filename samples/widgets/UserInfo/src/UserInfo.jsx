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

import React from 'react';
import Widget from '@wso2-dashboards/widget';

/**
 * Demonstrates how to retrieve user information from a widget.
 */
class UserInfo extends Widget {
    /**
     * Constructor.
     */
    constructor(props) {
        super(props);
    }


    render() {
        let styles = {
            container: {
                fontFamily: 'Roboto, sans-serif',
                color: '#afafaf',
                textAlign: 'center',
            },
        };

        // This returns user object with available user info attributes.
        // Syntax: super.getCurrentUser()
        // Return {{username: string}}
        const user = super.getCurrentUser();
        return (
            <div style={styles.container}>
                <h3>用户信息</h3>
                <p style={{fontSize: '1.8em'}}><strong>用户名: </strong>{user.username}</p>
            </div>
        );
    }
}

global.dashboard.registerWidget("UserInfo", UserInfo);
