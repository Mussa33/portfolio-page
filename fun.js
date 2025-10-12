document.addEventListener('DOMContentLoaded', function() {
  // Mail-Link zeigt Why.jpg
  const mailLink = document.querySelector('a[href="mailto:afrim1@bfh.ch"]');
  if (mailLink) {
    mailLink.addEventListener('click', function(e) {
      e.preventDefault();
      showFullscreenImage('pictures/Why.jpg', 'Why');
    });
  }
  // Interaktive Leaflet-Karte
  if (window.L) {
    const map = L.map('map').setView([46.948, 7.447], 10); // Bern
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    // Marker für Bern
    L.marker([46.948, 7.447]).addTo(map)
      .bindPopup('Bern: Wohnort & Arbeitsregion')
      .openPopup();
    // Marker für Zürich
    L.marker([47.3769, 8.5417]).addTo(map)
      .bindPopup('Zürich: Arbeitsort');
  }

  // Wetter-Widget mit Open-Meteo API
  const weatherDiv = document.getElementById('weather-widget');
  if (weatherDiv) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=46.948&longitude=7.447&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          const w = data.current_weather;
          const temp = w.temperature;
          const wind = w.windspeed;
          const icon = w.weathercode;
          let iconText = '';
          switch(icon) {
            case 0: iconText = '☀️'; break;
            case 1: iconText = '🌤️'; break;
            case 2: iconText = '⛅'; break;
            case 3: iconText = '☁️'; break;
            case 45: iconText = '🌫️'; break;
            case 48: iconText = '🌫️'; break;
            case 51: iconText = '🌦️'; break;
            case 61: iconText = '🌧️'; break;
            case 71: iconText = '🌨️'; break;
            case 80: iconText = '🌦️'; break;
            case 95: iconText = '⛈️'; break;
            default: iconText = '🌡️';
          }
          weatherDiv.innerHTML = `<strong>Bern:</strong> ${iconText} ${temp}°C, Wind ${wind} km/h`;
        } else {
          weatherDiv.textContent = 'Wetterdaten nicht verfügbar.';
        }
      })
      .catch(() => {
        weatherDiv.textContent = 'Wetterdaten konnten nicht geladen werden.';
      });
  }
  // Chart.js Skill Chart
  if (window.Chart) {
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['IP-Netzwerke', 'Systeme', 'Security', 'Cloud', 'Automation'],
          datasets: [{
            label: 'Kompetenz (1-10)',
            data: [9, 8, 7, 6, 8],
            backgroundColor: [
              '#ffd86b',
              '#e0f7fa',
              '#ffe4ec',
              '#e1bee7',
              '#c8e6c9'
            ],
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
  }
  const btn = document.getElementById('fun-btn');
  if (btn) {
    btn.addEventListener('click', function() {
      // Animation
      btn.style.transition = 'transform 0.3s';
      btn.style.transform = 'rotate(-8deg) scale(1.1)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 600);

      // Fullscreen Overlay mit Tom.jpg
      showFullscreenImage('pictures/Tom.jpg', 'Tom');
    });
  }

  // Gorilla-Link im Footer
  const gorillaLink = document.getElementById('gorilla-link');
  if (gorillaLink) {
    gorillaLink.addEventListener('click', function(e) {
      e.preventDefault();
      showFullscreenCameraOrImage();
    });
  }

  function showFullscreenImage(src, alt) {
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    let img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.borderRadius = '24px';
    img.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';

    overlay.addEventListener('click', function() {
      document.body.removeChild(overlay);
    });

    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }

  function showFullscreenCameraOrImage(fallbackSrc, fallbackAlt) {
    // Versuche Kamera zu aktivieren
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(function(stream) {
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        let video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.srcObject = stream;
        video.style.maxWidth = '90vw';
        video.style.maxHeight = '90vh';
        video.style.borderRadius = '24px';
        video.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';

        // Overlay schliessen bei Klick
        overlay.addEventListener('click', function() {
          document.body.removeChild(overlay);
          // Kamera-Stream stoppen
          let tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        });

        overlay.appendChild(video);
        document.body.appendChild(overlay);
      })
      .catch(function() {
        // Fallback: Zeige Hinweis
        showFullscreenImage();
      });
  }
});
