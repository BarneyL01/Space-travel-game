const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");


function getGoodIcon(good) {
  const icons = {
    food: '🍔',
    minerals: '💎',
    tech: '🤖',
    crystals: '🔮',
    alloys: '🔧',
    circuits: '📦',
    drones: '🚀',
    lasers: '🔫',
    armor: '🛡️',
    engines: '🚂',
    turbines: '💨',
  };
  return icons[good] || '';
}

function distance(a, b) {
  const dx = stations[a].x - stations[b].x;
  const dy = stations[a].y - stations[b].y;
  return Math.round(Math.sqrt(dx * dx + dy * dy) / 10);
}

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  connections.forEach(([a, b]) => {
    const x1 = stations[a].x;
    const y1 = stations[a].y;
    const x2 = stations[b].x;
    const y2 = stations[b].y;
    const dist = distance(a, b);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#0f0";
    ctx.stroke();

    // Calculate the midpoint of the line
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Display distance at the midpoint
    ctx.fillStyle = "#0f0";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(dist.toString(), midX, midY);
  });

  for (const name in stations) {
    const station = stations[name];
    ctx.beginPath();
    ctx.arc(station.x, station.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = name === player.location ? "#ff0" : "#0f0";
    ctx.fill();
    ctx.fillStyle = "#0f0";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(name, station.x + 12, station.y + 4);
  }
}

function renderVisitedPrices() {
  const container = document.getElementById("visitedPrices");
  container.innerHTML = "<h2>Visited Locations Market Data</h2>";
  if (player.visitedPrices.length === 0) return;

  let tableHtml = `<table><tr><th>Location</th><th>Fuel Price</th><th>Goods</th></tr>`;
  player.visitedPrices.forEach((visit) => {
    const goodsList = Object.entries(visit.goods)
      .map(([g, p]) => `<span class="good-icon">${getGoodIcon(g)}</span> ${g}: ${p}`)
      .join("<br>");
    const isCurrent = visit.name === player.location ? ' class="current-location"' : '';
    tableHtml += `<tr${isCurrent}><td>${visit.name}</td><td>${visit.fuelPrice}</td><td>${goodsList}</td></tr>`;
  });
  tableHtml += `</table>`;
  container.innerHTML = tableHtml;
}

function renderInfo() {
  const info = document.getElementById("info");
  const discovered = Object.keys(player.discovered).join(", ");
  const totalCargo = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  info.innerHTML = `
    <h2>Location: ${player.location}</h2>
    <p>Fuel: ${player.fuel}</p>
    <p>Credits: ${player.credits}</p>
    <p>Cargo (${totalCargo}/${player.cargoCapacity}):</p>
    <table id="cargo-table">
      <tr>
        <th>Good</th>
        <th>Quantity</th>
      </tr>
      ${Object.entries(player.cargo)
        .map(([good, quantity]) => `
        <tr>
          <td><span class="good-icon">${getGoodIcon(good)}</span> ${good}</td>
          <td>${quantity}</td>
        </tr>
      `)
        .join("")}
    </table>
    <p>Fuel Efficiency: x${player.fuelEfficiency.toFixed(2)}</p>
    <p>Visited: ${discovered}</p>
  `;
}

function renderActions() {
  const actions = document.getElementById("actions");
  const station = stations[player.location];
  actions.innerHTML = `
    <h2>Travel</h2>
    ${connections.map(([a, b]) => {
      if (a === player.location || b === player.location) {
        const dest = a === player.location ? b : a;
        const dist = Math.ceil(distance(player.location, dest) * player.fuelEfficiency);
        return `<button onclick="travelTo('${dest}', ${dist})">Go to ${dest} (${dist} fuel)</button>`;
      }
      return '';
    }).join('')}
    <h3>Market</h3>
    <div class="market-grid">
      <div class="good-header">Good</div>
      <div class="price-header">Price</div>
      <div class="action-header"></div>
      ${Object.entries(station.goods)
        .map(
          ([good, price]) => `
        <div class="good-name"><span class="good-icon">${getGoodIcon(good)}</span> ${good}</div>
        <div class="good-price">Buy: ${price}</div>
        <div class="good-actions">
          <button onclick="buyGood('${good}', ${price})">Buy</button>
          <button onclick="sellGood('${good}')">Sell</button>
          <button onclick="sellAll('${good}')">Sell All</button>
        </div>
      `
        )
        .join("")}
    </div>
    <h3>Fuel</h3>
    <p>Price per unit: ${station.fuelPrice}</p>
    <input id="fuelAmount" type="number" min="1" value="1">
    <button onclick="buyFuel()">Buy Fuel</button>
  `;
}

