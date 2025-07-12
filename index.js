const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// --- 1. IP 주소를 저장할 배열(임시 저장소) 만들기 ---
const loggedIps = [];

app.use(cors());
app.use(express.json());

// --- 2. IP 목록을 보여줄 메인 페이지('/') 만들기 ---
app.get('/', (req, res) => {
    // 페이지 스타일을 예쁘게 꾸미기
    let html = `
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background-color: #f0f2f5; color: #333; padding: 20px; }
            .container { max-width: 800px; margin: 40px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            h1 { text-align: center; color: #1a73e8; }
            ul { list-style: none; padding: 0; }
            li { background: #e8f0fe; border-left: 5px solid #1a73e8; padding: 15px; margin-bottom: 10px; border-radius: 4px; font-size: 1.1em; word-wrap: break-word; }
            li:nth-child(even) { background: #f8f9fa; border-left-color: #5f6368; }
            .timestamp { font-size: 0.8em; color: #5f6368; display: block; margin-top: 5px; }
            .no-logs { text-align: center; color: #888; font-size: 1.2em; padding: 40px 0; }
        </style>
        <div class="container">
            <h1>IP 접속 기록</h1>
            <ul>
    `;

    if (loggedIps.length === 0) {
        html += '<p class="no-logs">아직 기록된 IP가 없습니다. Netlify 페이지를 방문하여 로그를 생성하세요.</p>';
    } else {
        // 배열을 역순으로 돌면서 최신 기록이 위로 오게 함
        [...loggedIps].reverse().forEach(log => {
            html += `<li>IP: ${log.ip}<br>User-Agent: ${log.userAgent}<span class="timestamp">${log.time}</span></li>`;
        });
    }

    html += '</ul></div>';
    res.send(html);
});

// IP를 받아서 기록하는 경로는 그대로 둡니다.
app.post('/log-ip', (req, res) => {
    const { ip, userAgent } = req.body;
    if (ip) {
        const timestamp = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
        
        // --- 3. IP를 받을 때마다 배열에 객체 형태로 추가 ---
        loggedIps.push({ 
            ip: ip, 
            userAgent: userAgent,
            time: timestamp 
        });

        console.log(`[LOG ADDED] - IP: ${ip}`); // 서버 로그에도 기록
        res.status(200).json({ status: 'success', message: 'IP logged.' });
    } else {
        res.status(400).json({ status: 'error', message: 'IP is missing.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
