import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const env = Object.fromEntries(
  fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function randomToken() {
  return crypto.randomBytes(16).toString("hex"); // 32 hex chars
}

async function ensureUser(email, password, role, displayName, phoneNumber, address, isOrg = false, orgCapacity = null) {
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list?.users?.find((u) => u.email === email);
  if (existing) {
    // Update profile
    await admin.from("profiles").upsert({
      id: existing.id,
      role,
      display_name: displayName,
      phone_number: phoneNumber,
      address,
      is_organization: isOrg,
      organization_capacity: orgCapacity,
      is_banned: false,
    });
    return existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      display_name: displayName,
      phone_number: phoneNumber,
      address,
      is_organization: isOrg,
      organization_capacity: orgCapacity,
    },
  });

  if (error) throw error;

  await admin.from("profiles").upsert({
    id: data.user.id,
    role,
    display_name: displayName,
    phone_number: phoneNumber,
    address,
    is_organization: isOrg,
    organization_capacity: orgCapacity,
    is_banned: false,
  });

  return data.user.id;
}

async function seed() {
  console.log("=== SEEDING 10 REALISTIC DATA ROWS PER RELATED TABLE ===");

  // 1. PROFILES & USERS
  console.log("\n1. Ensuring realistic user profiles...");
  const donor1 = await ensureUser("donor@gmail.com", "password123", "donor", "Katering Selera Nusantara (Renon)", "081234567890", "Jl. Raya Puputan No. 45, Renon, Denpasar");
  const donor2 = await ensureUser("hotel.santika@gmail.com", "password123", "donor", "Hotel Santika Siligita Nusa Dua", "081298765432", "Jl. Siligita No. 9, Benoa, Kuta Selatan");
  const donor3 = await ensureUser("warung.bukris@gmail.com", "password123", "donor", "Spesial Sambal & Ayam Bu Kris", "081377889900", "Jl. Teuku Umar No. 88, Denpasar Barat");
  const donor4 = await ensureUser("artisan.bakery@gmail.com", "password123", "donor", "Artisan Bakery & Pastry Bali", "081566778899", "Jl. Danau Tamblingan No. 54, Sanur");

  const ben1 = await ensureUser("penerima@gmail.com", "password123", "beneficiary", "Budi Santoso (Penerima Manfaat)", "081311223344", "Jl. Hayam Wuruk No. 12, Denpasar Timur", false, null);
  const ben2 = await ensureUser("organisasi@gmail.com", "password123", "beneficiary", "Panti Asuhan Yayasan Sayap Ibu", "081122334455", "Jl. Tantular Barat No. 8, Renon, Denpasar", true, 50);
  const ben3 = await ensureUser("kasih.anak@gmail.com", "password123", "beneficiary", "Yayasan Peduli Kasih Anak Kanker Bali", "081233445566", "Jl. PB Sudirman No. 19, Denpasar", true, 40);
  const ben4 = await ensureUser("lansia.werdha@gmail.com", "password123", "beneficiary", "Panti Sosial Tresna Werdha Wana Seraya", "081344556677", "Jl. Raya Sesetan No. 110, Denpasar Selatan", true, 60);

  const proc1 = await ensureUser("pengolah@gmail.com", "password123", "processor", "CV Bali Biokonversi Maggot", "081987654321", "Jl. Bypass Ngurah Rai No. 201, Sanur");
  const proc2 = await ensureUser("kompos.lestari@gmail.com", "password123", "processor", "Sentra Kompos & Biogas Tirta Amerta", "081822334455", "Jl. Hang Tuah No. 33, Sanur Kaja");

  const admin1 = await ensureUser("admin@gmail.com", "password123", "admin", "Admin Pengawas Dinas Lingkungan Hidup", "081555666777", "Kantor DLHK Prov. Bali, Renon");

  // Update donor balance & subsidies
  await admin.from("profiles").update({ credit_balance: 180000 }).eq("id", donor1);
  await admin.from("profiles").update({ credit_balance: 250000 }).eq("id", donor2);
  await admin.from("profiles").update({ credit_balance: 120000 }).eq("id", donor3);
  await admin.from("profiles").update({ credit_balance: 90000 }).eq("id", donor4);
  await admin.from("profiles").update({ credit_balance: 750000 }).eq("id", proc1);
  await admin.from("profiles").update({ credit_balance: 420000 }).eq("id", proc2);

  for (const dId of [donor1, donor2, donor3, donor4]) {
    await admin.from("donor_subsidies").upsert({
      donor_id: dId,
      granted_amount: 12000,
      remaining_amount: 12000,
    });
  }

  // 2. FOOD LISTINGS (10 Real Food Items)
  console.log("\n2. Seeding 10 realistic food listings...");
  // Clear old test listings to have clean 10 realistic items
  await admin.from("food_listings").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const now = new Date();
  const listingsData = [
    {
      donor_id: donor1,
      title: "Gourmet Chicken Teriyaki Bento & Tamagoyaki",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
      portions: 35,
      remaining_portions: 25,
      risky_ingredients: ["telur", "kedelai"],
      dietary_tags: ["halal"],
      storage_method: "refrigerated",
      cooked_at: new Date(now.getTime() - 75 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 4 * 3600 * 1000).toISOString(),
      handling_notes: "Simpan dalam chiller 4°C. Panaskan kembali hingga 70°C sebelum disajikan.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor1,
      title: "Nasi Tumpeng Mini Nusantara & Ayam Bakar Madu",
      image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=80",
      portions: 40,
      remaining_portions: 30,
      risky_ingredients: ["santan", "telur"],
      dietary_tags: ["halal"],
      storage_method: "sealed_container",
      cooked_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 3 * 3600 * 1000).toISOString(),
      handling_notes: "Wadah tertutup rapat food-grade. Segera konsumsi sebelum batas waktu safe until.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor4,
      title: "Artisan Butter Croissant & Pain au Chocolat",
      image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700&q=80",
      portions: 30,
      remaining_portions: 28,
      risky_ingredients: ["susu", "mentega"],
      dietary_tags: ["halal", "vegetarian"],
      storage_method: "room_temperature",
      cooked_at: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 5 * 3600 * 1000).toISOString(),
      handling_notes: "Kering dan higienis. Dapat dipanaskan 3 menit dalam oven suhu 150°C.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor3,
      title: "Paket Nasi Ayam Geprek Crispy Sambal Bawang",
      image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&q=80",
      portions: 30,
      remaining_portions: 18,
      risky_ingredients: ["daging_ayam", "bawang"],
      dietary_tags: ["halal"],
      storage_method: "heated_display",
      cooked_at: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 3.5 * 3600 * 1000).toISOString(),
      handling_notes: "Dijaga dalam warmer display suhu 60°C.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor2,
      title: "Salad Bowl Quinoa, Edamame & Roasted Sesame",
      image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80",
      portions: 25,
      remaining_portions: 25,
      risky_ingredients: ["kedelai", "wijen"],
      dietary_tags: ["halal", "vegetarian", "bebas-gluten"],
      storage_method: "refrigerated",
      cooked_at: new Date(now.getTime() - 40 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 4.5 * 3600 * 1000).toISOString(),
      handling_notes: "Dressing dipisah dalam cup higienis. Sajikan dingin.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor1,
      title: "Sup Ayam Jagung Manis & Roti Garlic Katering",
      image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=700&q=80",
      portions: 25,
      remaining_portions: 15,
      risky_ingredients: ["telur", "daging_ayam"],
      dietary_tags: ["halal"],
      storage_method: "heated_display",
      cooked_at: new Date(now.getTime() - 50 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 3 * 3600 * 1000).toISOString(),
      handling_notes: "Disimpan dalam thermal urn stainless steel food-grade.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor1,
      title: "Nasi Rendang Sapi Padang & Gulai Daun Singkong",
      image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=700&q=80",
      portions: 35,
      remaining_portions: 20,
      risky_ingredients: ["santan", "daging_sapi"],
      dietary_tags: ["halal"],
      storage_method: "sealed_container",
      cooked_at: new Date(now.getTime() - 80 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 3.5 * 3600 * 1000).toISOString(),
      handling_notes: "Rendang daging empuk masak slow cook, kuah gulai terpisah.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor2,
      title: "Dimsum Siomay Ayam Udang & Hakau Kukus Hotel",
      image_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700&q=80",
      portions: 45,
      remaining_portions: 35,
      risky_ingredients: ["seafood", "udang", "telur"],
      dietary_tags: ["halal"],
      storage_method: "heated_display",
      cooked_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 3 * 3600 * 1000).toISOString(),
      handling_notes: "Kukusan bambu tertutup, saus cocolan cabai merah terpisah.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor4,
      title: "Beef Lasagna Panggang Bechamel Khas Italia",
      image_url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=700&q=80",
      portions: 20,
      remaining_portions: 12,
      risky_ingredients: ["susu", "keju", "daging_cincang"],
      dietary_tags: ["halal"],
      storage_method: "refrigerated",
      cooked_at: new Date(now.getTime() - 65 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 4 * 3600 * 1000).toISOString(),
      handling_notes: "Aluminium foil box sealed. Panaskan oven/microwave 180°C selama 5 menit.",
      food_condition: "safe_for_consumption",
      status: "active",
    },
    {
      donor_id: donor3,
      title: "Paket Nasi Kuning Bali Komplit Telur Balado",
      image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=80",
      portions: 30,
      remaining_portions: 0,
      risky_ingredients: ["santan", "telur"],
      dietary_tags: ["halal"],
      storage_method: "sealed_container",
      cooked_at: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
      safe_until: new Date(now.getTime() + 1 * 3600 * 1000).toISOString(),
      handling_notes: "Seluruh porsi telah terdistribusi habis ke relawan.",
      food_condition: "safe_for_consumption",
      status: "claimed",
    },
  ];

  const createdListings = [];
  for (const item of listingsData) {
    const { data, error } = await admin.from("food_listings").insert(item).select().single();
    if (error) {
      console.error("Error inserting listing:", item.title, error);
    } else {
      createdListings.push(data);
      console.log(`✓ Listing: "${data.title}" (${data.remaining_portions}/${data.portions} porsi)`);
    }
  }

  // 3. FOOD CLAIMS (10 Realistic Claims)
  console.log("\n3. Seeding 10 realistic food claims...");
  await admin.from("food_claims").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const todayStr = now.toISOString().split("T")[0];
  const claimsData = [
    // 4 active claims (waiting for pickup / QR available to scan)
    {
      listing_id: createdListings[0].id, // Bento
      claimant_id: ben1, // Budi Santoso
      portions_claimed: 5,
      qr_token: "bento" + randomToken().slice(5),
      is_collected: false,
      collected_at: null,
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[1].id, // Tumpeng
      claimant_id: ben2, // Sayap Ibu
      portions_claimed: 10,
      qr_token: "tumpeng" + randomToken().slice(7),
      is_collected: false,
      collected_at: null,
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[3].id, // Geprek
      claimant_id: ben3, // Kasih Anak
      portions_claimed: 12,
      qr_token: "geprek" + randomToken().slice(6),
      is_collected: false,
      collected_at: null,
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[5].id, // Sup Ayam
      claimant_id: ben4, // Lansia
      portions_claimed: 10,
      qr_token: "supayam" + randomToken().slice(7),
      is_collected: false,
      collected_at: null,
      meal_date: todayStr,
      meal_window: "lunch",
    },

    // 6 collected claims (historical handovers completed)
    {
      listing_id: createdListings[0].id,
      claimant_id: ben2,
      portions_claimed: 5,
      qr_token: randomToken(),
      is_collected: true,
      collected_at: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[2].id,
      claimant_id: ben1,
      portions_claimed: 2,
      qr_token: randomToken(),
      is_collected: true,
      collected_at: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[6].id,
      claimant_id: ben2,
      portions_claimed: 15,
      qr_token: randomToken(),
      is_collected: true,
      collected_at: new Date(now.getTime() - 50 * 60 * 1000).toISOString(),
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[7].id,
      claimant_id: ben3,
      portions_claimed: 10,
      qr_token: randomToken(),
      is_collected: true,
      collected_at: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[8].id,
      claimant_id: ben4,
      portions_claimed: 8,
      qr_token: randomToken(),
      is_collected: true,
      collected_at: new Date(now.getTime() - 35 * 60 * 1000).toISOString(),
      meal_date: todayStr,
      meal_window: "lunch",
    },
    {
      listing_id: createdListings[9].id, // fully claimed
      claimant_id: ben2,
      portions_claimed: 30,
      qr_token: randomToken(),
      is_collected: true,
      collected_at: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      meal_date: todayStr,
      meal_window: "lunch",
    },
  ];

  const createdClaims = [];
  for (const c of claimsData) {
    const { data, error } = await admin.from("food_claims").insert(c).select().single();
    if (error) {
      console.error("Error inserting claim:", error);
    } else {
      createdClaims.push(data);
      console.log(`✓ Claim ID: ${data.id.slice(0, 8)} | Token: ${data.qr_token} | Porsi: ${data.portions_claimed} | Status: ${data.is_collected ? "Selesai Serah Terima" : "Menunggu Pickup"}`);
    }
  }

  // 4. WASTE BATCHES (10 Realistic Waste Batches)
  console.log("\n4. Seeding 10 realistic waste batches...");
  await admin.from("waste_batches").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const wasteBatchesData = [
    // 5 collected batches
    {
      donor_id: donor1,
      processor_id: proc1,
      image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=700&q=80",
      target_category: "bsf_maggot",
      weight_kg: 35.5,
      rate_per_kg: 600,
      is_collected: true,
      collected_at: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      paid_at: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      qr_handover_token: randomToken(),
      subsidy_amount: 12000,
      donor_charge: 9300,
      processor_credit: 21300,
    },
    {
      donor_id: donor2,
      processor_id: proc1,
      image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=80",
      target_category: "bsf_maggot",
      weight_kg: 52.0,
      rate_per_kg: 600,
      is_collected: true,
      collected_at: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
      paid_at: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
      qr_handover_token: randomToken(),
      subsidy_amount: 12000,
      donor_charge: 19200,
      processor_credit: 31200,
    },
    {
      donor_id: donor3,
      processor_id: proc2,
      image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80",
      target_category: "compost_biogas",
      weight_kg: 40.0,
      rate_per_kg: 600,
      is_collected: true,
      collected_at: new Date(now.getTime() - 5 * 3600 * 1000).toISOString(),
      paid_at: new Date(now.getTime() - 5 * 3600 * 1000).toISOString(),
      qr_handover_token: randomToken(),
      subsidy_amount: 12000,
      donor_charge: 12000,
      processor_credit: 24000,
    },
    {
      donor_id: donor4,
      processor_id: proc1,
      image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=700&q=80",
      target_category: "poultry_fish",
      weight_kg: 22.5,
      rate_per_kg: 600,
      is_collected: true,
      collected_at: new Date(now.getTime() - 8 * 3600 * 1000).toISOString(),
      paid_at: new Date(now.getTime() - 8 * 3600 * 1000).toISOString(),
      qr_handover_token: randomToken(),
      subsidy_amount: 12000,
      donor_charge: 1500,
      processor_credit: 13500,
    },
    {
      donor_id: donor1,
      processor_id: proc2,
      image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=80",
      target_category: "compost_biogas",
      weight_kg: 65.0,
      rate_per_kg: 600,
      is_collected: true,
      collected_at: new Date(now.getTime() - 10 * 3600 * 1000).toISOString(),
      paid_at: new Date(now.getTime() - 10 * 3600 * 1000).toISOString(),
      qr_handover_token: randomToken(),
      subsidy_amount: 0,
      donor_charge: 39000,
      processor_credit: 39000,
    },

    // 5 active/pending batches waiting for collection
    {
      donor_id: donor1,
      processor_id: null,
      image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=700&q=80",
      target_category: "bsf_maggot",
      weight_kg: 28.5,
      rate_per_kg: 600,
      is_collected: false,
      collected_at: null,
      paid_at: null,
      qr_handover_token: "waste" + randomToken().slice(5),
    },
    {
      donor_id: donor2,
      processor_id: null,
      image_url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=80",
      target_category: "bsf_maggot",
      weight_kg: 45.0,
      rate_per_kg: 600,
      is_collected: false,
      collected_at: null,
      paid_at: null,
      qr_handover_token: "waste" + randomToken().slice(5),
    },
    {
      donor_id: donor3,
      processor_id: null,
      image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80",
      target_category: "poultry_fish",
      weight_kg: 18.0,
      rate_per_kg: 600,
      is_collected: false,
      collected_at: null,
      paid_at: null,
      qr_handover_token: "waste" + randomToken().slice(5),
    },
    {
      donor_id: donor4,
      processor_id: null,
      image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=700&q=80",
      target_category: "bsf_maggot",
      weight_kg: 32.0,
      rate_per_kg: 600,
      is_collected: false,
      collected_at: null,
      paid_at: null,
      qr_handover_token: "waste" + randomToken().slice(5),
    },
    {
      donor_id: donor1,
      processor_id: null,
      image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&q=80",
      target_category: "compost_biogas",
      weight_kg: 50.0,
      rate_per_kg: 600,
      is_collected: false,
      collected_at: null,
      paid_at: null,
      qr_handover_token: "waste" + randomToken().slice(5),
    },
  ];

  const createdBatches = [];
  for (const b of wasteBatchesData) {
    const { data, error } = await admin.from("waste_batches").insert(b).select().single();
    if (error) {
      console.error("Error inserting waste batch:", error);
    } else {
      createdBatches.push(data);
      console.log(`✓ Batch ID: ${data.id.slice(0, 8)} | ${data.target_category} | ${data.weight_kg} kg | ${data.is_collected ? "Sudah Diangkut" : "Menunggu Armada"}`);
    }
  }

  // 5. FINANCIAL TRANSACTIONS (10 Realistic Ledger Entries)
  console.log("\n5. Seeding 10 realistic financial ledger records...");
  await admin.from("financial_transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const txData = [
    {
      user_id: donor1,
      waste_batch_id: null,
      amount: 200000,
      type: "prepaid_deposit",
      description: "Top-up saldo deposit dompet sirkular via BCA Virtual Account",
    },
    {
      user_id: donor1,
      waste_batch_id: createdBatches[0].id,
      amount: -9300,
      type: "prepaid_deposit",
      description: "Pembayaran pengolahan limbah organik 35.5 kg (setelah subsidi Rp12.000)",
    },
    {
      user_id: proc1,
      waste_batch_id: createdBatches[0].id,
      amount: 21300,
      type: "prepaid_deposit",
      description: "Insentif biokonversi BSF maggot batch 35.5 kg @ Rp600/kg",
    },
    {
      user_id: donor2,
      waste_batch_id: null,
      amount: 300000,
      type: "prepaid_deposit",
      description: "Top-up saldo deposit katering hotel korporat",
    },
    {
      user_id: donor2,
      waste_batch_id: createdBatches[1].id,
      amount: -19200,
      type: "prepaid_deposit",
      description: "Biaya penjemputan limbah 52.0 kg sisa buffet sarapan",
    },
    {
      user_id: proc1,
      waste_batch_id: createdBatches[1].id,
      amount: 31200,
      type: "prepaid_deposit",
      description: "Kredit insentif processor armada BSF 52.0 kg",
    },
    {
      user_id: donor3,
      waste_batch_id: createdBatches[2].id,
      amount: -12000,
      type: "prepaid_deposit",
      description: "Biaya biokonversi kompos limbah dapur 40.0 kg",
    },
    {
      user_id: proc2,
      waste_batch_id: createdBatches[2].id,
      amount: 24000,
      type: "prepaid_deposit",
      description: "Penerimaan insentif pengolah kompos organik 40.0 kg",
    },
    {
      user_id: donor4,
      waste_batch_id: createdBatches[3].id,
      amount: -1500,
      type: "prepaid_deposit",
      description: "Biaya limbah pastry 22.5 kg pakan unggas",
    },
    {
      user_id: proc1,
      waste_batch_id: createdBatches[3].id,
      amount: 13500,
      type: "prepaid_deposit",
      description: "Insentif penerimaan limbah roti pakan ikan/unggas 22.5 kg",
    },
  ];

  for (const t of txData) {
    const { data, error } = await admin.from("financial_transactions").insert(t).select().single();
    if (error) {
      console.error("Error inserting transaction:", error);
    } else {
      console.log(`✓ Ledger: ${t.amount > 0 ? "+" : ""}${t.amount} IDR | ${t.description.slice(0, 45)}...`);
    }
  }

  // 6. STRIKE DISPUTES (2 Realistic Records)
  console.log("\n6. Seeding dispute escalation records...");
  await admin.from("strike_disputes").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const disputes = [
    {
      donor_id: donor3,
      listing_id: createdListings[3].id,
      reported_by: ben1,
      reason: "Kemasan tertekan saat transit pengiriman, aroma saus terdeteksi agak asam.",
      donor_evidence_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      donor_statement: "Telah diperiksa log suhu chiller 4°C katering saat pengemasan.",
      is_resolved: true,
      penalty_applied: false,
    },
    {
      donor_id: donor1,
      listing_id: createdListings[6].id,
      reported_by: ben2,
      reason: "Waktu penjemputan tertunda 15 menit melewati safe until, meminta konfirmasi kelayakan.",
      donor_evidence_url: null,
      donor_statement: null,
      is_resolved: false,
      penalty_applied: false,
    },
  ];

  for (const d of disputes) {
    const { data, error } = await admin.from("strike_disputes").insert(d).select().single();
    if (error) {
      console.error("Error inserting dispute:", error);
    } else {
      console.log(`✓ Dispute ID: ${data.id.slice(0, 8)} | Resolved: ${data.is_resolved}`);
    }
  }

  console.log("\n=== SEEDING SELESAI! SEMUA TABEL BERISI 10 DATA REALISTIS ===");
}

seed().catch((err) => {
  console.error("Fatal Seeding Error:", err);
  process.exit(1);
});
