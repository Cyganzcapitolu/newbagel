const prices = {
    czizbajgiel: 31,
    klasyk: 30,
    wege: 29,
    szarpany: 34,
    szarpanyser: 35,
    frytki: 10,
    napoje: 10
};

let order = [];
let discount = 0;

function renderOrder() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    order.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} – ${item.price} zł`;
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

document.getElementById("add-czizbajgiel").addEventListener("click", () => addItem("Czizbajgiel", prices.czizbajgiel));
document.getElementById("add-klasyk").addEventListener("click", () => addItem("Klasyk", prices.klasyk));
document.getElementById("add-wege").addEventListener("click", () => addItem("Wege", prices.wege));
document.getElementById("add-szarpany").addEventListener("click", () => addItem("Szarpany", prices.szarpany));
document.getElementById("add-szarpanyser").addEventListener("click", () => addItem("Szarpany z serem", prices.szarpanyser));
document.getElementById("add-frytki").addEventListener("click", () => addItem("Frytki", prices.frytki));
document.getElementById("add-napoje").addEventListener("click", () => addItem("Napój", prices.napoje));

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

    let archive = JSON.parse(localStorage.getItem("invoices") || "[]");
    archive.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(archive));
    alert("Faktura zapisana do archiwum.");
});
