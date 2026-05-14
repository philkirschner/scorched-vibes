const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const redScoreEl = document.querySelector("#redScore");
const blueScoreEl = document.querySelector("#blueScore");
const redHealthEl = document.querySelector("#redHealth");
const blueHealthEl = document.querySelector("#blueHealth");
const redShieldEl = document.querySelector("#redShield");
const blueShieldEl = document.querySelector("#blueShield");
const redFuelEl = document.querySelector("#redFuel");
const blueFuelEl = document.querySelector("#blueFuel");
const redCoinsEl = document.querySelector("#redCoins");
const blueCoinsEl = document.querySelector("#blueCoins");
const storeButton = document.querySelector("#storeButton");
const storeModal = document.querySelector("#storeModal");
const closeStoreButton = document.querySelector("#closeStoreButton");
const storePlayerLabel = document.querySelector("#storePlayerLabel");
const storeCoinsEl = document.querySelector("#storeCoins");
const messageEl = document.querySelector("#message");
const resetButton = document.querySelector("#resetButton");
const fireButton = document.querySelector("#fireButton");
const moveLeftButton = document.querySelector("#moveLeftButton");
const moveRightButton = document.querySelector("#moveRightButton");
const helpButton = document.querySelector("#helpButton");
const closeHelpButton = document.querySelector("#closeHelpButton");
const helpModal = document.querySelector("#helpModal");
const configModal = document.querySelector("#configModal");
const startBattleButton = document.querySelector("#startBattleButton");
const angleSlider = document.querySelector("#angleSlider");
const powerSlider = document.querySelector("#powerSlider");
const angleValue = document.querySelector("#angleValue");
const powerValue = document.querySelector("#powerValue");
const weaponSelect = document.querySelector("#weaponSelect");
const weaponGrid = document.querySelector("#weaponGrid");
const windValue = document.querySelector("#windValue");
const gravitySelect = document.querySelector("#gravitySelect");
const gravityValue = document.querySelector("#gravityValue");
const terrainSelect = document.querySelector("#terrainSelect");
const spreadSelect = document.querySelector("#spreadSelect");
const distanceSelect = document.querySelector("#distanceSelect");
const windSelect = document.querySelector("#windSelect");
const aimingHelpSelect = document.querySelector("#aimingHelpSelect");
const testingCheckbox = document.querySelector("#testingCheckbox");
const playersSelect = document.querySelector("#playersSelect");
const cpuDifficultySelect = document.querySelector("#cpuDifficultySelect");
const cpuDifficultyGroup = document.querySelector("#cpuDifficultyGroup");
const terrainValue = document.querySelector("#terrainValue");
const helpWeapons = document.querySelector("#helpWeapons");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BASE_GRAVITY = 178;
const TANK_WIDTH = 34;
const TANK_HEIGHT = 18;
const BARREL_LENGTH = 28;
const WIN_SCORE = 3;
const TURN_STRIP_HEIGHT = 7;
const STARTING_FUEL = 8;
const MOVE_STEP = 18;
// TANK_CENTER_FLOOR is computed dynamically once worldScale is known (see tankCenterFloor())

let WORLD_W = WIDTH;
let WORLD_H = HEIGHT;
let worldScale = 1;

const distanceModes = {
  small:  { label: "Small",  sizeScale: 1.0, powerBoost: 1.0  },
  medium: { label: "Medium", sizeScale: 1.5, powerBoost: 1.25 },
  large:  { label: "Large",  sizeScale: 2.0, powerBoost: 1.5  },
};

const gravityModes = {
  normal: { label: "Normal", scale: 1 },
  low: { label: "Low", scale: 0.58 },
  high: { label: "High", scale: 1.55 },
};

const terrainModes = {
  plains:  { label: "Grassy Plains",    roughness: 0.65, sky: ["#1a6ba0", "#4a9fd4", "#7ec8e3"], stars: { count: 0,  alpha: 0.0 }, ground: "#4a7c42", surface: "#7acc5a", sub: "#263224", aimDot: "rgba(255, 80,  0,   0.85)" },
  desert:  { label: "Sandy Desert",     roughness: 0.75, sky: ["#8b3a00", "#c96a00", "#e89820"], stars: { count: 0,  alpha: 0.0 }, ground: "#c49a28", surface: "#e8d070", sub: "#8a6a10", aimDot: "rgba(60,  140, 255, 0.90)" },
  snow:    { label: "Snowy Mountains",  roughness: 1.3,  sky: ["#7aabcc", "#a8cfe0", "#c8e0ee"], stars: { count: 10, alpha: 0.3 }, ground: "#6a7d8e", surface: "#e8f0f8", sub: "#3a4a55", aimDot: "rgba(255, 100, 0,   0.90)" },
  moon:    { label: "Moon",             roughness: 0.9,  sky: ["#000005", "#050510", "#0a0a1a"], stars: { count: 80, alpha: 0.9 }, ground: "#6e6e6e", surface: "#a0a0a0", sub: "#3a3a3a", aimDot: "rgba(255, 220, 50,  0.90)" },
  volcano: { label: "Volcano",          roughness: 1.4,  sky: ["#1a0000", "#3d0800", "#1a0505"], stars: { count: 15, alpha: 0.4 }, ground: "#1e1008", surface: "#ff4400", sub: "#0a0505", aimDot: "rgba(50,  255, 180, 0.90)" },
  candy:   { label: "Candy Land",       roughness: 0.6,  sky: ["#ff99cc", "#ffb3d9", "#ffd6ec"], stars: { count: 0,  alpha: 0.0 }, ground: "#aa44ee", surface: "#ff88ee", sub: "#882299", aimDot: "rgba(50,  200, 50,  0.90)" },
  jungle:  { label: "Jungle",           roughness: 1.0,  sky: ["#0a2010", "#153020", "#0a1a10"], stars: { count: 5,  alpha: 0.2 }, ground: "#1e5c1e", surface: "#3dcc3d", sub: "#0a2a0a", aimDot: "rgba(255, 230, 0,   0.90)" },
  arctic:  { label: "Arctic Ice",       roughness: 0.8,  sky: ["#c5dced", "#daeaf5", "#edf4fa"], stars: { count: 0,  alpha: 0.0 }, ground: "#8ab8cc", surface: "#e0f4ff", sub: "#5a8a9e", aimDot: "rgba(255, 90,  0,   0.90)" },
};

const spreadModes = {
  balanced: { label: "Balanced", scale: 0.8 },
  uneven: { label: "Uneven", scale: 1.15 },
  extreme: { label: "Extreme", scale: 1.55 },
};

const scores = { red: 0, blue: 0 };
const tanks = {
  red: makeTank("red", "#ef6a58", "#ffc0b5", 122, 45),
  blue: makeTank("blue", "#64b5f6", "#c3e8ff", WIDTH - 122, 135),
};

const weapons = {
  missile: {
    label: "Baby Missile",
    radius: 34,
    damage: 42,
    speed: 5.15,
    color: "#f2c14e",
    draw: "missile",
    starter: true,
  },
  big: {
    label: "Big Bomb",
    radius: 54,
    damage: 66,
    speed: 4.7,
    color: "#ff9f4a",
    draw: "spiked",
    starter: true,
  },
  cluster: {
    label: "Cluster Pop",
    radius: 26,
    damage: 30,
    speed: 5,
    color: "#d9f99d",
    cluster: true,
    draw: "cluster",
    price: 500,
  },
  airstrike: {
    label: "Airstrike",
    radius: 38,
    damage: 44,
    speed: 5.1,
    color: "#ff4444",
    draw: "airstrike",
    price: 1200,
    airstrike: true,
  },
  airstrikeShard: {
    label: "Airstrike Bomb",
    radius: 38,
    damage: 44,
    speed: 1,
    color: "#ff4444",
    draw: "airstrikeShard",
    shard: true,
  },
  sinkhole: {
    label: "Sinkhole",
    radius: 30,
    damage: 0,
    speed: 5.0,
    color: "#8b5c2a",
    draw: "sinkhole",
    price: 900,
    sinkhole: true,
  },
  bouncy: {
    label: "Bouncy Bomb",
    radius: 36,
    damage: 36,
    speed: 5.25,
    color: "#c4ff5f",
    bounces: 2,
    draw: "bouncy",
    price: 350,
  },
  drill: {
    label: "Drill",
    radius: 42,
    damage: 48,
    speed: 5.05,
    color: "#d6d3c4",
    drillDepth: 54,
    draw: "drill",
    price: 600,
  },
  dirtMover: {
    label: "Dirt Mover",
    radius: 48,
    damage: 0,
    speed: 4.95,
    color: "#a7c76f",
    raiseTerrain: true,
    draw: "dirt",
    price: 350,
  },
  teleport: {
    label: "Teleport Shot",
    radius: 16,
    damage: 0,
    speed: 5.35,
    color: "#c084fc",
    teleport: true,
    draw: "teleport",
    price: 800,
  },
  shieldBreaker: {
    label: "Shield Breaker",
    radius: 32,
    damage: 22,
    shieldDamage: 80,
    speed: 5.15,
    color: "#7dd3fc",
    draw: "shieldBreaker",
    price: 600,
  },
  volcano: {
    label: "Volcano",
    radius: 42,
    damage: 42,
    speed: 4.7,
    color: "#ff6b35",
    volcano: true,
    draw: "volcano",
    price: 900,
  },
  volcanoShard: {
    label: "Volcano Shard",
    radius: 22,
    damage: 20,
    speed: 4.8,
    color: "#ffb703",
    shard: true,
    draw: "volcanoShard",
  },
  blackHole: {
    label: "Black Hole",
    radius: 62,
    damage: 72,
    speed: 4.8,
    color: "#9933ff",
    draw: "blackHole",
    price: 1500,
    blackHole: true,
  },
};

