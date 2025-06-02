const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://mongodb:27017/catalog', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number
});
const Product = mongoose.model('Product', ProductSchema);

const initializeProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const initialProducts = [
        { id: '1', name: 'Test Product', price: 10 },
        { id: '2', name: 'Another Product', price: 20 }
      ];
      await Product.insertMany(initialProducts);
      console.log('Initial products added to database');
    }
  } catch (err) {
    console.error('Error initializing products:', err);
  }
};

initializeProducts();

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching products: ' + err.message);
  }
});

app.listen(3001, () => {
  console.log('Catalog Service running on port 3001');
});