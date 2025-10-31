(function() {
  'use strict';

  // Constants
  const BERN_COORDS = [46.948, 7.447];
  const ZURICH_COORDS = [47.3769, 8.5417];
  const WEATHER_API = 'https://api.open-meteo.com/v1/forecast?latitude=46.948&longitude=7.447&current_weather=true';
  
  const WEATHER_ICONS = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️', 51: '🌦️', 61: '🌧️',
    71: '🌨️', 80: '🌦️', 95: '⛈️'
  };
  const DEFAULT_WEATHER_ICON = '🌡️';

  const OVERLAY_STYLES = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999'
  };

  const MEDIA_STYLES = {
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
  };

  // Utility Functions
  function createOverlay() {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, OVERLAY_STYLES);
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    return overlay;
  }

  function applyMediaStyles(element) {
    Object.assign(element.style, MEDIA_STYLES);
  }

  function showFullscreenImage(src, alt = '') {
    const overlay = createOverlay();
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    applyMediaStyles(img);
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }

  function showFullscreenCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        const overlay = createOverlay();
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.srcObject = stream;
        applyMediaStyles(video);

        overlay.addEventListener('click', () => {
          document.body.removeChild(overlay);
          stream.getTracks().forEach(track => track.stop());
        });

        overlay.appendChild(video);
        document.body.appendChild(overlay);
      })
      .catch(() => {
        // Silent fail - camera access denied
      });
  }

  function getWeatherIcon(code) {
    return WEATHER_ICONS[code] || DEFAULT_WEATHER_ICON;
  }

  function initMap() {
    if (!window.L) return;

    const map = L.map('map').setView(BERN_COORDS, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker(BERN_COORDS).addTo(map)
      .bindPopup('Bern: Wohnort & Arbeitsregion')
      .openPopup();
    
    L.marker(ZURICH_COORDS).addTo(map)
      .bindPopup('Zürich: Arbeitsort');
  }

  function initWeather() {
    const weatherDiv = document.getElementById('weather-widget');
    if (!weatherDiv) return;

    fetch(WEATHER_API)
      .then(res => res.json())
      .then(data => {
        if (data?.current_weather) {
          const { temperature, windspeed, weathercode } = data.current_weather;
          const icon = getWeatherIcon(weathercode);
          weatherDiv.innerHTML = `<strong>Bern:</strong> ${icon} ${temperature}°C, Wind ${windspeed} km/h`;
        } else {
          weatherDiv.textContent = 'Wetterdaten nicht verfügbar.';
        }
      })
      .catch(() => {
        weatherDiv.textContent = 'Wetterdaten konnten nicht geladen werden.';
      });
  }

  function initChart() {
    if (!window.Chart) return;
    
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['IP-Netzwerke', 'Systeme', 'Security', 'Cloud', 'Automation'],
        datasets: [{
          label: 'Kompetenz (1-10)',
          data: [9, 8, 7, 6, 8],
          backgroundColor: ['#ffd86b', '#e0f7fa', '#ffe4ec', '#e1bee7', '#c8e6c9'],
          borderColor: '#4e54c8',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Meine wichtigsten Fähigkeiten',
            color: '#4e54c8',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: { color: '#4e54c8', font: { size: 14 } }
          },
          x: {
            ticks: { color: '#4e54c8', font: { size: 14 } }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutBounce'
        }
      }
    });
  }

  function initEventListeners() {
    const mailLink = document.querySelector('a[href="mailto:afrim1@bfh.ch"]');
    if (mailLink) {
      mailLink.addEventListener('click', e => {
        e.preventDefault();
        showFullscreenImage('pictures/Why.jpg', 'Why');
      });
    }

    const funBtn = document.getElementById('fun-btn');
    if (funBtn) {
      funBtn.addEventListener('click', () => {
        funBtn.style.transition = 'transform 0.3s';
        funBtn.style.transform = 'rotate(-8deg) scale(1.1)';
        setTimeout(() => {
          funBtn.style.transform = '';
        }, 600);
        showFullscreenImage('pictures/Tom.jpg', 'Tom');
      });
    }

    const gorillaLink = document.getElementById('gorilla-link');
    if (gorillaLink) {
      gorillaLink.addEventListener('click', e => {
        e.preventDefault();
        showFullscreenCamera();
      });
    }
  }

  function initYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initWeather();
    initChart();
    initEventListeners();
    initYear();
  });
})();
