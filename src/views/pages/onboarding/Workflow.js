import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Row,
    Col,
    Input,
    Button,
    Label,
    FormFeedback,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    DropdownToggle,
    DropdownItem,
    UncontrolledButtonDropdown,
    DropdownMenu,
    Badge
} from "reactstrap"
import CreatableSelect from "react-select/creatable"
import rfdc from 'rfdc';
import "flatpickr/dist/themes/light.css";
import Select from "react-select"
import {X, Trash2, ChevronDown } from "react-feather"

import chroma from "chroma-js"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import { connect } from "react-redux"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import workflowService from '../../../services/workflow.service'
import userService from '../../../services/user.service';

const colorMultiSelect = '#007bff';
const clone = rfdc();

const DropdownIndicatorClear = props => {
    return null;
};

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = data.color ? chroma(data.color) : "#7367f0"
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? data.color
                    : isFocused
                        ? color.alpha(0.1).css()
                        : null,
            color: isDisabled
                ? "#ccc"
                : isSelected
                    ? chroma.contrast(color, "white") > 2
                        ? "white"
                        : "black"
                    : data.color,
            cursor: isDisabled ? "not-allowed" : "default",

            ":active": {
                ...styles[":active"],
                backgroundColor: !isDisabled && (isSelected ? data.color : "#7367f0")
            }
        }
    },
    multiValue: (styles, { data }) => {
        const color = data.color ? chroma(data.color) : "#7367f0"
        return {
            ...styles,
            backgroundColor: color.alpha(0.1).css()
        }
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color ? data.color : "#7367f0"
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ":hover": {
            backgroundColor: data.color ? data.color : "#7367f0",
            color: "white"
        }
    })
}
class Workflow extends React.Component {
    state = {
        workflowEdit: false,
        pageSize: 20,
        workflowPipeline: [{
            value: 'Onboarding',
            label: 'Onboarding',
            color: colorMultiSelect
        }],
        userTypeOptions: [
            { value: "managers", label: "Users" },
            { value: "subject", label: "Subject" }
        ],
        managers: [],
        selectManagers: [],
        workflowModalType: 'create',
        dform: {
            triggers: [],
            actions: []
        },
        workflowTemplate: {
            name: '',
            description: '',
            triggers: []
        },
        columnDefs: [
            {
                headerName: "Name",
                field: "name",
                suppressSizeToFit: false,
                width: 250
            },
            {
                headerName: "Description",
                field: "description",
                suppressSizeToFit: false,
                width: 250
            },
            {
                headerName: "Actions",
                field: "transactions",
                suppressSizeToFit: false,
                width: 250,
                cellRendererFramework: params => {
                    return (
                        <div className="actions cursor-pointer">
                            <Trash2
                                className="mr-50"
                                size={15}
                                onClick={async () => {
                                    if(window.confirm("Are you sure?")) {
                                        let selectedData = this.gridApi.getSelectedRows();
                                        const workflow = selectedData[0];
                                        await workflowService.deleteWorkflow(workflow);
                                        this.getWorkflows();
                                        this.onSetSidebarOpen(false);
                                    }
                                }}
                            />
                        </div>
                    )
                }
            }
        ],
        defaultColDef: {
            resizable: true,
        },
        rowData: [],
        dform: {
            triggers: [],
            actions: []
        },
        notification: {
            actions: []
        },
        triggerTypes: [
            { type: 'App\\DFormTrigger', label: 'dForm' }
        ],
        actionTypes: [
            { type: 'App\\DFormAction', label: 'dForm' },
            { type: 'App\\NotificationTemplate', label: 'notification' }
        ]
    };

    constructor(props) {
        super(props);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);

        this.templates = {
            trigger: {
                actions: []
            },
            action: {
                action_users: []
            },
        };

        this.templates.workflow = {
            name: '',
            description: '',
            triggers: []
        }

        this.userTargetTypes = {
            subject: 'subject',
            managers: 'managers'
        }

