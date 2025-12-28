let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
const list = document.getElementById("expenseList");
const totalEl = document.getElementById("total");

let chart;

function addExpense() {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (title === "" || amount === "") return alert("Fill all fields");

  expenses.push({
    id: Date.now(),
    title,
    amount: Number(amount),
    category
  });

  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

function render() {
  list.innerHTML = "";
  let total = 0;

  expenses.forEach(exp => {
    total += exp.amount;
    list.innerHTML += `
      <li>
        ${exp.title} (₹${exp.amount})
        <button onclick="deleteExpense(${exp.id})">X</button>
      </li>
    `;
  });

  totalEl.innerText = total;
  renderChart();
}

function renderChart() {
  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] =
      (categories[exp.category] || 0) + exp.amount;
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
    }]
  };

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("expenseChart"), {
    type: "pie",
    data
  });
}

render();
