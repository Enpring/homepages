// DOM이 완전히 로드된 후에 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    // 현재 페이지의 폼 요소들을 가져옵니다.
    const form = document.getElementById('notify-form');
    const emailInput = document.getElementById('email-input');
    const submitButton = document.getElementById('notify-button');
    const messageArea = document.getElementById('message-area');

    // 1. 이메일 유효성 검사 함수
    function isValidEmail(email) {
        // 간단한 이메일 정규식
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // 2. 버튼 상태를 업데이트하는 함수
    function updateButtonState() {
        const email = emailInput.value;
        if (isValidEmail(email)) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // 3. 페이지 로드 시 버튼을 비활성화 상태로 시작
    updateButtonState();

    // 4. 이메일 입력란에 키보드를 입력할 때마다 유효성 검사
    emailInput.addEventListener('input', updateButtonState);

    // 5. 폼 제출(submit) 이벤트 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작을 막음
        const email = emailInput.value;

        // 버튼이 활성화되었어도 혹시 모르니 다시 한번 검사
        if (!isValidEmail(email)) {
            showMessage('유효한 이메일을 입력하세요.', false);
            return;
        }

        // 로딩 상태 표시
        submitButton.disabled = true;
        submitButton.textContent = '보내는 중...';

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const result = await response.json();

            if (!response.ok) {
                // 서버에서 보낸 에러 메시지 (예: 400 Bad Request)
                throw new Error(result.message || '알 수 없는 오류가 발생했습니다.');
            }

            // 성공
            showMessage(result.message, true);
            emailInput.value = ''; // 성공 시 입력창 비우기

        } catch (error) {
            // 실패
            showMessage(`오류: ${error.message}`, false);
        } finally {
            // 완료 (성공/실패 여부와 관계없이)
            submitButton.textContent = '알림 받기';
            // 입력창이 비워졌으므로 버튼을 다시 비활성화
            updateButtonState(); 
        }
    });

    // 6. 사용자에게 메시지를 보여주는 함수
    function showMessage(msg, success) {
        messageArea.textContent = msg;
        if (success) {
            messageArea.className = 'text-green-500 text-sm mt-2';
        } else {
            messageArea.className = 'text-red-500 text-sm mt-2';
        }
        
        // 3초 후에 메시지 지우기
        setTimeout(() => {
            messageArea.textContent = '';
        }, 3000);
    }
});
