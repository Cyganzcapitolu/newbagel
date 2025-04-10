document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll("#menu li");
    const orderList = document.getElementById("order-list");
    const totalAmount = document.getElementById("total-amount");
    const discountedAmount = document.getElementById("discounted-amount");
    const discountInput = document.getElementById("discount");
    const applyDiscountButton = document.getElementById("apply-discount");
    const generateInvoiceButton = document.getElementById("generate-invoice");
    const nipInput = document.getElementById("nip");
    const gusDataDisplay = document.getElementById("gus-data");

    let order = [];
    let discount = 0;

    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            const price = parseInt(item.getAttribute("data-price"));
            const name = item.textContent;
            order.push({ name, price });
            updateOrder();
        });
    });

    applyDiscountButton.addEventListener("click", function () {
        discount = parseInt(discountInput.value) || 0;
        updateOrder();
    });

    generateInvoiceButton.addEventListener("click", function () {
        generateInvoice();
    });

    nipInput.addEventListener("blur", function () {
        const nip = nipInput.value;
        if (nip) {
            fetchGusData(nip);
        }
    });

    function updateOrder() {
        const total = order.reduce((sum, item) => sum + item.price, 0);
        const discountedTotal = total - (total * (discount / 100));
        
        orderList.innerHTML = order.map(item => `<li>${item.name} - ${item.price} zł</li>`).join('');
        
        totalAmount.textContent = `${total} zł`;
        discountedAmount.textContent = `${discountedTotal.toFixed(2)} zł`;
    }

    function generateInvoice() {
        const invoiceData = order.map(item => `${item.name}: ${item.price} zł`).join('\n');
        const total = order.reduce((sum, item) => sum + item.price, 0);
        const discountedTotal = total - (total * (discount / 100));
        
        const invoice = `
        Faktura:
        ${invoiceData}
        
        Całkowita Kwota: ${total} zł
        Rabat: ${discount}%
        Kwota po Rabacie: ${discountedTotal.toFixed(2)} zł
        `;
        
        alert(invoice);
    }

    function fetchGusData(nip) {
        fetch(`https://api-v1.mojepanstwo.pl/firmy?nip=${nip}`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0]) {
                    const firma = data[0];
                    const firmaData = `
                        Nazwa Firmy: ${firma.nazwa}
                        NIP: ${firma.nip}
                        REGON: ${firma.regon}
                        Adres: ${firma.adres_ulica}, ${firma.adres_kod} ${firma.adres_miejscowosc}
                    `;
                    gusDataDisplay.textContent = firmaData;
                } else {
                    gusDataDisplay.textContent = 'Brak danych dla tego NIP';
                }
            })
            .catch(error => {
                console.error('Błąd podczas pobierania danych z GUS:', error);
                gusDataDisplay.textContent = 'Błąd pobierania danych z GUS';
            });
    }
});
