const closeButton = document.getElementById('threatslayer-close');

closeButton.addEventListener("click", () => {
    const popupContainer = document.getElementById('threatslayer-container');
    window.postMessage('test')
    console.log('after test')
})
