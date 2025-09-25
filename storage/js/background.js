window.addEventListener('load', function () {
    const applyBackgroundColor = () => {
        const color = localStorage.getItem('backgroundColor') || '#070c24';
        if (document.body.style.backgroundColor !== color) {
            document.body.style.backgroundColor = color;
        }
    };

    applyBackgroundColor();

    setInterval(applyBackgroundColor, 250);
});
