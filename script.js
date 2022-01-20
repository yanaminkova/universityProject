setInterval(setClock, 1000);

const hourHand = document.querySelector('[data-hour-hand]');
const minutehand = document.querySelector('[data-minute-hand]');
const secondHand = document.querySelector('[data-second-hand]');
const clock = document.querySelector('[data-clock]')


function setClock() {
    const currentDate = new Date();
    const secondsRatio = currentDate.getSeconds() / 60;
    const minutesRatio =(secondsRatio + currentDate.getMinutes()) / 60;
    const hoursRatio = (minutesRatio + currentDate.getHours()) / 12;

    setRotation(secondHand, secondsRatio);
    setRotation(minutehand, minutesRatio);
    setRotation(hourHand, hoursRatio);

}

function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360);
}

setClock();


clock.addEventListener('click', play);

function play(e){
    document.getElementById('music').play();
    e.stopImmediatePropagation();
    this.removeEventListener("click", play);
    document.onclick = stop;
}
function stop(){
    document.getElementById('music').pause();
    document.onclick = play;
}