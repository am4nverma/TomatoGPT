
import { RESTAURANTS } from "../lib/data";

const query = "italian";
const q = query.toLowerCase();

const results = RESTAURANTS.filter(
    (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
        r.menu.some((m) => m.name.toLowerCase().includes(q))
);

console.log(`Query: "${query}"`);
console.log(`Found ${results.length} results:`);
results.forEach(r => console.log(`- ${r.name} (${r.cuisine.join(", ")})`));

if (results.length === 0) {
    console.error("FAIL: No results found for 'italian'!");
    process.exit(1);
} else {
    console.log("SUCCESS: Logic works.");
}