function renderUpgrades() {
  const upgrades = document.getElementById("upgrades");
  upgrades.innerHTML = `
    <h2>Upgrades</h2>
    <button onclick="upgradeCargo()">Upgrade Cargo (50 credits)</button> <span class="upgrade-desc">Increases cargo capacity by 5.</span><br>
    <button onclick="upgradeEfficiency()">Upgrade Fuel Efficiency (75 credits)</button> <span class="upgrade-desc">Reduces fuel consumption by 5%.</span>
  `;
}

function travelTo(stationName, fuelNeeded) {
  if (player.fuel >= fuelNeeded) {
    player.fuel -= fuelNeeded;
    player.location = stationName;
    if (!player.discovered[stationName]) {
      player.discovered[stationName] = true;
      player.visitedPrices.push({
        name: stationName,
        fuelPrice: stations[stationName].fuelPrice,
        goods: { ...stations[stationName].goods },
      });
    }
    checkForPirates();
    renderAll();
  } else {
    alert("Not enough fuel!");
  }
}

function checkForPirates() {
  const chance = Math.random();
  if (chance < 0.25) {
    const stolen = Math.min(player.credits, 20);
    player.credits -= stolen;
    alert(`Pirates attacked! You lost ${stolen} credits.`);
  }
}

function buyFuel() {
  const amount = parseInt(document.getElementById("fuelAmount").value);
  const cost = amount * stations[player.location].fuelPrice;
  if (player.credits >= cost) {
    player.credits -= cost;
    player.fuel += amount;
    renderAll();
  } else {
    alert("Not enough credits!");
  }
}

function buyGood(good, price) {
  const totalCargo = Object.values(player.cargo).reduce((a, b) => a + b, 0);
  if (player.credits >= price && totalCargo < player.cargoCapacity) {
    player.credits -= price;
    player.cargo[good] = (player.cargo[good] || 0) + 1;
    renderAll();
  } else if (totalCargo >= player.cargoCapacity) {
    alert("Cargo hold full!");
  } else {
    alert("Not enough credits!");
  }
}

function sellGood(good) {
  const station = stations[player.location];
  if (player.cargo[good] > 0 && good in station.goods) {
    player.credits += station.goods[good];
    player.cargo[good]--;
    if (player.cargo[good] === 0) delete player.cargo[good];
    renderAll();
  }
}

function sellAll(good) {
  const station = stations[player.location];
  if (player.cargo[good] > 0 && good in station.goods) {
    const qty = player.cargo[good];
    player.credits += station.goods[good] * qty;
    delete player.cargo[good];
    renderAll();
  }
}

function upgradeCargo() {
  if (player.credits >= 50) {
    player.credits -= 50;
    player.cargoCapacity += 5;
    renderAll();
  } else {
    alert("Not enough credits to upgrade cargo.");
  }
}

function upgradeEfficiency() {
  if (player.credits >= 75) {
    player.credits -= 75;
    player.fuelEfficiency *= 0.95;
    renderAll();
  } else {
    alert("Not enough credits to upgrade fuel efficiency.");
  }
}

function renderAll() {
  drawMap();
  renderInfo();
  renderActions();
  renderVisitedPrices();
  renderUpgrades();
}

player.discovered[player.location] = true;
player.visitedPrices.push({
  name: player.location,
  fuelPrice: stations[player.location].fuelPrice,
  goods: { ...stations[player.location].goods },
});

renderAll();
