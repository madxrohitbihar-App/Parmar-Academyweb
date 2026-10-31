// Check session validity and redirect directly if valid
(function() {
    const expiryTime = localStorage.getItem("app_expiry_time");
    if (expiryTime && new Date().getTime() < parseInt(expiryTime)) {
        window.location.href = "https://modeduzone.netlify.app/";
    }
})();

function generateSecretKey() {
    const chars = '828c34db80ec53e94e7174f5f52e0b274a38ab2d';
    let middlePart = '';
    for (let i = 0; i < 20; i++) {
        middlePart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'MAD' + middlePart + 'ATP';
}

function openAroLinks() {
    const apiToken = "828c34db80ec53e94e7174f5f52e0b274a38ab2d";
    const freshKey = generateSecretKey();
    localStorage.setItem("expected_app_key", freshKey);

    const targetUrl = "https://madxrohitbihar-app.github.io/Parmar-key/?key=" + freshKey;
    const apiUrl = `https://arolinks.com/api?api=${apiToken}&url=${encodeURIComponent(targetUrl)}`;

    const msgDiv = document.getElementById("status-msg");
    msgDiv.style.color = "#00f2fe";
    msgDiv.innerText = "Generating Token...";
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success" && data.shortenedUrl) {
                window.location.href = data.shortenedUrl;
            } else {
                msgDiv.style.color = "#ff4d4d";
                msgDiv.innerText = "Error generating link!";
            }
        })
        .catch(() => {
            msgDiv.style.color = "#ff4d4d";
            msgDiv.innerText = "Network Error!";
        });
}

function verifyUserKey() {
    const userKey = document.getElementById("accessKeyInput").value.trim().toUpperCase();
    const expectedKey = localStorage.getItem("expected_app_key");
    const usedKeys = JSON.parse(localStorage.getItem("used_app_keys") || "[]");
    const msgDiv = document.getElementById("status-msg");

    if (!userKey) {
        msgDiv.style.color = "#ff4d4d";
        msgDiv.innerText = "Please enter access key!";
        return;
    }

    const patternValid = userKey.startsWith("MAD") && userKey.endsWith("ATP") && userKey.length === 26;
    if (!patternValid) {
        msgDiv.style.color = "#ff4d4d";
        msgDiv.innerText = "Invalid token format! Please get a new key.";
        return;
    }

    if (usedKeys.includes(userKey)) {
        msgDiv.style.color = "#ff4d4d";
        msgDiv.innerText = "This token has already been used! Please generate a new key.";
        return;
    }

    if ((expectedKey && userKey === expectedKey) || patternValid) {
        usedKeys.push(userKey);
        localStorage.setItem("used_app_keys", JSON.stringify(usedKeys));

        const twentyFourHours = 24 * 60 * 60 * 1000;
        const expiryTimestamp = new Date().getTime() + twentyFourHours;
        localStorage.setItem("app_expiry_time", expiryTimestamp);

        // Redirect directly to target URL after successful verification
        window.location.href = "https://modeduzone.netlify.app/";
    } else {
        msgDiv.style.color = "#ff4d4d";
        msgDiv.innerText = "Invalid Access Token!";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash-screen");
    if (!sessionStorage.getItem('splashShown')) {
        setTimeout(() => {
            splash.classList.add("hide-splash");
            sessionStorage.setItem('splashShown', 'true');
        }, 1200);
    } else {
        splash.style.display = 'none';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('key');
    if (urlKey) {
        document.getElementById('accessKeyInput').value = urlKey;
        localStorage.setItem("expected_app_key", urlKey);
    }
});
