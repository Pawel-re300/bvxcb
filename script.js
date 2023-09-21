// Pobieranie elementów z dokumentu
const budgetForm = document.getElementById("budget-form");
const incomeInput = document.getElementById("monthly-income");
const categorySelect = document.getElementById("category");
const expenseAmountInput = document.getElementById("expense-amount");
const budgetList = document.getElementById("budget-list");
const budgetTotal = document.getElementById("budget-total");

// Pobieranie zapisanej kwoty dochodu z localStorage lub ustawienie jej na zero
let monthlyIncome = parseFloat(localStorage.getItem("monthlyIncome")) || null;

// Ustawienie wczytanej wartości w polu input
incomeInput.value = monthlyIncome !== null ? monthlyIncome : "";

// Przechowywanie danych budżetowych
let budgetData = [];

// Funkcja do dodawania nowego wpisu do listy
function addBudgetEntry(category, expenseAmount) {
    // Sprawdzenie, czy kwota wydatku jest prawidłowa
    if (expenseAmount <= 0) {
        alert("Kwota wydatku musi być większa od zera.");
        return;
    }

    // Tworzenie nowego wpisu
    const entry = {
        category: category,
        expenseAmount: parseFloat(expenseAmount)
    };

    // Dodawanie wpisu do listy danych budżetowych
    budgetData.push(entry);

    // Tworzenie nowego elementu listy
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <span>Kategoria: ${entry.category}</span>
        <span>Kwota wydatku: ${entry.expenseAmount.toFixed(2)} PLN</span>
        <button class="delete-btn">Usuń</button>
    `;

    // Dodawanie obsługi kliknięcia do przycisku "Usuń"
    const deleteButton = listItem.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => {
        deleteBudgetEntry(entry);
    });

    // Dodawanie elementu listy do dokumentu
    budgetList.appendChild(listItem);

    // Czyszczenie pól formularza
    categorySelect.value = "";
    expenseAmountInput.value = "";

    // Aktualizacja salda budżetu (odejmowanie wydatku)
    monthlyIncome -= entry.expenseAmount;
    localStorage.setItem("monthlyIncome", monthlyIncome);
    updateBudget();
}

// Funkcja do usuwania wpisu z listy
function deleteBudgetEntry(entry) {
    const index = budgetData.indexOf(entry);
    if (index !== -1) {
        const deletedExpense = entry.expenseAmount;
        budgetData.splice(index, 1); // Usunięcie wpisu z tablicy danych budżetowych

        // Aktualizacja salda budżetu (przywracanie usuniętego wydatku)
        monthlyIncome += deletedExpense;
        localStorage.setItem("monthlyIncome", monthlyIncome);

        updateBudget(); // Aktualizacja salda po usunięciu
        renderBudgetList(); // Aktualizacja listy po usunięciu
    }
}

// Funkcja do aktualizacji salda budżetu
function updateBudget() {
    // Wyświetlanie salda na stronie
    budgetTotal.textContent = `Saldo: ${monthlyIncome !== null ? monthlyIncome.toFixed(2) + " PLN" : ""}`;
}

// Funkcja do renderowania listy budżetu
function renderBudgetList() {
    budgetList.innerHTML = "";
    budgetData.forEach((entry) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>Kategoria: ${entry.category}</span>
            <span>Kwota wydatku: ${entry.expenseAmount.toFixed(2)} PLN</span>
            <button class="delete-btn">Usuń</button>
        `;

        // Dodawanie obsługi kliknięcia do przycisku "Usuń"
        const deleteButton = listItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            deleteBudgetEntry(entry);
        });

        // Dodawanie elementu listy do dokumentu
        budgetList.appendChild(listItem);
    });
}

// Obsługa przesyłania formularza
budgetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const category = categorySelect.value;
    const expenseAmount = expenseAmountInput.value.trim();

    if (!isNaN(expenseAmount) && parseFloat(expenseAmount) >= 0) {
        addBudgetEntry(category, expenseAmount);
    } else {
        alert("Proszę wypełnić poprawnie formularz.");
    }
});

// Inicjalizacja listy budżetu
renderBudgetList();
updateBudget();

// Obsługa zmiany kwoty budżetu miesięcznego
incomeInput.addEventListener("change", function () {
    monthlyIncome = parseFloat(incomeInput.value) || null;
    localStorage.setItem("monthlyIncome", monthlyIncome);
    updateBudget();
});
