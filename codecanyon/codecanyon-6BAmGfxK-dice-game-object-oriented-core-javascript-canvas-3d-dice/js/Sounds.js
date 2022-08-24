/*****Sounds.js*****/
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    try { // for safari
      this.sound.play();
    } catch (e) { }
  }
  this.stop = function () {
    try {
      this.sound.pause();
    } catch (e) { }
  }
}

