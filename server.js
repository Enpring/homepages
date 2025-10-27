const express = require('express');
const path = require('path');
const fs = require('fs'); // <-- 1. File System 모듈 추가
const app = express();
const PORT = 3000;

// --- 1. 뷰 엔진 설정 (EJS) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 2. 미들웨어 설정 (공통) ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 3. 'api' 라우터 불러오기 (수동) ---
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); // api 라우터는 고정이므로 먼저 마운트

// --- 4. 'pages' 라우터 동적 로딩 (자동) ---
const pagesDir = path.join(__dirname, 'routes', 'pages');
const loadedPageRoutes = []; // 콘솔에 출력하기 위한 배열

try {
    // 'routes/pages' 폴더의 모든 파일을 동기적으로 읽어옵니다.
    fs.readdirSync(pagesDir).forEach(file => {
        // .js 파일만 대상으로 합니다.
        if (file.endsWith('.js')) {
            // 파일 이름에서 '.js'를 떼어내어 라우트 경로로 사용합니다.
            // 예: 'mypage.js' -> 'mypage'
            const pageName = path.basename(file, '.js');
            
            // 예: '/mypage'
            const routePath = `/${pageName}`;
            
            // 파일의 전체 경로를 사용해 라우터 모듈을 불러옵니다.
            // 예: require('./routes/pages/mypage.js')
            const router = require(path.join(pagesDir, file));

            // Express 앱에 라우터를 마운트합니다.
            // 예: app.use('/mypage', router)
            app.use(routePath, router);

            // 로깅을 위해 성공적으로 로드된 경로를 저장합니다.
            loadedPageRoutes.push(routePath);
        }
    });
} catch (err) {
    console.error('[오류] 페이지 라우터를 불러오는 중 에러가 발생했습니다:', err);
}
// ---

// --- 5. 서버 시작 ---
app.listen(PORT, () => {
    console.log('서버가 EJS 템플릿 모드로 시작되었습니다.');
    
    // 동적으로 불러온 페이지 경로들을 정렬하여 출력합니다.
    loadedPageRoutes.sort().forEach(route => {
        console.log(`  - http://localhost:${PORT}${route}`);
    });
});
