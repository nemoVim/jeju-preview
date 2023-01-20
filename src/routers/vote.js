import express from 'express';
import voteController from '../controllers/vote.js';

const router = express.Router();

// 투표하기
router.post('/', voteController.postVote);

// 투표 자체의 결과 가져오기
router.post('/', voteController.getResult);

// 실제 결과 입력 후 투표자들의 순위 가져오기
router.post('/ranking', voteController.getRanking);

export default router;