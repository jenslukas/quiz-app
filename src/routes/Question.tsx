import React, { FunctionComponent, useEffect } from "react";
import API from '../api'
import { Form, Checkbox, Button } from "antd";
import { useParams } from "react-router-dom";

type Answer = {
    id: number,
    answer: string
}

type Question = {
    id: number,
    question: string,
    answers: Answer[]
}


type State = {
    correct?: boolean,
    formerAnswers?: string[],
    formerQuestion?: Question,
    nextQuestion: Question,
    selectedAnswers: string[]
}

type QuizParams = {
    runId?: string;
}

const Question: FunctionComponent = () => {
    const defaultData = {
        nextQuestion: {
            id: 0,
            question: '',
            answers: [{ id: 0, answer: '' }],
        },
        selectedAnswers: []        
    }

    const [state, setState] = React.useState<State>(defaultData)

    const params = useParams<QuizParams>();

    let runId = params !== undefined ? parseInt(params.runId || '0') : 0;
    let showResult = true;

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
                    } else {
                        setState(defaultData);
                    }
                }
            });
        }

    };

    const onValuesChange = (event: any) => {
        console.log(state);
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

    useEffect(() => {
        updateTable();
    }, []);

    if (state.nextQuestion.id === 0) {
        return (<div><h3>Keine Fragen mehr vorhanden</h3></div>);
    } else {

        return (
            <div>
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
        )
    }

}

export default Question;