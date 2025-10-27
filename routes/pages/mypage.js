const express = require('express');
const router = express.Router();

// 1. /mypage 에 주입할 데이터
const myPageData = {
    page: {
        title: "My Page - 환영합니다",
        logoText: "MyLogo",
        heading: "Welcome",
        subtext: "저희의 새로운 서비스가 곧 출시됩니다. 가장 먼저 소식을 받아보세요.",
        emailPlaceholder: "your.email@example.com"
    },
    theme: {
        bodyClass: "bg-gray-900 text-white",
        logoColor: "text-indigo-500",
        logoTextColor: "",
        logoSvgPath: "M13 10V3L4 14h7v7l9-11h-7z",
        headingGradient: "from-indigo-400 to-purple-600",
        subtextClass: "text-gray-300",
        colorName: "indigo" // 버튼/포커스 등에 사용
    }
};

// 4. 라우터 설정
// 이제 'landingPage'라는 EJS 템플릿 *하나만* 사용합니다.
router.get('/', (req, res) => {
    res.render('pages/landingPage', myPageData);
});

module.exports = router;
