/**
 * Family Hub Card — Meals room data layer (v0.8.0)
 *
 * Ported from the Claude Design prototype's meal-data.js + mp-shared.jsx helpers.
 * This is the STATIC reference library (meals, sides, proteins, ingredients,
 * themes, rotations) + pure helpers. The mutable family state (plan, rhythm,
 * favs, custom, recipes, pantry, groceries) does NOT live here — it comes from
 * the backend via card._attrs("sensor.family_hub_meals") and is mutated through
 * the meals_* HA services.
 *
 * The card resolves everything library-related here (names, glyphs, variant
 * strings, ingredient folding) and passes already-resolved fields to the
 * services, so the backend stays dumb about the library.
 *
 * Recipe Ideas (rankIdeas / fetchRecipeIdeas) is the SWAPPABLE SEAM: in
 * production it should be backed by Spoonacular's search-by-ingredients endpoint
 * called through a Home Assistant REST sensor/script (API key stays in HA).
 * Keep the return shape identical and nothing in the UI changes.
 */

// ---- MyPlate food groups (dinner plate dots) ----
// icon: shape-based food-group cue (colorblind-safe — distinguishes by glyph,
// not hue). color is kept as a secondary accent only.
export const GROUPS = {
    protein: { label: "Protein", color: "#8B3A2A", icon: "🍗" },
    veg:     { label: "Veggies", color: "#3A6A28", icon: "🥦" },
    grain:   { label: "Grains",  color: "#B07818", icon: "🌾" },
    fruit:   { label: "Fruit",   color: "#A02828", icon: "🍎" },
    dairy:   { label: "Dairy",   color: "#5D7A8C", icon: "🥛" },
};
export const GROUP_ORDER = ["protein", "veg", "grain", "fruit", "dairy"];

// ---- Protein categories + cuts (guided dinner builder) ----
export const PROTEINS = {
    beef:     { label: "Beef",     glyph: "🥩", cuts: [
        { id: "ground",  label: "Ground beef" },
        { id: "steak",   label: "Steak" },
        { id: "roast",   label: "Roast & stew meat" },
        { id: "brisket", label: "Brisket" },
    ]},
    chicken:  { label: "Chicken",  glyph: "🍗", cuts: [
        { id: "breasts", label: "Breasts" },
        { id: "thighs",  label: "Thighs" },
        { id: "whole",   label: "Whole bird" },
    ]},
    pork:     { label: "Pork",     glyph: "🥓", cuts: [
        { id: "chops",  label: "Chops" },
        { id: "pulled", label: "Shoulder / pulled" },
        { id: "bacon",  label: "Bacon & sausage" },
    ]},
    turkey:   { label: "Turkey",   glyph: "🦃", cuts: [
        { id: "ground", label: "Ground turkey" },
        { id: "deli",   label: "Deli sliced" },
    ]},
    meatless: { label: "Meatless", glyph: "🫘", cuts: [
        { id: "eggs",        label: "Eggs" },
        { id: "beans",       label: "Beans & lentils" },
        { id: "cheesepasta", label: "Pasta & cheese" },
    ]},
};
export const PROTEIN_ORDER = ["beef", "chicken", "pork", "turkey", "meatless"];

