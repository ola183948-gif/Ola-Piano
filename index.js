  const piano = document.getElementById("piano");
        const noteLabel = document.getElementById("noteLabel");

        let audioContext;
        let melodyTimers = [];

        // Play a piano note using the Web Audio API
        function playNote(key) {
            if (!audioContext) {
                audioContext = new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();
            }

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const frequency = Number(key.dataset.freq);

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "triangle";
            oscillator.frequency.value = frequency;

            const now = audioContext.currentTime;

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(
                0.25, now + 0.02
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001, now + 0.45
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start(now);
            oscillator.stop(now + 0.46);

            key.classList.add("active");

            setTimeout(() => {
                key.classList.remove("active");
            }, 150);

            noteLabel.textContent =
                "Playing note: " + key.dataset.note;
        }

        // Play a note when a piano key is clicked or touched
        piano.addEventListener("pointerdown", function(event) {
            const key = event.target.closest(".key");

            if (key) {
                event.preventDefault();
                playNote(key);
            }
        });

        // Keyboard controls
        const keyboardMap = {
            a: "C4",
            s: "D4",
            d: "E4",
            f: "F4",
            g: "G4",
            h: "A4",
            j: "B4",
            k: "C5"
        };

        document.addEventListener("keydown", function(event) {
            if (event.repeat) return;

            const note = keyboardMap[event.key.toLowerCase()];

            if (note) {
                const key = piano.querySelector(
                    '[data-note="' + note + '"]'
                );

                if (key) {
                    playNote(key);
                }
            }
        });

        // Demo melody
        const melody = [
            "C4", "C4", "G4", "G4",
            "A4", "A4", "G4",
            "F4", "F4", "E4", "E4",
            "D4", "D4", "C4"
        ];

        document.getElementById("playTune")
            .addEventListener("click", function() {
                stopMelody();

                melody.forEach(function(note, index) {
                    const timer = setTimeout(function() {
                        const key = piano.querySelector(
                            '[data-note="' + note + '"]'
                        );

                        if (key) {
                            playNote(key);
                        }
                    }, index * 420);

                    melodyTimers.push(timer);
                });
            });

        // Stop the demo melody
        function stopMelody() {
            melodyTimers.forEach(function(timer) {
                clearTimeout(timer);
            });

            melodyTimers = [];
        }

        document.getElementById("stopTune")
            .addEventListener("click", stopMelody);