document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchBar = document.getElementById('search-bar');
    let talks = [];

    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk =>
            talk.category.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        talksToRender.forEach((talk, index) => {
            if (index === 3) { // Lunch break after the 3rd talk
                const breakElement = document.createElement('div');
                breakElement.classList.add('break');
                const breakStartTime = new Date(currentTime.getTime());
                const breakEndTime = new Date(breakStartTime.getTime() + 60 * 60 * 1000);
                breakElement.textContent = `Lunch Break (${formatTime(breakStartTime)} - ${formatTime(breakEndTime)})`;
                scheduleContainer.appendChild(breakElement);
                currentTime = breakEndTime;
            }

            const talkElement = document.createElement('div');
            talkElement.classList.add('talk');

            const talkStartTime = new Date(currentTime.getTime());
            const talkEndTime = new Date(talkStartTime.getTime() + talk.duration * 60 * 1000);

            talkElement.innerHTML = `
                <div class="talk-header">
                    <h2 class="talk-title">${talk.title}</h2>
                    <span class="talk-time">${formatTime(talkStartTime)} - ${formatTime(talkEndTime)}</span>
                </div>
                <p class="talk-speakers">By: ${talk.speakers.join(', ')}</p>
                <p class="talk-description">${talk.description}</p>
                <div class="talk-categories">
                    ${talk.category.map(cat => `<span class="talk-category">${cat}</span>`).join('')}
                </div>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime = new Date(talkEndTime.getTime() + 10 * 60 * 1000); // 10 minute break
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
