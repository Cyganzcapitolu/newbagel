import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bmeyrkcwhkatdsdrouvh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZXlya2N3aGthdGRzZHJvdXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDgzMzAsImV4cCI6MjA2MDM4NDMzMH0.LUJIBFHfYL5OC7VNnimTY_As6XmN3BQrckhLw41JKco';
const supabase = createClient(supabaseUrl, supabaseKey);
let order = [];
let discount = 0;

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
        invoices.push({ text: getInvoiceText(), date: new Date().toISOString() });
        localStorage.setItem("invoices", JSON.stringify(invoices));
        alert("Faktura zapisana!");
    });
});
document.getElementById("saveOrderBtn").addEventListener("click", async () => {
  if (order.length === 0) {
    alert("Zamówienie jest puste!");
    return;
  }

  const orderDate = new Date().toISOString();
  const totalAmount = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const finalAmount = totalAmount - discount;

  const { data: newOrder, error } = await supabase
    .from("orders")
    .insert([
      {
        order_date: orderDate,
        total_amount: totalAmount,
        discount: discount,
        final_amount: finalAmount
      }
    ])
    .select();

  if (error) {
    console.error("Błąd podczas zapisywania zamówienia:", error);
    alert("Wystąpił błąd. Nie zapisano zamówienia.");
    return;
  }

  const orderId = newOrder[0].id;

  const orderItems = order.map(item => ({
    order_id: orderId,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Błąd podczas zapisywania pozycji zamówienia:", itemsError);
    alert("Zamówienie zostało zapisane częściowo.");
  } else {
    alert("Zamówienie zostało zapisane!");
    order = [];
    updateOrderPreview();
    updateSummary();
  }
});

