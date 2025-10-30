const express = require('express');
const router = express.Router();

const pageData = {
    page: {
        title: "Coming Soon",
        description: "페이지가 준비 중입니다. 이메일을 등록하고 가장 먼저 업데이트를 확인하세요.",
        domainName: "example.com",
        logoPathName: "/image.png"
    },
    theme: {
        titleColor: "blue",
        backgroundColor: "black",
        descriptionColor: "gray",
        buttonColor: "blue"
    }
};

router.get('/', (req, res) => {
    res.render('pages/landingPage', pageData);
});

module.exports = router;
