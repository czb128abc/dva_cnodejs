import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Tooltip, message, Modal, Icon } from 'antd';
import { SwatchesPicker } from 'react-color';
import html2canvas from 'html2canvas';
import AddModal from './components/AddModal';
import EditModal from './components/EditModal';
import OrgChart from './lib/orgchart';
import * as utils from './utils';

import './lib/css/orgchart.css';
import './lib/css/vendor/font-awesome.min.css';
import './style.less';

const { confirm } = Modal;
window.html2canvas = html2canvas;

const TipIcon = ({
    hide, type, disabled = false, title, onClick = () => { },
}) => {
    const propsConfig = {
        disabled,
        onClick: (e) => {
            console.log('Button onClick');
            if (!disabled) {
                onClick();
            } else {
                e.stopPropagation();
                message.warn('请选择组织机构节点');
            }
        },
    };
    if (hide) {
        return null;
    }
    return (
        <Tooltip title={title}>
            <Icon type={type} {...propsConfig} />
        </Tooltip>
    );
};
let orgDomId = 1;
function creatChartId() {
    const str = `OrgChart${orgDomId}`;
    orgDomId += 1;
    console.log('str', str);
    return str;
}

export default class EditableOrgChart extends PureComponent {
    constructor(props) {
        super(props);
        this.refChartContainer = null;
        this.refChartContainerId = creatChartId();
        this.state = {
            selectedNode: null,
            colorPickerVisible: false,
        };
    }
    componentDidMount() {
        this.init();
    }
    init() {
        const { orgChartData, orgChartConfig } = this.props;
        const direction = 't2b';
        const config = {
            direction,
            chartContainer: `#${this.refChartContainer.id}`,
            data: orgChartData,
            toggleSiblingsResp: false,
            pan: true,
            nodeId: 'id',
            nodeTitle: 'name',
            // nodeContent: 'stockRatio',
            ...orgChartConfig,
        };
        config.createNode = this.createNode(config.direction, orgChartConfig.createNode);
        const org = new OrgChart(config);
        window.org = org;
        this.org = org;
        this.bindEvent();
    }
    createNode = (direction, callback) => (node, data) => {
        const typeMap = {
            t2b: 'down',
            b2t: 'down',
            l2r: 'down',
            r2l: 'down',
        };
        const arrowIconDom = document.createElement('ii');
        arrowIconDom.setAttribute('class', `arrow-icon anticon anticon-${typeMap[direction]}`);
        node.appendChild(arrowIconDom);
        if (data.color) {
            utils.setOrgBgClor(node, data.color);
        }
        if (typeof callback === 'function') {
            callback(node, data);
        }
    }
    bindEvent() {
        const chartContainerId = this.refChartContainer.id;
        utils.bindEventHandler('.node', 'click', this.clickNode, `#${chartContainerId}`);
        utils.bindEventHandler('.orgchart', 'click', this.clickChart, `#${chartContainerId}`);
    }

    clickNode = (event) => {
        const sNode = utils.closest(event.target, el => el.classList && el.classList.contains('node'));
        const selectedNode = {
            node: sNode,
            id: sNode.id,
            title: sNode.querySelector('.title').textContent,
            // content: sNode.querySelector('.content').textContent,
            dataStr: sNode.getAttribute('data-source'),
        };
        this.setState({
            selectedNode,
        });
    };
    clickChart = (event) => {
        if (!utils.closest(event.target, el => el.classList && el.classList.contains('node'))) {
            this.setState({ selectedNode: null });
        }
    };

    deleteNodes(selectedNode) {
        this.org.removeNodes(selectedNode.node);
    }

    addNodes({ nodeType, name, ...param }, id) {
        const { selectedNode } = this.state;
        const nodeData = {
            name,
            id,
            ...param,
        };
        if (this[`addNodesWith${nodeType}`]) {
            this[`addNodesWith${nodeType}`](nodeData, selectedNode);
        }
    }

    addNodesWithChild(nodeData, selectedNode) {
        const hasChild = selectedNode.node.parentNode.colSpan > 1;
        if (hasChild) {
            const subNode = utils.closest(selectedNode.node, el => el.nodeName === 'TABLE').querySelector('.nodes').querySelector('.node');
            this.org.addSiblings(subNode, {
                siblings: [nodeData],
            });
        } else {
            this.org.addChildren(selectedNode.node, {
                children: [nodeData],
            });
        }
    }

    addNodesWithSibling(nodeData, selectedNode) {
        this.org.addSiblings(selectedNode.node, {
            siblings: [nodeData],
        });
    }

    addNodesWithRoot(nodeData) {
        const chartIsEmpty = this.org.chartContainer.children.length === 0;
        if (chartIsEmpty) {
            // chartIsEmpty
        } else {
            this.org.addParent(this.org.chartContainer.querySelector('.node'), nodeData);
        }
    }

    handleAddSubmit = (values) => {
        const { onAddNode } = this.props;
        onAddNode(values).then(data => {
            if (data.success) {
                const id = data.result;
                this.addNodes(values, id);
            } else {
                message.warn(`新增节点失败~${data.message}`);
            }
        });
    }

