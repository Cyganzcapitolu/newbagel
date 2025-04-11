let order = [];
let discount = 0;

function renderOrder() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    order.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} – ${item.price} zł`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Usuń";
        removeBtn.addEventListener("click", () => {
            order.splice(index, 1);
            renderOrder();
        });
        li.appendChild(removeBtn);
        orderList.appendChild(li);
    });

    const sum = order.reduce((acc, item) => acc + item.price, 0);
    document.getElementById("order-sum").innerText = `Suma zamówienia: ${sum} zł`;
    document.getElementById("total-after-discount").innerText = `Suma po rabacie: ${Math.max(sum - discount, 0)} zł`;
}

function addItem(name, price) {
    order.push({ name, price });
    renderOrder();
}

function getInvoiceText() {
    const companyName = document.getElementById("company-name").value;
    const companyAddress = document.getElementById("company-address").value;
    const companyNip = document.getElementById("company-nip").value;
    const orderLines = order.map(item => `- ${item.name}: ${item.price} zł`).join('\n');
    const sum = order.reduce((acc, item) => acc + item.price, 0);
    const total = Math.max(sum - discount, 0);

    return `Faktura VAT
Nazwa firmy: ${companyName}
Adres: ${companyAddress}
NIP: ${companyNip}

Zamówienie:
${orderLines}

Suma: ${sum} zł
Rabat: ${discount} zł
Do zapłaty: ${total} zł`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#menu button").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            addItem(name, price);
        });
    });

    document.getElementById("apply-discount").addEventListener("click", () => {
        const discountInput = parseFloat(document.getElementById("discount").value);
        discount = isNaN(discountInput) ? 0 : discountInput;
        renderOrder();
    });

    document.getElementById("clear-order").addEventListener("click", () => {
        order = [];
        discount = 0;
        document.getElementById("discount").value = "";
        renderOrder();
        document.getElementById("invoice-preview").innerText = "";
    });

    document.getElementById("preview-invoice").addEventListener("click", () => {
        const previewText = getInvoiceText();
        document.getElementById("invoice-preview").innerText = previewText;
    });

    document.getElementById("save-invoice").addEventListener("click", () => {
        const invoice = {
            text: getInvoiceText(),
            date: new Date().toISOString()
        };

        let archive = JSON
::contentReference[oaicite:17]{index=17}
 
