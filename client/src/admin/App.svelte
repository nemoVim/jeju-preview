<script>
    import post from '../lib/post.js';

    let logined = false;
    let result = {};

    function makePwData() {
        const pwData = {
            password: document.getElementById('pw-input').value,
        };
        return pwData;
    }

    async function getResult(pwData) {
        const result = await post('http://localhost:2023/vote/result', pwData);
        console.log(result);
        return result;
    }

    async function getRanking(pwData) {
        const ranking = await post(
            'http://localhost:2023/vote/ranking',
            pwData
        );
        return ranking;
    }

    async function submitPw() {
        try {
            document.getElementById('login-div').classList.add('hidden');
            const pwData = makePwData();
            // const [_result, _ranking] = await Promise.all([
            //     getResult(pwData),
            //     getRanking(pwData),
            // ]);
            const _result = await getResult(pwData);

            result = _result.msg;

            logined = true;
        } catch (e) {
            document.getElementById('error-msg').innerHTML = e.message;
            document.getElementById('login-div').classList.remove('hidden');
            logined = false;
        }
    }
</script>

<main>
    <h1>Admin Panel</h1>
    <hr />
    {#if logined === true}
        <table>
            <tr>
                <td>Title</td>
                {#each result.choiceList as choice, i}
                    <td>{i+1}등</td>
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
