import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import assets from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);

    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState(products || []); // Initialize with products
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');

    // Initialize filterProducts when products load
    useEffect(() => {
        if (products) {
            setFilterProducts(products);
        }
    }, [products]);

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setCategory(prev => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setSubCategory(prev => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let productsCopy = products.slice();
        if (showSearch && search) {
            productsCopy = productsCopy.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        }

        // Sort after filtering
        productsCopy = sortProducts(productsCopy);

        setFilterProducts(productsCopy);
    };

    const sortProducts = (productsToSort) => {
        const sorted = [...productsToSort];

        switch (sortType) {
            case 'low-high':
                return sorted.sort((a, b) => (a.price - b.price));
            case 'high-low':
                return sorted.sort((a, b) => (b.price - a.price));
            default:
                return sorted;
        }
    };

    // Apply filters and sorting when dependencies change
    useEffect(() => {
        applyFilter();
    }, [category, subCategory, sortType, products, search, showSearch]);

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            {/* Filter Options */}
            <div className='min-w-60'>
                <p
                    className='my-2 text-xl flex items-center cursor-pointer gap-2'
                    onClick={() => setShowFilter(!showFilter)}
                >
                    FILTERS
                    <img
                        className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
                        src={assets.dropdownFilter_icon}
                        alt="dropdown"
                    />
                </p>
                {/* Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? 'block' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Men'}
                                onChange={toggleCategory}
                                checked={category.includes('Men')}
                            />
                            Men's Gymwear
                        </p>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Women'}
                                onChange={toggleCategory}
                                checked={category.includes('Women')}
                            />
                            Women's Gymwear
                        </p>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Gym Equipment'}
                                onChange={toggleCategory}
                                checked={category.includes('Gym Equipment')}
                            />
                            Gym Equipment
                        </p>
                    </div>
                </div>
                {/* SubCategory Filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? 'block' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>PRODUCT TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Topwear'}
                                onChange={toggleSubCategory}
                                checked={subCategory.includes('Topwear')}
                            />
                            Workout Tops
                        </p>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Bottomwear'}
                                onChange={toggleSubCategory}
                                checked={subCategory.includes('Bottomwear')}
                            />
                            Training Bottoms
                        </p>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Gym Sets'}
                                onChange={toggleSubCategory}
                                checked={subCategory.includes('Gym Sets')}
                            />
                            Gym Sets
                        </p>
                        <p className='flex gap-2'>
                            <input
                                className='w-3'
                                type="checkbox"
                                value={'Accessories'}
                                onChange={toggleSubCategory}
                                checked={subCategory.includes('Accessories')}
                            />
                            Gym Accessories
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />
                    {/* Product Sort */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        value={sortType}
                        className="border-2 border-gray-300 text-sm px-2"
                    >
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>
                {/* Map Products */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterProducts.length > 0 ? (
                        filterProducts.map((item, index) => (
                            <ProductItem
                                key={index}
                                name={item.name}
                                id={item._id}
                                price={item.price}
                                image={item.image}
                            />
                        ))
                    ) : (
                        <p>No products found matching your filters</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;