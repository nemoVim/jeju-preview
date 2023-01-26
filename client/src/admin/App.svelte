<script>
    import { postReq, putReq } from '../lib/requests.js';
    import { hideElementById, showElementById } from '../lib/toggleElements.js';

    let logined = false;
    let result = {};

    function makePwData() {
        const pwData = {
            password: document.getElementById('pw-input').value,
        };
        return pwData;
    }

    async function getResult(pwData) {
        const result = await postReq('/vote/result', pwData);
        console.log(result);
        return result;
    }

    async function getRanking(pwData) {
        const ranking = await postReq('/vote/ranking', pwData);
        return ranking;
    }

    async function submitPw() {
        try {
            hideElementById('login-div');
            const pwData = makePwData();
            // const [_result, _ranking] = await Promise.all([
            //     getResult(pwData),
            //     getRanking(pwData),
            // ]);
            const _result = await getResult(pwData);

            result = _result;

            logined = true;
        } catch (e) {
            document.getElementById('error-msg').innerHTML = e.message;
            showElementById('login-div');
            logined = false;
        }
    }

    function openPoll() {
        putReq('/poll/state', {
            state: 'open',
        });
    }

    function closePoll() {
        putReq('/poll/state', {
            state: 'close',
        });
    }

    function submitResult() {
        const resultList = document
            .getElementById('result-input')
            .value.split(/ *, */);
        putReq('/poll/result', resultList);
    }
</script>

<main>
    <h1>Admin Panel</h1>
    <hr />
    {#if logined === true}
        <button id="open-btn" on:click={openPoll}>투표 열기</button>
        <button id="close-btn" on:click={closePoll}>투표 닫기</button>
        <input
            id="result-input"
            type="text"
            placeholder="2, 1, 0 (2번이 1등, 1번이 2등, 0번이 3등)"
        />
        <button id="submit-result-btn" on:click={submitResult}
            >결과 입력하기</button
        >
        <table>
            <tr>
                <td>Title</td>
                {#each result.choiceList as choice, i}
                    <td>{i + 1}등</td>
                {/each}
                <td>Score</td>
            </tr>
            {#each result.voteList as voteList, i}
                <tr>
                    <td>{result.choiceList[i]}</td>
                    {#each voteList as vote}
                        <td>{vote}</td>
                    {/each}
                    <td>{result.scoreList[i]}</td>
                </tr>
            {/each}
            <tr>
                <td>Total</td>
                {#each result.totalVoteList as totalVotes}
                    <td>{totalVotes}</td>
                {/each}
                <td>{result.totalScore}</td>
            </tr>
        </table>
    {:else}
        <div id="login-div">
            <input id="pw-input" type="text" placeholder="암호를 입력하세요." />
            <button id="submit-btn" on:click={submitPw}>확인</button>
        </div>
        <p id="error-msg" />
    {/if}
</main>

<style>
</style>