// ---- Pantry ingredients (chips + grocery aisles) ----
export const AISLES = { produce: "Produce", meat: "Meat & Seafood", dairy: "Dairy & Eggs", bakery: "Bakery", pantry: "Pantry" };
export const INGREDIENTS = [
    { id: "chicken",   label: "Chicken",      glyph: "🍗", aisle: "meat",    cat: "protein" },
    { id: "gbeef",     label: "Ground beef",  glyph: "🥩", aisle: "meat",    cat: "protein" },
    { id: "pork",      label: "Pork",         glyph: "🥓", aisle: "meat",    cat: "protein" },
    { id: "turkey",    label: "Turkey",       glyph: "🦃", aisle: "meat",    cat: "protein" },
    { id: "eggs",      label: "Eggs",         glyph: "🥚", aisle: "dairy",   cat: "protein" },
    { id: "beans",     label: "Beans",        glyph: "🫘", aisle: "pantry",  cat: "protein" },
    { id: "potatoes",  label: "Potatoes",     glyph: "🥔", aisle: "produce", cat: "veg" },
    { id: "greens",    label: "Salad greens", glyph: "🥬", aisle: "produce", cat: "veg" },
    { id: "broccoli",  label: "Broccoli",     glyph: "🥦", aisle: "produce", cat: "veg" },
    { id: "tomatoes",  label: "Tomatoes",     glyph: "🍅", aisle: "produce", cat: "veg" },
    { id: "carrots",   label: "Carrots",      glyph: "🥕", aisle: "produce", cat: "veg" },
    { id: "corn",      label: "Corn",         glyph: "🌽", aisle: "produce", cat: "veg" },
    { id: "onions",    label: "Onions",       glyph: "🧅", aisle: "produce", cat: "veg" },
    { id: "fruit",     label: "Fruit",        glyph: "🍎", aisle: "produce", cat: "fruit" },
    { id: "tortillas", label: "Tortillas",    glyph: "🫓", aisle: "bakery",  cat: "grain", whole: true },
    { id: "bread",     label: "Bread",        glyph: "🍞", aisle: "bakery",  cat: "grain", whole: true },
    { id: "pasta",     label: "Pasta",        glyph: "🍝", aisle: "pantry",  cat: "grain", whole: true },
    { id: "rice",      label: "Rice",         glyph: "🍚", aisle: "pantry",  cat: "grain", whole: true },
    { id: "cheese",    label: "Cheese",       glyph: "🧀", aisle: "dairy",   cat: "dairy" },
    { id: "milk",      label: "Milk",         glyph: "🥛", aisle: "dairy",   cat: "dairy" },
];
export const ING_SECTIONS = [
    ["protein", "Proteins"],
    ["veg", "Veggies"],
    ["fruit", "Fruit"],
    ["grain", "Grains & starches"],
    ["dairy", "Dairy"],
];

