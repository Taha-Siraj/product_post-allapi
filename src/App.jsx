import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [products, setProducts] = useState([]);
  const [apiLoad, setApiLoad] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = 'https://product-post-server.vercel.app/';

  const stylecss = 'border-none py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-black font-semibold w-full text-lg';

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const postApi = (e) => {
    e.preventDefault();
    if (!name || !price || !description || !imgUrl) return notifyError('All fields are required!');

    setLoading(true);
    axios
      .post(`${baseUrl}/post-product`, { name, price, description, imgUrl })
      .then((res) => {
        notifySuccess('Product added successfully!');
        setApiLoad(!apiLoad);
        setName('');
        setPrice('');
        setDescription('');
        setImgUrl('');
      })
      .catch((err) => {
        notifyError('Error while posting product!');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/get-product`)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        notifyError('Error fetching products');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [apiLoad]);

  const deleteProduct = (id) => {
    setLoading(true);
    axios
      .delete(`${baseUrl}/product-delete/${id}`)
      .then((res) => {
        notifySuccess('Product deleted!');
        setApiLoad(!apiLoad);
      })
      .catch((err) => {
        notifyError('Delete failed');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const openPopup = (data) => {
    setProductId(data.id);
    setName(data.name);
    setPrice(data.price);
    setDescription(data.description);
    setImgUrl(data.imgUrl);
    setIsShow(true);
  };

  const closePopup = () => {
    setIsShow(false);
    setName('');
    setPrice('');
    setDescription('');
    setImgUrl('');
  };

  const editApi = (e) => {
    e.preventDefault();
    if (!name || !price || !description || !imgUrl) return notifyError('All fields are required!');

    setLoading(true);
    axios
      .put(`${baseUrl}/edit-product/${productId}`, { name, price, description, imgUrl })
      .then((res) => {
        notifySuccess('Product updated!');
        setIsShow(false);
        setApiLoad(!apiLoad);
        setName('');
        setPrice('');
        setDescription('');
        setImgUrl('');
      })
      .catch((err) => {
        notifyError('Edit failed');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="py-10 flex justify-center">
        <form onSubmit={postApi} className="bg-gray-900 shadow-xl rounded-2xl w-[380px] px-6 py-6 space-y-5 border border-cyan-400">
          <h1 className="text-3xl font-bold text-cyan-400 text-center">Add Product</h1>
          <input type="text" placeholder="Product Name" className={stylecss} value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" placeholder="Product Price" className={stylecss} value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="text" placeholder="Image URL" className={stylecss} value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
          <textarea placeholder="Product Title" className={stylecss} value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="bg-cyan-500 text-white py-2 px-4 rounded-md shadow hover:bg-cyan-600 font-bold w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
        {loading ? (
          <p className="text-center col-span-full">Loading products...</p>
        ) : (
          products.map((items) => (
            <div key={items.id} className="bg-gray-900 shadow-lg border border-cyan-500 rounded-xl p-5 space-y-3">
              <h2 className="text-xl font-mono font-bold text-cyan-300">
                Name: <span className="text-white">{items.name}</span>
              </h2>
              <p className="text-lg font-semibold text-cyan-300 font-mono">
                Price: <span className="text-white">${items.price}</span>
              </p>
              <p className="text-md text-cyan-300 text-xl font-mono">
                Title: <span className="text-white">{items.description}</span>
              </p>
              <img src={items.imgUrl} alt={items.name} className="w-full h-48 object-center rounded-md" />
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => deleteProduct(items.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md font-semibold"
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  onClick={() => openPopup(items)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md shadow-md font-semibold"
                  disabled={loading}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {isShow && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <form onSubmit={editApi} className="bg-gray-800 rounded-lg p-6 w-[350px] space-y-4 shadow-2xl border border-cyan-400">
            <h2 className="text-2xl font-bold text-center text-cyan-400">Edit Product</h2>
            <input type="text" placeholder="Product Name" className={stylecss} value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Product Price" className={stylecss} value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder="Image URL" className={stylecss} value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
            <textarea placeholder="Product Title" className={stylecss} value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;