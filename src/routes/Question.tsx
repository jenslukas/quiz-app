import React, { FunctionComponent, useEffect, useMemo } from "react";
import API from '../api'
import { Form, Checkbox, Button, List, notification, Typography, Switch, Space  } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { AnswerType, QuestionType } from "../helper/types";


const { Text } = Typography;

type State = {
    correct?: boolean,
    formerAnswers?: AnswerType[],
    formerQuestion?: QuestionType,
    nextQuestion: QuestionType,
    selectedAnswers: string[]
}

type QuizParams = {
    runId?: string;
}

const Question: FunctionComponent = () => {
    const [api, contextHolder] = notification.useNotification();

    const defaultData = useMemo(() => ({
        nextQuestion: {
            id: 0,
            question: '',
            answers: [{ id: 0, answer: '' }],
        },
        selectedAnswers: []        
    }),[]);

    const [state, setState] = React.useState<State>(defaultData)

    const params = useParams<QuizParams>();

    let runId = params !== undefined ? parseInt(params.runId || '0') : 0;
    let showResult = true;
    let showResultsOnWrongOnly = true;

    const onSend = (values: any) => {
        let request = {
            answerIds: state.selectedAnswers,
            questionId: state.nextQuestion.id
        }

        if (runId === 0) {
            API.saveValidatedQuestion(request).then(res => {
                if (res.status > 200 && res.status < 300) {
                    API.getQuestionToValidate().then(res => {
                        let next = {
                            nextQuestion: res.data,
                            selectedAnswers: []
                        }

                        setState(next);
                    }).catch(err => {
                        console.log('error', err);
                        setState(defaultData);
                    });
                }
            });
        } else {
            API.answerQuestion(runId, request).then(res => {
                if (res.status > 200 && res.status < 300) {
                    console.log(res.data);

                    if (res.data.nextQuestion) {
                        let next = res.data;
                        next.selectedAnswers = [];
                        setState(next);
                        showResultNotification(next);
                    } else {
                        setState(defaultData);
                    }
                }
            });
        }

    };

    const onValuesChange = (event: any) => {
        console.log('Value change');
        let selectedAnswerKey = Object.keys(event)[0];
        if (event[selectedAnswerKey] === true) {
            // add to selected answers if not already in
            if (!state.selectedAnswers.includes(selectedAnswerKey)) {
                state.selectedAnswers.push(selectedAnswerKey);
            }
        } else {
            // remove from selected answers array if it's in
            if (state.selectedAnswers.includes(selectedAnswerKey)) {
                for (var i = 0; i < state.selectedAnswers.length; i++) {
                    if (state.selectedAnswers[i] === selectedAnswerKey) {
                        state.selectedAnswers.splice(i, 1);
                    }
                }
            }
        }
    }

    const showResultsChange = () => {
        showResult = (showResult === true ? false : true);
    }

    const showResultsOnWrongChange = () => {
        showResultsOnWrongOnly = (showResultsOnWrongOnly === true ? false : true);
    }    

    // show result
    const showResultNotification = (state : State) => {
        if(showResult === false) return;
        if(showResultsOnWrongOnly === true && state.correct === true) return;
        
        let formerAnswers = state.formerAnswers ?? [];
        let formerQuestion = state.formerQuestion;

        function isCorrect(currentAnswer: AnswerType) {
            let found = false;
            for(let i = 0; i < formerAnswers.length; i++) {
                if(currentAnswer.id === formerAnswers[i].id) {
                    found = true;

                    if(currentAnswer.correct === true) {
                        return true;
                    }
                }
            }

            if(!found && currentAnswer.correct === false) {
                return true;
            }

            return false;
        }

        if(formerQuestion !== undefined) {
            api.open({
                message: formerQuestion.question,
                description: (
                    <List itemLayout="horizontal" dataSource={formerQuestion.answers} renderItem={(answer, index) => (
                        <List.Item>
                        <List.Item.Meta
                          description={
                            <>
                                { answer.correct ? <CheckCircleTwoTone twoToneColor="green"/> : <CloseCircleTwoTone twoToneColor="red"/> } &nbsp;
                                {isCorrect(answer) ? answer.answer : <Text type="danger">{answer.answer}</Text>}
                            </>
                        }
                        />
                      </List.Item>
              )
    
              } />
                ),
                duration: 0,
            });
        }
    };    
    

    useEffect(() => {
        console.log('useEffect');

        const updateTable = () => {
            if (runId === 0) {
                API.getQuestionToValidate().then(res => {
                    let next = {
                        nextQuestion: res.data,
                        selectedAnswers: []
                    }
    
                    setState(next);
                }).catch(err => {
                    console.log('error', err);
                    setState(defaultData);
                });
            } else {
                API.getNextQuestion(runId).then(res => {
                    let next = {
                        nextQuestion: res.data,
                        selectedAnswers: []
                    }
    
                    setState(next);
                }).catch(err => {
                    console.log('error', err);
                    setState(defaultData);
                });
            }
    
        }

        updateTable();
    }, [defaultData, runId]);

    if (state.nextQuestion.id === 0) {
        return (<div><h3>Keine Fragen mehr vorhanden</h3></div>);
    } else {

        return (
            <>
            <div style={{textAlign: 'right'}}>
            <Space>
                <Switch defaultChecked onChange={showResultsChange} /> Show Results
                
                <Switch defaultChecked onChange={showResultsOnWrongChange} /> on wrong answer only
                </Space>
            </div>
            <div>{contextHolder}
                <h3>{state.nextQuestion.question}</h3>
                <Form onValuesChange={onValuesChange}>
                    {state.nextQuestion.answers.map((answer, index) => (
                        <Form.Item key={String(answer.id)} name={String(answer.id)} valuePropName="checked">
                            <Checkbox key={String(answer.id)} name={String(answer.id)}> {answer.answer}  </Checkbox>
                        </Form.Item>
                    ))
                    }
                    <Form.Item>
                        <Button onClick={onSend}>Absenden</Button>
                    </Form.Item>
                </Form>
            </div>
            </>
        )
    }

}

export default Question;