// ---- Side dishes (round out the dinner plate). pairs = protein cats it suits ----
export const SIDES = [
    { id: "side-salad",   name: "Garden Salad",     glyph: "🥗", groups: ["veg"],     ing: ["greens", "tomatoes"],  pairs: ["beef", "meatless", "chicken"] },
    { id: "broc-side",    name: "Roasted Broccoli", glyph: "🥦", groups: ["veg"],     ing: ["broccoli"],            pairs: ["chicken", "beef"] },
    { id: "green-beans",  name: "Green Beans",      glyph: "🫛", groups: ["veg"],     ing: [],                      pairs: ["chicken", "pork", "beef"] },
    { id: "corn-cob",     name: "Corn on the Cob",  glyph: "🌽", groups: ["veg"],     ing: ["corn"],                pairs: ["beef", "chicken", "pork", "turkey"] },
    { id: "carrots-side", name: "Glazed Carrots",   glyph: "🥕", groups: ["veg"],     ing: ["carrots"],             pairs: ["chicken", "pork"] },
    { id: "mashed",       name: "Mashed Potatoes",  glyph: "🥔", groups: ["veg"],     ing: ["potatoes", "milk"],    pairs: ["beef", "chicken", "pork", "turkey"] },
    { id: "fries",        name: "Oven Fries",       glyph: "🍟", groups: ["veg"],     ing: ["potatoes"],            pairs: ["beef", "turkey"] },
    { id: "coleslaw",     name: "Coleslaw",         glyph: "🥬", groups: ["veg"],     ing: ["greens", "carrots"],   pairs: ["pork", "turkey"] },
    { id: "rice-side",    name: "Steamed Rice",     glyph: "🍚", groups: ["grain"],   ing: ["rice"],                pairs: ["chicken", "meatless"] },
    { id: "garlic-bread", name: "Garlic Bread",     glyph: "🥖", groups: ["grain"],   ing: ["bread"],               pairs: ["meatless", "beef"] },
    { id: "cornbread",    name: "Cornbread",        glyph: "🫓", groups: ["grain"],   ing: [],                      pairs: ["beef", "pork"] },
    { id: "beans-side",   name: "Refried Beans",    glyph: "🫘", groups: ["protein"], ing: ["beans"],               pairs: ["beef", "chicken", "meatless"] },
    { id: "fruit-salad",  name: "Fruit Salad",      glyph: "🍓", groups: ["fruit"],   ing: ["fruit"],               pairs: ["turkey", "chicken", "meatless"] },
    { id: "apple-slices", name: "Apple Slices",     glyph: "🍎", groups: ["fruit"],   ing: ["fruit"],               pairs: ["pork", "meatless"] },
    { id: "milk-glass",   name: "Milk",             glyph: "🥛", groups: ["dairy"],   ing: ["milk"],                pairs: [] },
    { id: "yogurt-cup",   name: "Yogurt Cups",      glyph: "🍨", groups: ["dairy"],   ing: ["milk"],                pairs: [] },
    // --- more veggies ---
    { id: "roasted-veg",  name: "Roasted Veggies",  glyph: "🫑", groups: ["veg"],     ing: ["onions", "carrots"],   pairs: ["beef", "chicken", "pork"] },
    { id: "baked-potato", name: "Baked Potato",     glyph: "🥔", groups: ["veg"],     ing: ["potatoes"],            pairs: ["beef", "chicken"] },
    { id: "sweet-potato", name: "Baked Sweet Potato", glyph: "🍠", groups: ["veg"],   ing: [],                      pairs: ["pork", "turkey", "chicken"] },
    { id: "asparagus",    name: "Roasted Asparagus", glyph: "🌿", groups: ["veg"],    ing: [],                      pairs: ["chicken", "beef"] },
    { id: "peas",         name: "Buttered Peas",    glyph: "🟢", groups: ["veg"],     ing: [],                      pairs: ["chicken", "turkey", "beef"] },
    { id: "brussels",     name: "Brussels Sprouts", glyph: "🥬", groups: ["veg"],     ing: [],                      pairs: ["pork", "beef", "chicken"] },
    // --- more grains ---
    { id: "dinner-rolls", name: "Dinner Rolls",     glyph: "🥐", groups: ["grain"],   ing: ["bread"],               pairs: ["beef", "chicken", "turkey"] },
    { id: "buttered-noodles", name: "Buttered Noodles", glyph: "🍝", groups: ["grain"], ing: ["pasta"],            pairs: ["beef", "chicken"] },
    { id: "biscuits",     name: "Biscuits",         glyph: "🫓", groups: ["grain"],   ing: [],                      pairs: ["pork", "chicken"] },
    { id: "quinoa",       name: "Quinoa",           glyph: "🍚", groups: ["grain"],   ing: [],                      pairs: ["chicken", "meatless"] },
    // --- more fruit ---
    { id: "grapes",       name: "Grapes",           glyph: "🍇", groups: ["fruit"],   ing: ["fruit"],               pairs: ["turkey", "chicken", "meatless"] },
    { id: "orange-slices", name: "Orange Slices",   glyph: "🍊", groups: ["fruit"],   ing: ["fruit"],               pairs: ["pork", "chicken"] },
    { id: "berries",      name: "Mixed Berries",    glyph: "🫐", groups: ["fruit"],   ing: ["fruit"],               pairs: ["chicken", "meatless"] },
    { id: "watermelon",   name: "Melon Wedges",     glyph: "🍉", groups: ["fruit"],   ing: [],                      pairs: ["turkey", "meatless"] },
    // --- more dairy ---
    { id: "cheese-cubes", name: "Cheese Cubes",     glyph: "🧀", groups: ["dairy"],   ing: ["cheese"],              pairs: [] },
    { id: "cottage-cheese", name: "Cottage Cheese", glyph: "🥣", groups: ["dairy"],   ing: ["milk"],                pairs: [] },
    // --- more protein sides ---
    { id: "eggs-side",    name: "Hard-Boiled Eggs", glyph: "🥚", groups: ["protein"], ing: ["eggs"],                pairs: ["meatless"] },
    { id: "edamame",      name: "Edamame",          glyph: "🫛", groups: ["protein"], ing: [],                      pairs: ["chicken", "meatless"] },
    { id: "hummus",       name: "Hummus & Veggies", glyph: "🧆", groups: ["protein", "veg"], ing: ["beans", "carrots"], pairs: ["meatless", "chicken"] },
];

