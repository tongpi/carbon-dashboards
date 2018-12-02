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

import Axios from 'axios';
import Qs from 'qs';
import {MediaType} from '../Constants';
import AuthManager from '../../auth/utils/AuthManager';
import DashboardUtils from '../DashboardUtils';

const REFRESH_TOKEN_COOKIE = 'PRT';

/**
 * Authentication API base path.
 */
const basePath = window.location.origin;

/**
 * Password grant type.
 */
const passwordGrantType = 'password';

/**
 * App context sans starting forward slash.
 */
const appContext = window.contextPath.substr(1);

/**
 * Authentication API client.
 */
export default class AuthenticationAPI {
    /**
     * Get HTTP client.
     *
     * @return {AxiosInstance} Axios client
     */
    static getHttpClient() {
        const client = Axios.create({
            baseURL: basePath,
            timeout: 2000,
        });
        client.defaults.headers.post['Content-Type'] = MediaType.APPLICATION_JSON;
        return client;
    }

    /**
     * Login user.
     *
     * @param {string} username Username
     * @param {string} password Password
     * @param {boolean} rememberMe Remember me flag
     * @return {AxiosPromise} Axios promise
     */
    static login(username, password, rememberMe = false) {
        return AuthenticationAPI
            .getHttpClient()
            .post(`/login/${appContext}`, Qs.stringify({
                username,
                password,
                grantType: passwordGrantType,
                rememberMe,
                appId: 'dash-' + DashboardUtils.generateUuid(),
            }), {
                headers: {
                    'Content-Type': MediaType.APPLICATION_WWW_FORM_URLENCODED,
                },
            });
    }

    /**
     * Get new token using refresh token
     *
     * @return {AxiosPromise} Axios promise
     */
    static getAccessTokenWithRefreshToken() {
        return AuthenticationAPI
            .getHttpClient()
            .post(`/login/${appContext}`, Qs.stringify({
                grantType: 'refresh_token',
                rememberMe: true
            }), {
                headers: {
                    'Content-Type': MediaType.APPLICATION_WWW_FORM_URLENCODED,
                    'Authorization': "Bearer " + AuthManager.getCookie(REFRESH_TOKEN_COOKIE),
                    'Accept': 'application/json'
                },
            });
    }

    /**
     * Logout user.
     *
     * @param {string} token Partial access token
     * @return {AxiosPromise} Axios promise
     */
    static logout(token) {
        return AuthenticationAPI
            .getHttpClient()
            .post(`/logout/${appContext}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    }

    /**
     * Get all roles.
     *
     * @returns {Promise} Promise
     */
    static getRoles() {
        let client = AuthenticationAPI.getHttpClient();
        client.defaults.headers.common['Authorization'] = "Bearer " + AuthManager.getUser().SDID;
        return client.get(`${window.contextPath}/apis/dashboards/roles`);
    }

    /**
     * Get roles by username.
     *
     * @param {string} username Username
     * @returns {Promise} Promise
     */
    static getUserRoles(username) {
        let client = AuthenticationAPI.getHttpClient();
        client.defaults.headers.common['Authorization'] = "Bearer " + AuthManager.getUser().SDID;
        return client.get(`${window.contextPath}/apis/dashboards/roles/${username}`);
    }
}
