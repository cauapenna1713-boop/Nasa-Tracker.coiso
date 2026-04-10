/**
 * NASA Tracker - Main Entry Point
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('NASA Tracker initializing...');

    // 1. Initial Data Fetch (Removed APOD)
    const [news, launches, discoveries, activeMissions, issData, artemis] = await Promise.all([
        ApiService.getLatestNews(),
        ApiService.getUpcomingLaunches(),
        ApiService.getDiscoveries(),
        ApiService.getActiveMissions(),
        ApiService.getISSTelemetry(),
        ApiService.getArtemisData()
    ]);

    // 2. Render UI
    UI.renderHero({ 
        title: 'NASA Exploration', 
        explanation: 'Exploring the frontiers of space and science to benefit humanity.' 
    });
    UI.renderGrid('news-grid', news, 'news');
    UI.renderGrid('launches-grid', launches, 'launch');
    UI.renderGrid('discoveries-grid', discoveries, 'discovery');
    UI.renderGrid('artemis-container', artemis, 'artemis');
    
    // Initial Live Dashboard Render - ONLY NASA for telemetry
    const liveNasaMissions = activeMissions.filter(m => 
        m.launch_service_provider?.name.toLowerCase().includes('nasa') ||
        m.mission?.agencies?.some(a => a.name.toLowerCase().includes('nasa'))
    );
    UI.renderLiveDashboard('live-container', liveNasaMissions, issData);

    // 3. Initialize Notifications
    const notificationBtn = document.getElementById('notification-btn');
    notificationBtn.addEventListener('click', async () => {
        const granted = await NotificationService.requestPermission();
        if (granted) {
            alert('Notifications enabled! You will be alerted for new launches.');
            notificationBtn.style.color = 'var(--accent-primary)';
        }
    });

    // Start background polling for news/notifications
    NotificationService.startPolling((newLaunches) => {
        UI.renderGrid('launches-grid', newLaunches, 'launch');
    });

    // 5. LIVE TELEMETRY LOOP (Every 5 seconds)
    setInterval(async () => {
        const [activeMissions, issData, artemis] = await Promise.all([
            ApiService.getActiveMissions(),
            ApiService.getISSTelemetry(),
            ApiService.getArtemisData()
        ]);
        const liveNasaMissions = activeMissions.filter(m => 
            m.launch_service_provider?.name.toLowerCase().includes('nasa') ||
            m.mission?.agencies?.some(a => a.name.toLowerCase().includes('nasa'))
        );
        UI.renderLiveDashboard('live-container', liveNasaMissions, issData);
        UI.renderGrid('artemis-container', artemis, 'artemis');
    }, 5000);

    // 6. Search Functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        UI.filterUI(e.target.value);
    });

    // 5. Scroll Animations (Simple Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-grid').forEach(grid => {
        observer.observe(grid);
    });

    console.log('NASA Tracker ready.');
});