// ---- Meal library (family staples) ----
export const MEALS = [
    // Breakfast
    { id: "eggs-toast",     name: "Scrambled Eggs & Toast", glyph: "🍳", types: ["b"], groups: ["protein", "grain"],          ing: ["eggs", "bread"],                fav: true  },
    { id: "oatmeal",        name: "Oatmeal & Berries",      glyph: "🥣", types: ["b"], groups: ["grain", "fruit"],            ing: ["fruit"],                        fav: true  },
    { id: "pancakes",       name: "Pancake Morning",        glyph: "🥞", types: ["b"], groups: ["grain"],                     ing: ["eggs", "milk"],                 fav: false },
    { id: "yogurt",         name: "Yogurt & Granola",       glyph: "🫐", types: ["b"], groups: ["dairy", "grain", "fruit"],   ing: ["milk", "fruit"],                fav: false },
    { id: "bfast-burritos", name: "Breakfast Burritos",     glyph: "🌯", types: ["b"], groups: ["protein", "grain", "dairy"], ing: ["eggs", "tortillas", "cheese"],  fav: false },
    { id: "smoothies",      name: "Fruit Smoothies",        glyph: "🥤", types: ["b"], groups: ["fruit", "dairy"],            ing: ["fruit", "milk"],                fav: false },
    { id: "french-toast",   name: "French Toast",           glyph: "🍞", types: ["b"], groups: ["grain", "dairy"],            ing: ["bread", "eggs", "milk"],        fav: false },
    { id: "cereal",         name: "Cereal & Fruit",         glyph: "🥛", types: ["b"], groups: ["grain", "dairy", "fruit"],   ing: ["milk", "fruit"],                fav: false },
    // Lunch
    { id: "turkey-sand",    name: "Turkey Sandwiches",      glyph: "🥪", types: ["l"], groups: ["protein", "grain", "veg"],   ing: ["turkey", "bread", "cheese", "greens"], fav: true,  protein: "turkey", cut: "deli" },
    { id: "grilled-cheese", name: "Grilled Cheese & Soup",  glyph: "🧀", types: ["l"], groups: ["grain", "dairy", "veg"],     ing: ["bread", "cheese", "tomatoes"],  fav: false, protein: "meatless", cut: "cheesepasta" },
    { id: "quesadillas",    name: "Cheese Quesadillas",     glyph: "🫓", types: ["l"], groups: ["grain", "dairy"],            ing: ["tortillas", "cheese"],          fav: true,  protein: "meatless", cut: "cheesepasta" },
    { id: "caesar-wrap",    name: "Chicken Caesar Wraps",   glyph: "🌯", types: ["l"], groups: ["protein", "veg", "grain"],   ing: ["chicken", "tortillas", "greens"], fav: false, protein: "chicken", cut: "breasts" },
    { id: "pbj",            name: "PB&J + Apple Slices",    glyph: "🥜", types: ["l"], groups: ["grain", "fruit"],            ing: ["bread", "fruit"],               fav: false },
    { id: "mac-cheese",     name: "Mac & Cheese",           glyph: "🥘", types: ["l"], groups: ["grain", "dairy"],            ing: ["pasta", "cheese", "milk"],      fav: false, protein: "meatless", cut: "cheesepasta" },
    { id: "soup-bread",     name: "Soup & Crusty Bread",    glyph: "🍲", types: ["l"], groups: ["veg", "grain"],              ing: ["tomatoes", "bread", "onions"],  fav: false },
    { id: "snack-plate",    name: "Picnic Snack Plate",     glyph: "🧺", types: ["l"], groups: ["veg", "dairy", "grain", "fruit"], ing: ["cheese", "greens", "fruit", "bread"], fav: false },
    // Dinner — beef
    { id: "spaghetti",   name: "Spaghetti & Meatballs", glyph: "🍝", types: ["d"], groups: ["protein", "grain"],                 ing: ["pasta", "gbeef", "tomatoes", "onions"], fav: true, protein: "beef", cut: "ground", sides: ["side-salad", "garlic-bread"] },
    { id: "taco-night",  name: "Taco Night",            glyph: "🌮", types: ["d"], groups: ["protein", "grain", "veg", "dairy"], ing: ["tortillas", "cheese", "tomatoes", "greens"], fav: true, protein: "beef", cut: "ground", sides: ["corn-cob"],
        proteinPick: ["beef", "chicken", "pork"], proteinIng: { beef: "gbeef", chicken: "chicken", pork: "pork" }, defaultPick: "beef",
        recipe: { time: "30 min", serves: 5, ingredients: ["2 lb of your protein (beef, chicken, or pork)", "10 taco shells or tortillas", "Shredded cheese", "Lettuce, tomato, salsa", "Taco seasoning"], steps: ["Cook your protein, drain, add seasoning + ½ cup water.", "Simmer 5 min while you chop toppings.", "Warm shells in the oven, 5 min at 325°.", "Set out everything build-your-own style."] } },
    { id: "meatloaf",    name: "Meatloaf",              glyph: "🧆", types: ["d"], groups: ["protein", "grain"],                 ing: ["gbeef", "bread", "onions"],     fav: false, protein: "beef", cut: "ground", sides: ["mashed", "green-beans"] },
    { id: "burgers",     name: "Burger Night",          glyph: "🍔", types: ["d"], groups: ["protein", "grain"],                 ing: ["gbeef", "bread", "cheese", "tomatoes", "onions"], fav: false, protein: "beef", cut: "ground", sides: ["fries", "corn-cob"] },
    { id: "chili",       name: "Slow-Cooker Chili",     glyph: "🌶️", types: ["d"], groups: ["protein", "veg"],                  ing: ["gbeef", "beans", "tomatoes", "onions"], fav: false, protein: "beef", cut: "ground", sides: ["cornbread"],
        recipe: { time: "15 min + 6 hr slow cook", serves: 5, ingredients: ["2 lb ground beef", "2 cans beans", "1 can crushed tomatoes", "Onion, chili powder, cumin"], steps: ["Brown beef with onion, drain.", "Everything into the slow cooker.", "Low 6 hours. Stir when you walk past.", "Cheese + cornbread on the side."] } },
    { id: "shepherds",   name: "Shepherd's Pie",        glyph: "🥧", types: ["d"], groups: ["protein", "veg"],                   ing: ["gbeef", "potatoes", "carrots", "onions"], fav: false, protein: "beef", cut: "ground", sides: ["green-beans"],
        recipe: { time: "50 min", serves: 5, ingredients: ["2 lb ground beef", "4 cups mashed potatoes", "Frozen peas + carrots", "Onion, broth, Worcestershire"], steps: ["Brown beef + onion, add veg and a splash of broth.", "Into a baking dish, mash on top.", "Bake 25 min at 400° until golden.", "Rest 5 min before scooping."] } },
    { id: "steak-night", name: "Steak Night",           glyph: "🥩", types: ["d"], groups: ["protein"],                          ing: ["potatoes"],                     fav: false, protein: "beef", cut: "steak", sides: ["mashed", "side-salad"] },
    { id: "beef-stew",   name: "Beef Stew",             glyph: "🍖", types: ["d"], groups: ["protein", "veg"],                   ing: ["potatoes", "carrots", "onions"], fav: false, protein: "beef", cut: "roast", sides: ["garlic-bread"] },
    { id: "brisket",     name: "Slow-Smoked Brisket",   glyph: "🥩", types: ["d"], groups: ["protein"],                          ing: ["gbeef", "onions"],              fav: false, protein: "beef", cut: "brisket", sides: ["cornbread", "coleslaw"],
        recipe: { time: "20 min + 6 hr low", serves: 5, ingredients: ["3–4 lb beef brisket", "Dry rub (salt, pepper, paprika, garlic)", "Onions", "BBQ sauce to finish"], steps: ["Rub the brisket well, let it sit while the oven heats to 300°.", "Bed of onions in the pan, brisket on top, cover tight.", "Low and slow ~6 hours until it pulls apart.", "Rest 20 min, slice against the grain."] } },
    // Dinner — chicken
    { id: "grilled-chx", name: "Grilled Chicken & Veg", glyph: "🍗", types: ["d"], groups: ["protein"],                          ing: ["chicken", "broccoli"],          fav: true,  protein: "chicken", cut: "breasts", sides: ["broc-side", "rice-side"] },
    { id: "fajitas",     name: "Chicken Fajitas",       glyph: "🫑", types: ["d"], groups: ["protein", "veg", "grain"],          ing: ["chicken", "tortillas", "onions"], fav: false, protein: "chicken", cut: "breasts", sides: ["beans-side"] },
    { id: "chx-soup",    name: "Chicken Noodle Soup",   glyph: "🍜", types: ["l", "d"], groups: ["protein", "grain", "veg"],     ing: ["chicken", "pasta", "carrots", "onions"], fav: false, protein: "chicken", cut: "breasts", sides: ["garlic-bread"] },
    { id: "stirfry",     name: "Chicken Stir-Fry",      glyph: "🥢", types: ["d"], groups: ["protein", "veg"],                   ing: ["chicken", "rice", "broccoli", "carrots"], fav: true, protein: "chicken", cut: "thighs", sides: ["rice-side"],
        recipe: { time: "25 min", serves: 5, ingredients: ["2 lb chicken thighs, sliced", "Broccoli, carrots, whatever veg is around", "Soy sauce, garlic, ginger", "Rice for the table"], steps: ["Start the rice first.", "Sear chicken hot and fast, set aside.", "Stir-fry veg 3–4 min, return chicken.", "Sauce in, toss 1 min, serve over rice."] } },
    { id: "roast-chx",   name: "Roast Chicken Dinner",  glyph: "🐔", types: ["d"], groups: ["protein"],                          ing: ["chicken", "potatoes", "carrots"], fav: false, protein: "chicken", cut: "whole", sides: ["mashed", "carrots-side"] },
    // Dinner — pork
    { id: "porkchops",   name: "Pork Chops & Apples",   glyph: "🥓", types: ["d"], groups: ["protein", "fruit"],                 ing: ["pork", "potatoes", "fruit"],    fav: false, protein: "pork", cut: "chops", sides: ["mashed", "green-beans"] },
    { id: "pulled-pork", name: "Pulled Pork Sandwiches", glyph: "🥪", types: ["d"], groups: ["protein", "grain"],                ing: ["pork", "bread"],                fav: false, protein: "pork", cut: "pulled", sides: ["coleslaw", "fries"] },
    // Dinner — turkey
    { id: "turkey-burgers", name: "Turkey Burgers",     glyph: "🍔", types: ["d"], groups: ["protein", "grain", "veg"],          ing: ["turkey", "bread", "greens", "tomatoes"], fav: false, protein: "turkey", cut: "ground", sides: ["fries", "side-salad"] },
    // Dinner — meatless
    { id: "brinner",     name: "Breakfast for Dinner",  glyph: "🍳", types: ["d"], groups: ["protein", "grain"],                 ing: ["eggs", "bread"],                fav: false, protein: "meatless", cut: "eggs", sides: ["fruit-salad"] },
    { id: "veg-curry",   name: "Veggie Curry & Rice",   glyph: "🍛", types: ["d"], groups: ["veg", "grain"],                     ing: ["rice", "broccoli", "beans", "onions"], fav: false, protein: "meatless", cut: "beans", sides: ["rice-side"],
        recipe: { time: "35 min", serves: 5, ingredients: ["1 can coconut milk", "Curry paste or powder", "Broccoli, carrots, chickpeas", "Rice for the table"], steps: ["Start the rice.", "Soften onion, bloom curry paste 1 min.", "Coconut milk + veg, simmer 15 min.", "Taste, salt, serve over rice."] } },
    { id: "ziti",        name: "Baked Ziti",            glyph: "🍅", types: ["d"], groups: ["grain", "dairy", "protein"],        ing: ["pasta", "cheese", "tomatoes"], fav: false, protein: "meatless", cut: "cheesepasta", sides: ["side-salad", "garlic-bread"] },
    { id: "pizza",       name: "Pizza Night",           glyph: "🍕", types: ["d"], groups: ["grain", "dairy"],                   ing: ["cheese", "tomatoes"],           fav: true,  protein: "meatless", cut: "cheesepasta", sides: ["side-salad"], rotates: true },
    // Quick options
    { id: "leftovers",   name: "Leftovers",             glyph: "🥡", types: ["b", "l", "d"], groups: [], ing: [], fav: false, special: true },
    { id: "eat-out",     name: "Eating Out",            glyph: "🍽️", types: ["l", "d"],     groups: [], ing: [], fav: false, special: true },
];

