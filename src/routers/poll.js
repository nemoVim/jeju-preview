import express from 'express';
import pollController from '../controllers/poll.js';

const router = new express.Router();

// 선택지 가져오기
router.get('/choice', pollController.getChoices);

// 선택지 입력하기
router.put('/choice', pollController.putChoices);

// 결과 입력하기
router.put('/result', pollController.putResult);

// 투표 열고 닫기
router.put('/state', pollController.putState);

export default router;