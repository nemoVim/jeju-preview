<script>
    import { getReq, postReq, putReq } from '../lib/requests.js';
    import { hideElementById, showElementById } from '../lib/toggleElements.js';

    let logined = false;
    let result = {};
    let ranking = [];
    let state = '';

    function makePwData() {
        const pwData = {
            password: document.getElementById('pw-input').value,
        };
        return pwData;
    }

    async function getResult(pwData) {
        result = await postReq('/vote/result', pwData);
    }

    async function getRanking(pwData) {
        ranking = await postReq('/vote/ranking', pwData);
    }

    async function getState() {
        state = await getReq('/poll/state');
    }

    async function submitPw() {
        try {
            hideElementById('login-div');
            const pwData = makePwData();
            // const [_result, _ranking] = await Promise.all([
            //     getResult(pwData),
            //     getRanking(pwData),
            // ]);
            await getResult(pwData);
            await getRanking(pwData);
            await getState();

            document.cookie = 'pw=' + pwData.password;

            logined = true;
        } catch (e) {
            document.getElementById('error-msg').innerHTML = e.message;
            showElementById('login-div');
            logined = false;
        }
    }

    async function openPoll() {
        const pw = document.cookie.split('=')[1];
        await putReq('/poll/state', {
            state: 'open',
            password: pw,
        });
        await getState();
    }

    async function closePoll() {
        const pw = document.cookie.split('=')[1];
        await putReq('/poll/state', {
            state: 'close',
            password: pw,
        });
        await getState();
    }

    async function submitResult() {
        const pw = document.cookie.split('=')[1];
        const resultList = document
            .getElementById('result-input')
            .value.split(/ *, */);
        await putReq('/poll/result', {
            resultList: resultList,
            password: pw,
        });
        await getRanking({
            password: pw,
        });
    }

    async function submitChoice() {
        const pw = document.cookie.split('=')[1];
        const choiceList = document
            .getElementById('choice-input')
            .value.split(/ *, */);
        await putReq('/poll/choice', {
            choiceList: choiceList,
            password: pw,
        });
        await getResult({
            password: pw,
        });
    }

    async function reset() {
        const pw = document.cookie.split('=')[1];

        try {
            await postReq('/poll/reset', {
                password: pw,
            });
            await postReq('/vote/reset', {
                password: pw,
            });
        } catch (e) {
            console.log(e);
        }
    }
</script>

<main>
    <h1>Admin Panel</h1>

    <hr />

    {#if logined === true}

    <button id="reset-btn" on:click={reset}>초기화</button>

    <hr />

        <button id="open-btn" on:click={openPoll}>투표 열기</button>
        <button id="close-btn" on:click={closePoll}>투표 닫기</button>
        <p>현재 상태: {state}</p>

        <hr />

        <input
            id="choice-input"
            type="text"
            placeholder="0번 팀, 1번 팀, ..."
        />
        <button id="submit-choice-btn" on:click={submitChoice}
            >팀명 입력하기</button
        >

        <hr />
        <table>
            <tr>
                <td>Title</td>
                {#each result.choiceList as choice, i}
                    <td>{(result.choiceList.length - i) * 20 }만원</td>
                {/each}
                <td>Money</td>
            </tr>
            {#each result.voteList as voteList, i}
                <tr>
                    <td>{result.choiceList[i]}</td>
                    {#each voteList as vote}
                        <td>{vote}표</td>
                    {/each}
                    <td>{result.moneyList[i]}만원</td>
                </tr>
            {/each}
            <tr>
                <td>Total</td>
                {#each result.totalVoteList as totalVotes}
                    <td>{totalVotes}표</td>
                {/each}
                <td>{result.totalMoney}만원</td>
            </tr>
        </table>

        <hr />

        <input
            id="result-input"
            type="text"
            placeholder="2, 1, 0 (2번이 1등, 1번이 2등, 0번이 3등)"
        />
        <button id="submit-result-btn" on:click={submitResult}
            >결과 입력하기</button
        >

        {#if ranking.resultList !== undefined}
            <p>현재 결과: {ranking.resultList}</p>
        {/if}

        <hr />

        <table>
            <tr>
                <td>index</td>
                <td>name</td>
                <td>score</td>
                <td>choice</td>
                <td>time</td>
            </tr>
            {#if ranking.rankingList.length !== 0}
                {#each ranking.rankingList as info, i}
                    <tr>
                        <td>{i + 1}</td>
                        <td>{info.name}</td>
                        <td>{info.score}점</td>
                        <td>{info.choiceList}</td>
                        <td>
                            {new Date(info.time).toLocaleDateString() +
                                ' ' +
                                new Date(info.time).toTimeString()}
                        </td>
                    </tr>
                {/each}
            {/if}
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
