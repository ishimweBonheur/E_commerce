import { ChangeEvent, useState } from 'react';

export default function EditableOrderModal({ onClose }: any) {
  const [order, setOrder] = useState({
    name: 'eric manzi',
    address: 'kk 4 st',
    city: 'Kigali, Kigali Province, Rwanda',
    email: 'eric.manzi98@gmail.com',
    phone: '+250781440175',
    paymentMethod: 'MTN Mobile Money',
    products: [
      {
        id: 1,
        name: 'Hisense 43 inch 4K Smart TV',
        quantity: 2,
        price: 450000,
      },
      {
        id: 2,
        name: 'LG TOP Load Washers Silver 8 KGS Vietnam',
        quantity: 12,
        price: 210000,
      },
      { id: 3, name: 'Crystal Sunflower Oil /5l', quantity: 23, price: 42000 },
    ],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleProductChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newProducts = [...order.products];
    if (name === 'name' || name === 'quantity' || name === 'price') {
      const updatedValue =
        name === 'quantity' || name === 'price' ? parseInt(value, 10) : value;
      newProducts[index] = { ...newProducts[index], [name]: updatedValue };
      setOrder({ ...order, products: newProducts });
    }
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Edit Order #234</h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-bold">Billing details</h3>
            <input
              type="text"
              name="name"
              value={order.name}
              onChange={handleChange}
              className="block w-full mt-1 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="address"
              value={order.address}
              onChange={handleChange}
              className="block w-full mt-1 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="city"
              value={order.city}
              onChange={handleChange}
              className="block w-full mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <h3 className="font-bold">Contact details</h3>
            <input
              type="text"
              name="email"
              value={order.email}
              onChange={handleChange}
              className="block w-full mt-1 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={order.phone}
              onChange={handleChange}
              className="block w-full mt-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold">Payment via</h3>
          <input
            type="text"
            name="paymentMethod"
            value={order.paymentMethod}
            onChange={handleChange}
            className="block w-full mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">PRODUCT</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">PRICE</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={product.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={(e) => handleProductChange(index, e)}
                      className="block w-full mt-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, e)}
                      className="block w-full mt-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, e)}
                      className="block w-full mt-1 border border-gray-300 rounded-md"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
