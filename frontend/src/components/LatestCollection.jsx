import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem'; // Assuming ProductItem is in the same directory, or adjust the path

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        if (products) { // Check if products is available
            setLatestProducts(products.slice(0, 10));
        }
    }, [products]) // Add products to dependency array, to update the latest products when products change.

    return (
        <div className='my-10'>
            <div className='text-center py-6 text-3xl'>
                <Title text1="LATEST" text2="COLLECTIONS" />
                <p className='w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Upgrade your workout with our latest high-performance gym wear, designed for comfort and style.
                </p>
            </div>
            {/* RENDERING PRODUCTS*/}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))}
            </div>
        </div>
    );
};

export default LatestCollection;