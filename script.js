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
  const scale = 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  connections.forEach(([a, b]) => {
    const x1 = stations[a].x * scale;
    const y1 = stations[a].y * scale;
    const x2 = stations[b].x * scale;
    const y2 = stations[b].y * scale;
    const dist = Math.ceil(distance(a, b) * player.fuelEfficiency);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = (a === player.location || b === player.location) ? "#ff0" : "#0f0";
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
    const x = station.x * scale;
    const y = station.y * scale;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = name === player.location ? "#ff0" : "#0f0";
    ctx.fill();
    ctx.fillStyle = "#0f0";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(name, x + 12, y + 4);
  }
}

function renderVisitedPrices() {
  const container = document.getElementById("visitedPrices");
  container.innerHTML = "<h2>Visited Locations Market Data</h2>";
  if (player.visitedPrices.length === 0) return;

  let minPrices = {};
  let maxPrices = {};
  if (player.hasCheapestGoodsUpgrade || player.hasMostExpensiveGoodsUpgrade) {
    player.visitedPrices.forEach((visit) => {
      for (const [good, price] of Object.entries(visit.goods)) {
        if (player.hasCheapestGoodsUpgrade) {
          if (!(good in minPrices) || price < minPrices[good]) {
            minPrices[good] = price;
          }
        }
        if (player.hasMostExpensiveGoodsUpgrade) {
          if (!(good in maxPrices) || price > maxPrices[good]) {
            maxPrices[good] = price;
          }
        }
      }
    });
  }

  let tableHtml = `<table><tr><th>Location</th><th>Fuel Price</th><th>Goods</th></tr>`;
  player.visitedPrices.forEach((visit) => {
    const goodsList = Object.entries(visit.goods)
      .map(([g, p]) => {
        let indicators = "";
        if (player.hasCheapestGoodsUpgrade && minPrices[g] === p) {
          indicators += " 🟢";
        }
        if (player.hasMostExpensiveGoodsUpgrade && maxPrices[g] === p) {
          indicators += " 🔴";
        }
        return `<span class="good-icon">${getGoodIcon(g)}</span> ${g}: ${p}${indicators}`;
      })
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
          ([good, price]) => {
            const hasCargo = player.cargo[good] > 0;
            return `
        <div class="good-name"><span class="good-icon">${getGoodIcon(good)}</span> ${good}</div>
        <div class="good-price">Buy: ${price}</div>
        <div class="good-actions">
          <button onclick="buyGood('${good}', ${price})">Buy</button>
          <button onclick="sellGood('${good}')" ${hasCargo ? '' : 'disabled'}>Sell</button>
          <button onclick="sellAll('${good}')" ${hasCargo ? '' : 'disabled'}>Sell All</button>
        </div>
      `;
          }
        )
        .join("")}
    </div>
    <h3>Fuel</h3>
    <p>Price per unit: ${station.fuelPrice}</p>
    <input id="fuelAmount" type="number" min="1" value="1">
    <button onclick="buyFuel()">Buy Fuel</button>

    <h3>Ship Status</h3>
    <p>Hull Integrity: ${player.hull}%</p>
    ${player.hull < 100 ? `<button onclick="repairHull()">Repair Hull</button>` : `<p>Hull fully repaired</p>`}
  `;
}

function repairHull() {
  const station = stations[player.location];
  const damage = 100 - player.hull;
  if (damage <= 0) {
    alert("Hull is already fully repaired.");
    return;
  }
  const repairCostPerPercent = station.fuelPrice; // Cost per 1% damage, similar to fuel price
  const totalCost = damage * repairCostPerPercent;

  if (player.credits >= totalCost) {
    const confirmRepair = confirm(`Repairing ${damage}% hull will cost ${totalCost} credits. Proceed?`);
    if (confirmRepair) {
      player.credits -= totalCost;
      player.hull = 100;
      alert("Hull fully repaired.");
      renderAll();
    }
  } else {
    alert("Not enough credits to repair hull.");
  }
}

function renderUpgrades() {
  const upgrades = document.getElementById("upgrades");
  upgrades.innerHTML = `
    <h2 style="cursor:pointer;" onclick="toggleUpgrades()"><span id="upgradesToggleIcon">▼</span> Upgrades</h2>
    <div id="upgradesContent">
      <button onclick="upgradeCargo()">Upgrade Cargo (50 credits)</button> <span class="upgrade-desc">Increases cargo capacity by 5.</span><br>
      <button onclick="upgradeEfficiency()" ${(player.fuelEfficiency < 0.25) ? 'disabled' : ''}>
        ${(player.fuelEfficiency < 0.25) ? 'Fuel Efficiency Maxed' : 'Upgrade Fuel Efficiency (75 credits)'}
      </button> <span class="upgrade-desc">Reduces fuel consumption by 5%.</span><br>
      <button onclick="buyCheapestGoodsUpgrade()" ${player.hasCheapestGoodsUpgrade ? 'disabled' : ''}>
        ${player.hasCheapestGoodsUpgrade ? 'Cheapest Goods Indicator (Purchased)' : 'Cheapest Goods Indicator (100 credits)'}
      </button> <span class="upgrade-desc">Highlights the cheapest good of each type across visited locations.</span><br>
      <button onclick="buyMostExpensiveGoodsUpgrade()" ${player.hasMostExpensiveGoodsUpgrade ? 'disabled' : ''}>
        ${player.hasMostExpensiveGoodsUpgrade ? 'Most Expensive Goods Indicator (Purchased)' : 'Most Expensive Goods Indicator (100 credits)'}
      </button> <span class="upgrade-desc">Highlights the most expensive good of each type across visited locations.</span>
    </div>
  `;
}

function toggleUpgrades() {
  const content = document.getElementById("upgradesContent");
  const icon = document.getElementById("upgradesToggleIcon");
  if (content.style.display === "none") {
    content.style.display = "block";
    if (icon) icon.textContent = "▼";
  } else {
    content.style.display = "none";
    if (icon) icon.textContent = "►";
  }
}
window.toggleUpgrades = toggleUpgrades;

function travelTo(stationName, fuelNeeded) {
  const fuelCost = Math.ceil(fuelNeeded * player.fuelEfficiency);
  if (player.fuel >= fuelCost) {
    player.fuel -= fuelCost;
    player.location = stationName;
    if (!player.discovered[stationName]) {
      player.discovered[stationName] = true;
      player.visitedPrices.push({
        name: stationName,
        fuelPrice: stations[stationName].fuelPrice,
        goods: { ...stations[stationName].goods },
      });
    }
    checkForEncounter();
    renderAll();
  } else {
    alert("Not enough fuel!");
  }
}

function checkForEncounter() {
  const encounterChance = Math.random();
  if (true) { // 30% chance of enemy ship encounter
    const enemyCredits = Math.floor(Math.random() * 50) + 20; // 20-70 credits
    const enemyGoods = Math.floor(Math.random() * 5) + 1; // 1-5 goods
    const enemyStrength = Math.random(); // 0-1 difficulty factor

    const modal = document.getElementById("encounterModal");
    const text = document.getElementById("encounterText");
    const attackBtn = document.getElementById("attackButton");
    const ignoreBtn = document.getElementById("ignoreButton");

    text.innerText = `An enemy ship appears!\nPotential loot: ${enemyCredits} credits and ${enemyGoods} goods.\nDo you want to attack?`;
    modal.style.display = "block";

    // Remove previous event listeners by cloning
    const newAttackBtn = attackBtn.cloneNode(true);
    const newIgnoreBtn = ignoreBtn.cloneNode(true);
    attackBtn.parentNode.replaceChild(newAttackBtn, attackBtn);
    ignoreBtn.parentNode.replaceChild(newIgnoreBtn, ignoreBtn);

    function showResult(message) {
      text.innerText = message;
      newAttackBtn.style.display = "none";
      newIgnoreBtn.style.display = "none";

      let closeBtn = document.getElementById("closeEncounterButton");
      if (!closeBtn) {
        closeBtn = document.createElement("button");
        closeBtn.id = "closeEncounterButton";
        closeBtn.innerText = "Close";
        closeBtn.style.marginTop = "10px";
        newAttackBtn.parentNode.appendChild(closeBtn);
      } else {
        closeBtn.style.display = "inline-block";
      }

      closeBtn.onclick = () => {
        modal.style.display = "none";
        closeBtn.style.display = "none";
        newAttackBtn.style.display = "inline-block";
        newIgnoreBtn.style.display = "inline-block";
        renderAll();
      };
    }

    newAttackBtn.onclick = () => {
      const successChance = 0.6 - enemyStrength * 0.5 + Math.random() * 0.4;
      if (successChance > 0.5) {
        player.credits += enemyCredits;
        let addedGoods = 0;
        for (const good in stations[player.location].goods) {
          if (addedGoods >= enemyGoods) break;
          if (!player.cargo[good]) player.cargo[good] = 0;
          if (player.cargoCapacity > Object.values(player.cargo).reduce((a, b) => a + b, 0)) {
            player.cargo[good]++;
            addedGoods++;
          }
        }
        showResult(`You won the battle!\nGained ${enemyCredits} credits and ${addedGoods} goods.`);
      } else {
        const lostCredits = Math.min(player.credits, Math.floor(Math.random() * 30) + 10);
        player.credits -= lostCredits;

        let lostGoods = 0;
        for (const good in player.cargo) {
          if (lostGoods >= enemyGoods) break;
          if (player.cargo[good] > 0) {
            const loss = Math.min(player.cargo[good], 1);
            player.cargo[good] -= loss;
            lostGoods += loss;
          }
        }

        const damage = Math.floor(Math.random() * 21) + 10;
        player.hull = Math.max(0, player.hull - damage);

        showResult(`You lost the battle!\nLost ${lostCredits} credits, ${lostGoods} goods, and took ${damage}% hull damage.`);
      }
    };

    newIgnoreBtn.onclick = () => {
      showResult("You avoided the enemy ship.");
    };
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

function buyCheapestGoodsUpgrade() {
  if (player.credits >= 100) {
    player.credits -= 100;
    player.hasCheapestGoodsUpgrade = true;
    renderAll();
  } else {
    alert("Not enough credits to purchase this upgrade.");
  }
}

function buyMostExpensiveGoodsUpgrade() {
  if (player.credits >= 100) {
    player.credits -= 100;
    player.hasMostExpensiveGoodsUpgrade = true;
    renderAll();
  } else {
    alert("Not enough credits to purchase this upgrade.");
  }
}
window.buyMostExpensiveGoodsUpgrade = buyMostExpensiveGoodsUpgrade;

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
