import { getSupabaseClient } from "@/lib/supabase";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

function makeImageUrl(name: string) {
  return `https://via.placeholder.com/800x600?text=${encodeURIComponent(name)}`;
}

export async function seedDatabase(force = false) {
  const supabase = getSupabaseClient();

  const [productsCountRes, categoriesCountRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);

  const productsCount = productsCountRes.count ?? 0;
  const categoriesCount = categoriesCountRes.count ?? 0;
  if (!force && productsCount > 0 && categoriesCount > 0) {
    return { insertedCategories: 0, insertedProducts: 0, skipped: true };
  }

  const categoryPayload = categories.map((item) => ({
    name: item.name,
    slug: item.slug,
    image: item.image,
    sort_order: item.sort_order,
    is_active: item.is_active,
  }));

  const categoryFullInsert = await supabase.from("categories").upsert(categoryPayload, { onConflict: "slug" });
  if (categoryFullInsert.error) {
    const fallbackPayload = categories.map((item) => ({ name: item.name, slug: item.slug }));
    const fallbackInsert = await supabase.from("categories").upsert(fallbackPayload, { onConflict: "slug" });
    if (fallbackInsert.error) throw fallbackInsert.error;
  }

  const categoriesRes = await supabase.from("categories").select("id,slug");
  if (categoriesRes.error) throw categoriesRes.error;
  const categoryIdBySlug = new Map<string, string>((categoriesRes.data ?? []).map((item) => [item.slug, item.id]));

  const productPayload = products
    .map((item) => {
      const categoryId = categoryIdBySlug.get(item.category);
      if (!categoryId) return null;
      return {
        name: item.name,
        description: item.description,
        price: item.price,
        sale_price: null,
        category_id: categoryId,
        images: [makeImageUrl(item.name)],
        is_active: true,
        stock: item.stock,
        attributes: item.specs ?? {},
      };
    })
    .filter(Boolean);

  const productInsert = await supabase.from("products").insert(productPayload);
  if (productInsert.error) {
    const fallbackPayload = products
      .map((item) => {
        const categoryId = categoryIdBySlug.get(item.category);
        if (!categoryId) return null;
        return {
          name: item.name,
          description: item.description,
          price: item.price,
          discount_price: null,
          category_id: categoryId,
          main_image: makeImageUrl(item.name),
          additional_images: [],
          is_active: true,
          stock: item.stock,
        };
      })
      .filter(Boolean);
    const fallbackInsert = await supabase.from("products").insert(fallbackPayload);
    if (fallbackInsert.error) throw fallbackInsert.error;
  }

  return {
    insertedCategories: categoryPayload.length,
    insertedProducts: productPayload.length,
    skipped: false,
  };
}
