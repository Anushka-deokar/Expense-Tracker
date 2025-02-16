
interface Expense {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
}


enum ExpenseCategory {
    Food = "Food",
    Travel = "Travel",
    Bills = "Bills",
    Shopping = "Shopping",
    Other = "Other"
}


const expenseForm = document.getElementById("expense-form") as HTMLFormElement;
const descInput = document.getElementById("desc") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const dateInput = document.getElementById("expense-date") as HTMLInputElement;
const categoryInput = document.getElementById("expense-category") as HTMLSelectElement;
const expenseList = document.getElementById("expense-list") as HTMLUListElement;
const totalExpense = document.querySelector(".total-expense-amount") as HTMLDivElement;


const filterCategory = document.getElementById("filter-category") as HTMLSelectElement;
const filterDate = document.getElementById("filter-date") as HTMLInputElement;
const applyFilterBtn = document.getElementById("apply-filter") as HTMLButtonElement;

let expenses: Expense[] = JSON.parse(localStorage.getItem("expenses") || "[]");


function renderExpenses(expensesToRender: Expense[] = expenses) {
    expenseList.innerHTML = "";
    let total = 0;

    expensesToRender.forEach(expense => {
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense-item");
        expenseItem.innerHTML = `
            <span>${expense.description} - ${expense.category} - $${expense.amount} - ${expense.date}</span>
            <button class="delete-btn" data-id="${expense.id}">X</button>
        `;

        expenseList.appendChild(expenseItem);
        total += expense.amount;
    });

    totalExpense.textContent = total.toFixed(2);


    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const id = (event.target as HTMLButtonElement).dataset.id!;
            deleteExpense(id);
        });
    });
}


function addExpense(event: Event) {
    event.preventDefault();

    const description = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value as ExpenseCategory;
    const date = dateInput.value;

    if (!description || isNaN(amount) || !category || !date) {
        alert("Please fill all fields correctly!");
        return;
    }

    const newExpense: Expense = {
        id: Date.now().toString(),
        description,
        amount,
        category,
        date
    };

    expenses.push(newExpense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();


    descInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
    categoryInput.value = "Select Category";
}


function deleteExpense(id: string) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
}


function applyFilters() {
    const selectedCategory = filterCategory.value;
    const selectedDate = filterDate.value;

    let filteredExpenses = expenses;

    if (selectedCategory !== "all") {
        filteredExpenses = filteredExpenses.filter(expense => expense.category === selectedCategory);
    }

    if (selectedDate) {
        filteredExpenses = filteredExpenses.filter(expense => expense.date === selectedDate);
    }

    renderExpenses(filteredExpenses);
}

// Event Listeners
expenseForm.addEventListener("submit", addExpense);
applyFilterBtn.addEventListener("click", applyFilters);

// Initial Render
renderExpenses();
