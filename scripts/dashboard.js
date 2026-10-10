window.onload = function () {

    const pacmanStats = JSON.parse(localStorage.getItem("pacmanStats")) || null;
    const pacmanHistory = JSON.parse(localStorage.getItem("pacmanHistory") || "[]");

    if (!pacmanHistory || pacmanHistory.length === 0) {
        document.getElementById("emptyState").classList.remove("hidden");
        document.getElementById("heroBanner").classList.add("hidden");
        document.getElementById("bentoRow1").classList.add("hidden");
        document.getElementById("bentoRow2").classList.add("hidden");
        document.querySelector(".history-section").classList.add("hidden");
        return;
    }

    populateCoreStats(pacmanStats, pacmanHistory);
    populateBehavioralStats(pacmanStats, pacmanHistory);
    populateHistoryTable(pacmanHistory, pacmanStats);
    renderCharts(pacmanHistory, pacmanStats);
}

function populateCoreStats(pacmanStats, pacmanHistory) {
    // Hero Banner
    document.getElementById("highScore").textContent = pacmanStats.highScore;
    document.getElementById("lastScore").textContent = pacmanHistory[pacmanHistory.length - 1].score;

    // Mini Stat Cards
    document.getElementById("gamesPlayed").textContent = pacmanStats.gamePlayed;
    document.getElementById("avgScore").textContent = Math.round(Number(pacmanStats.totalScore) / Number(pacmanStats.gamePlayed));
    document.getElementById("totalFood").textContent = pacmanStats.totalFoodEaten;
    document.getElementById("totalGhosts").textContent = pacmanStats.totalGhostEncountered;

}

function populateBehavioralStats(pacmanStats, pacmanHistory) {
    let winRate = Math.round((pacmanStats.totalWins / pacmanStats.gamePlayed) * 100);
    document.getElementById("winRate").textContent = `${winRate}%`;

    let avgGhostHits = pacmanStats.totalGhostEncountered / pacmanStats.gamePlayed;
    let playStyle = avgGhostHits > 1.5 ? "Aggressive 🔥" : "Cautious 🛡️"
    document.getElementById("playStyle").textContent = playStyle;

    let gameWithZeroHits = pacmanHistory.reduce((count, game) => {
        if (game.ghostEncountered === 0) {
            count += 1;
        }
        return count;
    }, 0);

    let avoidenceRate = gameWithZeroHits / pacmanHistory.length;
    document.getElementById("avoidanceRate").textContent = `${avoidenceRate}%`;

    document.getElementById("bestStreak").textContent = `${pacmanStats.maxStreak} Games`;

    let ghostEncountered = pacmanStats.totalGhostEncountered === 0 ? 1 : pacmanStats.totalGhostEncountered;
    let efficiency = Math.round(pacmanStats.totalFoodEaten / ghostEncountered);
    document.getElementById("efficiencyRating").textContent = efficiency;

    if (pacmanHistory.length < 2) {
        document.getElementById("trendIcon").textContent = "📈";
        document.getElementById("trendValue").textContent = "0%";
    }
    else {
        let smapleSize = 0;
        let historylen = pacmanHistory.length;
        if (historylen < 10) {
            smapleSize = Math.floor(historylen / 2);
        }
        else {
            smapleSize = 5;
        }
        let lastSampleAvg = pacmanHistory.slice(historylen - smapleSize * 2, historylen - smapleSize).reduce((score, game) => score + game.score, 0) / smapleSize;
        let currentSampleAvg = pacmanHistory.slice(historylen - smapleSize, historylen).reduce((score, game) => score + game.score, 0) / smapleSize;
        let trendValue = Math.round(((currentSampleAvg - lastSampleAvg) / lastSampleAvg) * 100);

        document.getElementById("trendIcon").textContent = trendValue < 0 ? "📉" : "📈";
        document.getElementById("trendValue").textContent = `${trendValue}%`;
    }
}

function populateHistoryTable(pacmanHistory, pacmanStats) {
    let tableBody = document.getElementById("historyTableBody");
    tableBody.innerHTML = "";

    // Show newest game first
    let reversedHistory = [...pacmanHistory].reverse();

    reversedHistory.forEach((game, index) => {
        let gameNumber = pacmanHistory.length - index;
        let row = document.createElement("tr");

        if (game.score === pacmanStats.highScore) {
            row.classList.add("best-game");
        }

        let resultClass = game.won ? "result-win" : "result-loss";
        let resultText = game.won ? "WIN" : "LOST";

        row.innerHTML = `
            <td>#${gameNumber}</td>
            <td>${game.score}</td>
            <td>${game.foodEaten}</td>
            <td>${game.ghostEncountered}</td>
            <td><span class="${resultClass}">${resultText}</span></td>
        `;

        tableBody.appendChild(row);
    });
}

function renderCharts(pacmanHistory, pacmanStats) {
    if (typeof Chart === "undefined") return;

    let labels = pacmanHistory.map((_, index) => `#${index + 1}`);

    // 1. Score Progress Line Chart
    let scoreCtx = document.getElementById("scoreChart");
    if (scoreCtx) {
        new Chart(scoreCtx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Score",
                    data: pacmanHistory.map(game => game.score),
                    borderColor: "#facc15",
                    backgroundColor: "rgba(250, 204, 21, 0.12)",
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: "#facc15",
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: "rgba(255, 255, 255, 0.05)" },
                        ticks: { color: "#94a3b8", font: { size: 10 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255, 255, 255, 0.05)" },
                        ticks: { color: "#94a3b8", font: { size: 10 } }
                    }
                }
            }
        });
    }

    // 2. Win Rate Doughnut Chart
    let winCtx = document.getElementById("winRateChart");
    if (winCtx) {
        let wins = pacmanStats.totalWins || 0;
        let losses = Math.max(0, (pacmanStats.gamePlayed || 0) - wins);

        new Chart(winCtx, {
            type: "doughnut",
            data: {
                labels: ["Wins", "Losses"],
                datasets: [{
                    data: [wins, losses],
                    backgroundColor: ["#22c55e", "#ef4444"],
                    borderColor: "transparent",
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "75%",
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // 3. Encounters Bar Chart
    let encountersCtx = document.getElementById("encountersChart");
    if (encountersCtx) {
        new Chart(encountersCtx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Ghost Hits",
                    data: pacmanHistory.map(game => game.ghostEncountered),
                    backgroundColor: "rgba(239, 68, 68, 0.75)",
                    borderColor: "#ef4444",
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: "#94a3b8", font: { size: 10 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255, 255, 255, 0.05)" },
                        ticks: { color: "#94a3b8", stepSize: 1, font: { size: 10 } }
                    }
                }
            }
        });
    }
}

