
import React, { useState } from "react";

function App() {
    const [quantity, setQuantity] = useState("1");
    const [message, setMessage] = useState("");

    const product = {
        product_name: "Sugar",
        product_price: 50
    };    

    const totalPrice =
        product.product_price * Number(quantity);

    const addToCart = async () => {
        const qty = Number(quantity);

        if (!Number.isFinite(qty) || qty <= 0) {
            setMessage("Please enter a valid quantity.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/cart",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        product_name: product.product_name,
                        product_price: product.product_price,
                        quantity: qty
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMessage("Product added successfully!");
        } catch (error) {
            setMessage(error.message || "Something went wrong.");
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Add to cart</h1>

            <h2>{product.product_name}</h2>

            <p>Price: ₹{product.product_price} / kg</p>

            <label>Quantity (kg): </label>

            <input
                type="number"
                min="0.001"
                max="1000"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />

            <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>

            <button onClick={addToCart}>
                Add to Cart
            </button>

            <p>{message}</p>
        </div>
    );
}

export default App;

// import React, { useState } from "react";

// function App() {
//     const [message, setMessage] = useState("");

//     const product = {
//         product_name: "T-Shirt",
//         product_price: 500,
//         quantity: 2
//     };

//     const addToCart = async () => {
//         try {
//             const response = await fetch(
//                 "http://localhost:5000/api/cart",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify(product)
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Request failed");
//             }

//             setMessage(data.message);
//             console.log("Saved cart item:", data);

//         } catch (error) {
//             console.error(error);
//             setMessage("Error: " + error.message);
//         }
//     };

//     return (
//         <div style={{ padding: "30px" }}>
//             <h1>My Shopping Website</h1>

//             <div>
//                 <h2>{product.product_name}</h2>

//                 <p>Price: ₹{product.product_price}</p>

//                 <p>Quantity: {product.quantity}</p>

//                 <p>
//                     Total: ₹
//                     {product.product_price * product.quantity}
//                 </p>

//                 <button onClick={addToCart}>
//                     Add to Cart
//                 </button>

//                 <p>{message}</p>
//             </div>
//         </div>
//     );
// }

// export default App;





// import { useState } from "react";

// function App() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: ""
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   function handleChange(event) {
//     setForm({
//       ...form,
//       [event.target.name]: event.target.value
//     });
//   }

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/students",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(form)
//         }
//       );
      

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Submission failed");
//       }

//       setMessage(data.message);

//       setForm({
//         name: "",
//         email: "",
//         phone: ""
//       });
//     } catch (error) {
//       setMessage(error.message || "Unable to connect to the server.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{
//       maxWidth: "450px",
//       margin: "50px auto",
//       padding: "25px",
//       border: "1px solid #ddd",
//       borderRadius: "12px",
//       fontFamily: "Arial"
//     }}>
//       <h2>Student Registration Form</h2>

//       <form onSubmit={handleSubmit}>
//         <label>Name</label>
//         <input
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           maxLength={100}
//           style={inputStyle}
//         />

//         <label>Email</label>
//         <input
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           maxLength={150}
//           style={inputStyle}
//         />

//         <label>Phone</label>
//         <input
//           name="phone"
//           type="tel"
//           value={form.phone}
//           onChange={handleChange}
//           style={inputStyle}
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </form>

//       {message && <p role="status">{message}</p>}
//     </div>
//   );
// }

// const inputStyle = {
//   display: "block",
//   width: "100%",
//   boxSizing: "border-box",
//   padding: "10px",
//   margin: "8px 0 18px",
//   border: "1px solid #ccc",
//   borderRadius: "5px"
// };




// export default App;
