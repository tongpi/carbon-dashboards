/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.carbon.dashboards.core.internal.roles.provider;

import org.wso2.carbon.dashboards.core.bean.DashboardConfigurations;

import java.util.ArrayList;
import java.util.List;

/**
 * This is the bean class for default roles in deployment yaml.
 */
public class RolesProvider {

    private static final String ROLE_ID = "1";

    private List<String> creatorRoleIds = new ArrayList<>();

    public RolesProvider(DashboardConfigurations dashboardConfigurations) {
        creatorRoleIds.add(ROLE_ID);
        if (dashboardConfigurations.getRoles() != null) {
            readConfigs(dashboardConfigurations);
        }
    }

    private void readConfigs(DashboardConfigurations dashboardConfigurations) {
        if (!dashboardConfigurations.getRoles().getCreators().isEmpty()) {
            creatorRoleIds = dashboardConfigurations.getRoles().getCreators();
        }
    }

    public List<String> getCreatorRoleIds() {
        return creatorRoleIds;
    }
}
