import Vote from '../models/vote.js';
import Poll from '../models/poll.js';
import Info from '../models/info.js';

// Interact with DB

async function writeVote(voteData) {
    console.log(voteData);
    const vote = new Vote(voteData);
    return await vote.save();
}

async function readAllVotes() {
    const allVotes = await Vote.find({});
    return allVotes;
}

async function readPoll() {
    const polls = await Poll.find({});
    return polls[0];
}

async function readPollResult() {
    const poll = await readPoll();
    return poll.resultList;
}

async function findInfo(name, phone) {
    const infos = await Info.find({
        name: name,
        phone: phone,
    });
    return infos[0];
}

async function updateInfoToVoted(name, phone) {
    const info = await findInfo(name, phone);
    info.voted = true;
    return await info.save();
}


// Calculate

async function calculateResult(allVotes) {}

async function calculateRanking(allVotes, pollResult) {}

// Check

async function checkPollState() {
    const poll = await readPoll();
    if (poll.state === 'open') {
        return true;
    } else if (poll.state === 'close') {
        throw new Error('투표가 이미 종료되었습니다.');
    } else {
        throw new Error('예기치 못한 문제가 발생했습니다.');
    }
}

async function checkInfo(name, phone) {
    const info = await findInfo(name, phone);
    console.log(info);
    if (info === undefined) {
        throw new Error('이름 또는 전화번호가 일치하지 않습니다.');
    } else if (info.voted) {
        throw new Error('이미 투표하셨습니다.');
    } else {
        return info;
    }
}

async function checkAdmin(pw) {
    if (pw === process.env.ADMIN_PW) {
        return true;
    } else {
        throw new Error('암호가 일치하지 않습니다.');
    }
}

export default {
    postVote: async (req, res) => {
        const voteData = req.body;

        console.log(voteData);

        try {
            await checkPollState();
            const info = await checkInfo(voteData.name, voteData.phone);
            console.log(info._id);
            await writeVote({
                infoId: info._id,
                choiceList: voteData.choiceList,
            });
            await updateInfoToVoted(voteData.name, voteData.phone);
            res.send({
                status: 'success'
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message
            });
        }
    },
    getResult: async (req, res) => {
        const pw = req.body.pw;

        try {
            await checkAdmin(pw);
            const allVotes = await readAllVotes();
            const result = await calculateResult(allVotes);
            res.send({
                status: 'success',
                msg: result
            });
        } catch(e) {
            res.send({
                status: 'error',
                msg: e.message
            });
        }
    },
    getRanking: async (req, res) => {
        const pw = req.body.pw;

        try {
            await checkAdmin(pw)
            const allVotes = await readAllVotes();
            const pollResult = await readPollResult();
            const ranking = await calculateRanking(allVotes, pollResult);
            res.send({
                status: 'success',
                msg: ranking 
            });
        } catch(e) {
            res.send({
                status: 'error',
                msg: e.message
            });
        }
    },
};
