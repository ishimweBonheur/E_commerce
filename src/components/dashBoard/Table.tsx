import { useState, useEffect } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import ConfirmationCard from './ConfirmationCard';
import CircularPagination from './NavigateonPage';
import { AppDispatch, RootState } from '../../app/store';
import {
  fetchDashboardProduct,
  deleteDashboardProduct,
} from '@/features/Dashboard/dashboardProductsSlice';

interface Column {
  Header: string;
  accessor: string;
}

interface Column {
  Header: string;
  accessor: string;
}

const columns: Column[] = [
  { Header: 'ID', accessor: 'id' },
  { Header: 'IMAGE', accessor: 'image' },
  { Header: 'TITLE', accessor: 'title' },
  { Header: 'QUANTITY', accessor: 'quantity' },
  { Header: 'PRICE', accessor: 'price' },
  { Header: 'CREATED AT', accessor: 'created_at' },
  { Header: 'DATE', accessor: 'date' },
  { Header: 'CATEGORY', accessor: 'category' },
  { Header: 'ACTION', accessor: 'action' },
];

function Table() {
  const dispatch: AppDispatch = useDispatch();

  const { DashboardProduct, status } = useSelector(
    (state: RootState) => state.DeshboardProducts
  );

  const user = useAppSelector((state) => state.signIn.user);
  // -----------------------------------------------------------
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [itemSelected, setItemToselected] = useState<number | null>(null);
  const [mode, setmode] = useState('');
  const [deleting, setdeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [color, setcolor] = useState<string | null>(null);
  // ---------------------------------------------------

  const isData = [...DashboardProduct].filter((product) => {
    const vendorFirstName = product.vendor?.firstName?.toLowerCase() || '';
    const vendorLastName = product.vendor?.lastName?.toLowerCase() || '';
    const userFirstName = user?.firstName?.toLowerCase() || '';
    const userLastName = user?.lastName?.toLowerCase() || '';
    return (
      vendorFirstName.includes(userFirstName) ||
      vendorLastName.includes(userLastName) ||
      vendorLastName.includes(userFirstName) ||
      vendorFirstName.includes(userLastName)
    );
  });
  const data =
    // eslint-disable-next-line eqeqeq
    user && user.userType.name == 'Admin' ? [...DashboardProduct] : isData;
  useEffect(() => {
    dispatch(fetchDashboardProduct());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  const totalPages = Math.ceil(data.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const paginatedData = data
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  // ---------------------------------------------------
  const navigate = useNavigate();

  // -----------------------------------------------------
  const handleDelete = (id: number) => {
    setItemToselected(id);
    setmode('delete');
    setModalVisible(true);
  };
  // -----------------------------------

  const handleUpdate = (id: number) => {
    setItemToselected(id);
    setmode('update');
    setModalVisible(true);
  };
  // -----------------------------------

  const confirmDelete = async () => {
    if (itemSelected !== null) {
      setdeleting(true);
      setModalVisible(false);
      const response = await dispatch(deleteDashboardProduct(itemSelected));
      if (response.payload === 'seccess') {
        dispatch(fetchDashboardProduct());
        setdeleting(false);
        setPopupMessage('Product is "DELETE" Permanently');
        setcolor('green');
        setIsPopupVisible(true);
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 10000);
      } else if (response.payload === 'fail') {
        setdeleting(false);
        setPopupMessage(
          'Delete Product failed This my be due to Network Connection'
        );
        setIsPopupVisible(true);
        setcolor('red');
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 10000);
      }
    }
  };
  // ---------------------------------------

  const confirmUpdate = () => {
    if (itemSelected !== null) {
      navigate(`/dashboard/product/${itemSelected}`);
    }
    setModalVisible(false);
  };
  // ----------------------------------------

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className=" bg-[#F5F6F6]">
      <div className=" flex flex-row justify-between items-center pl-[2.5%] mb-[1.3%] mt-[0.8%]">
        <div className=" flex flex-row items-center justify-between">
          <div className=" font-bold text-lg mr-[15px]">Product List</div>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/addProduct/`)}
            className="border-[2px] border-primary text-primary px-[5px] py-[5px] rounded-md flex justify-center items-center gap-2 text-sm
                hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
          >
            Add Product
          </button>
        </div>
        <div className="flex gap-2 max-w-full items-center p-[5px] bg-white border-2 border-[#9095A1] rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={6} />
              <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3" />
            </g>
          </svg>
          <input
            type="text"
            placeholder="Search order...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none  placeholder:text-gray-400 font-light"
          />
        </div>
      </div>
      <div className=" bg-white min-w-full min-h-full pr-[15px] pl-[2.5%] pt-[3.5%] rounded-xl">
        <table className="min-w-full min-h-full">
          <thead className=" text-[12px] leading-[26px]">
            <tr className="bg-[#F5F6F6] rounded-[10px]">
              {columns.map((column, index) => (
                <th
                  key={column.Header}
                  className={` px-4 text-left text-grey text-[12px] leading-[26px] hover:scale-105 hover:border hover:border-primary ${
                    index === 0 ? 'rounded-tl-lg rounded-bl-lg' : ''
                  } ${index === columns.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''}`}
                >
                  {column.Header}
                </th>
              ))}
            </tr>
            <tr className="h-[20px]"></tr>
          </thead>

          <tbody className="">
            {status === 'loading' &&
              Array(6)
                .fill(null)
                .map((_, index) => (
                  <tr
                    key={index}
                    className="border-b-[2.5px] min-w-full h-[60px]  border-[#F5F6F6] last:border-none"
                  >
                    <td key="ID" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg h-[40px]"></div>
                    </td>
                    <td key="image" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg h-[40px]"></div>
                    </td>
                    <td key="title" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                    <td key="quintity" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                    <td key="price" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                    <td key="created_at" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                    <td key="date" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                    <td key="category" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                    <td key="action" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px]"></div>
                    </td>
                  </tr>
                ))}
            {status === 'failed' &&
              Array(8)
                .fill(null)
                .map((_, index) => (
                  <tr
                    key={index}
                    className="border-b-[2.5px] min-w-full h-[60px]  border-[#F5F6F6] last:border-none"
                  >
                    <td key="ID" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                    <td key="image" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                    <td key="title" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                    <td key="quintity" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                    <td key="price" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                    <td key="created_at" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-pretty">
                        Failed..
                      </div>
                    </td>
                    <td key="date" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-pretty">
                        Failed..
                      </div>
                    </td>
                    <td key="category" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                    <td key="action" className="">
                      <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg  h-[40px] text-center">
                        Failed..
                      </div>
                    </td>
                  </tr>
                ))}
            {status === 'succeeded' &&
              paginatedData.map((product, index) => (
                <tr
                  key={index}
                  className=" h-[68px] text-grey leading-[16px] text-[12px] font-normal border-b-[2px] border-[#F5F6F6] last:border-none hover:translate-x-[0.7px] hover:border hover:bg-[#F5F6F6]"
                >
                  <td key="ID" className="px-4">
                    {product.id}
                  </td>
                  <td key="image" className="px-4 py-2">
                    <img
                      src={product.image}
                      alt="product"
                      className="h-[46px] w-[59px] object-cover"
                    />
                  </td>
                  <td key="title" className="px-4">
                    {product.name}
                  </td>
                  <td key="quintity" className="px-4">
                    {product.quantity}
                  </td>
                  <td key="price" className="px-4">
                    ${product.regularPrice}
                  </td>
                  <td key="created_at" className="px-4">
                    {product.createdAt.slice(0, 10)}
                  </td>
                  <td key="date" className="px-4">
                    {product.updatedAt.slice(0, 10)}
                  </td>
                  <td key="category" className="px-4">
                    {product.category.name}
                  </td>
                  <td key="action" className="px-4">
                    <div className="flex flex-row justify-start">
                      <div className=" h-[36px] w-[36px] rounded-full flex items-center justify-center hover:border-primary hover:border ">
                        <MdOutlineEdit
                          type="button"
                          className=" text-textBlack cursor-pointer  h-[18px] w-[18px]"
                          onClick={() => handleUpdate(product.id)}
                        />
                      </div>
                      <div className="h-[36px] w-[36px] rounded-full flex items-center justify-center hover:border-primary hover:border ">
                        <FaRegTrashAlt
                          type="button"
                          className="text-red-500 cursor-pointer h-[16px] w-[16px]"
                          onClick={() => handleDelete(product.id)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className=" flex flex-row justify-end pb-[2%] pt-[2%] pr-[5%]">
          <CircularPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        {mode === 'delete' && (
          <div className="">
            <ConfirmationCard
              isVisible={isConfirmationModalVisible}
              onClose={() => setModalVisible(false)}
              onConfirm={confirmDelete}
              message="Are you sure you want to delete this item?"
            />
          </div>
        )}

        {mode === 'update' && (
          <div className="">
            <ConfirmationCard
              isVisible={isConfirmationModalVisible}
              onClose={() => setModalVisible(false)}
              onConfirm={confirmUpdate}
              message="Are you sure you want to Update this item ?"
            />
          </div>
        )}
      </div>

      <div
        className={`fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 ${deleting ? '' : 'hidden'}`}
      >
        <div className="flex gap-2 flex-wrap justify-center p-4 md:p-12">
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Updating....
          </button>
        </div>
      </div>

      {isPopupVisible && (
        <div
          className={`h-fit min-w-fit fixed inset-0 z-50 left-[65%] top-[2%] ${color === 'green' ? 'bg-teal-100 border-teal-500 text-teal-900' : 'bg-red-100 border-red-300'}  border-t-4  rounded-b px-4 py-3 shadow-md`}
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className={`fill-current h-6 w-6 ${color === 'green' ? 'text-teal-500' : ' text-red-500'} mr-4`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">DELETE PRODUCT</p>
              <p className="text-sm">{popupMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
