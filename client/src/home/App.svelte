<script>
    import { getReq, postReq } from '../lib/requests';

    async function getPoll() {
        const poll = await getReq('/poll');
        console.log(poll);
        return poll;
    }

    const getPollPromise = getPoll();

    function makeChoiceList() {
        const choiceInputList = document.querySelectorAll(
            'select[id^=choice-]'
        );
        const choiceList = Array.from(
            { length: choiceInputList.length },
            () => -1
        );

        choiceInputList.forEach((choiceInput, ranking) => {
            const choice = Number(choiceInput.value);
            if (choice === -1) {
                throw new Error('팀을 선택해 주세요.');
            } else if (choiceList.indexOf(choice) === -1) {
                choiceList[ranking] = choice;
            } else {
                throw new Error('서로 다른 팀을 선택해 주세요.');
            }
        });

        return choiceList;
    }

    function makeVoteData(choiceList) {
        const voteData = {
            name: document.getElementById('name-input').value,
            phone: document.getElementById('phone-input').value,
            choiceList: choiceList,
        };
        console.log('[voteData]');
        console.log(voteData);
        return voteData;
    }

    async function sendVoteData(voteData) {
        await postReq('/vote', voteData);
        return true;
    }

    let isSubmitting = false;

    async function submitVote() {
        try {
            if (!isSubmitting && confirm('제출하시겠습니까?')) {
                isSubmitting = true;
                await sendVoteData(makeVoteData(makeChoiceList()));
                document.getElementById('error-msg').innerHTML =
                    '투표가 정상적으로 처리되었습니다.';
                console.log('Successfully voted!');
            } else {
                throw new Error('투자가 취소되었습니다.');
            }
        } catch (e) {
            isSubmitting = false;
            document.getElementById('error-msg').innerHTML = e.message;
            console.log(e);
        }
    }
</script>

<main>
    <div id="main-container">
        <h1>메이커톤 투자 확인서?</h1>

        <p class="line" />

        {#await getPollPromise}
            <p>Loading...</p>
        {:then poll}
            {#if poll.state === 'open'}
                <p>· 이름</p>
                <input id="name-input" type="text" placeholder="장현규" />

                <p>· 전화번호 뒷 4자리</p>
                <input id="phone-input" type="text" placeholder="5678" />

                <p class="line" />

                {#each poll.choiceList as choice, i}
                    <div class="choice-div">
                        <p>
                            {(poll.choiceList.length - i) * 20}만원을 투자할 팀:
                        </p>
                        <select id="choice-{i}-input">
                            <option value="-1">원하는 팀을 선택하세요.</option>
                            {#each poll.choiceList as choice, i}
                                <option value={i}>{choice}</option>
                            {/each}
                        </select>
                    </div>
                {/each}

                <p class="line" />

                <button id="submit-btn" on:click={submitVote}>제출</button>

                <p id="error-msg">*****</p>
            {:else}
                <p>투자가 종료되었습니다.</p>
            {/if}
        {/await}
        <p id="developer">ⓒ黑생회</p>
    </div>
</main>

<style>
    h1 {
        margin: 0;
    }

    p {
        margin: 1rem 0 0 0;
        width: -webkit-fill-available;
        padding: 0.5rem 0;
        font-weight: bold;
    }

    input {
        width: -webkit-fill-available;
        padding: 0.5rem 0.6rem 0.3rem 0.6rem;
        border: none;
        box-shadow: inset rgb(220, 220, 220) 0 0 0.3rem 0rem;
    }

    input:focus {
        outline: none;
        box-shadow: inset rgb(220, 220, 220) 0 0 0.6rem 0rem;
    }

    select {
        font-family: LINESeed;
        font-size: 1rem;
        width: -webkit-fill-available;
        padding: 0.6rem 0.6rem 0.4rem 0.6rem;
        border: none;
        box-shadow: inset rgb(220, 220, 220) 0 0 0.3rem 0rem;

        appearance: none;
        background-image: url(../assets/arrow.png);
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 0.5rem;
    }

    select:focus {
        outline: none;
        box-shadow: inset rgb(220, 220, 220) 0 0 0.6rem 0rem;
    }

    select:focus::after {
        transform: rotate(180deg);
    }

    main {
        display: flex;
        justify-content: center;
    }

    .line {
        width: -webkit-fill-available;
        border-bottom: dashed grey 0.15rem;
        padding: 0;
        margin-top: 1.5rem;
    }

    .choice-div {
        width: -webkit-fill-available;
    }

    #main-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        box-shadow: rgb(220 220 220) 0 0.2rem 0.4rem 0.2rem;
        padding: 2rem;
        background-color: white;
        position: relative;
    }

    #submit-btn {
        width: -webkit-fill-available;
        border-radius: 0;
        border: none;
        background-color: rgb(240, 240, 240);
        padding: 0.5rem 0.6rem 0.3rem 0.6rem;
        margin-top: 1.5rem;

        outline: none;
    }

    #submit-btn:hover {
        cursor: pointer;
        background-color: rgb(230, 230, 230);
        font-weight: bold;
    }

    #submit-btn:focus {
        background-color: rgb(230, 230, 230);
        font-weight: bold;
    }

    #error-msg {
        text-align: center !important;
        color: red;
        font-weight: 400 !important;
        font-size: 0.8rem;
    }

    #developer {
        margin: 0;
        padding: 0;
        text-align: right;
        font-size: 0.1rem;
        font-weight: 400;
        position: absolute;
        right: 0.5rem;
        bottom: 0.4rem;
        opacity: .05;
    }
</style>
