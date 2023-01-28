import express from 'express';
import pollController from '../controllers/poll.js';

const router = new express.Router();

// 모든 데이터 가져오기
router.get('/', pollController.getPoll);

// 선택지 가져오기
router.get('/choice', pollController.getChoices);

// 선택지 입력하기
router.put('/choice', pollController.putChoices);

// 결과 입력하기
router.put('/result', pollController.putResult);

// 투표 열고 닫기
router.put('/state', pollController.putState);

// 투표 상태 가져오기
router.get('/state', pollController.getState);


router.post('/reset', pollController.postReset);

export default router;