// ---- Recipe Ideas source (SWAPPABLE SEAM — Spoonacular-via-HA in production) ----
export const IDEAS_POOL = [
    { id: "idea-butter-chx", name: "Butter Chicken",        glyph: "🍛", groups: ["protein", "grain"],         ing: ["chicken", "rice", "onions"],             protein: "chicken",  cut: "thighs",  sides: ["rice-side"],  area: "Indian" },
    { id: "idea-carbonara",  name: "Spaghetti Carbonara",   glyph: "🍝", groups: ["grain", "protein", "dairy"], ing: ["pasta", "eggs", "cheese", "pork"],       protein: "pork",     cut: "bacon",   sides: ["side-salad"], area: "Italian" },
    { id: "idea-greek-bowl", name: "Greek Chicken Bowls",   glyph: "🥙", groups: ["protein", "veg", "grain"],   ing: ["chicken", "rice", "tomatoes", "greens"], protein: "chicken",  cut: "breasts", sides: ["side-salad"], area: "Greek" },
    { id: "idea-pork-ramen", name: "Quick Pork Ramen",      glyph: "🍜", groups: ["protein", "grain", "veg"],   ing: ["pork", "pasta", "eggs", "broccoli"],     protein: "pork",     cut: "chops",   sides: [],             area: "Japanese" },
    { id: "idea-chx-curry",  name: "Coconut Chicken Curry", glyph: "🍛", groups: ["protein", "grain", "veg"],   ing: ["chicken", "rice", "carrots", "onions"],  protein: "chicken",  cut: "thighs",  sides: ["rice-side"],  area: "Thai" },
    { id: "idea-beef-bowl",  name: "Korean Beef Bowls",     glyph: "🍲", groups: ["protein", "grain"],          ing: ["gbeef", "rice", "onions"],               protein: "beef",     cut: "ground",  sides: ["broc-side"],  area: "Korean" },
    { id: "idea-turkey-chili", name: "Turkey White Chili",  glyph: "🍲", groups: ["protein", "veg"],            ing: ["turkey", "beans", "onions"],             protein: "turkey",   cut: "ground",  sides: ["cornbread"],  area: "Tex-Mex" },
    { id: "idea-veg-stirfry", name: "Tofu Veggie Stir-Fry", glyph: "🥡", groups: ["veg", "grain"],              ing: ["rice", "broccoli", "carrots", "onions"], protein: "meatless", cut: "beans",   sides: ["rice-side"],  area: "Chinese" },
];

