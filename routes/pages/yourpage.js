const express = require('express');
const router = express.Router();

const pageData = {
    page: {
        title: "Coming Soon",
        description: "페이지가 준비 중입니다. 이메일을 등록하고 가장 먼저 업데이트를 확인하세요.",
        domainName: "yourpage",
        logoPathName: "/image.png"
    },
    theme: {
        bodyClass: "bg-blue-50 text-gray-800",
        logoSvgPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        headingGradient: "from-blue-500 to-teal-400",
        descriptionClass: "text-gray-600",
        buttonColor: "blue"
    }
};

router.get('/', (req, res) => {
    res.render('pages/landingPage', pageData);
});

module.exports = router;
