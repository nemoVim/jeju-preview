import Poll from '../models/poll.js';
import Info from '../models/info.js';

async function resetPoll() {
    const poll = await readPoll();
    poll.choiceList = [];
    poll.resultList = [];
    poll.state = 'close';
    await poll.save();

    const infos = await Info.find({
        voted: true 
    });

    for (let info of infos) {
        info.voted = false;
        await info.save();
    }

    return true;
}
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

function checkAdmin(pw) {
    if (pw === process.env.ADMIN_PW) {
        return true;
    } else {
        throw new Error('암호가 일치하지 않습니다.');
    }
}

export default {
    getPoll: async (req, res) => {
        const poll = await readPoll();
        res.send({
            status: 'success',
            msg: poll,
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
        const choiceList = req.body.choiceList;
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            await updateChoices(choiceList);
            res.send({
                status: 'success',
                msg: '정상적으로 처리되었습니다.',
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
    putResult: async (req, res) => {
        const resultList = req.body.resultList;
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            await updateResult(resultList);
            res.send({
                status: 'success',
                msg: '정상적으로 처리되었습니다.',
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
    putState: async (req, res) => {
        const state = req.body.state;
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            await updateState(state);
            res.send({
                status: 'success',
                msg: '정상적으로 처리되었습니다.',
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
    getState: async (req, res) => {
        const poll = await readPoll();
        res.send({
            status: 'success',
            msg: poll.state,
        });
    },
    postReset: async (req, res) => {
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            await resetPoll();
            res.send({
                status: 'success',
                msg: '정상적으로 처리되었습니다.',
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
};
