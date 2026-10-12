let target;
const vehicles = [];
let sceneCanvas;

function sceneHeight() {
  return Math.max(1, windowHeight - document.getElementById('controls').offsetHeight);
}

function setup() {
  sceneCanvas = createCanvas(windowWidth, sceneHeight());
  sceneCanvas.parent('scene');
  target = new MouseTarget(width / 2, height / 2);

  const slider = document.getElementById('vehicle-count');
  slider.value = SeekPopulation.INITIAL_COUNT;
  SeekPopulation.bindSlider(slider, document.getElementById('vehicle-count-value'),
    vehicles, target.pos, () => ({ width, height }), (x, y) => new Vehicle(x, y));

  // Les coordonnées sont relatives au canvas, pas à la barre de contrôle.
  // Un événement sur le slider ne modifie donc jamais la cible.
  sceneCanvas.elt.addEventListener('pointermove', event => {
    const rect = sceneCanvas.elt.getBoundingClientRect();
    const x = (event.clientX - rect.left) * width / rect.width;
    const y = (event.clientY - rect.top) * height / rect.height;
    if (x >= 0 && x <= width && y >= 0 && y <= height) target.pos.set(x, y);
  });
}

function draw() {
  background('black');
  for (const vehicle of vehicles) {
    SeekPopulation.step(vehicle, target.pos, width, height);
    vehicle.show();
  }
  target.show();
}

function windowResized() {
  resizeCanvas(windowWidth, sceneHeight());
  target.pos.set(constrain(target.pos.x, 0, width), constrain(target.pos.y, 0, height));
  for (const vehicle of vehicles) vehicle.edges();
}
