const rollBtn = document.getElementById("rollBtn");
const resultDiv = document.getElementById("result");

function parseBonus(bonusStr) {
  const match = bonusStr.match(/([+-]?\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function rollDice(sides, count, bonus) {
  let total = 0;
  let rolls = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }
  total += bonus;
  return { total, rolls };
}

rollBtn.addEventListener("click", () => {
  const diceSides = parseInt(
    document.querySelector('input[name="dice"]:checked').value,
    10
  );
  const numDice = parseInt(document.getElementById("numDice").value, 10);
  const bonus = parseBonus(document.getElementById("bonus").value);

  const { total, rolls } = rollDice(diceSides, numDice, bonus);

  // Display the total result
  resultDiv.innerHTML = total;

  // Create spans for each roll
  const rollsSpans = rolls
    .map((roll) => `<span class="roll">${roll}</span>`)
    .join(" ");

  const rollsDiv = document.getElementById("rolls");
  rollsDiv.innerHTML = rollsSpans;

  // Display bonus if it's not zero
  const bonusResultDiv = document.getElementById("bonusResult");
  if (bonus !== 0) {
    bonusResultDiv.innerHTML = bonus > 0 ? `+${bonus}` : bonus;
  } else {
    bonusResultDiv.innerHTML = "";
  }
});
