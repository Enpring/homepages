const express = require('express');
const router = express.Router();

router.post('/notify', (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ message: '이메일이 필요합니다.' });
    }

    console.log(`[알림 신청] 새로운 이메일 등록: ${email}`);
    res.status(200).json({ message: '성공적으로 등록되었습니다!' });
});

module.exports = router;
