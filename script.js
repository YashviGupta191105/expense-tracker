let transactions = [];

let incomeChart;
let expenseChart;

// Form submission handler
document.getElementById("transaction-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const validCategories = type === "Income" ? incomeCategories : expenseCategories;

  if (!amount || !date || !category || !type || !validCategories.includes(category)) {
    alert("Invalid input. Please check category selection based on transaction type.");
    return;
  }
  const transaction = { amount, type, date, category };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateSummary();
  renderTransactions(transactions);

  this.reset();
  updateCategoryOptions();
});



const incomeCategories = ["Salary", "Bonus", "Investments", "Freelancing", "Others"];
const expenseCategories = ["Food", "Travel", "Shopping", "Bills", "Rent", "Others"];

function updateCategoryOptions() {
  const type = document.getElementById("type").value;
  const categorySelect = document.getElementById("category");

  categorySelect.innerHTML = ""; // clear previous

  const categories = type === "Income" ? incomeCategories : expenseCategories;

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
  categorySelect.selectedIndex = 0;
}

function updateFilterCategories() {
  const type = document.getElementById("filter-type").value;
  const categorySelect = document.getElementById("filter-category");

  categorySelect.innerHTML = "<option value=''>All</option>"; // reset

  const categories =
    type === "Income"
      ? incomeCategories
      : type === "Expense"
        ? expenseCategories
        : [...incomeCategories, ...expenseCategories];

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function updateSummary() {
  let income = 0;
  let expenses = 0;
  let incomeBreakdown = {};
  let expenseBreakdown = {};

  transactions.forEach((t) => {
    if (t.type === "Income") {
      income += t.amount;
      incomeBreakdown[t.category] = (incomeBreakdown[t.category] || 0) + t.amount;
    } else {
      expenses += t.amount;
      expenseBreakdown[t.category] = (expenseBreakdown[t.category] || 0) + t.amount;
    }
  });

  const balance = income - expenses;

  document.getElementById("balance").textContent = `₹${balance}`;
  document.getElementById("income").textContent = `₹${income}`;
  document.getElementById("expenses").textContent = `₹${expenses}`;
  document.getElementById("networth").textContent = `₹${balance}`;

  updatePieChart("incomeChart", incomeBreakdown, incomeChart, true);
  updatePieChart("expenseChart", expenseBreakdown, expenseChart, false);
}

function updatePieChart(id, data, chartRef, isIncome) {
  const ctx = document.getElementById(id).getContext("2d");
  const labels = Object.keys(data);
  const values = Object.values(data);

  const backgroundColors = labels.map((_, i) => {
    const hue = (i * 137) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  });

  if (chartRef) {
    // Update existing chart
    chartRef.data.labels = labels;
    chartRef.data.datasets[0].data = values;
    chartRef.data.datasets[0].backgroundColor = backgroundColors;
    chartRef.update();
  } else {
    // Create new doughnut chart
    chartRef = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "50%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 18,
              padding: 15,
              color: "#333",
              font: {
                size: 14,
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      },
    });

    if (isIncome) incomeChart = chartRef;
    else expenseChart = chartRef;
  }
}


function renderTransactions(data) {
  const tbody = document.querySelector("#transaction-table tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const row = tbody.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.textContent = "No transactions to show.";
    return;
  }

  data.forEach((t, index) => {
    const row = tbody.insertRow();

    row.insertCell(0).textContent = t.type;
    row.insertCell(1).textContent = t.category;
    row.insertCell(2).textContent = t.amount;
    row.insertCell(3).textContent = t.date;

    const actionCell = row.insertCell(4);
    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
    delBtn.onclick = () => deleteTransaction(index);
    actionCell.appendChild(delBtn);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateSummary();
  renderTransactions(transactions);
}

function applyFilter() {
  const date = document.getElementById("filter-date").value;
  const type = document.getElementById("filter-type").value;
  const category = document.getElementById("filter-category").value;

  let filtered = transactions;

  if (date) {
    filtered = filtered.filter((t) => t.date === date);
  }

  if (type) {
    filtered = filtered.filter((t) => t.type === type);
  }

  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }

  renderTransactions(filtered);
}

function clearFilter() {
  document.getElementById("filter-date").value = "";
  document.getElementById("filter-type").value = "";
  document.getElementById("filter-category").value = "";
  updateFilterCategories();
  renderTransactions(transactions);
}


window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("transactions");
  if (saved) {
    transactions = JSON.parse(saved);
    renderTransactions(transactions);
    updateSummary();
  }

  updateCategoryOptions();
  updateFilterCategories();
});

