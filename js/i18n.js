/**
 * i18n Service for NASA Tracker
 * Handles English and Portuguese translations for the UI
 */

const I18N = {
    currentLang: localStorage.getItem('lang') || 'pt',
    
    translations: {
        en: {
            nav_home: 'Home',
            nav_news: 'News',
            nav_launches: 'Launches',
            nav_discoveries: 'Discoveries',
            nav_live: 'Live Feed',
            placeholder_search: 'Search the cosmos...',
            hero_label: 'Astronomy Picture of the Day',
            hero_cta: 'Explore Latest News',
            section_live: 'Live Missions & Telemetry',
            section_news: 'Latest NASA News',
            section_launches: 'NASA Missions',
            section_discoveries: 'Scientific Discoveries',
            card_read_more: 'Full Article',
            card_view_data: 'View Data',
            live_iss_title: 'International Space Station',
            live_iss_desc: "Real-time tracking of humanity's orbital laboratory.",
            live_telemetry: 'LIVE TELEMETRY',
            live_streaming: 'STREAMING LIVE',
            footer_text: 'Powered by NASA and The Space Devs APIs.'
        },
        pt: {
            nav_home: 'Início',
            nav_news: 'Notícias',
            nav_launches: 'Missões',
            nav_discoveries: 'Descobertas',
            nav_live: 'Ao Vivo',
            placeholder_search: 'Pesquisar no cosmos...',
            hero_label: 'Foto Astronômica do Dia',
            hero_cta: 'Explorar Notícias',
            section_live: 'Missões em Tempo Real e Telemetria',
            section_news: 'Últimas Notícias da NASA',
            section_launches: 'Missões da NASA',
            section_discoveries: 'Descobertas Científicas',
            card_read_more: 'Ler Artigo',
            card_view_data: 'Ver Dados',
            live_iss_title: 'Estação Espacial Internacional',
            live_iss_desc: 'Rastreamento em tempo real do laboratório orbital da humanidade.',
            live_telemetry: 'TELEMETRIA AO VIVO',
            live_streaming: 'TRANSMITINDO AO VIVO',
            footer_text: 'Alimentado por APIs da NASA e The Space Devs.'
        }
    },

    /**
     * Set language and update UI
     */
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        this.updateUI();
    },

    /**
     * Translate all elements with data-i18n attribute
     */
    updateUI() {
        const elements = document.querySelectorAll('[data-i18n]');
        const dict = this.translations[this.currentLang];
        
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT') {
                    el.placeholder = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Update active state of toggle
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLang);
        });
    }
};
