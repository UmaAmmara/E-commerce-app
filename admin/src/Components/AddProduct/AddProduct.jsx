import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value
    });
  };

  const Add_product = async () => {
    console.log("Product before upload:", productDetails);

    if (!image) {
      alert("Please upload an image before adding a product.");
      return;
    }

    try {
      // Step 1: Upload image
      let responsedData;
      let formData = new FormData();
      formData.append('product', image); // ✅ check backend expects 'product'

      await fetch("http://localhost:4000/upload", {
        method: "POST",
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          responsedData = data;
        });

      if (responsedData.success) {
        // attach uploaded image url
        const product = {
          ...productDetails,
          image: responsedData.image_url,
        };

        console.log("Final product to save:", product);

        // Step 2: Save product in DB
        await fetch("http://localhost:4000/addproduct", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product),
        })
          .then((res) => res.json())
          .then((data) => {
            data.success
              ? alert("✅ Product added successfully")
              : alert("❌ Failed to add product");
          });
      } else {
        alert("❌ Image upload failed");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder='Enter product title'
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder='Enter product price'
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder='Enter new product price'
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>

      <div className="addproduct-i">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="upload area"
            className='addproduct-thumbnail-img'
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name='image'
          id='file-input'
          hidden
        />
      </div>

      {/* ✅ fixed onClick */}
      <button onClick={Add_product} className='addproduct-btn'>
        Add Product
      </button>
    </div>
  )
}

export default AddProduct
