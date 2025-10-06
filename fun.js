document.addEventListener('DOMContentLoaded', function() {
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

    let msg = document.createElement('div');
    msg.textContent = 'Kamera konnte nicht aktiviert werden.';
    msg.style.color = '#fff';
    msg.style.fontSize = '2rem';
    msg.style.textAlign = 'center';
    msg.style.padding = '32px';
    msg.style.background = 'rgba(0,0,0,0.6)';
    msg.style.borderRadius = '24px';
    msg.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';

    overlay.addEventListener('click', function() {
      document.body.removeChild(overlay);
    });

    overlay.appendChild(msg);
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
