// src/lib/foodApi.ts

export const fetchProductInfo = async (barcode: string) => {
  try {
    // Делаем запрос к бесплатной базе Open Food Facts
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );
    const data = await response.json();

    // status 1 означает, что продукт найден
    if (data.status === 1) {
      return {
        id: barcode,
        name: data.product.product_name || "Unbekanntes Produkt",
        image: data.product.image_front_small_url || "",
        brand: data.product.brands || "Unbekannte Marke",
      };
    }
    
    // Если продукта нет в базе
    return null;
  } catch (error) {
    console.error("Ошибка при получении данных о продукте:", error);
    return null;
  }
};