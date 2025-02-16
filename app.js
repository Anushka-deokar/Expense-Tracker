// Enum for Expense Categories
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["Food"] = "Food";
    ExpenseCategory["Travel"] = "Travel";
    ExpenseCategory["Bills"] = "Bills";
    ExpenseCategory["Shopping"] = "Shopping";
    ExpenseCategory["Other"] = "Other";
})(ExpenseCategory || (ExpenseCategory = {}));
// Get Elements from DOM
var expenseForm = document.getElementById("expense-form");
var descInput = document.getElementById("desc");
var amountInput = document.getElementById("amount");
var dateInput = document.getElementById("expense-date");
var categoryInput = document.getElementById("expense-category");
var expenseList = document.getElementById("expense-list");
var totalExpense = document.querySelector(".total-expense-amount");
// Filter Elements
var filterCategory = document.getElementById("filter-category");
var filterDate = document.getElementById("filter-date");
var applyFilterBtn = document.getElementById("apply-filter");
var expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
// Function to Render Expenses
function renderExpenses(expensesToRender) {
    if (expensesToRender === void 0) { expensesToRender = expenses; }
    expenseList.innerHTML = "";
    var total = 0;
    expensesToRender.forEach(function (expense) {
        var expenseItem = document.createElement("li");
        expenseItem.classList.add("expense-item");
        expenseItem.innerHTML = "\n            <span>".concat(expense.description, " - ").concat(expense.category, " - $").concat(expense.amount, " - ").concat(expense.date, "</span>\n            <button class=\"delete-btn\" data-id=\"").concat(expense.id, "\">X</button>\n        ");
        expenseList.appendChild(expenseItem);
        total += expense.amount;
    });
    totalExpense.textContent = total.toFixed(2);
    // Attach event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach(function (button) {
        button.addEventListener("click", function (event) {
            var id = event.target.dataset.id;
            deleteExpense(id);
        });
    });
}
// Function to Add Expense
function addExpense(event) {
    event.preventDefault();
    var description = descInput.value.trim();
    var amount = parseFloat(amountInput.value);
    var category = categoryInput.value;
    var date = dateInput.value;
    if (!description || isNaN(amount) || !category || !date) {
        alert("Please fill all fields correctly!");
        return;
    }
    var newExpense = {
        id: Date.now().toString(),
        description: description,
        amount: amount,
        category: category,
        date: date
    };
    expenses.push(newExpense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    // Clear form fields
    descInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
    categoryInput.value = "Select Category";
}
// Function to Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(function (expense) { return expense.id !== id; });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
}
// Function to Apply Filters
function applyFilters() {
    var selectedCategory = filterCategory.value;
    var selectedDate = filterDate.value;
    var filteredExpenses = expenses;
    if (selectedCategory !== "all") {
        filteredExpenses = filteredExpenses.filter(function (expense) { return expense.category === selectedCategory; });
    }
    if (selectedDate) {
        filteredExpenses = filteredExpenses.filter(function (expense) { return expense.date === selectedDate; });
    }
    renderExpenses(filteredExpenses);
}
// Event Listeners
expenseForm.addEventListener("submit", addExpense);
applyFilterBtn.addEventListener("click", applyFilters);
// Initial Render
renderExpenses();
