// raporty.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bmeyrkcwhkatdsdrouvh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZXlya2N3aGthdGRzZHJvdXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDgzMzAsImV4cCI6MjA2MDM4NDMzMH0.LUJIBFHfYL5OC7VNnimTY_As6XmN3BQrckhLw41JKco';

const supabase = createClient(supabaseUrl, supabaseKey);

window.generujRaport = async function () {
  const miesiac = document.getElementById('miesiac').value;
  if (!miesiac) return alert('Wybierz miesiąc!');

  const [rok, mies] = miesiac.split('-');

  const { data, error } = await supabase
    .from('zamowienia')
    .select('*')
    .gte('data', `${rok}-${mies}-01`)
    .lte('data', `${rok}-${mies}-31`);

  if (error) {
    console.error('Błąd pobierania:', error);
    return;
  }

  let suma = 0;
  const produkty = {};

  data.forEach((zamowienie) => {
    suma += zamowienie.suma_po_rabacie;

    zamowienie.produkty.forEach((item) => {
      if (!produkty[item.nazwa]) {
        produkty[item.nazwa] = 0;
      }
      produkty[item.nazwa] += item.ilosc;
    });
  });

  document.getElementById('raport-finansowy').innerText = `Suma sprzedaży: ${suma.toFixed(2)} zł`;

  const towarowy = Object.entries(produkty)
    .map(([nazwa, ilosc]) => `${nazwa}: ${ilosc} szt.`)
    .join('\n');

  document.getElementById('raport-towarowy').innerText = towarowy;
}