let terrain = [];
let currentTurn = "red";
let projectiles = [];
let particles = [];
let craters = [];
let activeShot = null;
let wind = 0;
let lastTime = 0;
let battleOver = false;
let screenShake = 0;
let configuredTerrain = "plains";
let configuredSpread = "balanced";
let configuredGravity = "normal";
let configuredDistance = "small";
let configuredWind = "on";
let configuredAimingHelp = "on";
let configuredTesting = false;
let configuredCpuMode = false;
let configuredCpuDifficulty = "easy";
let cpuThinking = false;
let activeBlackHole = null;

function makeTank(id, color, accent, x, angle) {
  return {
    id,
    color,
    accent,
    x,
    y: 0,
    angle,
    power: 62,
    weapon: "missile",
    health: 100,
    shield: 40,
    fuel: STARTING_FUEL,
    coins: 0,
    boostedTurns: 0,
    unlockedWeapons: new Set(["missile", "big"]),
  };
}

function newBattle(resetMatch = false) {
  if (resetMatch) {
    scores.red = 0;
    scores.blue = 0;
  }

  configuredTerrain = terrainSelect.value;
  configuredSpread = spreadSelect.value;
  configuredGravity = gravitySelect.value;
  configuredDistance = distanceSelect.value;
  configuredWind = windSelect.value;
  configuredAimingHelp = aimingHelpSelect.value;
  configuredTesting = testingCheckbox.checked;
  configuredCpuMode = playersSelect.value === "cpu";
  configuredCpuDifficulty = cpuDifficultySelect.value;
  cpuThinking = false;
  activeBlackHole = null;
  const dm = distanceModes[configuredDistance];
  WORLD_W = Math.round(WIDTH * dm.sizeScale);
  WORLD_H = Math.round(HEIGHT * dm.sizeScale);
  worldScale = WIDTH / WORLD_W;
  wind = configuredWind === "on" ? Math.round((Math.random() * 2 - 1) * 44) : 0;
  projectiles = [];
  particles = [];
  craters = [];
  activeShot = null;
  battleOver = false;
  screenShake = 0;
  currentTurn = configuredCpuMode ? "red" : (Math.random() > 0.5 ? "red" : "blue");

  tanks.red.x = Math.round(WORLD_W * 0.12 + Math.random() * (WORLD_W * 0.055));
  tanks.blue.x = Math.round(WORLD_W * 0.83 + Math.random() * (WORLD_W * 0.055));
  generateTerrain();
  for (const tank of Object.values(tanks)) {
    tank.health = 100;
    tank.shield = 40;
    tank.fuel = STARTING_FUEL;
    tank.boostedTurns = 0;
  }
  tanks.red.angle = 45;
  tanks.blue.angle = 135;
  tanks.red.power = 62;
  tanks.blue.power = 62;
  settleTanks();
  if (configuredTesting) {
    for (const tank of Object.values(tanks)) {
      tank.coins = 99999;
      for (const [key, w] of Object.entries(weapons)) {
        if (!w.shard) tank.unlockedWeapons.add(key);
      }
    }
  }
  document.querySelector(".score.blue > span").textContent = configuredCpuMode ? "Blue 🤖" : "Blue";
  syncControlsToTurn();
  updateHud();
  messageEl.textContent = `${label(currentTurn)} aims first. Watch the wind and gravity.`;
}

function generateTerrain() {
  const points = [];
  const count = 13;
  const terrainMode = terrainModes[configuredTerrain];
  const spreadMode = spreadModes[configuredSpread];
  const roughness = terrainMode.roughness * spreadMode.scale;
  const hScale = WORLD_H / HEIGHT;
  for (let i = 0; i <= count; i += 1) {
    const t = i / count;
    let y = WORLD_H * 0.6125;
    if (configuredTerrain === "moon") {
      // bowl shape with ripples — mimics craters
      y += Math.sin(t * Math.PI) * 115 * hScale * roughness;
      y += Math.sin(t * Math.PI * 5.1) * 18 * hScale * roughness;
    } else if (configuredTerrain === "jungle") {
      // central mountain ridge with random bumps
      y += -Math.sin(t * Math.PI) * 92 * hScale * roughness;
      y += Math.sin(t * Math.PI * 4.4 + Math.random() * 0.5) * 42 * hScale * roughness;
    } else if (configuredTerrain === "snow" || configuredTerrain === "volcano") {
      // sharp jagged peaks
      y += Math.sin(t * Math.PI * 7.5 + Math.random()) * 54 * hScale * roughness;
      y += Math.sin(t * Math.PI * 2.3) * 44 * hScale * roughness;
    } else if (configuredTerrain === "arctic" || configuredTerrain === "candy") {
      // stepped plateaus
      y += Math.round(Math.sin(t * Math.PI * 3.4) * 2) * 32 * hScale * roughness;
      y += Math.sin(t * Math.PI * 8) * 8 * hScale;
    } else {
      // plains, desert — rolling hills
      y += Math.sin(t * Math.PI * 2.1 + Math.random() * 0.55) * 58 * hScale * roughness;
      y += Math.sin(t * Math.PI * 5.2 + Math.random() * 0.8) * 24 * hScale * roughness;
    }
    y += (Math.random() - 0.5) * 54 * hScale * roughness;
    points.push(y);
  }

  terrain = new Array(WORLD_W);
  for (let x = 0; x < WORLD_W; x += 1) {
    const scaled = (x / (WORLD_W - 1)) * count;
    const left = Math.floor(scaled);
    const right = Math.min(count, left + 1);
    const local = scaled - left;
    const smooth = local * local * (3 - 2 * local);
    const y = points[left] * (1 - smooth) + points[right] * smooth;
    terrain[x] = clamp(y, WORLD_H * 0.406, WORLD_H * 0.836);
  }

  applyTankHeightSpread();
  const flatRadius = Math.round(42 * WORLD_W / WIDTH);
  flattenLandingZone(tanks.red.x, flatRadius);
  flattenLandingZone(tanks.blue.x, flatRadius);
}

function applyTankHeightSpread() {
  if (configuredSpread === "balanced") return;
  const amount = (configuredSpread === "extreme" ? 112 : 64) * (WORLD_H / HEIGHT);
  const redIsHigh = Math.random() > 0.5;
  shapeElevationAround(tanks.red.x, redIsHigh ? -amount : amount);
  shapeElevationAround(tanks.blue.x, redIsHigh ? amount : -amount);
}

function shapeElevationAround(centerX, offset) {
  const radius = 150 * (WORLD_W / WIDTH);
  const start = Math.max(0, Math.round(centerX - radius));
  const end = Math.min(WORLD_W - 1, Math.round(centerX + radius));
  for (let x = start; x <= end; x += 1) {
    const distanceFromCenter = Math.abs(x - centerX) / radius;
    const influence = Math.max(0, 1 - distanceFromCenter * distanceFromCenter);
    terrain[x] = clamp(terrain[x] + offset * influence, WORLD_H * 0.359, WORLD_H * 0.867);
  }
}

function flattenLandingZone(centerX, radius) {
  const start = Math.max(0, Math.round(centerX) - radius);
  const end = Math.min(WORLD_W - 1, Math.round(centerX) + radius);
  const sample = terrain.slice(start, end + 1);
  const average = sample.reduce((sum, y) => sum + y, 0) / sample.length;
  for (let x = start; x <= end; x += 1) {
    terrain[x] = average;
  }
}

