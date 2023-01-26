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
        res.send(poll);
    },
    getChoices: async (req, res) => {
        const choiceList = await readChoices();
        res.send(choiceList);
    },
    putChoices: async (req, res) => {
        const choiceList = req.body.choiceList;
        await updateChoices(choiceList);
    },
    putResult: async (req, res) => {
        const resultList = req.body.resultList;
        await updateResult(resultList);
    },
    putState: async (req, res) => {
        const state = req.body.state;
        await updateState(state);
        res.end();
    },
}