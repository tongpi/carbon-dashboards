/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { FlatButton } from 'material-ui';
import { ActionViewModule } from 'material-ui/svg-icons';

class PortalButton extends Component {
    render() {
        return (
            <FlatButton
                style={{ minWidth: '48px' }}
                label={<FormattedMessage id='portal.title' defaultMessage='Portal' />}
                icon={<ActionViewModule />}
                onClick={() => this.props.history.push('/')}
            />
        );
    }
}

PortalButton.propTypes = {
    history: PropTypes.shape({}).isRequired,
};

export default withRouter(PortalButton);