        this.types = {
            dform: {
                trigger: 'App\\DFormTrigger',
                action: 'App\\DFormAction',
            },
            notification: {
                action: 'App\\NotificationTemplate'
            }
        }
    }

    changeUserTypeOption(event, keyTrigger, keyAction) {
        let workflowTemplate = clone(this.state.workflowTemplate);
        workflowTemplate.triggers[keyTrigger].actions[keyAction].user_target_type = event.value;
        if (event.value === this.userTargetTypes.subject) {
            workflowTemplate.triggers[keyTrigger].actions[keyAction].action_users = [];
        }
        this.setState({
            workflowTemplate
        });
    }

    onChangeActionUser(values, keyTrigger, keyAction) {
        let actionUsers = [];
        if (values) {
            actionUsers = values.map((valueObj) => valueObj.value);
        }
        let workflowTemplate = clone(this.state.workflowTemplate);
        workflowTemplate.triggers[keyTrigger].actions[keyAction].action_users = actionUsers;
        this.setState({
            workflowTemplate
        });
    }

    onSetSidebarOpen(open, type = 'create', workflow = false) {
        if (!open) {
            this.clearGridSelection();
            this.setState({ workflowEdit: open });
            return;
        }

        if (type === 'edit' && !workflow) {
            return;
        }

        if (type === 'create') {
            workflow = this.templates.workflow;
        }

        this.setState({
            workflowEdit: open,
            workflowModalType: type,
            workflowTemplate: workflow
        });
    }

    async getTriggers() {
        const response = await workflowService.getDFormTriggers();
        this.setState({ dform: { ...this.state.dform, triggers: response.data.data } })
    }

    async getNotifications() {
        const response = await workflowService.getNotifications();
        this.setState({ notification: { ...this.state.notification, actions: response.data.data } })
    }

    async getActions() {
        const response = await workflowService.getDFormActions();
        this.setState({ dform: { ...this.state.dform, actions: response.data.data } })
    }
    async getWorkflows() {
        const response = await workflowService.getWorkflows();
        this.setState({ rowData: response.data.data })
    }

    async getManagers() {
        const response = await userService.getAll();
        this.setState({ managers: response.data.data })
        this.getSelectManagers();
    }

    transformManagerToSelectFormat(manager) {
        return {
            value: manager,
            label: manager.name + ` (${manager.id})`,
            color: colorMultiSelect
        }
    }

    getSelectManagers() {
        const selectManagers = this.state.managers.map((manager) => {
            return this.transformManagerToSelectFormat(manager)
        });

        this.setState({ selectManagers: selectManagers })
    }

    async componentDidMount() {
        this.getTriggers();
        this.getActions();
        this.getNotifications();
        this.getWorkflows();
        this.getManagers();
    }

    checkTriggersTypeIsCorrect(type) {
        if (type === this.types.dform.trigger) {
            return true;
        }
        return false;
    }

    getTriggersByType(type) {
        if (type === this.types.dform.trigger) {
            return this.state.dform.triggers;
        }
        return [];
    }

    getTriggerActionsByType(type) {
        if (type === this.types.dform.action) {
            return this.state.dform.actions;
        }
        if (type === this.types.notification.action) {
            return this.state.notification.actions;
        }
        return [];
    }

    checkTriggersActionTypeIsCorrect(type) {
        if (type === this.types.dform.action) {
            return true;
        }
        if (type === this.types.notification.action) {
            return true;
        }
        return false;
    }
    componentWillMount() {

    }

    openWorkflow() {
        this.onSetSidebarOpen(true);
    }

    createAction(key) {
        let workflow = clone(this.state.workflowTemplate);
        workflow.triggers[key].actions.push(this.templates.action);
        this.setState({
            workflowTemplate: workflow
        });
    }

    createTrigger() {
        let workflow = clone(this.state.workflowTemplate);
        workflow.triggers.push(this.templates.trigger);
        this.setState({
            workflowTemplate: workflow
        });
    }

    removeAction(triggerKey, actionKey) {
        let workflow = clone(this.state.workflowTemplate);
        workflow.triggers[triggerKey].actions.splice(actionKey, 1)
        this.setState({
            workflowTemplate: workflow
        });
    }

    removeTrigger(triggerKey) {
        let workflow = clone(this.state.workflowTemplate);
        workflow.triggers.splice(triggerKey, 1)
        this.setState({
            workflowTemplate: workflow
        });
    }

    setWorkflowTrigger(keyTrigger, triggerObj) {
        let workflowTemplate = clone(this.state.workflowTemplate);
        workflowTemplate.triggers[keyTrigger].trigger_id = triggerObj.id;
        this.setState({
            workflowTemplate
        });
    }
    setWorkflowTriggerType(keyTrigger, triggerType) {
        let workflowTemplate = clone(this.state.workflowTemplate);
        workflowTemplate.triggers[keyTrigger].trigger_type = triggerType;
        workflowTemplate.triggers[keyTrigger].trigger_id = -1;
        this.setState({
            workflowTemplate
        });
    }

    setWorkflowTriggerAction(keyTrigger, keyAction, actionObj) {
        let workflowTemplate = clone(this.state.workflowTemplate);
        workflowTemplate.triggers[keyTrigger].actions[keyAction].action_id = actionObj.id;
        this.setState({
            workflowTemplate
        });
    }

    setWorkflowTriggerActionType(keyTrigger, keyAction, actionType) {
        let workflowTemplate = clone(this.state.workflowTemplate);
        workflowTemplate.triggers[keyTrigger].actions[keyAction].action_type = actionType;
        workflowTemplate.triggers[keyTrigger].actions[keyAction].action_id = -1;
        this.setState({
            workflowTemplate
        });
    }

    getTriggerNameById(id, type) {
        const trigger = this.getTriggersByType(type).find((trigger => trigger.id === id));
        return trigger ? trigger.trigger : 'none';
    }

    getTriggerTypeName(type) {
        const trigger = this.state.triggerTypes.find((trigger => trigger.type === type));
        return trigger ? trigger.label : 'none';
    }

    getTriggerActionNameById(id, type) {
        const action = this.getTriggerActionsByType(type).find((action => action.id === id));
        return action ? action.action || action.name : 'none';
    }



    getTriggerActionTypeName(type) {
        const action = this.state.actionTypes.find((action => action.type === type));
        return action ? action.label : 'none';
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();

        window.addEventListener('resize', () => {
            this.gridApi.sizeColumnsToFit();
        });
    }

    async submitWorkflow() {

        if (this.state.workflowModalType === 'edit') {
            this.updateWorkflow();
        } else {
            this.createWorkflow();
        }

        this.getWorkflows();
    }

    onSelectionChanged() {
        let selectedData = this.gridApi.getSelectedRows();
        const workflow = selectedData[0];
        this.onSetSidebarOpen(true, 'edit', workflow);
    }
    clearGridSelection() {
        this.gridApi.deselectAll();
        this.gridApi.clearFocusedCell();
    }

    async updateWorkflow() {
        try {
            const response = await workflowService.updateWorkflow(this.state.workflowTemplate);
            toast.success('Success')
        } catch (error) {
            if ('response' in error) {
                if ('error' in error.response.data) {
                    toast.error(error.response.data.error.message)
                }
            }
        }
    }

    async createWorkflow() {
        try {
            const response = await workflowService.createWorkflow(this.state.workflowTemplate);
            this.getWorkflows();
            this.onSetSidebarOpen(false);
            toast.success('Success')
        } catch (error) {
            if ('response' in error) {
                if ('error' in error.response.data) {
                    toast.error(error.response.data.error.message)
                }
            }
        }
    }

    render() {
        const { rowData, columnDefs, defaultColDef, pageSize } = this.state

        const select = <Select
            // components={{ DropdownIndicator: DropdownIndicatorClear }}
            value={this.state.workflowPipeline}
            maxMenuHeight={200}
            isClearable={false}
            styles={colourStyles}
            options={this.state.workflowPipeline}
            className="fix-margin-select"
            onChange={(values) => { }}
            classNamePrefix="select"
            id="languages"
        />

        const workflowEditElement = (
            <Row className="mt-2">
                <Col sm="12">
                    <FormGroup>
                        <Label for="">Name</Label>
                        <Input
                            type="text"
                            name="Name"
                            id="mobileVertical"
                            placeholder="Name"
                            value={this.state.workflowTemplate.name}
                            onChange={(event) => this.setState({ workflowTemplate: { ...this.state.workflowTemplate, name: event.target.value } })}
                        />
                        <FormFeedback></FormFeedback>
                    </FormGroup>
                </Col>
                <Col sm="12">
                    <FormGroup>
                        <Label for="">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="mobileVertical"
                            placeholder="description"
                            value={this.state.workflowTemplate.description}
                            onChange={(event) => this.setState({ workflowTemplate: { ...this.state.workflowTemplate, description: event.target.value } })}
                        />
                        <FormFeedback></FormFeedback>
                    </FormGroup>
                </Col>

                <Col sm="12">
                    {
                        this.state.workflowTemplate.triggers.map((trigger, keyTrigger) =>
                            <ListGroupItem>
                                <ListGroupItemHeading className="d-flex workflow-edit-font-trigger-head">
                                    <X size="15" className="x-closer" onClick={() => { this.removeTrigger(keyTrigger) }} />
                                    <div className="d-flex flex-wrap justify-content-center align-items-center w-100">
                                        <div className="mb-1 w-100 text-center text-primary">Trigger #{keyTrigger + 1}</div>
                                        <div className="text-center w-100">
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle style={{ 'border-radius': 0 }} color="primary" size="sm" caret>
                                                    Onboarding
                                                            <ChevronDown size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem tag="button">Onboarding</DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle style={{ 'border-radius': 0 }} color="primary" size="sm" caret>
                                                    {this.getTriggerTypeName(trigger.trigger_type)}
                                                    <ChevronDown size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {
                                                        this.state.triggerTypes.map((trigger, label) =>
                                                            <DropdownItem onClick={() => this.setWorkflowTriggerType(keyTrigger, trigger.type)} tag="button">{trigger.label}</DropdownItem>
                                                        )
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle disabled={!this.checkTriggersTypeIsCorrect(trigger.trigger_type)} style={{ 'border-radius': 0 }} color="primary" size="sm" caret>
                                                    {this.getTriggerNameById(trigger.trigger_id, trigger.trigger_type)}
                                                    <ChevronDown size={15} />
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {
                                                        this.getTriggersByType(trigger.trigger_type).map((triggerObj) =>
                                                            <DropdownItem onClick={() => this.setWorkflowTrigger(keyTrigger, triggerObj)} tag="button">{triggerObj.trigger}</DropdownItem>
                                                        )
                                                    }
                                                </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                        </div>
                                    </div>
                                </ListGroupItemHeading>
                                <ListGroup className="d-flex mt-2">
                                    {
                                        trigger.actions.map((action, keyAction) =>
                                            <ListGroupItem>
                                                <X size="15" className="x-closer" onClick={() => { this.removeAction(keyTrigger, keyAction) }} />
                                                <div className="d-flex flex-wrap justify-content-center align-items-center w-100">
                                                    <div className="mb-1 w-100 text-center text-primary">Action #{keyAction + 1}</div>
                                                    <div className="text-center w-100">
                                                        <UncontrolledButtonDropdown>
                                                            <DropdownToggle style={{ 'border-radius': 0 }} color="primary" size="sm" caret>
                                                                Onboarding
                                                                        <ChevronDown size={15} />
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem tag="button">Onboarding</DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                        <UncontrolledButtonDropdown>
                                                            <DropdownToggle style={{ 'border-radius': 0 }} color="primary" size="sm" caret>
                                                                {this.getTriggerActionTypeName(action.action_type)}
                                                                <ChevronDown size={15} />
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                {
                                                                    this.state.actionTypes.map((action, label) =>
                                                                        <DropdownItem onClick={() => this.setWorkflowTriggerActionType(keyTrigger, keyAction, action.type)} tag="button">{action.label}</DropdownItem>
                                                                    )
                                                                }
                                                            </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                        <UncontrolledButtonDropdown>
                                                            <DropdownToggle disabled={!this.checkTriggersActionTypeIsCorrect(action.action_type)} style={{ 'border-radius': 0 }} color="primary" size="sm" caret>
                                                                {this.getTriggerActionNameById(action.action_id, action.action_type)}
                                                                <ChevronDown size={15} />
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                {
                                                                    this.getTriggerActionsByType(action.action_type).map((actionObj) =>
                                                                        <DropdownItem onClick={() => this.setWorkflowTriggerAction(keyTrigger, keyAction, actionObj)} tag="button">{actionObj.action || actionObj.name}</DropdownItem>
                                                                    )
                                                                }
                                                            </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                    </div>

                                                    {

                                                        action.action_type === "App\\NotificationTemplate" ?
                                                            <div className="text-center w-100">
                                                                <div className="text-center w-100">
                                                                    <div className="text-center w-100 mt-1 mb-1">to</div>
                                                                    <CreatableSelect
                                                                        style={{ width: '200px' }}
                                                                        isClearable={false}
                                                                        options={this.state.userTypeOptions}
                                                                        value={this.state.userTypeOptions.find((userTypeOption) => userTypeOption.value === action.user_target_type)}
                                                                        onChange={(event) => { this.changeUserTypeOption(event, keyTrigger, keyAction) }}
                                                                    />
                                                                </div>
                                                                {
                                                                    action.user_target_type === this.userTargetTypes.managers ?
                                                                        <div className="text-center w-100 mt-2">

                                                                            <Select
                                                                                value={action.action_users.map((user) => this.transformManagerToSelectFormat(user))}
                                                                                maxMenuHeight={200}
                                                                                isMulti
                                                                                isSearchable={true}
                                                                                isClearable={false}
                                                                                styles={colourStyles}
                                                                                options={this.state.selectManagers}
                                                                                className="fix-margin-select"
                                                                                onChange={(values) => { this.onChangeActionUser(values, keyTrigger, keyAction) }}
                                                                                classNamePrefix="select"
                                                                            />
                                                                        </div>
                                                                        : null
                                                                }
                                                            </div>
                                                            : null
                                                    }


                                                </div>
                                            </ListGroupItem>
                                        )
                                    }
                                </ListGroup>
                                <div className="d-flex justify-content-end flex-wrap mt-2">
                                    <Button size="sm" color="primary d-flex-left" onClick={() => this.createAction(keyTrigger)}>CREATE ACTION</Button>
                                </div>
                            </ListGroupItem>
                        )
                    }
                    <div className="d-flex justify-content-end flex-wrap mt-2">
                        <Button size="sm" color="primary d-flex-left" onClick={() => this.createTrigger()}>CREATE TRIGGER</Button>
                    </div>
                </Col>
                <Col md="12">
                    <div className="d-flex justify-content-center flex-wrap mt-2">
                        <Button color="primary d-flex-left" onClick={() => this.submitWorkflow()}>Save</Button>
                    </div>
                </Col>
            </Row>

        )

        return (
            <div>
                <div>
                    <Row className="app-user-list">
                        <Col lg="6">

                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-end flex-wrap mt-2">
                                        <Button onClick={() => this.openWorkflow()} color="primary d-flex-left">Create</Button>
                                    </div>
                                    <div className="ag-theme-material ag-grid-table">
                                        {this.rowData !== null ? (
                                            <ContextLayout.Consumer>
                                                {context => (
                                                    <AgGridReact
                                                        gridOptions={{}}
                                                        rowSelection="multiple"
                                                        defaultColDef={defaultColDef}
                                                        columnDefs={columnDefs}
                                                        rowData={rowData}
                                                        onGridReady={this.onGridReady}
                                                        colResizeDefault={"shift"}
                                                        animateRows={true}
                                                        floatingFilter={false}
                                                        pagination={true}
                                                        pivotPanelShow="always"
                                                        paginationPageSize={pageSize}
                                                        resizable={true}
                                                        enableRtl={context.state.direction === "rtl"}
                                                        onSelectionChanged={() => this.onSelectionChanged()}
                                                    />
                                                )}
                                            </ContextLayout.Consumer>
                                        ) : null}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col >
                        {
                            this.state.workflowEdit ?
                                <Col col="md-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-weight-bold">{this.state.workflowTemplate.name} <Badge color="info">{this.state.workflowModalType}</Badge></CardTitle>
                                            <X size={15} className="cursor-pointer" onClick={() => this.onSetSidebarOpen(false)} />
                                        </CardHeader>
                                        <CardBody className="card-top-padding">
                                            {workflowEditElement}
                                        </CardBody>
                                    </Card>
                                </Col> : null
                        }
                    </Row>
                </div>
                <ToastContainer />
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
    }
}
const mapActionsToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapActionsToProps)(Workflow)