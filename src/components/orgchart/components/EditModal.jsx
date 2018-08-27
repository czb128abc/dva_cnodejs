import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Radio, Row, Col, Popover, Button } from 'antd';
import { SwatchesPicker } from 'react-color';


const FormItem = Form.Item;

class EditModal extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        isRoot: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({
            visible: true,
        });
        this.props.form.resetFields();
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = async () => {
        const { onSubmit } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const param = {
                    ...values,
                }
                if (!values.color) {
                    delete param.color;
                }
                onSubmit(param);
                this.hideModelHandler();
            }
        });
        const delay = await setTimeout(() => { }, 2000);
        return delay;
    };

    handleColorChange = (color) => {
        const { form } = this.props;
        form.setFieldsValue({ color: color.hex })
    }

    render() {
        const { children } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal
                    title="编辑"
                    visible={this.state.visible}
                    onOk={this.okHandler}
                    onCancel={this.hideModelHandler}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form layout="horizontal" onSubmit={this.okHandler}>
                        <FormItem
                            {...formItemLayout}
                            label="name"
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: [{ max: 128, message: '长度最多为128', required: true }],
                                    initialValue: '',
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="title"
                        >
                            {
                                getFieldDecorator('title', {
                                    rules: [{ max: 128, message: '长度最多为128', required: true }],
                                    initialValue: '',
                                })(<Input />)
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="color"
                        >
                            <Row>
                                <Col span={8}>
                                    {
                                        getFieldDecorator('color', {
                                            initialValue: '',
                                        })(<Input readOnly />)
                                    }
                                </Col>
                                <Col span={8} offset={2}>
                                    <Popover
                                        title="请选择颜色"
                                        content={(
                                            <SwatchesPicker onChange={this.handleColorChange} />
                                        )}
                                    >
                                        <Button shape="circle" icon="environment" ></Button>
                                    </Popover>

                                </Col>
                            </Row>

                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}

export default Form.create()(EditModal);
