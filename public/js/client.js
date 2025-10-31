/**
 * 이 파일은 모든 랜딩 페이지에서 공통으로 사용되는 클라이언트 사이드 스크립트입니다.
 * 1. 이메일 입력 유효성 검사 (실시간)
 * 2. 폼 제출 (API 호출)
 */

// DOM이 완전히 로드된 후에 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    const notifyForm = document.getElementById('notify-form');
    const emailInput = document.getElementById('email-input');
    const submitButton = document.getElementById('notify-button');
    const buttonText = document.getElementById('button-text');
    const buttonLoading = document.getElementById('button-loading');
    const formMessage = document.getElementById('message-area');

    // 폼이나 인풋이 존재하지 않으면 스크립트를 종료합니다.
    if (!notifyForm || !emailInput || !submitButton) {
        return;
    }

    /**
     * 간단한 이메일 유효성 검사 함수
     * @param {string} email - 검사할 이메일 문자열
     * @returns {boolean} - 유효하면 true, 아니면 false
     */
    function validateEmail(email) {
        // 간단한 정규식으로 'user@domain.com' 형식을 확인합니다.
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * 버튼의 활성화/비활성화 상태를 토글합니다.
     */
    function updateButtonState() {
        const email = emailInput.value;
        if (validateEmail(email)) {
            // 유효한 이메일: 버튼 활성화
            submitButton.disabled = false;
        } else {
            // 유효하지 않은 이메일: 버튼 비활성화
            submitButton.disabled = true;
        }
    }

    /**
     * 폼 제출(로딩) 상태를 설정합니다.
     * @param {boolean} isLoading - 로딩 중인지 여부
     */
    function setFormLoading(isLoading) {
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.textContent = '보내는 중...';
        emailInput.disabled = true;
    } else {
        submitButton.disabled = false;
        submitButton.textContent = '알림 받기';
        emailInput.disabled = false;
    }
}

    /**
     * 사용자에게 피드백 메시지를 보여줍니다.
     * @param {string} message - 보여줄 메시지
     * @param {boolean} isError - 에러 메시지인지 여부
     */
    function showMessage(message, isError = false) {
        formMessage.textContent = message;
        if (isError) {
            formMessage.classList.remove('text-green-400');
            formMessage.classList.add('text-red-400');
        } else {
            formMessage.classList.remove('text-red-400');
            formMessage.classList.add('text-green-400');
        }
        formMessage.classList.remove('hidden'); // 메시지 보이기
    }

    // --- 이벤트 리스너 ---

    // 1. 이메일 입력창에 키를 입력할 때마다 유효성 검사 실행
    emailInput.addEventListener('input', updateButtonState);

    // 2. 폼 제출 이벤트 처리
    notifyForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // 기본 폼 제출(새로고침) 방지

        const email = emailInput.value;
        
        // [수정됨] window.location 대신 data-page-id 속성을 읽어옵니다.
        const pageName = notifyForm.dataset.domainName; 

        // 유효성 재확인
        if (!validateEmail(email)) {
            showMessage('유효한 이메일 주소를 입력하세요.', true);
            return;
        }

        // 로딩 상태 시작
        setFormLoading(true);
        showMessage('', false); // 이전 메시지 숨기기

        try {
            // API 엔드포인트
            const API_URL = 'http://default-enstart-back-ema-df1f5-112414483-6eff766d0525.kr.lb.naverncp.com/subscription/';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    domain: pageName // [수정됨] 서버에서 받은 페이지 식별자 전송
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                // HTTP 상태 코드가 200-299가 아닌 경우 (e.g., 400, 500)
                throw new Error(result.message || '알 수 없는 에러가 발생했습니다.');
            }

            // 성공
            showMessage(result.message || '성공적으로 등록되었습니다!', false);
            emailInput.value = ''; // 입력창 비우기
            updateButtonState(); // 버튼 비활성화

        } catch (error) {
            // 실패 (네트워크 오류 또는 서버 에러)
            console.error('Fetch Error:', error);
            showMessage(error.message || '전송에 실패했습니다. 나중에 다시 시도하세요.', true);
        
        } finally {
            // 로딩 상태 종료 (성공/실패 여부와 관계없이)
            setFormLoading(false);
            // 성공했을 경우 이메일이 비워졌으므로 버튼은 자동으로 비활성화됩니다.
            updateButtonState();
        }
    });

    // --- 초기화 ---
    // 페이지 로드 시 버튼 상태 초기화 (보통 비활성화 상태)
    updateButtonState();

});
