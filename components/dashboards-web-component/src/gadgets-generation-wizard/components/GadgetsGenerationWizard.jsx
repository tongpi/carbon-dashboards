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
import { FormattedMessage } from 'react-intl';
import defaultTheme from '../../utils/Theme';
import { withRouter } from 'react-router-dom';
// Material UI Components
import { Step, StepLabel, Stepper } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import { darkBaseTheme, getMuiTheme, MuiThemeProvider } from 'material-ui/styles';
// App Components
import FormPanel from '../../common/FormPanel';
import Header from '../../common/Header';
import ChartConfigurator from './ChartConfigurator';
import ProviderConfigurator from './ProviderConfigurator';
import UtilFunctions from '../utils/UtilFunctions';
import GadgetDetailsConfigurator from './GadgetDetailsConfigurator';
import ChartPreviewer from './chartPreview/ChartPreviewer';
// API
import GadgetsGenerationAPI from '../../utils/apis/GadgetsGenerationAPI';

const appContext = window.contextPath;

/**
 * Style constants
 */
const styles = {
    messageBox: { textAlign: 'center', color: 'white' },
    errorMessage: { backgroundColor: '#FF5722', color: 'white' },
    successMessage: { backgroundColor: '#4CAF50', color: 'white' },
    completedStepperText: { color: 'white' },
    activeStepperText: { color: '#0097A7' },
    inactiveStepperText: { color: '#FFFFFF', opacity: 0.3 },
};

/**
 * Represents a main chart, that can have Line / Bar / Area assub charts
 */
class GadgetsGenerationWizard extends Component {
    constructor() {
        super();
        this.state = {
            // Data related
            isGadgetDetailsValid: false,
            isProviderConfigurationValid: false,
            gadgetDetails: {
                name: '',
            },
            providerType: '',
            providersList: [],
            providerConfiguration: {},
            providerConfigRenderTypes: {},
            providerConfigRenderHints:{},
            providerDescription: '',
            chartConfiguration: {},
            pubsub: {},
            metadata: {
                names: [],
                types: [],
            },
            data: [],
            // UI related
            isSnackbarOpen: false,
            snackbarMessage: '',
            snackbarMessageType: '',
            loading: false,
            finished: false,
            stepIndex: 0,
            previewGadget: false,
            previewConfiguration: {},
        };
        this.handleGadgetDetailsChange = this.handleGadgetDetailsChange.bind(this);
        this.handleProviderTypeChange = this.handleProviderTypeChange.bind(this);
        this.handleProviderConfigPropertyChange = this.handleProviderConfigPropertyChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.updateChartConfiguration = this.updateChartConfiguration.bind(this);
        this.previewGadget = this.previewGadget.bind(this);
        this.dummyAsync = this.dummyAsync.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleDynamicQuery = this.handleDynamicQuery.bind(this);
        this.handleMetadataInput = this.handleMetadataInput.bind(this);
        GadgetsGenerationWizard.getPubSubConfiguration = GadgetsGenerationWizard.getPubSubConfiguration.bind(this);
    }

    componentDidMount() {
        const api = new GadgetsGenerationAPI();
        api.getProvidersList().then((response) => {
            this.setState({
                providersList: response.data,
            });
        });
    }

    /**
     * Updates the value of a detail related to the gadget
     * @param key
     * @param value
     */
    handleGadgetDetailsChange(key, value) {
        const state = this.state;
        state.gadgetDetails[key] = value;
        this.setState(state);
    }

    handleMetadataInput(metadata) {
        this.setState({ metadata });
    }

    /**
     * Updates the selected provider's type, and specific configuration in the state when a provider is selected
     * @param providerType
     */
    handleProviderTypeChange(providerType) {
        const apis = new GadgetsGenerationAPI();
        apis.getProviderConfiguration(providerType).then((response) => {
            // Set configuration of pre-configured H2 database
            if (providerType === 'RDBMSBatchDataProvider') {
                this.setState({
                    providerType,
                    providerConfigRenderTypes: UtilFunctions.getDefaultH2RenderTypes(),
                    providerConfiguration: UtilFunctions.getDefaultH2Config(),
                    providerConfigRenderHints: response.data[2],
                    providerDescription: response.data[3] || '',
                });
            } else {
                this.setState({
                    providerType,
                    providerConfigRenderTypes: response.data[0],
                    providerConfiguration: response.data[1],
                    providerConfigRenderHints: response.data[2],
                    providerDescription: response.data[3] || '',
                });
            }
        }).catch(() => {
            this.displaySnackbar('加载提供者配置失败', 'errorMessage');
        });
    }

