export const config = {
  runtime: "nodejs",
};

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

const FOURTHWALL_API_EMAIL = process.env.FOURTHWALL_API_EMAIL;
const FOURTHWALL_API_PASSWORD = process.env.FOURTHWALL_API_PASSWORD;
const FOURTHWALL_STOREFRONT_TOKEN = process.env.FOURTHWALL_STOREFRONT_TOKEN;

const FOURTHWALL_API_BASE = "https://api.fourthwall.com";

interface FourthwallAuthResponse {
  token: string;
  expires_in: number;
}

interface FourthwallProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url?: string;
  category: string;
}

// Get Fourthwall auth token
async function getFourthwallToken(): Promise<string> {
  try {
    const response = await fetch(`${FOURTHWALL_API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: FOURTHWALL_API_EMAIL,
        password: FOURTHWALL_API_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error(`Fourthwall auth failed: ${response.statusText}`);
    }

    const data = (await response.json()) as FourthwallAuthResponse;
    return data.token;
  } catch (error) {
    console.error("[Fourthwall] Auth error:", error);
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  const action = req.query.action || "";

  try {
    switch (action) {
      case "products":
        return await handleGetProducts(req, res);
      case "sync-products":
        return await handleSyncProducts(req, res);
      case "store-settings":
        return await handleGetStoreSettings(req, res);
      case "webhook":
        return await handleWebhook(req, res);
      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error: any) {
    console.error("[Fourthwall API] Error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}

// Get products from Fourthwall storefront
async function handleGetProducts(req: any, res: any) {
  try {
    const token = await getFourthwallToken();

    const response = await fetch(
      `${FOURTHWALL_API_BASE}/storefront/products?storefront_token=${FOURTHWALL_STOREFRONT_TOKEN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = (await response.json()) as { products?: unknown };

    return res.status(200).json({
      success: true,
      products: data.products || [],
    });
  } catch (error: any) {
    console.error("[Fourthwall] Get products error:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch products",
    });
  }
}

// Sync Fourthwall products to AeThex database
async function handleSyncProducts(req: any, res: any) {
  try {
    const token = await getFourthwallToken();

    const response = await fetch(
      `${FOURTHWALL_API_BASE}/storefront/products?storefront_token=${FOURTHWALL_STOREFRONT_TOKEN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    const products: FourthwallProduct[] = data.products || [];

    // Sync products to Supabase
    const syncResults = [];

    for (const product of products) {
      const { error } = await supabase.from("fourthwall_products").upsert(
        {
          fourthwall_id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          image_url: product.image_url,
          category: product.category,
          synced_at: new Date().toISOString(),
        },
        {
          onConflict: "fourthwall_id",
        },
      );

      syncResults.push({
        product_id: product.id,
        product_name: product.name,
        success: !error,
        error: error?.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Synced ${products.length} products`,
      results: syncResults,
    });
  } catch (error: any) {
    console.error("[Fourthwall] Sync products error:", error);
    return res.status(500).json({
      error: error.message || "Failed to sync products",
    });
  }
}

// Get store settings
async function handleGetStoreSettings(req: any, res: any) {
  try {
    const token = await getFourthwallToken();

    const response = await fetch(`${FOURTHWALL_API_BASE}/store/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch store settings: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      settings: data,
    });
  } catch (error: any) {
    console.error("[Fourthwall] Get settings error:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch store settings",
    });
  }
}

// Handle Fourthwall webhooks (order events, etc)
async function handleWebhook(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event_type, data } = req.body;

    if (!event_type) {
      return res.status(400).json({ error: "Missing event_type" });
    }

    // Log webhook event
    const { error } = await supabase.from("fourthwall_webhook_logs").insert({
      event_type,
      payload: data,
      received_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Fourthwall] Webhook log error:", error);
    }

    // Handle specific events
    switch (event_type) {
      case "order.created":
        await handleOrderCreated(data);
        break;
      case "order.paid":
        await handleOrderPaid(data);
        break;
      case "product.updated":
        await handleProductUpdated(data);
        break;
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error: any) {
    console.error("[Fourthwall] Webhook error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process webhook",
    });
  }
}

// Handle Fourthwall order created event
async function handleOrderCreated(data: any) {
  try {
    const { order_id, customer_email, items, total_amount } = data;

    // Store order in database for later processing
    const { error } = await supabase.from("fourthwall_orders").insert({
      fourthwall_order_id: order_id,
      customer_email,
      items: items || [],
      total_amount,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[Fourthwall] Failed to store order:", error);
    }

    console.log(`[Fourthwall] Order created: ${order_id}`);
  } catch (error) {
    console.error("[Fourthwall] Order creation error:", error);
  }
}

// Handle Fourthwall order paid event
async function handleOrderPaid(data: any) {
  try {
    const { order_id } = data;

    // Update order status
    const { error } = await supabase
      .from("fourthwall_orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("fourthwall_order_id", order_id);

    if (error) {
      console.error("[Fourthwall] Failed to update order:", error);
    }

    console.log(`[Fourthwall] Order paid: ${order_id}`);
  } catch (error) {
    console.error("[Fourthwall] Order payment error:", error);
  }
}

// Handle Fourthwall product updated event
async function handleProductUpdated(data: any) {
  try {
    const { product_id, ...updates } = data;

    // Update product in database
    const { error } = await supabase
      .from("fourthwall_products")
      .update({
        ...updates,
        synced_at: new Date().toISOString(),
      })
      .eq("fourthwall_id", product_id);

    if (error) {
      console.error("[Fourthwall] Failed to update product:", error);
    }

    console.log(`[Fourthwall] Product updated: ${product_id}`);
  } catch (error) {
    console.error("[Fourthwall] Product update error:", error);
  }
}
