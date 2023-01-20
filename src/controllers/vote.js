import Vote from '../models/vote.js';
import Poll from '../models/poll.js';

// Interact with DB

async function writeVote(voteData) {
    const vote = new Vote(voteData);
    return await vote.save();
}

async function readAllVotes() {
    const allVotes = await Vote.find({});
    return allVotes;
}

async function readPoll() {
    const poll = await Poll.find({});
    return poll;
}

async function readPollResult() {
    const poll = await readPoll();
    return poll.resultList;
}


// Calculate

async function calculateResult(allVotes) {

}

async function calculateRanking(allVotes, pollResult) {

}



// Check

async function checkPollState() {
    const poll = await readPoll();
    if (poll.state === 'open') {
        return true;
    } else if (poll.state === 'close') {
        return false;
    } else {
        // error
        console.log('error');
        return false;
    }
}

async function checkProfile(name, email) {}

async function checkAdmin(pw) {
    if (pw === process.env.ADMIN_PW) {
        return true;
    } else {
        return false;
    }
}

export default {
    postVote: async (req, res) => {
        const voteData = req.body;

        if (
            (await checkPollState()) &&
            (await checkProfile(voteData.name, voteData.email))
        ) {
            await writeVote(voteData);
            res.send('Complete');
        } else {
            res.send('Not matched');
        }
    },
    getResult: async (req, res) => {
        const pw = req.body.pw;

        if (await checkAdmin(pw)) {
            const allVotes = await readAllVotes();
            const result = await calculateResult(allVotes);
            res.send(result);
        } else {
            res.send('Wrong PW');
        }
    },
    getRanking: async (req, res) => {
        const pw = req.body.pw;

        if (await checkAdmin(pw)) {
            const allVotes = await readAllVotes();
            const pollResult = await readPollResult();
            const ranking = await calculateRanking(allVotes, pollResult);
            res.send(ranking);
        } else {
            res.send('Wrong PW');
        }
    },
};