function terrainYAt(x) {
  const ix = clamp(Math.round(x), 0, WORLD_W - 1);
  return terrain[ix];
}

function tankCenterFloor() {
  return (HEIGHT - TURN_STRIP_HEIGHT) / worldScale - TANK_HEIGHT / 2 - 3;
}

function tankSlope(tank) {
  return Math.atan2(terrainYAt(tank.x + 12) - terrainYAt(tank.x - 12), 24) * 0.65;
}

function getAimInfo(tank, angle = tank.angle) {
  const slope = tankSlope(tank);
  const radians = degreesToRadians(angle);
  const baseLocalX = 1;
  const baseLocalY = -16;
  const baseX = tank.x + Math.cos(slope) * baseLocalX - Math.sin(slope) * baseLocalY;
  const baseY = tank.y + Math.sin(slope) * baseLocalX + Math.cos(slope) * baseLocalY;
  return {
    baseX,
    baseY,
    muzzleX: baseX + Math.cos(radians) * BARREL_LENGTH,
    muzzleY: baseY - Math.sin(radians) * BARREL_LENGTH,
    radians,
    slope,
  };
}

function settleTanks(options = {}) {
  for (const tank of Object.values(tanks)) {
    const previousY = tank.y;
    const nextY = Math.min(terrainYAt(tank.x) - TANK_HEIGHT / 2, tankCenterFloor());
    tank.y = nextY;
    if (options.fallDamage && previousY > 0) {
      const fall = nextY - previousY;
      if (fall > 24) {
        const damage = clamp(Math.round((fall - 18) / 3), 1, 24);
        applyDirectDamage(tank, damage, `${label(tank.id)} drops into the drill hole`);
      }
    }
  }
}

function syncControlsToTurn() {
  const tank = tanks[currentTurn];
  if (!tank.unlockedWeapons.has(tank.weapon)) tank.weapon = "missile";
  angleSlider.value = tank.angle;
  powerSlider.value = tank.power;
  weaponSelect.value = tank.weapon;
  updateWeaponButtons();
  updateControlLabels();
}

function updateControlLabels() {
  angleValue.textContent = `${angleSlider.value} deg`;
  powerValue.textContent = powerSlider.value;
}

function updateHud() {
  redScoreEl.textContent = scores.red;
  blueScoreEl.textContent = scores.blue;
  redHealthEl.textContent = Math.max(0, Math.round(tanks.red.health));
  blueHealthEl.textContent = Math.max(0, Math.round(tanks.blue.health));
  redShieldEl.textContent = Math.max(0, Math.round(tanks.red.shield));
  blueShieldEl.textContent = Math.max(0, Math.round(tanks.blue.shield));
  redFuelEl.textContent = Math.max(0, tanks.red.fuel);
  blueFuelEl.textContent = Math.max(0, tanks.blue.fuel);
  redCoinsEl.textContent = tanks.red.coins;
  blueCoinsEl.textContent = tanks.blue.coins;
  windValue.textContent = configuredWind === "off" ? "Off" : wind === 0 ? "Calm" : `${Math.abs(wind)} ${wind > 0 ? "east" : "west"}`;
  gravityValue.textContent = gravityModes[configuredGravity].label;
  terrainValue.textContent = terrainModes[configuredTerrain].label;
}

function renderWeaponButtons() {
  weaponGrid.innerHTML = "";
  const sortedEntries = Object.entries(weapons)
    .filter(([, w]) => !w.shard)
    .sort(([, a], [, b]) => {
      if (a.starter && !b.starter) return -1;
      if (!a.starter && b.starter) return 1;
      if (a.starter && b.starter) return 0;
      return (a.price ?? 0) - (b.price ?? 0);
    });
  for (const [key, weapon] of sortedEntries) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "weapon-button";
    button.dataset.weapon = key;
    button.setAttribute("aria-pressed", "false");

    const preview = document.createElement("canvas");
    preview.width = 84;
    preview.height = 60;
    drawWeaponPreview(preview, key);

    const labelEl = document.createElement("span");
    labelEl.textContent = weapon.label;

    button.append(preview, labelEl);
    button.addEventListener("click", () => selectWeapon(key));
    weaponGrid.append(button);
  }
  updateWeaponButtons();
}

function renderHelpWeapons() {
  helpWeapons.innerHTML = "";
  for (const [key, weapon] of Object.entries(weapons)) {
    if (weapon.shard) continue;
    const item = document.createElement("li");
    const descriptions = {
      missile: "Baby Missile: reliable starter shot with medium damage and crater size.",
      big: "Big Bomb: slower, bigger, spiked, and strong when it lands close.",
      cluster: "Cluster Pop: three small impacts that cover a wider patch.",
      bouncy: "Bouncy Bomb: skips off terrain before exploding.",
      drill: "Drill: burrows underground, opens a deep hole, and can cause fall damage.",
      dirtMover: "Dirt Mover: raises a mound for cover, ramps, traps, or escape routes.",
      teleport: "Teleport Shot: moves your tank to the impact point.",
      shieldBreaker: "Shield Breaker: strips shield energy before health damage.",
      volcano: "Volcano: damages on first impact, then erupts into falling fire.",
      airstrike: "Airstrike: calls in six bombs that rain down across a wide area.",
      sinkhole: "Sinkhole: collapses the ground under the impact point, dropping any tank standing there.",
      blackHole: "Black Hole: opens a gravity well that drags both tanks in for three seconds, then explodes.",
    };
    item.textContent = descriptions[key] || weapon.label;
    helpWeapons.append(item);
  }
}

function showHelp() {
  helpModal.classList.add("active");
}

function hideHelp() {
  helpModal.classList.remove("active");
}

function showConfig() {
  configModal.classList.add("active");
}

function hideConfig() {
  configModal.classList.remove("active");
}

function startConfiguredBattle(resetMatch = true) {
  hideConfig();
  newBattle(resetMatch);
}

function selectWeapon(key) {
  if (!weapons[key] || weapons[key].shard) return;
  if (!tanks[currentTurn].unlockedWeapons.has(key)) return;
  weaponSelect.value = key;
  tanks[currentTurn].weapon = key;
  updateWeaponButtons();
}

function updateWeaponButtons() {
  const unlocked = tanks[currentTurn].unlockedWeapons;
  for (const button of weaponGrid.querySelectorAll(".weapon-button")) {
    const key = button.dataset.weapon;
    const isLocked = !unlocked.has(key);
    const selected = !isLocked && key === weaponSelect.value;
    button.classList.toggle("selected", selected);
    button.classList.toggle("locked", isLocked);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  }
}

