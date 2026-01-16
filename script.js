window.addEventListener('load', () => {
    // Dodaj klasę visible do body, co uruchomi transition opacity w CSS
    document.body.classList.add('visible');
    
    console.log("Dinguz Launcher site loaded.");

    // --- 3D TILT EFFECT ---
    const card = document.querySelector('.tilt-card');
    const wrapper = document.querySelector('.tilt-wrapper');

    if (card && wrapper) {
        wrapper.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Oblicz kąt obrotu (max 8 stopni)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        wrapper.addEventListener('mouseleave', () => {
            // Reset po wyjechaniu myszką
            card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
            card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });

        wrapper.addEventListener('mouseenter', () => {
            // Usuń opóźnienie przy wjechaniu myszką dla płynności
            card.style.transition = 'none';
        });
    }
});