    /**
     * Sets changed property value of provider configuration in state
     * @param propertyKey
     * @param propertyValue
     */
    handleProviderConfigPropertyChange(propertyKey, propertyValue) {
        const state = this.state;
        state.providerConfiguration[propertyKey] = propertyValue;
        this.setState(state);
    }

    /**
     * Updates the chart configuration
     * @param chartConfiguration
     */
    updateChartConfiguration(chartConfiguration) {
        this.setState({ chartConfiguration });
    }

    /**
     * Previews the gadget
     */
    previewGadget() {
        const validatedConfiguration = this.child.getValidatedConfiguration();
        if (!UtilFunctions.isEmpty(validatedConfiguration)) {
            const previewableConfig = {
                name: this.state.gadgetDetails.name,
                id: (UtilFunctions.generateID(this.state.gadgetDetails.name)),
                configs: {
                    providerConfig: {
                        configs: {
                            type: this.state.providerType,
                            config: this.state.providerConfiguration,
                        },
                    },
                    chartConfig: validatedConfiguration,
                },
            };
            this.setState({
                previewConfiguration: previewableConfig,
                previewGadget: true,
            });
        } else {
            this.displaySnackbar('Please fill in required values', 'errorMessage');
        }
    }

    /**
     * Submits gadget configuration
     */
    submitGadgetConfig() {
        const validatedConfiguration = this.child.getValidatedConfiguration();
        if (!UtilFunctions.isEmpty(validatedConfiguration)) {
            const submittableConfig = {
                name: this.state.gadgetDetails.name,
                id: (UtilFunctions.generateID(this.state.gadgetDetails.name)),
                version: '1.0.0',
                chartConfig: validatedConfiguration,
                pubsub: GadgetsGenerationWizard.getPubSubConfiguration(validatedConfiguration.widgetOutputConfigs,
                    this.state.providerConfiguration.queryData.customWidgetInputs),
                providerConfig: {
                    configs: {
                        type: this.state.providerType,
                        config: this.state.providerConfiguration,
                    },
                },
                metadata: this.state.metadata,
            };
            const apis = new GadgetsGenerationAPI();
            apis.addGadgetConfiguration(JSON.stringify(submittableConfig)).then((response) => {
                if (response.status === 201) {
                    this.displaySnackbar(`小部件 ${this.state.gadgetDetails.name} 创建成功!`,
                        'successMessage');
                    setTimeout(() => {
                        this.props.history.push('/');
                    }, 1000);
                } else {
                    this.displaySnackbar('小部件保存失败', 'errorMessage');
                }
            }).catch(() => {
                this.displaySnackbar('小部件保存失败', 'errorMessage');
            });
        } else {
            this.displaySnackbar('Please fill in required values', 'errorMessage');
        }
    }

    /* Wizard pages navigation related functions [START] */

    handleFormSubmit(event) {
        event.preventDefault();
        this.handleNext();
    }

    dummyAsync(cb) {
        this.setState({ loading: true }, () => {
            this.asyncTimer = setTimeout(cb, 500);
        });
    }

    handleDynamicQuery(queryFunctionImpl, customWidgetInputs, systemWidgetInputs, parameters, defaultValues) {
        this.widgetInputsDefaultValues = defaultValues.split(',');
        const queryFunction = 'this.getQuery = function (' + parameters + '){' + queryFunctionImpl + '}';
        this.handleProviderConfigPropertyChange('queryData', {
            queryFunction,
            customWidgetInputs,
            systemWidgetInputs,
        });
    }

    static getPubSubConfiguration(widgetOutputConfigs, customWidgetInputs) {
        const pubsub = {};
        pubsub.types = [];
        if (customWidgetInputs.length !== 0) {
            pubsub.types.push('subscriber');
            pubsub.subscriberWidgetInputs = customWidgetInputs.map((widgetInput) => {
                return widgetInput.name;
            });
        }
        if (widgetOutputConfigs && widgetOutputConfigs.length !== 0) {
            pubsub.types.push('publisher');
            pubsub.publisherWidgetOutputs = widgetOutputConfigs.map((outputAttribute) => {
                return outputAttribute.publishedAsValue;
            });
        }
        return pubsub;
    }