function drawWeaponPreview(preview, key) {
  const g = preview.getContext("2d");
  const weapon = weapons[key];
  g.clearRect(0, 0, preview.width, preview.height);
  g.save();
  g.translate(preview.width / 2, preview.height / 2);
  g.rotate(-0.25);

  if (weapon.draw === "spiked") {
    g.fillStyle = "#151816";
    for (let i = 0; i < 8; i += 1) {
      const a = i * Math.PI / 4;
      g.beginPath();
      g.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
      g.lineTo(Math.cos(a + 0.18) * 18, Math.sin(a + 0.18) * 18);
      g.lineTo(Math.cos(a - 0.18) * 18, Math.sin(a - 0.18) * 18);
      g.closePath();
      g.fill();
    }
    g.fillStyle = weapon.color;
    g.beginPath();
    g.arc(0, 0, 13, 0, Math.PI * 2);
    g.fill();
  } else if (weapon.draw === "cluster") {
    for (const point of [{ x: 0, y: -8 }, { x: -9, y: 7 }, { x: 9, y: 7 }]) {
      g.fillStyle = weapon.color;
      g.beginPath();
      g.arc(point.x, point.y, 7, 0, Math.PI * 2);
      g.fill();
    }
  } else if (weapon.draw === "drill") {
    g.fillStyle = weapon.color;
    g.beginPath();
    g.moveTo(18, 0);
    g.lineTo(-12, -10);
    g.lineTo(-5, 0);
    g.lineTo(-12, 10);
    g.closePath();
    g.fill();
  } else if (weapon.draw === "dirt") {
    g.fillStyle = weapon.color;
    g.beginPath();
    g.arc(-7, 3, 8, 0, Math.PI * 2);
    g.arc(3, -3, 10, 0, Math.PI * 2);
    g.arc(11, 5, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#5d704f";
    g.fillRect(-15, 9, 30, 4);
  } else if (weapon.draw === "teleport") {
    g.strokeStyle = weapon.color;
    g.lineWidth = 5;
    g.beginPath();
    g.arc(0, 0, 14, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = "#f7edff";
    g.beginPath();
    g.arc(0, 0, 6, 0, Math.PI * 2);
    g.fill();
  } else if (weapon.draw === "shieldBreaker") {
    g.strokeStyle = weapon.color;
    g.lineWidth = 5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-18, 0);
    g.lineTo(14, 0);
    g.moveTo(5, -11);
    g.lineTo(18, 0);
    g.lineTo(5, 11);
    g.stroke();
  } else if (weapon.draw === "volcano" || weapon.draw === "volcanoShard") {
    g.fillStyle = weapon.color;
    g.beginPath();
    g.moveTo(18, 0);
    g.lineTo(-12, -12);
    g.lineTo(-4, 0);
    g.lineTo(-12, 12);
    g.closePath();
    g.fill();
    g.fillStyle = "#ffd166";
    g.fillRect(-2, -3, 8, 6);
  } else if (weapon.draw === "gravityStorm") {
    g.strokeStyle = weapon.color;
    g.lineWidth = 4;
    for (let i = 0; i < 3; i += 1) {
      g.beginPath();
      g.ellipse(0, 0, 8 + i * 5, 15 - i, i * 0.8, 0, Math.PI * 2);
      g.stroke();
    }
  } else if (weapon.draw === "lowGravity" || weapon.draw === "highGravity") {
    g.fillStyle = weapon.color;
    g.beginPath();
    g.ellipse(0, 0, 14, 8, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = weapon.draw === "lowGravity" ? "#e0f7ff" : "#5c2e12";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(0, 0, weapon.draw === "lowGravity" ? 19 : 10, 0, Math.PI * 2);
    g.stroke();
  } else if (weapon.draw === "airstrike" || weapon.draw === "airstrikeShard") {
    // Three bombs falling with downward chevron
    for (let i = -1; i <= 1; i += 1) {
      g.fillStyle = weapon.color;
      g.beginPath();
      g.ellipse(i * 11, -6 + Math.abs(i) * 4, 5, 7, 0, 0, Math.PI * 2);
      g.fill();
    }
    g.strokeStyle = weapon.color;
    g.lineWidth = 3;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-8, 6); g.lineTo(0, 14); g.lineTo(8, 6);
    g.stroke();
  } else if (weapon.draw === "sinkhole") {
    // Concentric ellipses shrinking downward (funnel)
    for (let i = 0; i < 3; i += 1) {
      g.strokeStyle = weapon.color;
      g.globalAlpha = 0.4 + i * 0.3;
      g.lineWidth = 2;
      g.beginPath();
      g.ellipse(0, -8 + i * 8, 16 - i * 5, 5 - i, 0, 0, Math.PI * 2);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.strokeStyle = weapon.color;
    g.lineWidth = 3;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-6, 8); g.lineTo(0, 16); g.lineTo(6, 8);
    g.stroke();
  } else if (weapon.draw === "blackHole") {
    // Dark pulsing ring with event horizon
    for (let i = 2; i >= 0; i -= 1) {
      g.strokeStyle = `rgba(153, 51, 255, ${0.35 + i * 0.25})`;
      g.lineWidth = 2 + i;
      g.beginPath();
      g.arc(0, 0, 7 + i * 5, 0, Math.PI * 2);
      g.stroke();
    }
    g.fillStyle = "#050005";
    g.beginPath();
    g.arc(0, 0, 7, 0, Math.PI * 2);
    g.fill();
  } else {
    g.fillStyle = weapon.color;
    g.beginPath();
    g.ellipse(0, 0, 15, 9, 0, 0, Math.PI * 2);
    g.fill();
  }

  g.restore();
}

function fire() {
  if (projectiles.length > 0 || battleOver) return;

  const tank = tanks[currentTurn];
  tank.angle = Number(angleSlider.value);
  tank.power = Number(powerSlider.value);
  tank.weapon = weaponSelect.value;
  const weapon = weapons[tank.weapon];
  const aim = getAimInfo(tank, tank.angle);
  const speed = tank.power * weapon.speed * distanceModes[configuredDistance].powerBoost;

  activeShot = {
    owner: currentTurn,
    weaponKey: tank.weapon,
    resultMessage: "",
  };
  projectiles.push(makeProjectile({
    owner: currentTurn,
    weaponKey: tank.weapon,
    x: aim.muzzleX,
    y: aim.muzzleY,
    vx: Math.cos(aim.radians) * speed,
    vy: -Math.sin(aim.radians) * speed,
  }));
  messageEl.textContent = `${label(currentTurn)} fires ${weapon.label}.`;
}

function makeProjectile(settings) {
  const weapon = weapons[settings.weaponKey];
  return {
    owner: settings.owner,
    weaponKey: settings.weaponKey,
    x: settings.x,
    y: settings.y,
    vx: settings.vx,
    vy: settings.vy,
    bounces: settings.bounces ?? weapon.bounces ?? 0,
    trail: [],
    age: 0,
  };
}

function update(dt) {
  const busy = projectiles.length > 0 || !!activeBlackHole || cpuThinking;
  fireButton.disabled = busy || battleOver;
  storeButton.disabled = busy || battleOver;
  moveLeftButton.disabled = busy || battleOver || tanks[currentTurn].fuel <= 0;
  moveRightButton.disabled = moveLeftButton.disabled;
  if (projectiles.length > 0) updateProjectiles(dt);
  if (activeBlackHole) updateBlackHole(dt);

  for (const particle of particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += currentGravity() * 0.38 * dt;
    particle.life -= dt;
  }
  particles = particles.filter((particle) => particle.life > 0);
  screenShake = Math.max(0, screenShake - dt * 16);
}

function updateProjectiles(dt) {
  const spawned = [];
  let survivors = projectiles;
  const substeps = 4;
  for (let i = 0; i < substeps; i += 1) {
    const step = dt / substeps;
    const nextSurvivors = [];
    for (const shot of survivors) {
      if (advanceProjectile(shot, step, spawned)) {
        nextSurvivors.push(shot);
      }
    }
    survivors = nextSurvivors.concat(spawned.splice(0));
  }
  projectiles = survivors;

  if (projectiles.length === 0 && activeShot && !battleOver && !activeBlackHole) {
    finishShot(activeShot.owner);
  }
}

function advanceProjectile(shot, dt, spawned) {
  const weapon = weapons[shot.weaponKey];
  shot.age += dt;
  if (shot.age > projectileMaxAge(shot)) return false;
  shot.vx += wind * dt;
  if (weapon.storm) {
    shot.vx += Math.sin(shot.age * 7) * 32 * dt;
  }
  shot.vy += projectileGravity(shot) * dt;
  shot.x += shot.vx * dt;
  shot.y += shot.vy * dt;
  shot.trail.push({ x: shot.x, y: shot.y });
  if (shot.trail.length > 70) shot.trail.shift();

  const outOfBounds = shot.x < -45 || shot.x > WORLD_W + 45 || shot.y > WORLD_H + 90 || (shot.y < -260 && shot.age > 1.5);
  if (outOfBounds) return false;

  const hitTerrain = shot.x >= 0 && shot.x < WORLD_W && shot.y >= terrainYAt(shot.x);
  const hitTank = Object.values(tanks).some((tank) => tank.id !== shot.owner && distance(shot, tank) < 20);
  if (!hitTerrain && !hitTank) return true;

  const impactX = clamp(shot.x, 0, WORLD_W - 1);
  const impactY = clamp(shot.y, 0, WORLD_H);

  if (weapon.bounces && hitTerrain && !hitTank && shot.bounces > 0 && Math.abs(shot.vy) > 70) {
    bounceProjectile(shot, impactX);
    return true;
  }

  resolveImpact(shot, impactX, impactY, spawned);
  return false;
}

function projectileGravity(shot) {
  const weapon = weapons[shot.weaponKey];
  let scale = weapon.gravityScale ?? 1;
  if (weapon.storm) {
    scale *= 0.32 + Math.abs(Math.sin(shot.age * 4.6)) * 2.3;
  }
  return currentGravity() * scale;
}

function projectileMaxAge(shot) {
  const weapon = weapons[shot.weaponKey];
  if (weapon.shard) return 4.5;
  if (weapon.volcano) return 8.5;
  if (weapon.storm) return 8;
  return 9;
}

function currentGravity() {
  return BASE_GRAVITY * gravityModes[configuredGravity].scale;
}

function bounceProjectile(shot, x) {
  shot.y = terrainYAt(x) - 5;
  shot.vy = -Math.abs(shot.vy) * 0.68;
  shot.vx *= 0.78;
  shot.bounces -= 1;
  addParticles(shot.x, shot.y, weapons[shot.weaponKey].color, 12);
  messageEl.textContent = `Bouncy Bomb skips. ${shot.bounces} bounce${shot.bounces === 1 ? "" : "s"} left.`;
}

function updateBlackHole(dt) {
  if (!activeBlackHole || battleOver) return;
  activeBlackHole.age += dt;

  for (const tank of Object.values(tanks)) {
    const dx = activeBlackHole.x - tank.x;
    const dist = Math.abs(dx);
    const pull = Math.min(320, 12000 / (dist + 40)) * dt;
    tank.x = clamp(tank.x + Math.sign(dx) * pull, 35, WORLD_W - 35);
    tank.y = Math.min(terrainYAt(tank.x) - TANK_HEIGHT / 2, tankCenterFloor());
  }

  if (activeBlackHole.age >= 3) {
    const bh = activeBlackHole;
    activeBlackHole = null;
    processExplosion(bh.x, bh.y, "blackHole", 1);
    finishShot(bh.owner);
  }
}

function spawnAirstrikeShards(shot, x, spawned) {
  const spread = 280 * (WORLD_W / WIDTH);
  for (let i = 0; i < 6; i += 1) {
    const offsetX = (Math.random() - 0.5) * spread;
    const yStart = -(60 + i * 100 + Math.random() * 60);
    spawned.push(makeProjectile({
      owner: shot.owner,
      weaponKey: "airstrikeShard",
      x: x + offsetX,
      y: yStart,
      vx: (Math.random() - 0.5) * 18,
      vy: 500 + Math.random() * 90,
    }));
  }
}

function applySinkhole(cx) {
  const radius = Math.round(110 * WORLD_W / WIDTH);
  const start = Math.max(0, Math.floor(cx - radius));
  const end = Math.min(WORLD_W - 1, Math.ceil(cx + radius));
  for (let x = start; x <= end; x += 1) {
    const t = Math.abs(x - cx) / radius;
    const pullDown = 1 - t * t;
    terrain[x] = terrain[x] + (WORLD_H * 0.97 - terrain[x]) * pullDown;
  }
}

function resolveImpact(shot, x, y, spawned) {
  const weapon = weapons[shot.weaponKey];

  if (weapon.teleport) {
    teleportTank(shot.owner, x);
    return;
  }

  if (weapon.raiseTerrain) {
    raiseTerrainMound(x, weapon.radius);
    craters.push({ x, y, radius: weapon.radius, life: 0.45, color: weapon.color });
    addParticles(x, y, weapon.color, 34);
    settleTanks();
    updateHud();
    activeShot.resultMessage = "Dirt Mover builds a new mound.";
    return;
  }

  if (weapon.airstrike) {
    spawnAirstrikeShards(shot, x, spawned);
    activeShot.resultMessage = "Airstrike called! Bombs incoming!";
    return;
  }

  if (weapon.sinkhole) {
    applySinkhole(x);
    addParticles(x, terrainYAt(x), weapon.color, 60);
    screenShake = Math.max(screenShake, 14);
    settleTanks({ fallDamage: true });
    updateHud();
    activeShot.resultMessage = "Sinkhole! The ground opens up!";
    return;
  }

  if (weapon.blackHole) {
    activeBlackHole = { x, y, age: 0, owner: shot.owner };
    addParticles(x, y, weapon.color, 40);
    screenShake = Math.max(screenShake, 6);
    activeShot.resultMessage = "Black Hole opens… brace yourself.";
    return;
  }

  if (weapon.drillDepth) {
    y = clamp(terrainYAt(x) + weapon.drillDepth, 0, WORLD_H);
    activeShot.resultMessage = `${weapon.label} burrows underground before exploding.`;
  }

  processExplosion(x, y, shot.weaponKey, 1, { fallDamage: Boolean(weapon.drillDepth) });

  if (weapon.cluster) {
    for (const offset of [-42, 0, 42]) {
      const popX = clamp(x + offset, 0, WORLD_W - 1);
      const popY = terrainYAt(popX) - 8;
      processExplosion(popX, popY, "volcanoShard", 0.82);
    }
  }

  if (weapon.volcano) {
    spawnVolcanoShards(shot, x, y, spawned);
    activeShot.resultMessage = "Volcano erupts into falling fire.";
  }
}

function processExplosion(x, y, weaponKey, scale = 1, options = {}) {
  const weapon = weapons[weaponKey];
  const radius = weapon.radius * scale;
  craterTerrain(x, y, radius);
  craters.push({ x, y, radius, life: 0.45, color: weapon.color });
  addParticles(x, y, weapon.color, Math.round((weaponKey === "big" ? 56 : 34) * scale));
  screenShake = Math.max(screenShake, radius / 9);
  applyDamage(x, y, weapon, scale);
  settleTanks({ fallDamage: options.fallDamage });
  updateHud();
}

function spawnVolcanoShards(shot, x, y, spawned) {
  const angles = [-0.92, -0.48, 0, 0.48, 0.92];
  for (const angle of angles) {
    const speed = 220 + Math.random() * 70;
    spawned.push(makeProjectile({
      owner: shot.owner,
      weaponKey: "volcanoShard",
      x,
      y: y - 14,
      vx: Math.sin(angle) * speed,
      vy: -Math.cos(angle) * speed - 80,
    }));
  }
}

function teleportTank(owner, x) {
  const tank = tanks[owner];
  const safeX = clamp(x, 35, WORLD_W - 35);
  flattenLandingZone(safeX, 28);
  tank.x = safeX;
  settleTanks();
  addParticles(tank.x, tank.y - 15, weapons.teleport.color, 36);
  activeShot.resultMessage = `${label(owner)} teleports to the impact point.`;
  updateHud();
}

function moveCurrentTank(direction) {
  if (projectiles.length > 0 || battleOver) return;
  const tank = tanks[currentTurn];
  if (tank.fuel <= 0) {
    messageEl.textContent = `${label(currentTurn)} is out of fuel.`;
    return;
  }

  const nextX = clamp(tank.x + direction * Math.round(MOVE_STEP / worldScale), 35, WORLD_W - 35);
  if (nextX === tank.x) {
    messageEl.textContent = `${label(currentTurn)} cannot move farther that way.`;
    return;
  }

  tank.x = nextX;
  tank.fuel -= 1;
  settleTanks();
  updateHud();
  messageEl.textContent = `${label(currentTurn)} moves. ${tank.fuel} fuel left.`;
}

function finishShot(owner) {
  const redAlive = tanks.red.health > 0;
  const blueAlive = tanks.blue.health > 0;
  if (!redAlive || !blueAlive) {
    finishBattle(redAlive ? "red" : "blue");
    return;
  }

  if (tanks[owner].boostedTurns > 0) tanks[owner].boostedTurns -= 1;
  currentTurn = owner === "red" ? "blue" : "red";
  syncControlsToTurn();
  updateHud();
  messageEl.textContent = activeShot.resultMessage || `${label(currentTurn)} turn. Adjust for wind, gravity, and the new terrain.`;
  activeShot = null;
  if (configuredCpuMode && currentTurn === "blue") scheduleCpuTurn();
}

function craterTerrain(cx, cy, radius) {
  const start = Math.max(0, Math.floor(cx - radius));
  const end = Math.min(WORLD_W - 1, Math.ceil(cx + radius));
  for (let x = start; x <= end; x += 1) {
    const dx = x - cx;
    const depth = Math.sqrt(Math.max(0, radius * radius - dx * dx));
    const craterFloor = cy + depth * 0.72;
    if (terrain[x] < craterFloor) {
      terrain[x] = clamp(craterFloor, 0, WORLD_H + 40);
    }
  }
}

function raiseTerrainMound(cx, radius) {
  const centerY = terrainYAt(cx);
  const start = Math.max(0, Math.floor(cx - radius));
  const end = Math.min(WORLD_W - 1, Math.ceil(cx + radius));
  for (let x = start; x <= end; x += 1) {
    const dx = x - cx;
    const lift = Math.sqrt(Math.max(0, radius * radius - dx * dx)) * 0.78;
    const moundTop = centerY - lift;
    if (terrain[x] > moundTop) {
      terrain[x] = clamp(moundTop, WORLD_H * 0.25, WORLD_H - TURN_STRIP_HEIGHT / worldScale - 10);
    }
  }
}

function applyDamage(x, y, weapon, scale = 1) {
  const boostMult = (activeShot?.owner && tanks[activeShot.owner]?.boostedTurns > 0) ? 1.5 : 1;
  for (const tank of Object.values(tanks)) {
    const d = distance({ x, y }, tank);
    const damageRadius = weapon.radius * 1.6 * scale;
    if (d < damageRadius) {
      const hit = Math.max(0, 1 - d / damageRadius);
      const rawDamage = Math.round(weapon.damage * scale * hit * boostMult);
      const shieldDamage = Math.round((weapon.shieldDamage ?? rawDamage * 0.8) * hit);
      let healthDamage = rawDamage;
      let shieldLost = 0;

      if (tank.shield > 0 && rawDamage > 0) {
        const shieldBefore = tank.shield;
        const shieldPressure = Math.max(rawDamage, shieldDamage);
        shieldLost = Math.min(shieldBefore, shieldPressure);
        tank.shield -= shieldLost;
        healthDamage = Math.max(0, rawDamage - shieldBefore);
        if (shieldLost > 0) {
          activeShot.resultMessage = `${label(tank.id)} shield loses ${shieldLost}.`;
        }
      }

      if (healthDamage > 0) {
        tank.health = clamp(tank.health - healthDamage, 0, 100);
        activeShot.resultMessage = `${label(tank.id)} takes ${healthDamage} damage.`;
      }

      const attacker = activeShot?.owner;
      if (attacker && attacker !== tank.id && shieldLost + healthDamage > 0) {
        tanks[attacker].coins += (shieldLost + healthDamage) * 5;
      }
    }
  }
}

function applyDirectDamage(tank, amount, prefix) {
  const boostMult = (activeShot?.owner && tanks[activeShot.owner]?.boostedTurns > 0) ? 1.5 : 1;
  amount = Math.round(amount * boostMult);
  let remaining = amount;
  if (tank.shield > 0) {
    const shieldLoss = Math.min(tank.shield, remaining);
    tank.shield -= shieldLoss;
    remaining -= shieldLoss;
  }
  if (remaining > 0) {
    tank.health = clamp(tank.health - remaining, 0, 100);
  }
  if (activeShot) {
    activeShot.resultMessage = `${prefix} and takes ${amount} damage.`;
    if (activeShot.owner !== tank.id) {
      tanks[activeShot.owner].coins += amount * 5;
    }
  }
}

function finishBattle(winner) {
  battleOver = true;
  projectiles = [];
  activeShot = null;
  scores[winner] += 1;
  updateHud();

  if (scores[winner] >= WIN_SCORE) {
    messageEl.textContent = `${label(winner)} wins the match. New battle starts soon.`;
    setTimeout(() => newBattle(true), 2200);
  } else {
    messageEl.textContent = `${label(winner)} wins this battle. Next hill loading...`;
    setTimeout(() => newBattle(), 2000);
  }
}

function addParticles(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 170;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 70,
      life: 0.45 + Math.random() * 0.55,
      color,
    });
  }
}

