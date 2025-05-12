import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyers } from '@/app/Dashboard/buyerSlice';
import { fetchOrders } from '@/app/Dashboard/orderSlice';
import { useAppSelector } from '@/app/hooks';
import { AppDispatch, RootState } from '@/app/store';
import UserMetricsChart from '../Chart';
import TopCategories from '../TopCategories';
import SalesMap from '../salesMap/SalesMap';
import ProductTable from './BestSellingProducts';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Order from '@/interfaces/order';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define OrderDetail locally
interface OrderDetail {
  id: number;
  quantity: number;
  price: number;
}

function HomeDash() {
  const Role = useAppSelector((state) => state.signIn.user?.userType.name);
  const currentUser = useAppSelector((state) => state.signIn.user);
  const { buyers } = useSelector((state: RootState) => state.buyer);
  const { order } = useSelector((state: RootState) => state.order) as unknown as { order: Order[] };
  const { allProducts } = useSelector((state: RootState) => state.products);
  const [sum, setSum] = useState(0);
  const [tproduct, setAllproduct] = useState(0);
  const [vendorSalesData, setVendorSalesData] = useState([]);
  const [vendorProductsData, setVendorProductsData] = useState([]);

  function getGreeting(): string {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return 'Good Morning';
    }
    if (hour < 18) {
      return 'Good Afternoon';
    }
    return 'Good Evening';
  }

  const greetings = getGreeting();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBuyers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const calculateTotalSum = useCallback(
    () =>
      order.reduce(
        (Tsum, ord) => (ord.paid ? Tsum + ord.totalAmount : Tsum),
        0
      ),
    [order]
  );

  const CalculateTProduct = useCallback(() => {
    return order
      .filter((o) => o.paid)
      .reduce((totalproduct, o) => totalproduct + o.orderDetails.length, 0);
  }, [order]);

  useEffect(() => {
    setSum(calculateTotalSum());
    setAllproduct(CalculateTProduct());
  }, [order, calculateTotalSum, CalculateTProduct]);

  // Filter vendor-specific data
  const vendorOrders = order.filter(
    (ord) => ord.orderDetails.some((detail: OrderDetail) => {
      const product = allProducts.find((p) => p.id === detail.id);
      return product?.vendor?.id === currentUser?.id;
    })
  );
  const vendorProducts = allProducts.filter(
    (prod) => prod.vendor?.id === currentUser?.id
  );

  // Calculate vendor-specific metrics
  const vendorTotalSales = vendorOrders.reduce(
    (total, ord) => (ord.paid ? total + ord.totalAmount : total),
    0
  );
  const vendorTotalOrders = vendorOrders.length;
  const vendorTotalProducts = vendorProducts.length;
  const vendorProductsSold = vendorOrders.reduce(
    (total, ord) => total + ord.orderDetails.length,
    0
  );

  // Prepare sales trend data
  const salesTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: Array(12).fill(0).map((_, i) => {
          const monthOrders = vendorOrders.filter((ord) => {
            const orderDate = new Date(ord.createdAt);
            return orderDate.getMonth() === i && ord.paid;
          });
          return monthOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
        }),
        borderColor: '#3CD856',
        backgroundColor: '#3CD856',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // Prepare top products data
  const topProductsData = {
    labels: vendorProducts.slice(0, 5).map((prod) => prod.name),
    datasets: [
      {
        label: 'Sales',
        data: vendorProducts.slice(0, 5).map((prod) => {
          const productOrders = vendorOrders.filter((ord) =>
            ord.orderDetails.some((detail: OrderDetail) => detail.id === prod.id)
          );
          return productOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
        }),
        backgroundColor: '#EF4444',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{greetings}</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              Welcome back, {currentUser?.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              type="button"
            >
              <img src="/icons/ExportIcon.svg" alt="Export" className="w-4 h-4" />
              Export Report
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src="/icons/farmer.svg" alt="profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {Role === 'Vendor' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <img src="/icons/SalesIcon.svg" alt="Sales" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">${vendorTotalSales.toLocaleString()}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <span className="font-medium">Your Store Sales</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <img src="/icons/OrderIcon.svg" alt="Order" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{vendorTotalOrders}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <span className="font-medium">Your Store Orders</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <img src="/icons/DiscIcon.svg" alt="Product Sold" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Products Sold</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{vendorProductsSold}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">Total Products Sold</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <img src="/icons/AddPeople.svg" alt="Products" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{vendorTotalProducts}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-orange-600">
                <span className="font-medium">Your Products</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
              <div className="h-64">
                <Line data={salesTrendData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
              <div className="h-64">
                <Bar data={topProductsData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Inventory Status</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendorProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.salesPrice}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {Role === 'Admin' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <img src="/icons/SalesIcon.svg" alt="Sales" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">${sum.toLocaleString()}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">All Products Sales</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <img src="/icons/OrderIcon.svg" alt="Order" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{order.length}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <span className="font-medium">All Orders</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <img src="/icons/DiscIcon.svg" alt="Product Sold" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Products Sold</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{tproduct}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span className="font-medium">All Products Sold</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <img src="/icons/AddPeople.svg" alt="New Customers" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Customers</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {buyers?.filter((user) => user.userType?.name === 'Buyer').length || 0}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-orange-600">
                <span className="font-medium">All Buyers</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <UserMetricsChart />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <TopCategories />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SalesMap />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <ProductTable />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomeDash;
