import { useState, useEffect, FormEvent, CSSProperties } from 'react';

interface ProductData {
    id: number;
    productname: string;
    productdescription: string;
    productprice: number;
    productcategory: string;
    productstock: number;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function Product() {
    const [productname, setProductName] = useState("");
    const [productdescription, setProductDescription] = useState("");
    const [productprice, setProductPrice] = useState("");
    const [productcategory, setProductCategory] = useState("");
    const [productstock, setProductStock] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [products, setProducts] = useState<ProductData[]>([]);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch existing products
    const fetchProducts = async () => {
        try {
            const res = await fetch("http://zomato-production-aca8.up.railway.app/api/products/all");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!productname || !productdescription || !productprice || !productcategory || !productstock) {
            setMessage("All fields are required!");
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const formData = new FormData();
            formData.append("productname", productname);
            formData.append("productdescription", productdescription);
            formData.append("productprice", productprice);
            formData.append("productcategory", productcategory);
            formData.append("productstock", productstock);
            if (image) {
                formData.append("image", image);
            }

            const res = await fetch("http://zomato-production-aca8.up.railway.app/api/products/create", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                setMessage("Product added successfully!");
                setIsError(false);
                // Clear form
                setProductName("");
                setProductDescription("");
                setProductPrice("");
                setProductCategory("");
                setProductStock("");
                setImage(null);
                // Refresh list
                fetchProducts();
            } else {
                setMessage(result.message || "Failed to add product. Please try again.");
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
            setMessage("Network error. Please make sure the backend is running.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`http://zomato-production-aca8.up.railway.app/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMessage("Product deleted successfully!");
                setIsError(false);
                fetchProducts();
            } else {
                const result = await res.json();
                setMessage(result.message || "Failed to delete product.");
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
            setMessage("Network error. Failed to delete product.");
            setIsError(true);
        }
    };

    return (
        <div style={pageContainerStyle}>
            {/* Heading */}
            <div style={{ width: "100%", marginBottom: 32 }}>
                <h1 style={titleStyle}>Manage Products</h1>
                <p style={{ color: "#696969", fontSize: 15, marginTop: 4 }}>Add new products to the menu and view current offerings</p>
            </div>

            {/* Error/Success Messages */}
            {message && (
                <div style={{
                    width: "100%",
                    color: isError ? "#d32f2f" : "#2e7d32",
                    backgroundColor: isError ? "#fdeded" : "#edf7ed",
                    padding: "14px 20px",
                    borderRadius: 12,
                    marginBottom: 24,
                    fontSize: 14,
                    fontWeight: 600,
                    border: isError ? "1px solid #f5c2c2" : "1px solid #c3e6cb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}>
                    {message}
                </div>
            )}

            <div style={contentGridStyle}>
                {/* Left Side: Add Product Form */}
                <div style={formCardStyle}>
                    <h2 style={sectionTitleStyle}>Add New Product</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Product Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Garlic Bread"
                                value={productname}
                                onChange={e => setProductName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                                placeholder="Describe the product/dish..."
                                value={productdescription}
                                onChange={e => setProductDescription(e.target.value)}
                                required
                                style={textareaStyle}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Price (₹)</label>
                                <input
                                    type="number"
                                    placeholder="199"
                                    value={productprice}
                                    onChange={e => setProductPrice(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Stock</label>
                                <input
                                    type="number"
                                    placeholder="50"
                                    value={productstock}
                                    onChange={e => setProductStock(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={productcategory}
                                onChange={e => setProductCategory(e.target.value)}
                                required
                                style={selectStyle}
                            >
                                <option value="">Select Category</option>
                                <option value="Starters">Starters</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Biryani">Biryani</option>
                                <option value="Breads">Breads</option>
                                <option value="Desserts">Desserts</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Sides">Sides</option>
                            </select>
                        </div>

                        {/* Image Preview & Selection */}
                        <div style={{ marginTop: 8 }}>
                            {image && (
                                <div style={previewContainerStyle}>
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        alt="Preview" 
                                        style={previewImageStyle} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setImage(null)}
                                        style={removePreviewBtnStyle}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <label style={labelStyle}>Product Image</label>
                            <input 
                                type='file' 
                                className='mt-2'
                                accept='image/*'
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                style={fileInputStyle}
                            />  
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={loading ? disabledBtnStyle : btnStyle}
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>
                    </form>
                </div>

                {/* Right Side: Product List */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                    <h2 style={sectionTitleStyle}>Current Products ({products.length})</h2>
                    {products.length === 0 ? (
                        <div style={emptyStateStyle}>
                            <span style={{ fontSize: 48, marginBottom: 12, display: "block" }}>🍽️</span>
                            <p style={{ fontWeight: 600, color: "#1c1c1c" }}>No products added yet.</p>
                            <p style={{ color: "#9e9e9e", fontSize: 13, marginTop: 4 }}>Fill out the form to add your first product.</p>
                        </div>
                    ) : (
                        <div style={productGridStyle}>
                            {products.map(product => (
                                <div key={product.id} style={productCardStyle}>
                                    {/* Product Image */}
                                    <div style={{ position: "relative" }}>
                                        <img 
                                            src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format"} 
                                            alt={product.productname} 
                                            style={cardImageStyle}
                                        />
                                        <span style={categoryBadgeStyle}>
                                            {product.productcategory}
                                        </span>
                                    </div>

                                    {/* Card Info */}
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                            <h3 style={cardTitleStyle}>{product.productname}</h3>
                                            <span style={cardPriceStyle}>₹{product.productprice}</span>
                                        </div>
                                        <p style={cardDescStyle}>{product.productdescription}</p>
                                        
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                                            <span style={{ fontSize: 12, color: product.productstock > 0 ? "#2e7d32" : "#d32f2f", fontWeight: 600 }}>
                                                {product.productstock > 0 ? `Stock: ${product.productstock}` : "Out of stock"}
                                            </span>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                style={deleteBtnStyle}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Layout Styles
const pageContainerStyle: CSSProperties = {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 24px",
    fontFamily: "Inter, sans-serif",
};

const titleStyle: CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 800,
    fontSize: "32px",
    color: "#1c1c1c",
    margin: 0,
    letterSpacing: "-0.5px",
};

const contentGridStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "32px",
    alignItems: "flex-start",
};

const formCardStyle: CSSProperties = {
    width: "420px",
    flexShrink: 0,
    padding: "32px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
    boxSizing: "border-box",
};

const sectionTitleStyle: CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    color: "#1c1c1c",
    marginBottom: "20px",
    marginTop: 0,
};

const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#696969",
    marginBottom: "6px",
};

const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e8e8e8",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    background: "#f8f8f8",
};

const textareaStyle: CSSProperties = {
    ...inputStyle,
    height: "80px",
    resize: "vertical",
};

const selectStyle: CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
};

const fileInputStyle: CSSProperties = {
    width: "100%",
    fontSize: "13px",
    color: "#696969",
};

const btnStyle: CSSProperties = {
    width: "100%",
    backgroundColor: "#e23744",
    color: "white",
    padding: "12px",
    marginTop: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "inherit",
    boxShadow: "0 2px 10px rgba(226, 55, 68, 0.2)",
    transition: "background-color 0.2s",
};

const disabledBtnStyle: CSSProperties = {
    ...btnStyle,
    backgroundColor: "#f3b5ba",
    cursor: "not-allowed",
    boxShadow: "none",
};

const previewContainerStyle: CSSProperties = {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #e8e8e8",
    marginBottom: "12px",
};

const previewImageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
};

const removePreviewBtnStyle: CSSProperties = {
    position: "absolute",
    top: "4px",
    right: "4px",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
};

// Right Panel / Product Cards Grid
const productGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
};

const productCardStyle: CSSProperties = {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    border: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

const cardImageStyle: CSSProperties = {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    backgroundColor: "#f8f8f8",
};

const categoryBadgeStyle: CSSProperties = {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#e23744",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const cardTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: "#1c1c1c",
    lineHeight: "1.3",
};

const cardPriceStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: 800,
    color: "#e23744",
};

const cardDescStyle: CSSProperties = {
    fontSize: "13px",
    color: "#696969",
    marginTop: "8px",
    marginBottom: 0,
    lineHeight: "1.5",
    height: "40px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
};

const deleteBtnStyle: CSSProperties = {
    background: "none",
    border: "none",
    color: "#e23744",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontFamily: "inherit",
};

const emptyStateStyle: CSSProperties = {
    background: "#fff",
    border: "2px dashed #e8e8e8",
    borderRadius: "16px",
    padding: "60px 20px",
    textAlign: "center",
};
