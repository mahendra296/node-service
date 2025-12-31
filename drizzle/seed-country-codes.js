import { db } from "../config/db.js";
import { countryCodesTable } from "./schema.js";

const countryCodes = [
  { code: "+1", country: "United States", shortName: "US" },
  { code: "+1", country: "Canada", shortName: "CA" },
  { code: "+44", country: "United Kingdom", shortName: "UK" },
  { code: "+91", country: "India", shortName: "IN" },
  { code: "+61", country: "Australia", shortName: "AU" },
  { code: "+49", country: "Germany", shortName: "DE" },
  { code: "+33", country: "France", shortName: "FR" },
  { code: "+81", country: "Japan", shortName: "JP" },
  { code: "+86", country: "China", shortName: "CN" },
  { code: "+55", country: "Brazil", shortName: "BR" },
  { code: "+52", country: "Mexico", shortName: "MX" },
  { code: "+39", country: "Italy", shortName: "IT" },
  { code: "+34", country: "Spain", shortName: "ES" },
  { code: "+31", country: "Netherlands", shortName: "NL" },
  { code: "+46", country: "Sweden", shortName: "SE" },
  { code: "+47", country: "Norway", shortName: "NO" },
  { code: "+45", country: "Denmark", shortName: "DK" },
  { code: "+358", country: "Finland", shortName: "FI" },
  { code: "+48", country: "Poland", shortName: "PL" },
  { code: "+43", country: "Austria", shortName: "AT" },
  { code: "+41", country: "Switzerland", shortName: "CH" },
  { code: "+32", country: "Belgium", shortName: "BE" },
  { code: "+351", country: "Portugal", shortName: "PT" },
  { code: "+353", country: "Ireland", shortName: "IE" },
  { code: "+64", country: "New Zealand", shortName: "NZ" },
  { code: "+65", country: "Singapore", shortName: "SG" },
  { code: "+852", country: "Hong Kong", shortName: "HK" },
  { code: "+82", country: "South Korea", shortName: "KR" },
  { code: "+66", country: "Thailand", shortName: "TH" },
  { code: "+60", country: "Malaysia", shortName: "MY" },
  { code: "+63", country: "Philippines", shortName: "PH" },
  { code: "+62", country: "Indonesia", shortName: "ID" },
  { code: "+84", country: "Vietnam", shortName: "VN" },
  { code: "+971", country: "United Arab Emirates", shortName: "AE" },
  { code: "+966", country: "Saudi Arabia", shortName: "SA" },
  { code: "+972", country: "Israel", shortName: "IL" },
  { code: "+90", country: "Turkey", shortName: "TR" },
  { code: "+7", country: "Russia", shortName: "RU" },
  { code: "+380", country: "Ukraine", shortName: "UA" },
  { code: "+27", country: "South Africa", shortName: "ZA" },
  { code: "+20", country: "Egypt", shortName: "EG" },
  { code: "+234", country: "Nigeria", shortName: "NG" },
  { code: "+254", country: "Kenya", shortName: "KE" },
  { code: "+92", country: "Pakistan", shortName: "PK" },
  { code: "+880", country: "Bangladesh", shortName: "BD" },
  { code: "+94", country: "Sri Lanka", shortName: "LK" },
  { code: "+977", country: "Nepal", shortName: "NP" },
  { code: "+54", country: "Argentina", shortName: "AR" },
  { code: "+56", country: "Chile", shortName: "CL" },
  { code: "+57", country: "Colombia", shortName: "CO" },
];

async function seedCountryCodes() {
  try {
    console.log("Seeding country codes...");

    for (const country of countryCodes) {
      try {
        await db.insert(countryCodesTable).values(country);
        console.log(`Added: ${country.code} - ${country.country}`);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(`Skipped (duplicate): ${country.code} - ${country.country}`);
        } else {
          throw error;
        }
      }
    }

    console.log("Country codes seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding country codes:", error);
    process.exit(1);
  }
}

seedCountryCodes();
