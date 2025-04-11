let order = [];
let discount = 0;

function renderOrder() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    order.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} – ${item.price} zł`;

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

    const sum = order.reduce((acc, item) => acc + item.price, 0);
    document.getElementById("order-sum").textContent = `Suma zamówienia: ${sum} zł`;
    document.getElementById("total-after-discount").textContent = `Suma po rabacie: ${Math.max(sum - discount, 0)} zł`;
}

function getInvoiceText() {
    const companyName = document.getElementById("company-name").value;
    const companyAddress = document.getElementById("company-address").value;
    const companyNip = document.getElementById("company-nip").value;

    const sum = order.reduce((acc, item) => acc + item.price, 0);
    const total = Math.max(sum - discount, 0);

    const items = order.map(item => `- ${item.name}: ${item.price} zł`).join("\n");

    return `Faktura VAT
Nazwa firmy: ${companyName}
Adres: ${companyAddress}
NIP: ${companyNip}

Zamówienie:
${items}

Suma: ${sum} zł
Rabat: ${discount} zł
Do zapłaty: ${total} zł`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".menu-btn").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            order.push({ name, price });
            renderOrder();
        });
    });

    document.getElementById("apply-discount").addEventListener("click", () => {
        const value = parseFloat(document.getElementById("discount").value);
        discount = isNaN(value) ? 0 : value;
        renderOrder();
    });

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
        invoices.push({ text: getInvoiceText(), date: new Date().toISOString() });
        localStorage.setItem("invoices", JSON.stringify(invoices));
        alert("Faktura zapisana!");
    });
});
