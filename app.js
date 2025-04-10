document.addEventListener('DOMContentLoaded', function () {
    // Zmienna do przechowywania całkowitej kwoty
    let totalAmount = 0;
    let bagelPrice = 0;
    let friesPrice = 10; // Cena frytek
    let drinkPrice = 10; // Cena napoju

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

    // Funkcja obliczająca całkowitą kwotę
    function calculateTotalAmount() {
        const bagel = document.querySelector('.bagel-btn.active');
        const discount = parseInt(document.getElementById("discount").value, 10);

        if (bagel) {
            bagelPrice = bagelPrices[bagel.id];
        }

        totalAmount = bagelPrice;

        // Dodajemy frytki
        if (friesButton.classList.contains("active")) {
            totalAmount += friesPrice;
        }

        // Dodajemy napój
        if (drinkButton.classList.contains("active")) {
            totalAmount += drinkPrice;
        }

        // Uwzględnienie rabatu
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

    // Obsługuje wybór bajgla
    document.querySelectorAll('.bagel-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Resetowanie zaznaczenia
            document.querySelectorAll('.bagel-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            calculateTotalAmount();
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

            document.getElementById("invoice-preview").style.display = "block";
        } else {
            alert("Proszę uzupełnić wszystkie dane, aby zobaczyć podgląd faktury");
        }
    });
});