function draw() {
  ctx.save();
  if (screenShake > 0) {
    ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
  }
  ctx.scale(worldScale, worldScale);
  drawSky();
  drawTerrain();
  drawCraters();
  drawBlackHole();
  drawProjectiles();
  if (projectiles.length === 0 && !battleOver && configuredAimingHelp === "on") drawAimArc(tanks[currentTurn]);
  drawTanks();
  drawParticles();
  ctx.restore();
  drawTurnStrip();
}

function drawSky() {
  const theme = terrainModes[configuredTerrain];
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  sky.addColorStop(0, theme.sky[0]);
  sky.addColorStop(0.62, theme.sky[1]);
  sky.addColorStop(1, theme.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  if (theme.stars.count > 0) {
    ctx.fillStyle = `rgba(242, 240, 223, ${theme.stars.alpha})`;
    for (let i = 0; i < theme.stars.count; i += 1) {
      const x = (i * 173) % WORLD_W;
      const y = 24 + ((i * 97) % Math.round(WORLD_H * 0.3));
      ctx.fillRect(x, y, 2 / worldScale, 2 / worldScale);
    }
  }

  drawWindArrow();
}

function drawWindArrow() {
  const x = WORLD_W / 2;
  const y = Math.round(42 * WORLD_H / HEIGHT);
  const length = clamp(Math.abs(wind) * 2.1, 12, 92);
  const dir = wind >= 0 ? 1 : -1;
  ctx.strokeStyle = "rgba(242, 193, 78, 0.82)";
  ctx.fillStyle = "rgba(242, 193, 78, 0.82)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - length * dir, y);
  ctx.lineTo(x + length * dir, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + length * dir, y);
  ctx.lineTo(x + (length - 13) * dir, y - 8);
  ctx.lineTo(x + (length - 13) * dir, y + 8);
  ctx.closePath();
  ctx.fill();
}

function drawTerrain() {
  const theme = terrainModes[configuredTerrain];

  ctx.beginPath();
  ctx.moveTo(0, WORLD_H);
  for (let x = 0; x < WORLD_W; x += 1) {
    ctx.lineTo(x, terrain[x]);
  }
  ctx.lineTo(WORLD_W, WORLD_H);
  ctx.closePath();
  ctx.fillStyle = theme.ground;
  ctx.fill();

  ctx.beginPath();
  for (let x = 0; x < WORLD_W; x += 1) {
    if (x === 0) ctx.moveTo(x, terrain[x]);
    else ctx.lineTo(x, terrain[x]);
  }
  ctx.strokeStyle = theme.surface;
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.globalAlpha = 0.28;
  ctx.fillStyle = theme.sub;
  for (let x = 0; x < WORLD_W; x += 28) {
    const y = terrain[x] + 26 + ((x * 17) % 34);
    ctx.fillRect(x, y, 16, WORLD_H - y);
  }
  ctx.globalAlpha = 1;
}

function drawCraters() {
  for (const crater of craters) {
    crater.life -= 0.014;
    ctx.globalAlpha = Math.max(0, crater.life);
    ctx.strokeStyle = crater.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(crater.x, crater.y, crater.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  craters = craters.filter((crater) => crater.life > 0);
}

function drawTanks() {
  drawTank(tanks.red);
  drawTank(tanks.blue);
}

function drawTank(tank) {
  ctx.save();
  ctx.translate(tank.x, tank.y);

  const slope = tankSlope(tank);
  ctx.rotate(slope);

  if (tank.shield > 0) {
    const shieldColor = hexToRgb(tank.color);
    ctx.strokeStyle = `rgba(${shieldColor.r}, ${shieldColor.g}, ${shieldColor.b}, ${0.22 + tank.shield / 95})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -8, 29, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (tank.boostedTurns > 0) {
    const pulse = 0.55 + 0.45 * Math.sin(performance.now() / 160);
    ctx.strokeStyle = `rgba(255, 160, 20, ${pulse})`;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(0, -8, 37, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = `rgba(255, 185, 40, ${0.82 + 0.18 * pulse})`;
    ctx.font = `bold 11px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(`⚡${tank.boostedTurns}`, 0, -52);
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  roundRect(-26, 8, 52, 7, 4);
  ctx.fill();

  ctx.fillStyle = "#111411";
  roundRect(-TANK_WIDTH / 2 - 8, -1, TANK_WIDTH + 16, TANK_HEIGHT + 7, 7);
  ctx.fill();

  ctx.fillStyle = "#283026";
  for (let x = -20; x <= 20; x += 10) {
    ctx.beginPath();
    ctx.arc(x, 11, 3.7, 0, Math.PI * 2);
    ctx.fill();
  }

  const bodyGradient = ctx.createLinearGradient(0, -18, 0, 13);
  bodyGradient.addColorStop(0, tank.accent);
  bodyGradient.addColorStop(0.18, tank.color);
  bodyGradient.addColorStop(1, "#2a3028");
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(-22, 4);
  ctx.lineTo(-15, -12);
  ctx.lineTo(13, -15);
  ctx.lineTo(23, -2);
  ctx.lineTo(18, 8);
  ctx.lineTo(-19, 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(17, 20, 17, 0.72)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = tank.color;
  roundRect(-13, -23, 26, 17, 8);
  ctx.fill();
  ctx.fillStyle = tank.accent;
  ctx.beginPath();
  ctx.arc(-4, -15, 5, 0, Math.PI * 2);
  ctx.fill();

  const radians = degreesToRadians(tank.angle);
  ctx.strokeStyle = "#151816";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(1, -16);
  ctx.lineTo(Math.cos(radians - slope) * BARREL_LENGTH, -16 - Math.sin(radians - slope) * BARREL_LENGTH);
  ctx.stroke();
  ctx.strokeStyle = tank.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(1, -16);
  ctx.lineTo(Math.cos(radians - slope) * BARREL_LENGTH, -16 - Math.sin(radians - slope) * BARREL_LENGTH);
  ctx.stroke();

  drawTankBars(tank);
  ctx.restore();
}

function drawTankBars(tank) {
  ctx.fillStyle = "#111411";
  ctx.fillRect(-24, -44, 48, 6);
  ctx.fillStyle = tank.health > 45 ? "#8ccf6a" : tank.health > 20 ? "#f2c14e" : "#ef6a58";
  ctx.fillRect(-23, -43, 46 * (tank.health / 100), 4);

  ctx.fillStyle = "#111411";
  ctx.fillRect(-24, -36, 48, 5);
  ctx.fillStyle = tank.color;
  ctx.fillRect(-23, -35, 46 * (tank.shield / 40), 3);
}

function drawAimArc(tank) {
  const weapon = weapons[weaponSelect.value];
  const aim = getAimInfo(tank, Number(angleSlider.value));
  const speed = Number(powerSlider.value) * weapon.speed * distanceModes[configuredDistance].powerBoost;
  let px = aim.muzzleX;
  let py = aim.muzzleY;
  let vx = Math.cos(aim.radians) * speed;
  let vy = -Math.sin(aim.radians) * speed;
  ctx.fillStyle = weapon.storm ? "rgba(180, 167, 255, 0.75)" : terrainModes[configuredTerrain].aimDot;
  for (let i = 0; i < 26; i += 1) {
    const fakeShot = { weaponKey: weaponSelect.value, age: i * 0.06 };
    vx += wind * 0.06;
    vy += projectileGravity(fakeShot) * 0.06;
    px += vx * 0.06;
    py += vy * 0.06;
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawProjectiles() {
  for (const shot of projectiles) {
    drawProjectile(shot);
  }
}

function drawProjectile(shot) {
  const weapon = weapons[shot.weaponKey];
  ctx.strokeStyle = weapon.storm ? "rgba(180, 167, 255, 0.45)" : "rgba(242, 240, 223, 0.35)";
  ctx.lineWidth = weapon.storm ? 3 : 2;
  ctx.beginPath();
  shot.trail.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  const angle = Math.atan2(shot.vy, shot.vx);
  ctx.save();
  ctx.translate(shot.x, shot.y);
  ctx.rotate(angle);

  if (weapon.draw === "spiked") drawSpikedProjectile(weapon.color);
  else if (weapon.draw === "cluster") drawClusterProjectile(weapon.color);
  else if (weapon.draw === "bouncy") drawBouncyProjectile(weapon.color);
  else if (weapon.draw === "drill") drawDrillProjectile(weapon.color);
  else if (weapon.draw === "dirt") drawDirtMoverProjectile(weapon.color);
  else if (weapon.draw === "teleport") drawTeleportProjectile(weapon.color);
  else if (weapon.draw === "shieldBreaker") drawShieldBreakerProjectile(weapon.color);
  else if (weapon.draw === "volcano" || weapon.draw === "volcanoShard") drawVolcanoProjectile(weapon.color, weapon.draw === "volcanoShard");
  else if (weapon.draw === "airstrike") drawMissileProjectile(weapon.color);
  else if (weapon.draw === "airstrikeShard") drawAirstrikeShardProjectile(weapon.color);
  else if (weapon.draw === "sinkhole") drawMissileProjectile(weapon.color);
  else if (weapon.draw === "blackHole") drawBlackHoleProjectile(weapon.color);
  else drawMissileProjectile(weapon.color);

  ctx.restore();
}

function drawMissileProjectile(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff0b8";
  ctx.beginPath();
  ctx.arc(3, -1, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpikedProjectile(color) {
  ctx.fillStyle = "#151816";
  for (let i = 0; i < 8; i += 1) {
    const a = i * Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 7, Math.sin(a) * 7);
    ctx.lineTo(Math.cos(a + 0.18) * 14, Math.sin(a + 0.18) * 14);
    ctx.lineTo(Math.cos(a - 0.18) * 14, Math.sin(a - 0.18) * 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffd6a8";
  ctx.beginPath();
  ctx.arc(-3, -4, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawClusterProjectile(color) {
  const offsets = [
    { x: 2, y: -6 },
    { x: -5, y: 5 },
    { x: 8, y: 5 },
  ];
  ctx.strokeStyle = "rgba(92, 56, 34, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(2, -8);
  ctx.lineTo(-5, 2);
  ctx.moveTo(2, -8);
  ctx.lineTo(8, 2);
  ctx.stroke();
  for (const offset of offsets) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(offset.x, offset.y, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4ffd8";
    ctx.beginPath();
    ctx.arc(offset.x - 1.5, offset.y - 1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBouncyProjectile(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#263224";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawDrillProjectile(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(-8, -7);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-8, 7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#4b4a42";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, -5);
  ctx.lineTo(7, 0);
  ctx.lineTo(-4, 5);
  ctx.stroke();
}

function drawDirtMoverProjectile(color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-4, 2, 6, 0, Math.PI * 2);
  ctx.arc(4, -2, 7, 0, Math.PI * 2);
  ctx.arc(10, 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#5d704f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-12, 8);
  ctx.lineTo(14, 8);
  ctx.stroke();
}

function drawTeleportProjectile(color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawShieldBreakerProjectile(color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(8, 0);
  ctx.moveTo(2, -7);
  ctx.lineTo(10, 0);
  ctx.lineTo(2, 7);
  ctx.stroke();
}

function drawVolcanoProjectile(color, small) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-7, -7);
  ctx.lineTo(-2, 0);
  ctx.lineTo(-7, 7);
  ctx.closePath();
  ctx.fill();
  if (!small) {
    ctx.fillStyle = "#ffd166";
    ctx.fillRect(-2, -2, 5, 4);
  }
}

function drawGravityProjectile(color, lowGravity) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = lowGravity ? "#e0f7ff" : "#5c2e12";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, lowGravity ? 12 : 6, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGravityStormProjectile(color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 5 + i * 4, 9 - i, i * 0.8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawAirstrikeShardProjectile(color) {
  ctx.fillStyle = "#222";
  ctx.fillRect(-3, -10, 6, 5);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBlackHoleProjectile(color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#050005";
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawBlackHole() {
  if (!activeBlackHole) return;
  const { x, y, age } = activeBlackHole;
  const pulse = 0.5 + 0.5 * Math.sin(age * 10);
  const outerRadius = 32 + pulse * 8;

  const grad = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);
  grad.addColorStop(0,    "rgba(5,   0, 20, 1)");
  grad.addColorStop(0.42, "rgba(80,  0, 140, 0.88)");
  grad.addColorStop(1,    "rgba(120, 20, 200, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(age * 2.8);
  ctx.strokeStyle = `rgba(190, 110, 255, ${0.55 + pulse * 0.35})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([9, 7]);
  ctx.beginPath();
  ctx.arc(0, 0, outerRadius * 0.62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Countdown arc around the outside
  const progress = 1 - age / 3;
  ctx.strokeStyle = `rgba(220, 180, 255, ${0.55 + pulse * 0.3})`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius + 7, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
  ctx.stroke();
}

function drawTurnStrip() {
  ctx.fillStyle = currentTurn === "red" ? tanks.red.color : tanks.blue.color;
  ctx.fillRect(0, HEIGHT - TURN_STRIP_HEIGHT, WIDTH, TURN_STRIP_HEIGHT);
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.fillRect(0, HEIGHT - TURN_STRIP_HEIGHT, WIDTH, 1);
}

function drawParticles() {
  for (const particle of particles) {
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loop(time) {
  const dt = Math.min(0.033, (time - lastTime) / 1000 || 0);
  lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function label(id) {
  return id === "red" ? "Red" : "Blue";
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function adjustActiveTankFromControls() {
  angleSlider.value = clamp(Number(angleSlider.value), Number(angleSlider.min), Number(angleSlider.max));
  powerSlider.value = clamp(Number(powerSlider.value), Number(powerSlider.min), Number(powerSlider.max));
  tanks[currentTurn].angle = Number(angleSlider.value);
  tanks[currentTurn].power = Number(powerSlider.value);
  tanks[currentTurn].weapon = weaponSelect.value;
  updateControlLabels();
}

// ── CPU opponent ───────────────────────────────────────────────────────────

function simulateShot(weaponKey, angle, power) {
  // Fast forward-simulation using the real game physics.
  // Returns the {x, y} world position where it first hits terrain (or exits bounds).
  const weapon = weapons[weaponKey];
  const tank = tanks["blue"];
  const aim = getAimInfo(tank, angle);
  const speed = power * weapon.speed * distanceModes[configuredDistance].powerBoost;
  let px = aim.muzzleX;
  let py = aim.muzzleY;
  let vx = Math.cos(aim.radians) * speed;
  let vy = -Math.sin(aim.radians) * speed;
  const grav = currentGravity() * (weapon.gravityScale ?? 1);
  const dt = 0.05;
  for (let age = 0; age < 9; age += dt) {
    vx += wind * dt;
    vy += grav * dt;
    px += vx * dt;
    py += vy * dt;
    if (px < -45 || px > WORLD_W + 45 || py > WORLD_H + 90) break;
    if (px >= 0 && px < WORLD_W && py >= terrainYAt(px)) break;
  }
  return { x: px, y: py };
}

function computeCpuShot() {
  // Pick a weapon, scan angles 5-175° at several power levels, find the combo
  // landing closest to the enemy (Red) tank, then smear with difficulty noise.
  const cpuWeaponKey = Math.random() < 0.5 ? "missile" : "big";
  const enemy = tanks["red"];
  let bestAngle = 135;
  let bestPower = 62;
  let bestDist = Infinity;

  for (let power = 30; power <= 100; power += 10) {
    for (let angle = 5; angle <= 175; angle += 1) {
      const landing = simulateShot(cpuWeaponKey, angle, power);
      const dx = landing.x - enemy.x;
      const dy = landing.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        bestDist = dist;
        bestAngle = angle;
        bestPower = power;
      }
    }
  }

  const spread = configuredCpuDifficulty === "easy" ? 10
               : configuredCpuDifficulty === "medium" ? 5
               : 2;
  bestAngle = clamp(Math.round(bestAngle + (Math.random() * 2 - 1) * spread), 5, 175);
  bestPower = clamp(Math.round(bestPower + (Math.random() * 2 - 1) * spread), 20, 100);

  return { angle: bestAngle, power: bestPower, weaponKey: cpuWeaponKey };
}

function animateCpuSliders(targetAngle, targetPower, callback) {
  // Smoothly move the sliders to the CPU's chosen values so the human can watch.
  const startAngle = Number(angleSlider.value);
  const startPower = Number(powerSlider.value);
  const duration = 700;
  const start = performance.now();

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    angleSlider.value = Math.round(startAngle + (targetAngle - startAngle) * ease);
    powerSlider.value = Math.round(startPower + (targetPower - startPower) * ease);
    updateControlLabels();
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      callback();
    }
  }
  requestAnimationFrame(step);
}

function scheduleCpuTurn() {
  cpuThinking = true;
  messageEl.textContent = "CPU is thinking…";

  setTimeout(() => {
    const shot = computeCpuShot();
    animateCpuSliders(shot.angle, shot.power, () => {
      setTimeout(() => {
        tanks["blue"].angle = shot.angle;
        tanks["blue"].power = shot.power;
        tanks["blue"].weapon = shot.weaponKey;
        angleSlider.value = shot.angle;
        powerSlider.value = shot.power;
        weaponSelect.value = shot.weaponKey;
        updateWeaponButtons();
        updateControlLabels();
        cpuThinking = false;
        fire();
      }, 350);
    });
  }, 900);
}

// ── Store ──────────────────────────────────────────────────────────────────

function openStore() {
  storePlayerLabel.textContent = label(currentTurn);
  storePlayerLabel.style.color = currentTurn === "red" ? "var(--red)" : "var(--blue)";
  renderStoreItems();
  storeModal.classList.add("active");
}

function closeStore() {
  storeModal.classList.remove("active");
}

function renderStoreItems() {
  const tank = tanks[currentTurn];
  storeCoinsEl.textContent = tank.coins;

  const weaponList = document.querySelector("#storeWeaponList");
  weaponList.innerHTML = "";
  for (const [key, weapon] of Object.entries(weapons)) {
    if (weapon.shard || weapon.starter) continue;
    const owned = tank.unlockedWeapons.has(key);
    const canAfford = tank.coins >= weapon.price;

    const item = document.createElement("div");
    item.className = "store-item" + (owned ? " owned" : "");

    const preview = document.createElement("canvas");
    preview.width = 84;
    preview.height = 60;
    drawWeaponPreview(preview, key);

    const info = document.createElement("div");
    info.className = "store-item-info";
    info.innerHTML = `<span class="store-item-name">${weapon.label}</span>
      <span class="store-item-price">${owned ? "Owned" : `🪙 ${weapon.price}`}</span>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = owned ? "✓" : "Buy";
    btn.disabled = owned || !canAfford;
    if (!owned) btn.addEventListener("click", () => buyItem("weapon", key));

    item.append(preview, info, btn);
    weaponList.append(item);
  }

  const supplyList = document.querySelector("#storeSupplyList");
  supplyList.innerHTML = "";
  const supplies = [
    { id: "health", label: "+50 Health",                     price: 250, icon: "❤️" },
    { id: "fuel",   label: "+5 Fuel",                        price: 100, icon: "⛽" },
    { id: "boost",  label: "Damage Boost — +50% for 3 turns", price: 800, icon: "⚡" },
  ];
  for (const supply of supplies) {
    const canAfford = tank.coins >= supply.price;
    const item = document.createElement("div");
    item.className = "store-item";

    const iconEl = document.createElement("div");
    iconEl.className = "store-supply-icon";
    iconEl.textContent = supply.icon;

    const info = document.createElement("div");
    info.className = "store-item-info";
    info.innerHTML = `<span class="store-item-name">${supply.label}</span>
      <span class="store-item-price">🪙 ${supply.price}</span>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Buy";
    btn.disabled = !canAfford;
    btn.addEventListener("click", () => buyItem(supply.id));

    item.append(iconEl, info, btn);
    supplyList.append(item);
  }
}

function buyItem(type, key) {
  const tank = tanks[currentTurn];
  if (type === "weapon") {
    const price = weapons[key].price;
    if (tank.coins < price || tank.unlockedWeapons.has(key)) return;
    tank.coins -= price;
    tank.unlockedWeapons.add(key);
    updateWeaponButtons();
  } else if (type === "health") {
    if (tank.coins < 250) return;
    tank.coins -= 250;
    tank.health = Math.min(100, tank.health + 50);
  } else if (type === "fuel") {
    if (tank.coins < 100) return;
    tank.coins -= 100;
    tank.fuel += 5;
  } else if (type === "boost") {
    if (tank.coins < 800) return;
    tank.coins -= 800;
    tank.boostedTurns = 3;
  }
  updateHud();
  renderStoreItems();
}

fireButton.addEventListener("click", fire);
resetButton.addEventListener("click", showConfig);
helpButton.addEventListener("click", showHelp);
closeHelpButton.addEventListener("click", hideHelp);
startBattleButton.addEventListener("click", () => startConfiguredBattle(true));
moveLeftButton.addEventListener("click", () => moveCurrentTank(-1));
moveRightButton.addEventListener("click", () => moveCurrentTank(1));

angleSlider.addEventListener("input", adjustActiveTankFromControls);
powerSlider.addEventListener("input", adjustActiveTankFromControls);
helpModal.addEventListener("click", (event) => {
  if (event.target === helpModal) hideHelp();
});
playersSelect.addEventListener("change", () => {
  cpuDifficultyGroup.style.display = playersSelect.value === "cpu" ? "" : "none";
});

storeButton.addEventListener("click", openStore);
closeStoreButton.addEventListener("click", closeStore);
storeModal.addEventListener("click", (event) => {
  if (event.target === storeModal) closeStore();
});

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
    event.preventDefault();
  }
  if (projectiles.length > 0 || battleOver) return;

  if (event.key === "ArrowLeft") angleSlider.value = Number(angleSlider.value) + 1;
  if (event.key === "ArrowRight") angleSlider.value = Number(angleSlider.value) - 1;
  if (event.key === "ArrowUp") powerSlider.value = Number(powerSlider.value) + 1;
  if (event.key === "ArrowDown") powerSlider.value = Number(powerSlider.value) - 1;
  if (event.key === " ") fire();
  adjustActiveTankFromControls();
});

renderWeaponButtons();
renderHelpWeapons();
newBattle(true);
requestAnimationFrame(loop);
