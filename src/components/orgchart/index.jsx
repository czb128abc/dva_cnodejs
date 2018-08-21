import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Tooltip, message, Modal } from 'antd';
import { SwatchesPicker } from 'react-color';
import OrgChart from 'orgchart.js';
import 'orgchart.js/src/orgchart.css';
import AddModal from './components/AddModal';
import * as utils from './utils';
import './css/vendor/font-awesome.min.css';
import './style.less';
const { confirm } = Modal;

const TipIcon = ({
    type, disabled = false, title, onClick = () => { },
}) => (
        <Tooltip title={title}>
            <Button shape="circle" disabled={disabled} icon={type} onClick={onClick} />
        </Tooltip>
    );

export default class EditableOrgChart extends PureComponent {
    constructor(props) {
        super(props);
        this.refChartContainer = null;
        this.state = {
            selectedNode: null,
            colorPickerVisible: false,
        };
    }
    componentDidMount() {
        this.init();
    }
    init() {
        const { orgChartData } = this.props;
        const direction = 't2b';
        console.log(this.refChartContainer)
        const org = new OrgChart({
            direction,
            chartContainer: `#${this.refChartContainer.id}`,
            data: orgChartData,
            toggleSiblingsResp: true,
            nodeContent: 'title',
            nodeId: 'id',
            nodeTitle: 'name',
            createNode: this.createNode(direction),
        });
        window.org = org;
        this.org = org;
        this.bindEvent();
    }
    createNode = (direction) => (node, data) => {
        const typeMap = {
            t2b: 'down',
            b2t: 'up',
            l2r: 'rigth',
            r2l: 'left',
        };
        const arrowIconDom = document.createElement('ii');
        arrowIconDom.setAttribute('class', `arrow-icon anticon anticon-${typeMap[direction]}`);
        node.appendChild(arrowIconDom);
        if (data.color) {
            utils.setOrgBgClor(node, data.color);
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
            content: sNode.querySelector('.content').textContent,
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

    addNodes({ nodeType, name }, id) {
        const { selectedNode } = this.state;
        const nodeData = {
            name,
            id,
        };
        if (this[`addNodesWith${nodeType}`]) {
            this[`addNodesWith${nodeType}`](nodeData, selectedNode);
        }
    }

    addNodesWithChild(nodeData, selectedNode) {
        const hasChild = selectedNode.node.parentNode.colSpan > 1;
        if (hasChild) {
            const subNode = utils.closest(selectedNode, el => el.nodeName === 'TABLE').querySelector('.nodes').querySelector('.node');
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
        })
    }

    handleColorChange = (color, event) => {
        this.setState({ colorPickerValue: color.hex })
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

    render() {
        const { selectedNode, colorPickerVisible } = this.state;
        const selectedNodeTitle = selectedNode ? selectedNode.title : '无';
        const disabled = !selectedNode;
        return (
            <div className="orgchart-container">
                <Card
                    title="组织机构编辑"
                    cover={(<div>当前选中节点: {selectedNodeTitle}</div>)}
                    actions={
                        [
                            <AddModal isRoot={false} record={{}} onSubmit={this.handleAddSubmit} >
                                <TipIcon disabled={disabled} type="file-add" title="添加" />
                            </AddModal>,
                            <TipIcon onClick={this.handleDelNode} disabled={disabled} type="delete" title="删除" />,
                            <TipIcon disabled={disabled} type="edit" title="编辑" />,
                            <TipIcon onClick={this.handleShowColorPick} disabled={disabled} type="delete" title="更改选中节点颜色" />,
                        ]
                    }
                >
                    <div id="chart-container" ref={(ref) => { this.refChartContainer = ref }} />
                </Card>
                <Modal
                    title={'点击确定,可保存组织机构颜色'}
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

async function operateSuccess() {
    await setTimeout(() => { }, 2000);
    return {
        result: utils.getId(),
        success: true,
    };
}
const actions = {
    onAddNode: operateSuccess,
    onDelNode: operateSuccess,
    onEditNode: operateSuccess,
};
EditableOrgChart.propTypes = {
    orgChartData: PropTypes.object,
};
const orgChartData = {
    id: '1',
    name: 'Su Miao',
    title: 'department manager',
    relationship: '111',
    children: [
        {
            id: '2', name: 'Tie Hua', title: 'senior engineer', relationship: '110', color: "#2196f3"
        },
        {
            id: '3', name: 'Hei Hei', title: 'senior engineer', relationship: '111',
        },
        {
            id: '4', name: 'Tie Hua4', title: 'senior engineer', relationship: '110', color: "#2196f3"
        },
        {
            id: '5', name: 'Hei Hei5', title: 'senior engineer', relationship: '111',

            children: [
                {
                    id: '51', name: 'Hei Hei51', title: 'senior engineer', relationship: '111',
                },
                {
                    id: '52', name: 'Hei Hei52', title: 'senior engineer', relationship: '111',
                }
            ]
        },
    ],
};
EditableOrgChart.defaultProps = {
    orgChartData,
    ...actions,
};
