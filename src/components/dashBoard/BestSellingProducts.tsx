import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/app/hooks';
import { Product } from '@/types/Product';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface ChartData {
  name: string;
  sales: number;
  price: number;
}

function BestSellingProducts() {
  const token = useAppSelector((state) => state.signIn.token);
  const [bestselling, setBestSelling] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/product/getAvailableProducts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response): void => {
        // Sort by averageRating to get best selling products
        const sortedProducts = response.data.availableProducts
          .sort((a: Product, b: Product) => b.averageRating - a.averageRating)
          .slice(0, 5);
        setBestSelling(sortedProducts);
      })
      .catch((error) => {
        console.error('Error fetching best selling products:', error);
      });
  }, [token]);

  const chartData = bestselling.map((product) => ({
    name: product.name.length > 15 ? `${product.name.slice(0, 15)}...` : product.name,
    sales: product.averageRating * 100, // Convert rating to percentage for better visualization
    price: product.regularPrice,
  }));

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            Sales: {payload[0].value}%
          </p>
          <p className="text-sm text-gray-600">
            Price: ${payload[0].payload.price}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Best Selling Products</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: 'Sales Performance (%)',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="sales"
            fill="#4F46E5"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BestSellingProducts;
