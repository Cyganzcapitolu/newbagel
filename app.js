document.addEventListener('DOMContentLoaded', function () {
    // Zmienna do przechowywania całkowitej kwoty
    let totalAmount = 0;
    let bagelPrice = 0;
    let friesPrice = 10; // Cena frytek
    let drinkPrice = 10; // Cena napoju
    let orderItems = []; // Przechowuje wybrane pozycje zamówienia

    // Ceny bajgli
    const bagelPrices = {
        'poszarpany': 33,
        'firmowy': 35,
        'zebro': 45,
        'czizbajgiel': 31,
        'haloumi': 35
    };

    const friesButton = document.getElementById("fries");
    const drinkButton = document.getElementById("drink");
    const generateInvoiceButton = document.getElementById("generate-invoice");
    const previewInvoiceButton = document.getElementById("preview-invoice");
    const clearOrderButton = document.getElementById("clear-order");

    // Funkcja obliczająca całkowitą kwotę
    function calculateTotalAmount() {
        totalAmount = 0;

        // Sumujemy ceny wybranych bajgli
        orderItems.forEach(item => {
            totalAmount += item.price;
        });

        // Dodajemy frytki
        if (friesButton.classList.contains("active")) {
            totalAmount += friesPrice;
        }

        // Dodajemy napój
        if (drinkButton.classList.contains("active")) {
            totalAmount += drinkPrice;
        }

        // Zastosowanie rabatu
        const discount = parseInt(document.getElementById("discount").value, 10);
        if (discount > 0) {
            totalAmount = totalAmount - (totalAmount * (discount / 100));
        }

        // Zaktualizuj sumę zamówienia
        document.getElementById("total-amount").textContent = totalAmount.toFixed(2) + " PLN";

        // Zaktualizuj sumę po rabacie
        const totalAfterDiscount = totalAmount.toFixed(2);
        document.getElementById("total-after-discount").textContent = totalAfterDiscount + " PLN";

        return totalAmount;
    }

    // Funkcja do dodania bajgla
    function addBagel(bagel) {
        const bagelItem = {
            name: bagel,
            price: bagelPrices[bagel]
        };

        orderItems.push(bagelItem);
        calculateTotalAmount();
    }

    // Funkcja do usunięcia całego zamówienia
    function clearOrder() {
        orderItems = [];
        friesButton.classList.remove("active");
        drinkButton.classList.remove("active");
        document.getElementById("discount").value = 0;
        calculateTotalAmount();
    }

    // Obsługuje wybór bajgla
    document.querySelectorAll('.bagel-btn').forEach(button => {
        button.addEventListener('click', () => {
            addBagel(button.id);
        });
    });

    // Obsługuje wybór frytek
    friesButton.addEventListener('click', () => {
        friesButton.classList.toggle('active');
        calculateTotalAmount();
    });

    // Obsługuje wybór napoju
    drinkButton.addEventListener('click', () => {
        drinkButton.classList.toggle('active');
        calculateTotalAmount();
    });

    // Generowanie faktury
    generateInvoiceButton.addEventListener("click", function () {
        calculateTotalAmount();

        const companyName = document.getElementById("company-name").value;
        const companyAddress = document.getElementById("company-address").value;
        const nip = document.getElementById("nip").value;

        if (companyName && companyAddress && nip && totalAmount > 0) {
            alert("Faktura została wygenerowana");
            // Możesz tu dodać logikę zapisywania faktury w bazie danych lub generowania PDF
        } else {
            alert("Proszę uzupełnić wszystkie dane");
        }
    });

    // Podgląd faktury
    previewInvoiceButton.addEventListener("click", function () {
        calculateTotalAmount();

        const companyName = document.getElementById("company-name").value;
        const companyAddress = document.getElementById("company-address").value;
        const nip = document.getElementById("nip").value;

        if (companyName && companyAddress && nip && totalAmount > 0) {
            document.getElementById("preview-company-name").textContent = companyName;
            document.getElementById("preview-company-address").textContent = companyAddress;
            document.getElementById("preview-nip").textContent = nip;
            document.getElementById("preview-total-amount").textContent = totalAmount.toFixed(2);

            document.getElementById("invoice-preview").style.display = "block"; } else { alert("Proszę uzupełnić dane i dodać produkty"); } });
        // Kasowanie zamówienia
clearOrderButton.addEventListener("click", function () {
    clearOrder();
});

// Dynamiczne przeliczanie rabatu
document.getElementById("discount").addEventListener("input", function () {
    calculateTotalAmount();
});