    /**
     * Handles onClick of Next button, including validations
     */
    handleNext() {
        const { stepIndex } = this.state;
        const apis = new GadgetsGenerationAPI();
        switch (stepIndex) {
            case (0):
                // Validate gadget details & proceed for selecting provider
                if (this.state.gadgetDetails.name !== '') {
                    apis.validateWidgetName(this.state.gadgetDetails.name).then((response) => {
                        if (response.status === 200) {
                            if (!this.state.loading) {
                                this.dummyAsync(() => this.setState({
                                    loading: false,
                                    isGadgetDetailsValid: true,
                                    stepIndex: stepIndex + 1,
                                    finished: stepIndex >= 2,
                                }));
                            }
                        }
                    }).catch((error) => {
                        if (error.response) {
                            if (error.response.status === 409) {
                                this.displaySnackbar('同名小部件已存在', 'errorMessage');
                            } else {
                                this.displaySnackbar('不能进入下一步', 'errorMessage');
                            }
                        } else {
                            this.displaySnackbar('不能处理你的请求', 'errorMessage');
                        }
                    });
                } else {
                    this.displaySnackbar('小部件名称不能为空', 'errorMessage');
                }
                break;
            case (1):
                // Validate provider configuration and get metadata
                const isProviderConfigurationValid = true;
                if (!UtilFunctions.isEmpty(this.state.providerConfiguration)) {
                    if (this.state.providerType !== 'WebSocketProvider') {
                        eval(this.state.providerConfiguration.queryData.queryFunction);
                        this.state.providerConfiguration.queryData.query = this.getQuery.apply(this, this.widgetInputsDefaultValues);
                        apis.getProviderMetadata(this.state.providerType,
                            this.state.providerConfiguration).then((response) => {
                            if (!this.state.loading) {
                                this.dummyAsync(() => this.setState({
                                    loading: false,
                                    isGadgetDetailsValid: true,
                                    stepIndex: stepIndex + 1,
                                    finished: stepIndex >= 2,
                                    metadata: response.data,
                                }));
                            }
                        }).catch(() => {
                            this.displaySnackbar('Unable to process your request', 'errorMessage');
                        });
                    } else if (ProviderConfigurator.validateWebSocketConfig(this.state.providerConfiguration) &&
                            ProviderConfigurator.validateMetadata(this.state.metadata)) {
                        this.state.providerConfiguration.queryData = {
                            customWidgetInputs: [],
                        };
                        this.setState({
                            loading: false,
                            isGadgetDetailsValid: true,
                            stepIndex: stepIndex + 1,
                            finished: stepIndex >= 2,
                        });
                    } else {
                        this.displaySnackbar('Please provide a valid configuration', 'errorMessage');
                    }
                } else {
                    this.displaySnackbar('请选择一个数据提供者并对其仔细配置', 'errorMessage');
                }
                break;
            case (2):
                this.submitGadgetConfig();
                break;
            default:
                this.displaySnackbar('该步无效', 'errorMessage');
        }
    }

