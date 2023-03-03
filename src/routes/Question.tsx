import React from "react";
import API from '../api'
import { Form, Checkbox, Button } from "antd";
import { useParams } from "react-router-dom";

type Answer = {
    id: number,
    answer: string
}

type State = {
    question: string
    answers: Answer[],
    selectedAnswers: string[]
}

interface QuestionProps {
    runId: number,
}

export default class Question extends React.Component<QuestionProps, State> {
    public static defaultProps: Partial<QuestionProps> = {
        runId: 0
    };

    constructor(props: QuestionProps) {
        super(props);

        let { runId } = useParams();
        console.log('got runId: ' + runId);

        this.state = {
            question: '',
            answers: [{ id: 0, answer: '' }],
            selectedAnswers: []
        }
    }

    onSend = (values: any) => {
        console.log('Form send');
        console.log(this.state);
        let request = {
            answerIds: this.state.selectedAnswers
        }
        console.log(request)
        API.saveValidatedQuestion(request).then(res => {
            if (res.status > 200 && res.status < 300) {
                API.getQuestionToValidate().then(res => {
                    res.data.selectedAnswers = [];
                    this.setState(res.data);
                })
            }

            console.log(res);
        });
    };

    onValuesChange = (event: any) => {
        let selectedAnswerKey = Object.keys(event)[0];
        if (event[selectedAnswerKey] === true) {
            // add to selected answers if not already in
            if (!this.state.selectedAnswers.includes(selectedAnswerKey)) {
                this.state.selectedAnswers.push(selectedAnswerKey);
            }
        } else {
            // remove from selected answers array if it's in
            if (this.state.selectedAnswers.includes(selectedAnswerKey)) {
                for (var i = 0; i < this.state.selectedAnswers.length; i++) {
                    if (this.state.selectedAnswers[i] === selectedAnswerKey) {
                        this.state.selectedAnswers.splice(i, 1);
                    }
                }
            }
        }

        console.log(this.state.selectedAnswers)
    }

    updateTable = () => {
        if(this.props.runId === 0) {
            API.getQuestionToValidate().then(res => {
                this.setState(res.data);
            })                
        } else {
            API.getNextQuestion(this.props.runId).then(res => {
                this.setState(res.data);
            })                 
        }
    
    }

    componentDidMount(): void {
        console.log("Question mounted");
        this.updateTable();
    }

    render() {
        return (
            <div>
                <h3>{this.state.question}</h3>
                <Form onValuesChange={this.onValuesChange}>
                    {this.state.answers.map((answer, index) => (
                        <Form.Item key={String(answer.id)} name={String(answer.id)} valuePropName="checked">
                            <Checkbox key={String(answer.id)} name={String(answer.id)}> {answer.answer}  </Checkbox>
                        </Form.Item>
                    ))
                    }
                    <Form.Item>
                        <Button onClick={this.onSend}>Absenden</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}