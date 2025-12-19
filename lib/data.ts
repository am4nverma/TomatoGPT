export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isVeg: boolean;
};

export type Restaurant = {
    id: string;
    name: string;
    cuisine: string[];
    rating: number;
    deliveryTime: string;
    priceForTwo: number;
    image: string;
    address: string;
    menu: MenuItem[];
};

export const RESTAURANTS: Restaurant[] = [
    {
        id: "r1",
        name: "Tomato Italia",
        cuisine: ["Italian", "Pizza", "Pasta"],
        rating: 4.5,
        deliveryTime: "30-40 min",
        priceForTwo: 30,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        address: "123 Main St, New York, NY",
        menu: [
            {
                id: "m1",
                name: "Margherita Pizza",
                description: "Classic tomato sauce, mozzarella, and basil.",
                price: 12,
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
                category: "Pizza",
                isVeg: true,
            },
            {
                id: "m2",
                name: "Pepperoni Pizza",
                description: "Spicy pepperoni with mozzarella cheese.",
                price: 15,
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
                category: "Pizza",
                isVeg: false,
            },
        ],
    },
    {
        id: "r2",
        name: "Burger Kingdom",
        cuisine: ["American", "Burgers", "Fast Food"],
        rating: 4.2,
        deliveryTime: "25-35 min",
        priceForTwo: 25,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        address: "456 Burger Lane, Brooklyn, NY",
        menu: [
            {
                id: "m3",
                name: "Classic Cheeseburger",
                description: "Juicy beef patty with cheddar cheese.",
                price: 10,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                category: "Burgers",
                isVeg: false,
            },
            {
                id: "m4",
                name: "Veggie Delight",
                description: "Plant-based patty with fresh veggies.",
                price: 11,
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", // Using known good burger image
                category: "Burgers",
                isVeg: true,
            },
        ],
    },
    {
        id: "r3",
        name: "Sushi Zen",
        cuisine: ["Japanese", "Sushi"],
        rating: 4.8,
        deliveryTime: "40-50 min",
        priceForTwo: 50,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        address: "789 Sushi Way, Manhattan, NY",
        menu: [
            {
                id: "m5",
                name: "Salmon Roll",
                description: "Fresh salmon roll with avocado.",
                price: 8,
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
                category: "Sushi",
                isVeg: false,
            },
            {
                id: "m6",
                name: "Avocado Maki",
                description: "Simple and fresh avocado roll.",
                price: 6,
                image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
                category: "Sushi",
                isVeg: true,
            },
        ],
    },
    {
        id: "r4",
        name: "Pasta Palace",
        cuisine: ["Italian", "Pasta"],
        rating: 4.3,
        deliveryTime: "25-35 min",
        priceForTwo: 40,
        // Using a reliable pasta image
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
        address: "321 Pasta Ln, Little Italy, NY",
        menu: [
            {
                id: "m7",
                name: "Spaghetti Carbonara",
                description: "Authentic roman style carbonara.",
                price: 18,
                image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
                category: "Pasta",
                isVeg: false,
            },
        ],
    },
    {
        id: "r5",
        name: "Luigi's Trattoria",
        cuisine: ["Italian", "Pizza"],
        rating: 4.7,
        deliveryTime: "45-55 min",
        priceForTwo: 55,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", // Changed to safe Pizza ID
        address: "555 Olive St, Bronx, NY",
        menu: [
            {
                id: "m8",
                name: "Tiramisu",
                description: "Classic Italian dessert.",
                price: 9,
                image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
                category: "Dessert",
                isVeg: true,
            },
        ],
    },
];
