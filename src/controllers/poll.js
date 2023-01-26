import Poll from '../models/poll.js';

async function readPoll() {
    const polls = await Poll.find({});
    return polls[0];
}

async function readChoices() {
    const poll = await readPoll();
    return poll.choiceList;
}

async function updateChoices(choiceList) {
    const poll = await readPoll();
    poll.choiceList = choiceList;
    return await poll.save();
}

async function updateResult(resultList) {
    const poll = await readPoll();
    poll.resultList = resultList;
    return await poll.save();
}

async function updateState(state) {
    const poll = await readPoll();
    poll.state = state;
    return await poll.save();
}

export default {
    getPoll: async (req, res) => {
        const poll = await readPoll();
        res.send({
            status: 'success',
            msg: poll
        });
    },
    getChoices: async (req, res) => {
        const choiceList = await readChoices();
        res.send({
            status: 'success',
            msg: choiceList, 
        });
    },
    putChoices: async (req, res) => {
        const choiceList = req.body;
        await updateChoices(choiceList);
        res.send({
            status: 'success',
            msg: '',
        });
    },
    putResult: async (req, res) => {
        const resultList = req.body;
        await updateResult(resultList);
        res.send({
            status: 'success',
            msg: '',
        });
    },
    putState: async (req, res) => {
        const state = req.body.state;
        await updateState(state);
        res.send({
            status: 'success',
            msg: '',
        });
    },
}