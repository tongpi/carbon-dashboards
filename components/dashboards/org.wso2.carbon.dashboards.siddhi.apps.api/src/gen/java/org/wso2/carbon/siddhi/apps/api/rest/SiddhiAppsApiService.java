/*
 *   Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing,
 *   software distributed under the License is distributed on an
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *   KIND, either express or implied.  See the License for the
 *   specific language governing permissions and limitations
 *   under the License.
 *
 */

package org.wso2.carbon.siddhi.apps.api.rest;

import org.wso2.msf4j.Request;
import javax.ws.rs.core.Response;

@javax.annotation.Generated(value = "io.swagger.codegen.languages.JavaMSF4JServerCodegen",
        date = "2017-11-01T11:26:25.925Z")
/**
 * Auto generated class from Swagger to MSF4J.
 */
public abstract class SiddhiAppsApiService {

    //Get siddhi apps which have store annotated elements
    public abstract Response getSiddhiApps(Request request);

    //Get siddhi store elements from a siddhi app
    public abstract Response getSiddhiAppStoreElements(Request request, String appName);
}
