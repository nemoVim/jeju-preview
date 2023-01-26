<script>
    import post from '../lib/post';


    async function getPoll() {
        const pollData = await fetch("http://localhost:2023/poll");
        const poll = await pollData.json();
        console.log(poll);
        return poll;
    }

    const getPollPromise = getPoll();

    function makeChoiceList() {
        const choiceInputList = document.querySelectorAll('input[id^=choice-]');
        const choiceList = Array.from({length: choiceInputList.length}, () => -1);

        choiceInputList.forEach((choiceInput, index) => {
            const ranking = choiceInput.value;
            if (ranking <= 0 || ranking > choiceList.length) {
                throw new Error('알맞은 등수를 입력해 주세요.');
            } else {

                if (choiceList[ranking-1] === -1) {
                    choiceList[ranking-1] = index;
                } else {
                    throw new Error('서로 다른 등수를 입력해 주세요.');
                }
            }
        });

        return choiceList;
    }

    function makeVoteData(choiceList) {
        const voteData = {
            name: document.getElementById('name-input').value,
            phone: document.getElementById('phone-input').value,
            choiceList: choiceList,
        }
        console.log("[voteData]");
        console.log(voteData);
        return voteData;
    }

    async function sendVoteData(voteData) {
        await post('http://localhost:2023/vote', voteData);
        return true;
    }

    async function submitVote() {
        try {
            document.getElementById('submit-btn').classList.add('hidden');
            await sendVoteData(makeVoteData(makeChoiceList()));
            document.getElementById('error-msg').classList.remove('hidden');
            document.getElementById('error-msg').innerHTML = '투표가 정상적으로 처리되었습니다.';
            console.log("Successfully voted!");
        } catch (e) {
            document.getElementById('submit-btn').classList.remove('hidden');
            document.getElementById('error-msg').classList.remove('hidden');
            document.getElementById('error-msg').innerHTML = e.message;
            console.log(e);
        }
    }

</script>

<main>
    <h1>투표인가? 투자인가?</h1>

    {#await getPollPromise}
        <p>Loading...</p>
    {:then poll} 
        {#if poll.state === 'open'}
            <p>이름</p>
            <input id="name-input" type="text" placeholder="장현규">

            <p>전화번호 뒷 4자리</p>
            <input id="phone-input" type="text" placeholder="5678">

            {#each poll.choiceList as choice, i}
                <div>
                    <p>{choice}</p>
                    <input id="choice-{i}-input" type="number" value=0>
                </div>
            {/each}

            <button id="submit-btn" on:click={submitVote}>제출</button>

            <p id="error-msg" class="hidden">대충 오류가 발생했다는 글</p>

        {:else}
            <p>투표가 종료되었습니다.</p>
        {/if}
    {/await}
</main>

<style>
</style>
