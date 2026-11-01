const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_PASSWORD',
  database: 'your_database_name'
});

// ====================== ADD TO CART ======================
app.post('/api/cart/add', async (req, res) => {
  try {
    const { product_id, session_id } = req.body;

    if (!product_id || !session_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'product_id and session_id are required' 
      });
    }

    // Check if product already exists in cart for this session
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart WHERE session_id = ? AND product_id = ?',
      [session_id, product_id]
    );

    if (existing.length > 0) {
      // Increase quantity
      await db.query(
        'UPDATE cart SET quantity = quantity + 1 WHERE id = ?',
        [existing[0].id]
      );
    } else {
      // Insert new item
      await db.query(
        'INSERT INTO cart (session_id, product_id, quantity) VALUES (?, ?, 1)',
        [session_id, product_id]
      );
    }

    res.json({ 
      success: true, 
      message: 'Product added to cart successfully' 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== GET CART ======================
app.get('/api/cart/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;

    const [items] = await db.query(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        p.id as product_id,
        p.name,
        p.price,
        p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.session_id = ?
    `, [session_id]);

    res.json({ success: true, cart: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== UPDATE QUANTITY ======================
app.put('/api/cart/update', async (req, res) => {
  try {
    const { cart_id, quantity } = req.body;

    if (quantity < 1) {
      await db.query('DELETE FROM cart WHERE id = ?', [cart_id]);
    } else {
      await db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cart_id]);
    }

    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ====================== REMOVE ITEM ======================
app.delete('/api/cart/:cart_id', async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE id = ?', [req.params.cart_id]);
    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});