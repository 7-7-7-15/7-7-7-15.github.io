const phrases = [
    `Hidden — Darkened — Unveiled`,
    `Veiled — Shadowed — Awakened`,
    `Obscured — Aligned — Transcendent`,
    `Cast — Covered — Illuminated`,
    `Twilight — Eclipse — Dawn`,
    `Beyond the Darkness Lies Power`,
    `The Power of Hidden Light`,
    `Rise from the Shadow`,
    /*{ other: 'loop', width: '200px', type: "video", src: `https://media.tenor.com/SIpmtvnEsDIAAAPo/rotating-chips.mp4` },*/
    `Darkness Ignites the Flame`,
    `From Shadows, Strength Emerges`,
    /*{ type: "image", width: '400px', src: `https://c.tenor.com/9MVlipGuNioAAAAC/tenor.gif` },*/
    `Light Born from the Abyss`,
    `Power Forged in Darkness`,
   `In Darkness, We Find Light`,
   `From Darkness, a New Dawn`,
    `Born of Shadows, Built to Last`,
    `Born in Shadow, Forged in Fire`,
  
  
];

const paragraph = document.getElementById('dynamicParagraph');

paragraph.style.userSelect = 'none';

function changeText() {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    if (typeof randomPhrase === "string") {
        paragraph.textContent = randomPhrase;
    } else if (randomPhrase.type === "image") {
        paragraph.innerHTML = `<img src="${randomPhrase.src}" alt="Splash Image" style="max-width: ${randomPhrase.width};">`;
    } else if (randomPhrase.type === "video") {
        paragraph.innerHTML = `<video ${randomPhrase.other} autoplay style="max-width: ${randomPhrase.width}; height: auto; "> <source src="${randomPhrase.src}" type="video/mp4"> </video>`;
    }
}

paragraph.addEventListener('click', changeText);
window.onload = changeText;
