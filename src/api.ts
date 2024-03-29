import axios from 'axios';

const instance = axios.create({
  baseURL: `https://quiz-api.luklabs.de`
});

let api = {
    getQuestionToValidate: () => instance.get('/question/validate'),
    saveValidatedQuestion: (question: any) => instance.post('/question/validate', question),
    getListOfRuns: () => instance.get('/quiz/list/all'),
    getRun: (runId: number) => instance.get('/quiz/' + runId),
    createQuizRun: (code: string) => instance.post('/quiz/' + code, {}),
    createQuizRunFromWrong: (id: number) => instance.post('/quiz/wrong/' + id, {}),    
    getNextQuestion: (runId: number) => instance.get('/quiz/id/' + runId),
    answerQuestion: (runId: number, answer: any) => instance.post('/quiz/id/' + runId, answer),
}

export default api;