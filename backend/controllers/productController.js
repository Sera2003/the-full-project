import fs from 'fs';
import productModel from '../models/productModel.js';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto'; // For generating unique names
dotenv.config();

// GitHub Info
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_REPO = process.env.GITHUB_REPO;

// Helper function to upload file to GitHub
const uploadFileToGitHub = async (fileBuffer, fileName) => {
  try {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex'); // Generate a unique identifier
    const pathInRepo = `products/${uniqueSuffix}-${fileName}`; // Use the unique identifier in the filename
    const base64Content = fileBuffer.toString('base64');
    
    const res = await axios.put(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${pathInRepo}`,
      {
        message: `Add product image ${fileName}`,
        content: base64Content,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    
    return res.data.content.download_url;
  } catch (error) {
    console.error('Error uploading file to GitHub:', error.message);
    throw error;
  }
};

// Fixed addProduct function
const addProduct = async (req, res) => {
  try {
    console.log('Files in request:', req.files);  // Log files in request

    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Always pick images by name, no filtering
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);
    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        return await uploadFileToGitHub(image.buffer, image.originalname);
      })
    );

    console.log('Uploaded Image URLs:', imagesUrl);

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log('Product Data:', productData);

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: 'Product Added'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Other functions stay the same
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
