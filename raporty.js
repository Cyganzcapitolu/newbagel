// raporty.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bmeyrkcwhkatdsdrouvh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Użyj swojego klucza
const supabase = createClient(supabaseUrl, supabaseKey);

window.generujRaport = async function () {
  const miesiac = document.getElementById('miesiac').value;
  if (!miesiac) return alert('Wybierz miesiąc!');

  const [rok, mies] = miesiac.split('-');
  const startDate = `${rok}-${mies}-01`;
  const endDate = `${rok}-${mies}-31`;

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_date, total_amount, discount, final_amount, order_items (product_name, quantity, price)')
    .gte('order_date', startDate)
    .lte('order_date', endDate);

  if (error) {
    console.error('Błąd pobierania:', error);
    return;
  }

  let suma = 0;
  const produkty = {};

  orders.forEach((order) => {
    suma += order.final_amount;

    order.order_items.forEach((item) => {
      if (!produkty[item.product_name]) {
        produkty[item.product_name] = 0;
      }
      produkty[item.product_name] += item.quantity;
    });
  });

  document.getElementById('raport-finansowy').innerText = `Suma sprzedaży: ${suma.toFixed(2)} zł`;

  const towarowy = Object.entries(produkty)
    .map(([nazwa, ilosc]) => `${nazwa}: ${ilosc} szt.`)
    .join('\n');

  document.getElementById('raport-towarowy').innerText = towarowy;
}