    handlePrev() {
        const { stepIndex } = this.state;
        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex - 1,
            }));
        }
    }

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <GadgetDetailsConfigurator
                        gadgetDetails={this.state.gadgetDetails}
                        handleGadgetDetailsChange={this.handleGadgetDetailsChange}
                    />
                );
            case 1:
                return (
                    <ProviderConfigurator
                        providersList={this.state.providersList}
                        providerType={this.state.providerType}
                        configuration={this.state.providerConfiguration}
                        configRenderTypes={this.state.providerConfigRenderTypes}
                        configRenderHints={this.state.providerConfigRenderHints}
                        configProviderDescription={this.state.providerDescription}
                        providerMetadata={this.state.metadata}
                        handleProviderTypeChange={this.handleProviderTypeChange}
                        handleProviderConfigPropertyChange={this.handleProviderConfigPropertyChange}
                        handleMetadataInput={this.handleMetadataInput}
                        handleDynamicQuery={this.handleDynamicQuery}
                    />
                );
            case 2:
                return (
                    <ChartConfigurator
                        onRef={ref => (this.child = ref)}
                        metadata={this.state.metadata}
                        onConfigurationChange={this.updateChartConfiguration}
                        onPreview={this.previewGadget}
                    />
                );
            default:
                return '该步无效';
        }
    }

    renderNextButton(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <RaisedButton
                        label="下一步"
                        primary
                        style={{ marginRight: 12 }}
                        onClick={this.handleNext}
                    />
                );
            case 1:
                return (
                    <RaisedButton
                        label="下一步"
                        primary
                        style={{ marginRight: 12 }}
                        onClick={this.handleNext}
                    />
                );
            case 2:
                return (
                    <RaisedButton
                        label="创建"
                        primary
                        style={{ marginRight: 12 }}
                        onClick={() => this.submitGadgetConfig()}
                    />
                );
            default:
                return null;
        }
    }

    renderContent() {
        const { finished, stepIndex } = this.state;
        const contentStyle = { margin: '0 16px', overflow: 'hidden' };

        if (finished) {
            return (
                <div style={contentStyle}>
                    <p>
                        <a
                            href={appContext}
                            onClick={(event) => {
                                event.preventDefault();
                                this.setState({ stepIndex: 0, finished: false });
                            }}
                        >
                            Reset
                        </a>
                    </p>
                </div>
            );
        }

        return (
            <div style={contentStyle}>
                <div>{this.getStepContent(stepIndex)}</div>
                <div style={{ marginTop: 24, marginBottom: 12 }}>
                    <FlatButton
                        label="后退"
                        disabled={stepIndex === 0}
                        onClick={this.handlePrev}
                        style={{ marginRight: 12 }}
                    />
                    {this.renderNextButton(stepIndex)}
                    <FlatButton
                        label="取消"
                        onClick={() => this.props.history.push('/')}
                        style={{marginRight: 12}}
                    />
                </div>
            </div>
        );
    }

    /* Wizard pages navigation related functions [END] */

    /**
     * Displays snackbar with the given message, and refers to the style with the provided key
     * @param message
     * @param styleKey
     */
    displaySnackbar(message, styleKey) {
        this.setState({
            snackbarMessage: message,
            isSnackbarOpen: true,
            snackbarMessageType: styleKey,
        });
    }

    /**
     * Returns style for the stepper text based on the given current and self indexes
     * @param currentIndex
     * @param selfIndex
     */
    getStepperTextStyle(currentIndex, selfIndex) {
        if (selfIndex === currentIndex) {
            return styles.activeStepperText;
        } else if (selfIndex < currentIndex) {
            return styles.completedStepperText;
        } else {
            return styles.inactiveStepperText;
        }
    }

    render() {
        const { loading, stepIndex } = this.state;

        return (
            <MuiThemeProvider muiTheme={defaultTheme}>
                <div>
                    <Header title={<FormattedMessage id="widget-gen-wizard.title" defaultMessage="Widget Designer" />}/>
                    <Dialog
                        modal={false}
                        open={this.state.previewGadget}
                        onRequestClose={() => this.setState({ previewGadget: false })}
                        repositionOnUpdate
                    >
                        <ChartPreviewer
                            config={this.state.previewConfiguration}
                        />
                    </Dialog>
                    <FormPanel
                        title={<FormattedMessage id="create.widget" defaultMessage="Create Widget" />}
                        width="800"
                        onSubmit={this.handleFormSubmit}
                    >
                        <div style={{ align: 'center' }}>
                            <Stepper activeStep={stepIndex}>
                                <Step>
                                    <StepLabel
                                        style={this.getStepperTextStyle(stepIndex, 0)}
                                    >
                                        输入小部件名称
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel
                                        style={this.getStepperTextStyle(stepIndex, 1)}
                                    >
                                        配置数据提供者
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel
                                        style={this.getStepperTextStyle(stepIndex, 2)}
                                    >
                                        配置图表
                                    </StepLabel>
                                </Step>
                            </Stepper>
                            <ExpandTransition loading={loading} open>
                                {this.renderContent()}
                            </ExpandTransition>
                        </div>
                    </FormPanel>
                    <Snackbar
                        open={this.state.isSnackbarOpen}
                        message={this.state.snackbarMessage}
                        autoHideDuration={4000}
                        onRequestClose={() => {
                            this.setState({
                                snackbarMessage: '',
                                isSnackbarOpen: false,
                            });
                        }}
                        contentStyle={styles.messageBox}
                        bodyStyle={styles[this.state.snackbarMessageType]}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(GadgetsGenerationWizard);
