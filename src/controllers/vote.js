import Vote from '../models/vote.js';
import Poll from '../models/poll.js';
import Info from '../models/info.js';

// Interact with DB

async function resetVote() {
    return await Vote.deleteMany({});
}

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

async function makeResultObj() {
    const poll = await readPoll();
    const lenObj = { length: poll.choiceList.length };
    const result = {
        choiceList: poll.choiceList,
        voteList: Array.from(lenObj, () => Array.from(lenObj, () => 0)),
        moneyList: Array.from(lenObj, () => 0),
        totalVoteList: Array.from(lenObj, () => 0),
        totalMoney: 0,
    };
    return result;
}

async function countVotes(result) {
    const allVotes = await readAllVotes();
    allVotes.forEach((vote) => {
        const choiceList = vote.choiceList;
        choiceList.forEach((choice, ranking) => {
            result.voteList[choice][ranking] += 1;
        });
    });
    return result;
}

function calculateMoney(result) {
    result.voteList.forEach((voteList, i) => {
        const money = voteList.reduce((prev, val, i) => {
            return prev + val * (voteList.length - i);
        }, 0);
        result.moneyList[i] = money;
    });
    return result;
}

function countTotal(result) {
    result.voteList.map((voteList) => {
        voteList.map((value, i) => {
            result.totalVoteList[i] += value;
        });
    });

    result.totalMoney = result.moneyList.reduce((prev, val) => {
        return prev + val;
    }, 0);

    return result;
}

async function calculateResult() {
    const result = countTotal(
        calculateMoney(await countVotes(await makeResultObj()))
    );
    console.log(result);
    return result;
}

async function makeRankingList() {
    const allVotes = await readAllVotes();
    const rankingList = [];
    allVotes.forEach((info, i) => {
        rankingList.push({
            name: info.name,
            choiceList: info.choiceList,
            time: info.createdAt,
            score: 0,
        });
    });
    return rankingList;
}

function calculateScore(info, pollResult) {
    const score = info.choiceList.reduce((prev, val, idx) => {
        if (pollResult[idx] === val) {
            return prev + (info.choiceList.length - idx);
        } else {
            return prev;
        }
    }, 0);

    info['score'] = score;

    return info;
}

async function addScore(rankingList) {
    const pollResult = await readPollResult();
    const ranking = {
        rankingList: rankingList.map((info) => {
            return calculateScore(info, pollResult);
        }),
        resultList: pollResult,
    };

    return ranking;
}

function sortRanking(ranking) {
    ranking.rankingList.sort((a, b) => {
        if (b.score === a.score) {
            return -(b.time - a.time);
        } else {
            return b.score - a.score;
        }
    });
    return ranking;
}

async function calculateRanking() {
    const ranking = sortRanking(await addScore(await makeRankingList()));
    return ranking;
}

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
        // return info;
        throw new Error('이미 투표하셨습니다.');
    } else {
        return info;
    }
}

function checkAdmin(pw) {
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
                name: info.name,
                choiceList: voteData.choiceList,
            });
            await updateInfoToVoted(voteData.name, voteData.phone);
            res.send({
                status: 'success',
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
    getResult: async (req, res) => {
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            const result = await calculateResult();
            res.send({
                status: 'success',
                msg: result,
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
    getRanking: async (req, res) => {
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            const ranking = await calculateRanking();
            res.send({
                status: 'success',
                msg: ranking,
            });
        } catch (e) {
            res.send({
                status: 'error',
                msg: e.message,
            });
        }
    },
    postReset: async (req, res) => {
        const pw = req.body.password;

        try {
            checkAdmin(pw);
            await resetVote();
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
    }
};
