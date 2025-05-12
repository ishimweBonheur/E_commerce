import Order from '@/interfaces/order';

interface ModalProps {
  order: Order;
  close: () => void;
}

function OrderDetailsModal({ close, order }: ModalProps) {
  const billigDetails = order.deliveryInfo;
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">Order #234</h2>
        <div className="flex items-center">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
            {order.status}
          </span>
          <button
            onClick={() => close()}
            type="button"
            className="ml-4 text-xl text-gray-400 hover:text-gray-600"
          >
            x
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-bold">Billing details</h3>
          <p>eric manzi</p>
          <p>{billigDetails.address}</p>
          <p>
            {billigDetails.city}, {order.country}
          </p>
        </div>
        <div>
          <h3 className="font-bold">Billing details</h3>
          <p>eric manzi</p>
          <p>{billigDetails.address}</p>
          <p>
            {billigDetails.city}, {order.country}
          </p>
        </div>
        <div>
          <h3 className="font-bold">Email</h3>
          <p className="text-blue-600">eric.manzi98@gmail.com</p>
        </div>
        <div>
          <h3 className="font-bold">Phone</h3>
          <p className="text-blue-600">+250781440175</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">Payment via</h3>
        <p>MTN Mobile Money</p>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border text-gray-500 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">No</th>
              <th className="px-4 py-2 text-left">PRODUCT</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">PRICE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">Hisense 43 inch 4K Smart TV</td>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">450,000</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">
                LG TOP Load Washers Silver 8 KGS Vietnam
              </td>
              <td className="border px-4 py-2">12</td>
              <td className="border px-4 py-2">210,000</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">3</td>
              <td className="border px-4 py-2">Crystal Sunflower Oil /5l</td>
              <td className="border px-4 py-2">23</td>
              <td className="border px-4 py-2">42,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-1 bg-primary text-sm text-white rounded-md"
        >
          Edit
        </button>
        <button
          type="button"
          className="px-4 py-1 bg-red-500 text-sm text-white rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
