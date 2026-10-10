function saveGameData() {
    //updating the pacmanHistory 
    const newDataEntry = {
        "score": score, "foodEaten": foodEaten, "ghostEncountered": ghostEncountered, "won": win, "date": Date.now(), "dateISO": new Date().toLocaleDateString()
    };

    const currentHistory = JSON.parse(localStorage.getItem("pacmanHistory") || "[]");

    currentHistory.push(newDataEntry);

    if (currentHistory.length > 50) {
        currentHistory.shift();
    }

    localStorage.setItem("pacmanHistory", JSON.stringify(currentHistory));

    //updating the pacmanStats
    const pacmanStats = JSON.parse(localStorage.getItem("pacmanStats")) || { "gamePlayed": 0, "totalScore": 0, "highScore": 0, "totalFoodEaten": 0, "totalGhostEncountered": 0, "totalWins": 0, "currentStreak": 0, "maxStreak": 0 };

    pacmanStats.gamePlayed += 1;
    pacmanStats.totalScore += score;
    pacmanStats.highScore = Math.max(pacmanStats.highScore, score);
    pacmanStats.totalFoodEaten += foodEaten;
    pacmanStats.totalGhostEncountered += ghostEncountered;
    pacmanStats.totalWins += win ? 1 : 0;
    pacmanStats.currentStreak = win ? pacmanStats.currentStreak + 1 : 0;
    pacmanStats.maxStreak = Math.max(pacmanStats.maxStreak, pacmanStats.currentStreak);

    localStorage.setItem("pacmanStats", JSON.stringify(pacmanStats));
}