const express = require('express');
const cors = require('cors');
const app = express();

// Railway가 제공하는 포트를 사용하거나, 로컬 테스트를 위해 3001 포트를 사용합니다.
const port = process.env.PORT || 3001;

app.use(cors()); // 모든 출처에서의 요청을 허용 (Netlify 사이트에서 보낼 것이므로)
app.use(express.json());

// 서버가 살아있는지 확인하는 루트 경로
app.get('/', (req, res) => {
    res.send('IP Logger Server is running!');
});

// IP를 받아 로그로 기록하는 경로
app.post('/log-ip', (req, res) => {
    const { ip, userAgent } = req.body; // IP와 추가 정보(브라우저 종류 등)를 받음
    if (ip) {
        // Railway의 로그 시스템에 기록됩니다.
        console.log(`[IP LOG] - IP: ${ip}, User-Agent: ${userAgent}`);
        res.status(200).json({ status: 'success', message: 'IP logged.' });
    } else {
        res.status(400).json({ status: 'error', message: 'IP is missing.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});