    handleEditSubmit = (values) => {
        const { selectedNode } = this.state;

        const { onEditNode } = this.props;
        const param = {
            ...JSON.parse(selectedNode.dataStr),
            ...values,
        };
        onEditNode(param).then(data => {
            if (data.success) {
                selectedNode.node.dataset.source = JSON.stringify(param);
                const content = selectedNode.node.querySelector('.content');
                const title = selectedNode.node.querySelector('.title');
                if (title) {
                    title.textContent = param.name;
                }
                if (content) {
                    content.textContent = param.title;
                }
                if (param.color) {
                    utils.setOrgBgClor(selectedNode.node, param.color);
                }
            } else {
                message.warn(`编辑节点失败~${data.message}`);
            }
        });
    }


    handleDelNode = () => {
        const { selectedNode } = this.state;
        const { onDelNode } = this.props;
        confirm({
            title: `确认删除该节点:${selectedNode.title}`,
            onOk: async () => {
                const data = await onDelNode(selectedNode.id);
                if (data.success) {
                    this.deleteNodes(selectedNode);
                } else {
                    message.warn(`删除节点失败~${data.message}`);
                }
                return data;
            },
        });
    }

    handleShowColorPick = () => {
        this.setState({
            colorPickerVisible: true,
            colorPickerValue: '',
        });
    }

    handleColorChange = (color) => {
        this.setState({ colorPickerValue: color.hex });
    }

    handleColorPickerSubmit = async () => {
        this.setState({ colorPickerVisible: false });
        const { colorPickerValue, selectedNode } = this.state;
        const { onEditNode } = this.props;
        const param = JSON.parse(selectedNode.dataStr);
        param.color = colorPickerValue;
        const data = await onEditNode(param);
        if (data.success) {
            selectedNode.node.dataset.source = JSON.stringify(param);
            utils.setOrgBgClor(selectedNode.node, colorPickerValue);
        } else {
            message.warn(`操作失败~${data.message}`);
        }
    }
    handleExportPng = () => {
        // eslint-disable-next-line
        this.org._clickExportButton();
    }

    render() {
        const { selectedNode, colorPickerVisible } = this.state;
        const selectedNodeTitle = selectedNode ? selectedNode.title : '无';
        const disabled = !selectedNode;
        const actions = [
            <AddModal isRoot={false} record={{}} onSubmit={this.handleAddSubmit} >
                <TipIcon hide disabled={disabled} type="file-add" title="选中节,添加" />
            </AddModal>,
            <TipIcon onClick={this.handleDelNode} disabled={disabled} type="delete" title="删除选中节" />,
            <EditModal isRoot={false} record={{}} onSubmit={this.handleEditSubmit}>
                <TipIcon hide disabled={disabled} type="edit" title="编辑选中节" />
            </EditModal>,
            <TipIcon onClick={this.handleShowColorPick} disabled={disabled} type="environment" title="更改选中节点颜色" />,
            <TipIcon onClick={this.handleExportPng} type="export" title="导出图片" />,
        ];
        return (
            <div>
                <Card
                    actions={
                        [actions[1], actions[3], actions[4]]
                    }
                >
                    <div>当前选中节点: {selectedNodeTitle}</div>
                </Card>
                <div className="editable-orgchart-container">
                    <div id={this.refChartContainerId} ref={(ref) => { this.refChartContainer = ref; }} />
                </div>
                <Modal
                    title="点击确定,可保存组织机构颜色"
                    visible={colorPickerVisible}
                    onOk={this.handleColorPickerSubmit}
                    onCancel={() => this.setState({ colorPickerVisible: false })}
                >
                    <SwatchesPicker onChange={this.handleColorChange} />
                </Modal>
            </div >
        );
    }
}

const operateSuccess = (type) => async (data) => {
    await setTimeout(() => { }, 2000);
    console.log('operateSuccess', type, data);
    return {
        result: utils.getId(),
        success: true,
    };
};
const actions = {
    onAddNode: operateSuccess('onAddNode'),
    onDelNode: operateSuccess('onDelNode'),
    onEditNode: operateSuccess('onEditNode'),
};
EditableOrgChart.propTypes = {
    orgChartData: PropTypes.object,
    orgChartConfig: PropTypes.object,
};
const orgChartData = {
    id: '1',
    name: 'Su Miao',
    title: 'department manager',
    relationship: '111',
    children: [
        {
            id: '2', name: 'Tie Hua', title: 'senior engineer', relationship: '110', color: '#2196f3',
        },
        {
            id: '3', name: 'Hei Hei', title: 'senior engineer', relationship: '111',
        },
        {
            id: '4',
            name: 'Tie Hua4',
            title: 'senior engineer',
            relationship: '110',
            color: '#2196f3',
            children: [
                {
                    id: '41',
                    name: 'Hei Hei41',
                    title: 'senior engineer',
                    relationship: '111',

                    children: [
                        {
                            id: '411', name: 'Hei Hei411', title: 'senior engineer', relationship: '111',
                        },

                    ],
                },
            ],
        },
        {
            id: '5',
            name: 'Hei Hei5',
            title: 'senior engineer',
            relationship: '111',

            children: [
                {
                    id: '51', name: 'Hei Hei51', title: 'senior engineer', relationship: '111',
                },
                {
                    id: '52', name: 'Hei Hei52', title: 'senior engineer', relationship: '111',
                },
            ],
        },
    ],
};
EditableOrgChart.defaultProps = {
    orgChartData,
    ...actions,
    orgChartConfig: {},
};
