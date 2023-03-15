import { Form, Button, Divider, Input, Modal, Space, FormInstance } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { FunctionComponent, useEffect } from "react";
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
            <Space size="middle"><Link to={{ pathname: `/question/${record.id}` }}>Continue</Link> <Button type="link">Create wrong run</Button> </Space>
        ),
    }
];

interface IState {
    runs: DataType[],
    isModalOpen: boolean
}


const RunList: FunctionComponent = () => {
    const [form] = Form.useForm();
    const code = Form.useWatch('code', form);

    const defaultData = {
        runs: [{
            id: 1,
            code: '123',
            openQuestions: 1,
            closedQuestions: 2,
            correctAnswers: 3
        }],
        isModalOpen: false
    };

    const [state, setState] = React.useState<IState>(defaultData);

    const showModal = () => {
        setState(state => ({
            runs: state.runs,
            isModalOpen: true
        }));
    };

    const handleOk = () => {
        API.createQuizRun(code).then(res => {
            setState(state => ({
                runs: state.runs,
                isModalOpen: false
            }));
            updateRuns();
        });
    };

    const handleCancel = () => {
        setState(state => ({
            runs: state.runs,
            isModalOpen: false
        }));
    };

    const updateRuns = () => {
        API.getListOfRuns().then(res => {
            setState({ runs: res.data, isModalOpen: false });
        })
    }

    useEffect(() => {
        console.log('usef effect');
        updateRuns();
    }, []);


    return (
        <div>
            <h1>Run List</h1>
            <Button style={{ float: 'right' }} type="primary" onClick={showModal}>Create new Run</Button><br />
            <Divider />
            <Table columns={columns} dataSource={state.runs} />
            <Modal title="Create new Quiz run" open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form}>
                    <Form.Item label="Name" name="code">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default RunList;