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
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { FlatButton, Menu, MenuItem, Popover } from 'material-ui';
import { ActionAccountCircle } from 'material-ui/svg-icons';

import AuthManager from '../auth/utils/AuthManager';

export default class UserMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false,
            anchorElement: null,
        };
        this.handleUserIconClick = this.handleUserIconClick.bind(this);
        this.handleMenuCloseRequest = this.handleMenuCloseRequest.bind(this);
    }

    handleUserIconClick(event) {
        event.preventDefault();
        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
            anchorElement: event.currentTarget,
        });
    }

    handleMenuCloseRequest() {
        this.setState({
            isMenuOpen: false,
        });
    }

    render() {
        const user = AuthManager.getUser();
        if (user) {
            return (
                <span>
                    <FlatButton
                        style={{ marginTop: '6px' }}
                        label={user.username}
                        onClick={this.handleUserIconClick}
                        icon={<ActionAccountCircle />}
                    />
                    <Popover
                        open={this.state.isMenuOpen}
                        anchorEl={this.state.anchorElement}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        onRequestClose={this.handleMenuCloseRequest}
                    >
                        <Menu>
                            <MenuItem
                                primaryText={<FormattedMessage id='logout' defaultMessage='Logout' />}
                                containerElement={<Link to={'/logout'} />}
                            />
                        </Menu>
                    </Popover>
                </span>
            );
        } else {
            return (
                <FlatButton
                    style={{ marginTop: '6px' }}
                    label={<FormattedMessage id='login' defaultMessage='Login' />}
                    containerElement={<Link to={`/login?referrer=${window.location.pathname}`} />}
                />
            );
        }
    }
}
