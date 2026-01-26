import { supabase } from "../_supabase.js";

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const userId = userData.user.id;

  try {
    if (req.method === "GET") {
      // Get items
      const { data: items, error: itemsError } = await supabase
        .from("staff_marketplace_items")
        .select("*")
        .eq("is_available", true)
        .order("points_cost");

      if (itemsError) throw itemsError;

      // Get user's points
      let { data: points } = await supabase
        .from("staff_points")
        .select("*")
        .eq("user_id", userId)
        .single();

      // Create points record if doesn't exist
      if (!points) {
        const { data: newPoints } = await supabase
          .from("staff_points")
          .insert({ user_id: userId, balance: 1000, lifetime_earned: 1000 })
          .select()
          .single();
        points = newPoints;
      }

      // Get user's orders
      const { data: orders } = await supabase
        .from("staff_marketplace_orders")
        .select(`*, item:staff_marketplace_items(name, image_url)`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      return new Response(JSON.stringify({
        items: items || [],
        points: points || { balance: 0, lifetime_earned: 0 },
        orders: orders || []
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { item_id, quantity, shipping_address } = body;

      // Get item
      const { data: item } = await supabase
        .from("staff_marketplace_items")
        .select("*")
        .eq("id", item_id)
        .single();

      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
      }

      // Check stock
      if (item.stock_count !== null && item.stock_count < (quantity || 1)) {
        return new Response(JSON.stringify({ error: "Insufficient stock" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }

      // Check points
      const { data: points } = await supabase
        .from("staff_points")
        .select("balance")
        .eq("user_id", userId)
        .single();

      const totalCost = item.points_cost * (quantity || 1);
      if (!points || points.balance < totalCost) {
        return new Response(JSON.stringify({ error: "Insufficient points" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("staff_marketplace_orders")
        .insert({
          user_id: userId,
          item_id,
          quantity: quantity || 1,
          shipping_address,
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Deduct points
      await supabase
        .from("staff_points")
        .update({ balance: points.balance - totalCost })
        .eq("user_id", userId);

      // Update stock if applicable
      if (item.stock_count !== null) {
        await supabase
          .from("staff_marketplace_items")
          .update({ stock_count: item.stock_count - (quantity || 1) })
          .eq("id", item_id);
      }

      return new Response(JSON.stringify({ order }), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
