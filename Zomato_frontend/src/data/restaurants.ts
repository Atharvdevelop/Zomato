export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestseller?: boolean;
  rating?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  coverImage: string;
  address: string;
  city: string;
  isOpen: boolean;
  offers: string[];
  tags: string[];
  menu: Record<string, MenuItem[]>;
}

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Spice Garden",
    cuisine: ["North Indian", "Mughlai", "Biryani"],
    rating: 4.5,
    reviewCount: 2341,
    deliveryTime: "25-35 min",
    deliveryFee: 0,
    minOrder: 149,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&auto=format",
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=400&fit=crop&auto=format",
    address: "12, Connaught Place",
    city: "New Delhi",
    isOpen: true,
    offers: ["50% off up to ₹100", "Free delivery on orders above ₹299"],
    tags: ["Trending", "Bestseller"],
    menu: {
      "Starters": [
        { id: "m1", name: "Chicken Tikka", description: "Tender chicken marinated in yogurt and spices, grilled to perfection", price: 299, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop&auto=format", category: "Starters", isVeg: false, isBestseller: true, rating: 4.7 },
        { id: "m2", name: "Paneer Tikka", description: "Soft cottage cheese cubes marinated in spiced yogurt, charcoal grilled", price: 249, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop&auto=format", category: "Starters", isVeg: true, isBestseller: false, rating: 4.5 },
        { id: "m3", name: "Seekh Kebab", description: "Minced lamb mixed with herbs and spices, grilled on skewers", price: 319, image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=200&fit=crop&auto=format", category: "Starters", isVeg: false, rating: 4.6 },
      ],
      "Main Course": [
        { id: "m4", name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken pieces", price: 349, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop&auto=format", category: "Main Course", isVeg: false, isBestseller: true, rating: 4.8 },
        { id: "m5", name: "Dal Makhani", description: "Slow-cooked black lentils in buttery tomato gravy", price: 229, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop&auto=format", category: "Main Course", isVeg: true, isBestseller: true, rating: 4.7 },
        { id: "m6", name: "Mutton Rogan Josh", description: "Slow-cooked mutton in aromatic Kashmiri spices", price: 429, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop&auto=format", category: "Main Course", isVeg: false, rating: 4.6 },
      ],
      "Biryani": [
        { id: "m7", name: "Chicken Biryani", description: "Aromatic basmati rice cooked with chicken and whole spices", price: 379, image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop&auto=format", category: "Biryani", isVeg: false, isBestseller: true, rating: 4.9 },
        { id: "m8", name: "Veg Biryani", description: "Fragrant basmati rice cooked with seasonal vegetables", price: 299, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&h=200&fit=crop&auto=format", category: "Biryani", isVeg: true, rating: 4.4 },
      ],
      "Breads": [
        { id: "m9", name: "Butter Naan", description: "Soft leavened bread baked in tandoor, finished with butter", price: 59, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop&auto=format", category: "Breads", isVeg: true, rating: 4.5 },
        { id: "m10", name: "Tandoori Roti", description: "Whole wheat bread baked fresh in tandoor", price: 39, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop&auto=format", category: "Breads", isVeg: true, rating: 4.3 },
      ],
      "Desserts": [
        { id: "m11", name: "Gulab Jamun", description: "Soft milk dumplings soaked in rose-flavored sugar syrup", price: 119, image: "https://images.unsplash.com/photo-1666385671717-e21f7e1f50f7?w=300&h=200&fit=crop&auto=format", category: "Desserts", isVeg: true, isBestseller: true, rating: 4.8 },
        { id: "m12", name: "Kulfi", description: "Traditional Indian ice cream with pistachio and cardamom", price: 99, image: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=300&h=200&fit=crop&auto=format", category: "Desserts", isVeg: true, rating: 4.6 },
      ],
    },
  },
  {
    id: "r2",
    name: "Pizza Paradise",
    cuisine: ["Pizza", "Italian", "Pasta"],
    rating: 4.3,
    reviewCount: 1892,
    deliveryTime: "30-40 min",
    deliveryFee: 29,
    minOrder: 199,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=400&fit=crop&auto=format",
    address: "45, Bandra West",
    city: "Mumbai",
    isOpen: true,
    offers: ["Buy 1 Get 1 Free on Pizzas"],
    tags: ["Popular"],
    menu: {
      "Pizzas": [
        { id: "p1", name: "Margherita", description: "Classic tomato sauce with fresh mozzarella and basil", price: 299, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop&auto=format", category: "Pizzas", isVeg: true, isBestseller: true, rating: 4.6 },
        { id: "p2", name: "Pepperoni Feast", description: "Loaded with premium pepperoni and mozzarella", price: 399, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop&auto=format", category: "Pizzas", isVeg: false, isBestseller: true, rating: 4.7 },
        { id: "p3", name: "BBQ Chicken", description: "Smoky BBQ sauce, grilled chicken, caramelized onions", price: 379, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop&auto=format", category: "Pizzas", isVeg: false, rating: 4.5 },
        { id: "p4", name: "Veggie Supreme", description: "Colorful bell peppers, mushrooms, olives, and corn", price: 339, image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300&h=200&fit=crop&auto=format", category: "Pizzas", isVeg: true, rating: 4.4 },
      ],
      "Pasta": [
        { id: "p5", name: "Penne Arrabbiata", description: "Spicy tomato sauce with garlic and red chilies", price: 249, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop&auto=format", category: "Pasta", isVeg: true, rating: 4.3 },
        { id: "p6", name: "Chicken Alfredo", description: "Creamy white sauce pasta with grilled chicken", price: 299, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023882a?w=300&h=200&fit=crop&auto=format", category: "Pasta", isVeg: false, isBestseller: true, rating: 4.5 },
      ],
      "Sides": [
        { id: "p7", name: "Garlic Bread", description: "Toasted baguette with garlic butter and herbs", price: 129, image: "https://images.unsplash.com/photo-1619531040576-f9416740661e?w=300&h=200&fit=crop&auto=format", category: "Sides", isVeg: true, rating: 4.6 },
        { id: "p8", name: "Cheesy Dip", description: "Warm cheddar cheese dip with nachos", price: 149, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&auto=format", category: "Sides", isVeg: true, rating: 4.4 },
      ],
    },
  },
  {
    id: "r3",
    name: "Burger Barn",
    cuisine: ["Burgers", "American", "Sandwiches"],
    rating: 4.2,
    reviewCount: 3120,
    deliveryTime: "20-30 min",
    deliveryFee: 0,
    minOrder: 99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format",
    coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=400&fit=crop&auto=format",
    address: "78, Koramangala",
    city: "Bangalore",
    isOpen: true,
    offers: ["20% off on first order"],
    tags: ["Fast Delivery"],
    menu: {
      "Burgers": [
        { id: "b1", name: "Classic Cheeseburger", description: "Beef patty, cheddar, lettuce, tomato, pickles, special sauce", price: 229, image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=300&h=200&fit=crop&auto=format", category: "Burgers", isVeg: false, isBestseller: true, rating: 4.6 },
        { id: "b2", name: "Crispy Chicken Burger", description: "Crispy fried chicken, coleslaw, chipotle mayo", price: 249, image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=300&h=200&fit=crop&auto=format", category: "Burgers", isVeg: false, isBestseller: true, rating: 4.7 },
        { id: "b3", name: "Veggie Delight", description: "Crispy veggie patty, fresh veggies, house sauce", price: 199, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300&h=200&fit=crop&auto=format", category: "Burgers", isVeg: true, rating: 4.3 },
        { id: "b4", name: "Double Smash Burger", description: "Double smashed beef patties, American cheese, caramelized onions", price: 349, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop&auto=format", category: "Burgers", isVeg: false, rating: 4.8 },
      ],
      "Fries & Sides": [
        { id: "b5", name: "Loaded Fries", description: "Crispy fries topped with cheese sauce, jalapeños, sour cream", price: 179, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop&auto=format", category: "Fries & Sides", isVeg: true, isBestseller: true, rating: 4.5 },
        { id: "b6", name: "Onion Rings", description: "Golden-fried onion rings with ranch dip", price: 149, image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&h=200&fit=crop&auto=format", category: "Fries & Sides", isVeg: true, rating: 4.4 },
      ],
      "Beverages": [
        { id: "b7", name: "Chocolate Milkshake", description: "Thick, creamy chocolate milkshake with whipped cream", price: 149, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=200&fit=crop&auto=format", category: "Beverages", isVeg: true, rating: 4.7 },
        { id: "b8", name: "Fresh Lemonade", description: "Cold pressed lemons with mint and sugar", price: 99, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop&auto=format", category: "Beverages", isVeg: true, rating: 4.4 },
      ],
    },
  },
  {
    id: "r4",
    name: "Sushi Sakura",
    cuisine: ["Japanese", "Sushi", "Ramen"],
    rating: 4.6,
    reviewCount: 987,
    deliveryTime: "40-50 min",
    deliveryFee: 49,
    minOrder: 299,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop&auto=format",
    coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&h=400&fit=crop&auto=format",
    address: "23, Jubilee Hills",
    city: "Hyderabad",
    isOpen: true,
    offers: ["₹75 off on orders above ₹499"],
    tags: ["Premium"],
    menu: {
      "Sushi Rolls": [
        { id: "s1", name: "Dragon Roll", description: "Shrimp tempura, avocado, cucumber, topped with tuna", price: 549, image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=300&h=200&fit=crop&auto=format", category: "Sushi Rolls", isVeg: false, isBestseller: true, rating: 4.8 },
        { id: "s2", name: "California Roll", description: "Crab meat, avocado, cucumber with sesame seeds", price: 449, image: "https://images.unsplash.com/photo-1617196034085-9651c5d9e71a?w=300&h=200&fit=crop&auto=format", category: "Sushi Rolls", isVeg: false, isBestseller: true, rating: 4.7 },
        { id: "s3", name: "Veggie Maki", description: "Cucumber, avocado, carrot, bell pepper maki roll", price: 349, image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=300&h=200&fit=crop&auto=format", category: "Sushi Rolls", isVeg: true, rating: 4.5 },
      ],
      "Ramen": [
        { id: "s4", name: "Tonkotsu Ramen", description: "Rich pork broth with chashu, soft-boiled egg, nori", price: 479, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop&auto=format", category: "Ramen", isVeg: false, isBestseller: true, rating: 4.9 },
        { id: "s5", name: "Miso Ramen", description: "Umami-rich miso broth with tofu, corn, and scallions", price: 429, image: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=300&h=200&fit=crop&auto=format", category: "Ramen", isVeg: true, rating: 4.7 },
      ],
      "Appetizers": [
        { id: "s6", name: "Edamame", description: "Salted steamed soybeans", price: 149, image: "https://images.unsplash.com/photo-1531235236994-2b3b4e9c91a2?w=300&h=200&fit=crop&auto=format", category: "Appetizers", isVeg: true, rating: 4.5 },
        { id: "s7", name: "Gyoza", description: "Pan-fried pork and cabbage dumplings", price: 299, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&h=200&fit=crop&auto=format", category: "Appetizers", isVeg: false, isBestseller: true, rating: 4.6 },
      ],
    },
  },
  {
    id: "r5",
    name: "Dosa Delight",
    cuisine: ["South Indian", "Kerala", "Andhra"],
    rating: 4.4,
    reviewCount: 4567,
    deliveryTime: "25-35 min",
    deliveryFee: 0,
    minOrder: 99,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop&auto=format",
    coverImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&h=400&fit=crop&auto=format",
    address: "5, T Nagar",
    city: "Chennai",
    isOpen: true,
    offers: ["10% off on weekend orders"],
    tags: ["Value for Money", "Pure Veg"],
    menu: {
      "Dosas": [
        { id: "d1", name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potato filling", price: 129, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&h=200&fit=crop&auto=format", category: "Dosas", isVeg: true, isBestseller: true, rating: 4.8 },
        { id: "d2", name: "Set Dosa", description: "Soft, spongy dosas served with coconut chutney and sambar", price: 99, image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=200&fit=crop&auto=format", category: "Dosas", isVeg: true, rating: 4.6 },
        { id: "d3", name: "Rava Dosa", description: "Crispy semolina crepe with onion and green chilies", price: 119, image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=300&h=200&fit=crop&auto=format", category: "Dosas", isVeg: true, rating: 4.5 },
      ],
      "Rice": [
        { id: "d4", name: "Curd Rice", description: "Cooling rice mixed with yogurt, tempered with mustard and curry leaves", price: 89, image: "https://images.unsplash.com/photo-1550346335-6d03e0f5dbfb?w=300&h=200&fit=crop&auto=format", category: "Rice", isVeg: true, isBestseller: true, rating: 4.7 },
        { id: "d5", name: "Lemon Rice", description: "Tangy rice with turmeric, peanuts, and curry leaves", price: 99, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop&auto=format", category: "Rice", isVeg: true, rating: 4.5 },
      ],
      "Snacks": [
        { id: "d6", name: "Idli Sambar", description: "Soft steamed rice cakes with spiced lentil soup", price: 79, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop&auto=format", category: "Snacks", isVeg: true, isBestseller: true, rating: 4.7 },
        { id: "d7", name: "Vada", description: "Crispy savory lentil donuts served with chutneys", price: 69, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=200&fit=crop&auto=format", category: "Snacks", isVeg: true, rating: 4.4 },
      ],
    },
  },
  {
    id: "r6",
    name: "The Dessert Lab",
    cuisine: ["Desserts", "Ice Cream", "Waffles"],
    rating: 4.7,
    reviewCount: 2876,
    deliveryTime: "20-30 min",
    deliveryFee: 29,
    minOrder: 149,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&auto=format",
    coverImage: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&h=400&fit=crop&auto=format",
    address: "90, Indiranagar",
    city: "Bangalore",
    isOpen: true,
    offers: ["₹50 off on orders above ₹299"],
    tags: ["Trending", "Highly Rated"],
    menu: {
      "Waffles": [
        { id: "w1", name: "Classic Belgian Waffle", description: "Crispy waffle with vanilla ice cream, fresh berries, maple syrup", price: 249, image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300&h=200&fit=crop&auto=format", category: "Waffles", isVeg: true, isBestseller: true, rating: 4.8 },
        { id: "w2", name: "Nutella Waffle", description: "Waffle loaded with Nutella, banana slices, and hazelnuts", price: 279, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=200&fit=crop&auto=format", category: "Waffles", isVeg: true, isBestseller: true, rating: 4.9 },
      ],
      "Sundaes": [
        { id: "w3", name: "Hot Fudge Sundae", description: "Vanilla ice cream, hot fudge, whipped cream, cherry on top", price: 199, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop&auto=format", category: "Sundaes", isVeg: true, isBestseller: true, rating: 4.8 },
        { id: "w4", name: "Brownie Sundae", description: "Warm chocolate brownie, vanilla ice cream, caramel drizzle", price: 229, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop&auto=format", category: "Sundaes", isVeg: true, rating: 4.7 },
      ],
      "Cakes": [
        { id: "w5", name: "Red Velvet Slice", description: "Moist red velvet cake with cream cheese frosting", price: 179, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&h=200&fit=crop&auto=format", category: "Cakes", isVeg: true, isBestseller: true, rating: 4.9 },
        { id: "w6", name: "Tiramisu", description: "Classic Italian dessert with mascarpone and espresso", price: 199, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop&auto=format", category: "Cakes", isVeg: true, rating: 4.8 },
      ],
    },
  },
];

export const cuisineCategories = [
  { name: "North Indian", icon: "🍛", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=150&fit=crop&auto=format" },
  { name: "Pizza", icon: "🍕", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop&auto=format" },
  { name: "Burgers", icon: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop&auto=format" },
  { name: "Chinese", icon: "🥡", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=150&fit=crop&auto=format" },
  { name: "South Indian", icon: "🥘", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=150&fit=crop&auto=format" },
  { name: "Sushi", icon: "🍣", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=150&fit=crop&auto=format" },
  { name: "Desserts", icon: "🍰", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=150&fit=crop&auto=format" },
  { name: "Biryani", icon: "🍚", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=200&h=150&fit=crop&auto=format" },
];