// ---- Healthy fats (informational / affirming only — never a required slot) ----
export const HEALTHY_FAT_INGS  = ["eggs", "cheese", "milk"];
export const HEALTHY_FAT_FOODS = ["olive oil", "avocado", "nuts", "seeds", "eggs", "full-fat dairy", "olives"];

// ---- Rotations + theme nights ----
export const PIZZA_ROTATION = ["Marco's · pepperoni", "Homemade · margherita", "Slice House · supreme"];
export const PASTA_ROTATION = ["spaghetti", "ziti"];
export const THEMES = {
    pizza:     { label: "Pizza Night", glyph: "🍕" },
    leftovers: { label: "Leftovers",   glyph: "🥡" },
    taco:      { label: "Taco Night",  glyph: "🌮" },
    pasta:     { label: "Pasta Night", glyph: "🍝" },
};

// ---- Date helpers (local time; plan keys 'YYYY-MM-DD'; 0=Sunday) ----
export const DOW       = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MON       = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const HORIZON_DAYS = 30;

export function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
export function parseISO(s) { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
export function addDays(d, n) { const c = new Date(d.getFullYear(), d.getMonth(), d.getDate()); c.setDate(c.getDate() + n); return c; }
export function today() { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
export function startOfWeek(d, ws) { return addDays(d, -((d.getDay() - ws + 7) % 7)); }
export function weekIdx(d) { return Math.floor((d.getTime() / 86400000 + 4) / 7); }

// ---- Library lookups (custom = the family's saved meals from the model) ----
export function allMeals(custom) {
    return custom && custom.length ? MEALS.concat(custom) : MEALS;
}
export function mealById(id, custom) {
    return allMeals(custom).find((m) => m.id === id) || null;
}
export function sideById(id) {
    return SIDES.find((s) => s.id === id) || null;
}
export function getIngredients(customIng) {
    return customIng && customIng.length ? INGREDIENTS.concat(customIng) : INGREDIENTS;
}
export function ingById(id, customIng) {
    return getIngredients(customIng).find((x) => x.id === id) || null;
}
// Recipe for a meal: admin-edited override (from the model) wins, then the built-in card.
export function getRecipe(meal, recipes) {
    return (recipes && meal && recipes[meal.id]) || (meal && meal.recipe) || null;
}

// Resolve a meal's ingredient list, folding in a protein-flexible pick
// (Taco Night with chicken pulls chicken, not beef). Grocery math MUST go here.
export function mealIngredients(meal, dEntry) {
    if (!meal) return [];
    let ings = (meal.ing || []).slice();
    if (meal.proteinPick) {
        const pick = (dEntry && dEntry.protein) || meal.defaultPick;
        const pid = meal.proteinIng[pick];
        if (pid && ings.indexOf(pid) === -1) ings = ings.concat(pid);
    }
    return ings;
}

// Healthy-fat foods a meal already contains (informational/affirming only).
export function mealHealthyFats(meal) {
    if (!meal) return [];
    const map = { eggs: "eggs", cheese: "full-fat dairy", milk: "full-fat dairy" };
    const out = [];
    (meal.ing || []).forEach((i) => { if (map[i] && out.indexOf(map[i]) === -1) out.push(map[i]); });
    return out;
}

// True when a meal's grains are all whole-grain staples.
export function mealWholeGrain(meal, customIng) {
    if (!meal || (meal.groups || []).indexOf("grain") === -1) return false;
    const grainIngs = (meal.ing || []).map((i) => ingById(i, customIng)).filter((x) => x && x.cat === "grain");
    if (!grainIngs.length) return false;
    return grainIngs.every((x) => x.whole);
}

// Union of MyPlate groups covered by a dinner entry (main + sides).
export function dinnerGroups(dEntry, custom) {
    if (!dEntry) return [];
    const set = new Set();
    const main = mealById(dEntry.main, custom);
    if (main) (main.groups || []).forEach((g) => set.add(g));
    (dEntry.sides || []).forEach((sid) => {
        const s = sideById(sid);
        if (s) s.groups.forEach((g) => set.add(g));
    });
    return [...set];
}

export function fmtDayLong(d)  { return `${DOW[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`; }
export function fmtDayShort(d) { return `${DOW_SHORT[d.getDay()]} ${d.getDate()}`; }

// Next date (today..horizon) whose dinner is empty.
export function nextEmptyDinner(plan) {
    const t = today();
    for (let i = 0; i < HORIZON_DAYS; i++) {
        const d = addDays(t, i);
        const e = plan[iso(d)];
        if (!e || !e.d) return d;
    }
    return null;
}

// Variant display string the card sends to meals_set_dinner (backend is library-
// agnostic): pizza-style weekly rotation, or a protein-flexible pick label.
export function variantFor(meal, date, protein) {
    if (!meal) return "";
    if (meal.rotates) return PIZZA_ROTATION[weekIdx(date) % PIZZA_ROTATION.length];
    if (meal.proteinPick && protein) return `with ${PROTEINS[protein].label.toLowerCase()}`;
    return "";
}

// ---- Recipe Ideas seam ----
// Synchronous rank (current data source = the local IDEAS_POOL): returns
// [{ idea, hits }] ranked by how many on-hand ingredients each idea uses.
export function rankIdeas(haveIds) {
    const have = haveIds || [];
    return IDEAS_POOL
        .map((m) => ({ idea: m, hits: m.ing.filter((i) => have.indexOf(i) !== -1) }))
        .sort((a, b) => b.hits.length - a.hits.length);
}
// Promise wrapper — keeps the exact shape the Spoonacular-via-HA layer will
// return, so swapping the source later changes nothing in the UI.
export function fetchRecipeIdeas(haveIds) {
    return Promise.resolve(rankIdeas(haveIds));
}
