// Supabase config
const supabaseUrl = "https://bmeyrkcwhkatdsdrouvh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZXlya2N3aGthdGRzZHJvdXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDgzMzAsImV4cCI6MjA2MDM4NDMzMH0.LUJIBFHfYL5OC7VNnimTY_As6XmN3BQrckhLw41JKco";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let order = [];

function addItem(name, price) {
  const existing = order.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    order.push({ name, price, quantity: 1 });
  }
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";
  let total = 0;

  order.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} zł`;
    list.appendChild(li);
    total += item.price * item.quantity;
  });

  document.getElementById("total").textContent = total.toFixed(2);
  applyDiscount();
}

function applyDiscount() {
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = total * (1 - discount / 100);
  document.getElementById("discountedTotal").textContent = discountedTotal.toFixed(2);
}

function clearOrder() {
  order = [];
  renderOrder();
}

function previewInvoice() {
  let output = "";
  order.forEach(item => {
    output += `${item.name} x${item.quantity} - ${item.price * item.quantity} zł\n`;
  });
  output += `\nSuma: ${document.getElementById("total").textContent} zł`;
  output += `\nPo rabacie: ${document.getElementById("discountedTotal").textContent} zł`;
  document.getElementById("invoice-content").textContent = output;
  document.getElementById("invoice-preview").style.display = "block";
}

function downloadPDF() {
  previewInvoice();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(document.getElementById("invoice-content").textContent, 10, 10);
  doc.save("faktura.pdf");
}

async function saveOrder() {
  const items = order.map(item => `${item.name} x${item.quantity}`).join(", ");
  const total = parseFloat(document.getElementById("total").textContent);
  const discounted = parseFloat(document.getElementById("discountedTotal").textContent);
  const discount = parseFloat(document.getElementById("discount").value) || 0;
  const date = new Date().toISOString();

  const { error } = await supabase
    .from("orders")
    .insert([{ items, total, discounted, discount, date }]);

  if (error) {
    alert("Błąd przy zapisie do bazy: " + error.message);
  } else {
    alert("Zamówienie zapisane!");
    clearOrder();
  }
}
