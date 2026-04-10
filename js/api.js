/**
 * API Service for NASA Tracker
 * Handles all requests to NASA and The Space Devs APIs
 */

const CONFIG = {
    NASA_KEY: 'zaeRNnv790DciLxpNVwO4ndOWRKwkUkK4aM44ZWl', 
    TSD_URL: 'https://lldev.thespacedevs.com/2.2.0',
    SNAPI_URL: 'https://api.spaceflightnewsapi.net/v4',
    NASA_IMAGE_URL: 'https://images-api.nasa.gov',
    ISS_URL: 'https://api.wheretheiss.at/v1/satellites/25544'
};

const ApiService = {
    /**
     * Fetch Astronomy Picture of the Day
     */
    async getAPOD() {
        try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${CONFIG.NASA_KEY}`);
            if (response.status === 429) {
                console.warn('NASA API Rate Limit reached.');
                return { 
                    url: 'https://images.nasa.gov/images/nasalogo.png', 
                    title: 'NASA Exploration', 
                    explanation: 'The Astronomy Picture of the Day is currently unavailable due to high demand. Please check back in an hour.' 
                };
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching APOD:', error);
            return null;
        }
    },

    /**
     * Fetch latest news from NASA via Spaceflight News API (SNAPI)
     */
    async getLatestNews() {
        try {
            // Include NASA, ESA, and SpaceX news
            const response = await fetch(`${CONFIG.SNAPI_URL}/articles/?limit=25`);
            const data = await response.json();
            const allowedAgencies = ['NASA', 'ESA', 'SpaceX', 'Spaceflight Now', 'SpaceNews'];
            return data.results.filter(news => 
                allowedAgencies.some(agency => news.news_site.includes(agency))
            ).slice(0, 8);
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    },

    /**
     * Fetch upcoming launches (NASA-only)
     */
    async getUpcomingLaunches() {
        try {
            // Include NASA, ESA, and SpaceX
            const response = await fetch(`${CONFIG.TSD_URL}/launch/upcoming/?limit=25`);
            const data = await response.json();
            const allowed = ['nasa', 'spacex', 'european space agency', 'esa'];
            return data.results.filter(launch => 
                allowed.some(agency => launch.launch_service_provider?.name.toLowerCase().includes(agency)) ||
                launch.mission?.agencies?.some(a => allowed.some(agency => a.name.toLowerCase().includes(agency)))
            ).slice(0, 4);
        } catch (error) {
            console.error('Error fetching launches:', error);
            return [];
        }
    },

    /**
     * Fetch scientific discoveries (Recent items from 2024+)
     */
    async getDiscoveries() {
        try {
            // Broader query to ensure results, then sorted by date in JS
            const response = await fetch(`${CONFIG.NASA_IMAGE_URL}/search?q=James+Webb+nebula&media_type=image`);
            const data = await response.json();
            
            const items = data.collection.items || [];
            
            // Client-side sorting by date descending
            const sorted = items.sort((a, b) => {
                const dateA = a.data[0]?.date_created ? new Date(a.data[0].date_created) : 0;
                const dateB = b.data[0]?.date_created ? new Date(b.data[0].date_created) : 0;
                return dateB - dateA;
            });
            
            return sorted.slice(0, 4);
        } catch (error) {
            console.error('Error fetching discoveries:', error);
            return [];
        }
    },

    /**
     * Fetch Live ISS Telemetry (Real-world proxy for live mission telemetry)
     */
    async getISSTelemetry() {
        try {
            const response = await fetch(CONFIG.ISS_URL);
            return await response.json();
        } catch (error) {
            console.error('Error fetching ISS telemetry:', error);
            return null;
        }
    },

    /**
     * Fetch all currently active (In Flight) NASA missions
     */
    async getActiveMissions() {
        try {
            // Fetch active missions for NASA, ESA, SpaceX
            const response = await fetch(`${CONFIG.TSD_URL}/launch/?status=3&limit=25`);
            const data = await response.json();
            const allowed = ['nasa', 'spacex', 'esa', 'european space agency'];
            return data.results.filter(launch => 
                allowed.some(agency => launch.launch_service_provider?.name.toLowerCase().includes(agency)) ||
                launch.mission?.agencies?.some(a => allowed.some(agency => a.name.toLowerCase().includes(agency)))
            );
        } catch (error) {
            console.error('Error fetching active missions:', error);
            return [];
        }
    },

    /**
     * Fetch Artemis specifically (Search by program/name)
     */
    async getArtemisData() {
        try {
            const response = await fetch(`${CONFIG.TSD_URL}/launch/?search=Artemis&limit=2`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching Artemis data:', error);
            return [];
        }
    }
};
