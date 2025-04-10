document.addEventListener('DOMContentLoaded', function () {
    const nipInput = document.getElementById("nip");
    const generateInvoiceButton = document.getElementById("generate-invoice");
    const previewInvoiceButton = document.getElementById("preview-invoice"); // Przycisk podglądu faktury
    const invoicePreview = document.getElementById("invoice-preview"); // Sekcja z podglądem faktury

    // Obsługuje przycisk 'Generuj fakturę'
    generateInvoiceButton.addEventListener("click", function () {
        const nip = nipInput.value;
        const companyName = document.getElementById("company-name").value;
        const companyAddress = document.getElementById("company-address").value;
        const totalAmount = document.getElementById("total-amount").value;

        // Przykładowe pobranie danych do faktury, możesz dodać logikę zapisania faktury
        if (companyName && companyAddress && nip && totalAmount) {
            alert("Faktura została wygenerowana");
            // Możemy dodać zapis do bazy danych (jeśli masz backend)
        } else {
            alert("Proszę uzupełnić wszystkie dane");
        }
    });

    // Obsługuje przycisk 'Podgląd faktury'
    previewInvoiceButton.addEventListener("click", function () {
        const companyName = document.getElementById("company-name").value;
        const companyAddress = document.getElementById("company-address").value;
        const nip = document.getElementById("nip").value;
        const totalAmount = document.getElementById("total-amount").value;

        // Sprawdzenie, czy wszystkie dane zostały uzupełnione
        if (companyName && companyAddress && nip && totalAmount) {
            // Wstawianie danych do podglądu faktury
            document.getElementById("preview-company-name").textContent = companyName;
            document.getElementById("preview-company-address").textContent = companyAddress;
            document.getElementById("preview-nip").textContent = nip;
            document.getElementById("preview-total-amount").textContent = totalAmount;

            // Pokazywanie sekcji podglądu
            invoicePreview.style.display = "block";
        } else {
            alert("Proszę uzupełnić wszystkie dane, aby zobaczyć podgląd faktury");
        }
    });
});
