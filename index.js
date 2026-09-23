// Landing Page JavaScript Logic
document.addEventListener("DOMContentLoaded", () => {
    const bgmAudio = document.getElementById("bgmAudio");
    const soundToggleBtn = document.getElementById("soundToggleBtn");
    let isAudioPlaying = false;

    if (soundToggleBtn && bgmAudio) {
        soundToggleBtn.addEventListener("click", () => {
            if (isAudioPlaying) {
                bgmAudio.pause();
                soundToggleBtn.innerHTML = "🔊 BGM: OFF";
                soundToggleBtn.style.borderColor = "var(--maze-blue)";
                isAudioPlaying = false;
            } else {
                bgmAudio.play().then(() => {
                    soundToggleBtn.innerHTML = "🎶 BGM: ON";
                    soundToggleBtn.style.borderColor = "var(--pacman-yellow)";
                    isAudioPlaying = true;
                }).catch(err => {
                    console.log("Audio playback requires user gesture:", err);
                });
            }
        });
    }

    // Add subtle hover sound or dynamic interaction effects if needed
    console.log("Pac-Man Landing Page Loaded!");
});
