import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { showErrorToast } from '@/utils/ToastConfig';

interface ICategory {
  categoryName: string;
  totalProducts: number;
  totalSales: number;
}

function TopCategories() {
  const token = useAppSelector((state) => state.signIn.token);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/category/get_metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategoryData(response.data.data);
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  }, [token]);

  return (
    <div className="flex flex-col rounded-lg lg:w-[50%] xs:w-full h-64 p-4 bg-white">
      <h2 className="font-semibold mb-4">Top Categories</h2>
      <div className="flex items-center justify-between py-2 w-full text-sm bg-greyWhite text-grey font-semibold">
        <h3 className="w-20">Categories</h3>
        <h3 className="w-20 text-center">Products</h3>
        <h3 className="w-20 text-end">Total Sales</h3>
      </div>
      <div className="w-full flex flex-col overflow-y-auto">
        {categoryData.map((category: ICategory) => (
          <div
            className="flex items-center justify-between w-full py-3 text-sm border-b border-lightGrey text-grey font-normal"
            key={category.categoryName}
          >
            <h3 className="w-20 text-start">{category.categoryName}</h3>
            <h3 className="w-20 text-center">{category.totalProducts}</h3>
            <h3 className="w-20 text-end">{category.totalSales}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCategories;
