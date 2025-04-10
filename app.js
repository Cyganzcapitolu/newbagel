let order = [];
let discount = 0;
let invoiceNumber = 1; // Startujemy od numeru 1 faktury

function renderOrder() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    order.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} x${item.quantity} – ${item.price * item.quantity} zł`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.style.marginLeft = "10px";
        removeBtn.onclick = () => {
            order.splice(index, 1);
            renderOrder();
        };

        li.appendChild(removeBtn);
        orderList.appendChild(li);
    });

    const sum = order.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById("order-sum").textContent = `Suma zamówienia: ${sum} zł`;
    document.getElementById("total-after-discount").textContent = `Suma po rabacie: ${Math.max(sum - discount, 0)} zł`;
}

function getInvoiceText() {
    const companyName = document.getElementById("company-name").value;
    const companyAddress = document.getElementById("company-address").value;
    const companyNip = document.getElementById("company-nip").value;

    const sum = order.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = Math.max(sum - discount, 0);

    const items = order.map(item => `- ${item.name} x${item.quantity}: ${item.price * item.quantity} zł`).join("\n");

    return `Faktura VAT
Numer faktury: #${invoiceNumber}
Data wystawienia: ${new Date().toLocaleDateString()}

Nazwa firmy: ${companyName}
Adres: ${companyAddress}
NIP: ${companyNip}

Zamówienie:
${items}

Suma: ${sum} zł
Rabat: ${discount} zł
Do zapłaty: ${total} zł`;
}

function updateDiscount() {
    const value = parseFloat(document.getElementById("discount").value);
    discount = isNaN(value) ? 0 : value;
    renderOrder();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".menu-btn").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            const existing = order.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                order.push({ name, price, quantity: 1 });
            }

            renderOrder();
        });
    });

    document.getElementById("discount").addEventListener("input", updateDiscount);

    document.getElementById("clear-order").addEventListener("click", () => {
        order = [];
        discount = 0;
        document.getElementById("discount").value = "";
        renderOrder();
        document.getElementById("invoice-preview").textContent = "";
    });

    document.getElementById("preview-invoice").addEventListener("click", () => {
        const preview = getInvoiceText();
        document.getElementById("invoice-preview").textContent = preview;
    });

    document.getElementById("save-invoice").addEventListener("click", () => {
        const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");
        invoices.push({ text: getInvoiceText(), date: new Date().toISOString(), number: invoiceNumber });
        localStorage.setItem("invoices", JSON.stringify(invoices));

        invoiceNumber += 1; // Zwiększamy numer faktury po zapisaniu

        alert("Faktura zapisana!");
    });

    document.getElementById("download-invoice").addEventListener("click", () => {
        const invoiceText = getInvoiceText();
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(invoiceText));
        element.setAttribute("download", `faktura_${invoiceNumber}.txt`);
        element.click();
    });

    // Funkcja eksportu do PDF
    document.getElementById("export-pdf").addEventListener("click", () => {
        const invoiceText = document.getElementById("invoice-preview").innerText;
        const doc = new jsPDF();
        doc.text(invoiceText, 10, 10);
        doc.save(`faktura_${invoiceNumber}.pdf`);
    });
});
