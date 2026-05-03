// src/lib/foodApi.ts

export const fetchProductInfo = async (barcode: string) => {
  // 1. Zuerst Open Food Facts versuchen
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.status === 1 && data.product.product_name) {
      return {
        id: barcode,
        name: data.product.product_name,
        image: data.product.image_front_small_url || '',
        brand: data.product.brands || 'Unbekannte Marke',
      };
    }
  } catch (e) {
    console.error('Open Food Facts Fehler:', e);
  }

  // 2. Fallback: Open EAN Database
  try {
    const response = await fetch(
      `https://opengtindb.org/?ean=${barcode}&cmd=product&lang=de`
    );
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    const name = xml.querySelector('name')?.textContent;
    const brand = xml.querySelector('vendor')?.textContent;
    const image = xml.querySelector('mainpic')?.textContent;

    if (name) {
      return {
        id: barcode,
        name,
        image: image || '',
        brand: brand || 'Unbekannte Marke',
      };
    }
  } catch (e) {
    console.error('OpenGTIN Fehler:', e);
  }

  // 3. Fallback: UPC Item DB
  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        id: barcode,
        name: item.title || 'Unbekanntes Produkt',
        image: item.images?.[0] || '',
        brand: item.brand || 'Unbekannte Marke',
      };
    }
  } catch (e) {
    console.error('UPC Item DB Fehler:', e);
  }

  return null;
};