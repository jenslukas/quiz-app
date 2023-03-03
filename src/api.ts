import axios from 'axios';

const instance = axios.create({
  baseURL: `http://127.0.0.1:3000`
});

let api = {
    getQuestionToValidate: () => instance.get('/question/validate'),
    saveValidatedQuestion: (question: any) => instance.post('/question/validate', question),
    getListOfRuns: () => instance.get('/quiz/list'),
    createQuizRun: (code: string) => instance.post('/quiz/' + code, {}),
    getNextQuestion: (runId: number) => instance.get('/quiz/' + runId),
}

export default api;