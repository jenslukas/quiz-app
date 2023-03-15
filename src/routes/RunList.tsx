import { Form, Button, Divider, Input, Modal, Space, FormInstance } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";
import API from "../api";

interface DataType {
    id: number;
    code: string
    openQuestions: number;
    closedQuestions: number;
    correctAnswers: number;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'code',
        key: 'code',
    },
    {
        title: 'Open Questions',
        dataIndex: 'openQuestions',
        key: 'openQuestions',
    },
    {
        title: 'Closed Questions',
        dataIndex: 'closedQuestions',
        key: 'closedQuestions',
    },
    {
        title: 'Correct Answers',
        dataIndex: 'correctAnswers',
        key: 'correctAnswers',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle"><Link to={{ pathname: `/question/${record.id}` }}>Continue</Link></Space>
        ),
    }
];

interface IState {
    runs: DataType[],
    isModalOpen: boolean
}


export default class RunList extends Component<{}, IState> {
    formRef = React.createRef<FormInstance>();


    showModal = () => {
        this.setState(state => ({
            runs: state.runs,
            isModalOpen: true
        }));
    };

    handleOk = () => {
        let code = this.formRef.current?.getFieldValue('code');
        API.createQuizRun(code).then(res => {
            this.setState(state => ({
                runs: state.runs,
                isModalOpen: false
            }));
            this.updateRuns();
        });
    };

    handleCancel = () => {
        this.setState(state => ({
            runs: state.runs,
            isModalOpen: false
        }));
    };

    constructor(props: {}) {
        super(props);
        this.state = {
            runs: [{
                id: 1,
                code: '123',
                openQuestions: 1,
                closedQuestions: 2,
                correctAnswers: 3
            }],
            isModalOpen: false
        };
    }

    updateRuns = () => {
        API.getListOfRuns().then(res => {
            this.setState({ runs: res.data });
        })
    }

    async componentDidMount(): Promise<void> {
        this.updateRuns();
    }

    render() {
        return (
            <div>
                <h1>Run List</h1>
                <Button style={{ float: 'right' }} type="primary" onClick={this.showModal}>Create new Run</Button><br />
                <Divider />
                <Table columns={columns} dataSource={this.state.runs} />
                <Modal title="Create new Quiz run" open={this.state.isModalOpen} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form ref={this.formRef}>
                        <Form.Item label="Name" name="code">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}