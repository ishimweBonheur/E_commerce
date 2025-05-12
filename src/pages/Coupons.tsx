import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import { IoIosArrowDown, IoIosSearch } from 'react-icons/io';
import PuffLoader from 'react-spinners/PuffLoader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import {
  fetchCoupons,
  deleteCoupon,
  selectCoupons,
  fetchMyCoupons,
} from '@/features/Coupons/CouponsFeature';

import CircularPagination from '@/components/dashBoard/NavigateonPage';
import { useAppSelector } from '@/app/hooks';
import { showErrorToast } from '@/utils/ToastConfig';
import Button from '@/components/form/Button';

function Coupons() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<any>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const token = useAppSelector((state: RootState) => state.signIn.token)!;
  const Role = useAppSelector((state) => state.signIn.user?.userType.name);
  const User = useAppSelector((state) => state.signIn.user?.lastName);

  const dispatch: AppDispatch = useDispatch();
  const { coupons, loading, error } = useSelector(selectCoupons);

  useEffect(() => {
    if (Role === 'Admin') {
      dispatch(fetchCoupons());
    } else {
      dispatch(fetchMyCoupons());
    }
  }, [dispatch, Role]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev: any) =>
      prev.includes(id)
        ? prev.filter((rowId: number) => rowId !== id)
        : [...prev, id]
    );
  };

  const showDeleteModal = (couponId: number) => {
    setSelectedCouponId(couponId);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCouponId !== null) {
      dispatch(deleteCoupon({ couponId: selectedCouponId, token }))
        .unwrap()
        .then(() => {
          setDeleteModal(false);
          setSelectedCouponId(null);
          dispatch(fetchCoupons());
        })
        .catch((Anerror) => {
          showErrorToast(Anerror || 'Failed to delete the coupon:');
        });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setSelectedCouponId(null);
  };

  const getStatus = (expirationDate: string) => {
    const currentDate = new Date();
    const expiration = new Date(expirationDate);
    return expiration >= currentDate ? 'Active' : 'Expired';
  };

  // ********* Pagination **********
  const COUPONS_PER_PAGE = 8;
  const totalPages = Math.ceil(coupons.length / COUPONS_PER_PAGE);
  const startIndex = (currentPage - 1) * COUPONS_PER_PAGE;

  const paginatedData = coupons
    .filter(
      (coupon) =>
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, startIndex + COUPONS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-5 max-w-screen-xl">
      <div className="flex gap-4 items-center py-4">
        <h1 className="text-2xl font-bold">Coupons</h1>
      </div>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:justify-between">
        <ul className="flex gap-4 items-center">
          <li className="flex gap-2 items-center">
            <button type="button" className="text-lg">
              All
            </button>
            ({coupons.length})
          </li>
          <span className="text-sm">|</span>
          <li className="flex gap-2 items-center">
            <button
              className="text-lg text-primary"
              type="button"
              data-testid="active-filter"
            >
              Active
            </button>
            (
            {
              coupons.filter(
                (coupon) => getStatus(coupon.expirationDate) === 'Active'
              ).length
            }
            )
          </li>
          <span className="text-sm">|</span>
          <li className="flex gap-2 items-center">
            <button
              className="text-lg text-primary"
              type="button"
              data-testid="expired-filter"
            >
              Expired
            </button>
            (
            {
              coupons.filter(
                (coupon) => getStatus(coupon.expirationDate) === 'Expired'
              ).length
            }
            )
          </li>
        </ul>
        <div className="flex gap-2 border border-gray-500 rounded items-center bg-white p-2">
          <IoIosSearch size={24} />
          <input
            id="searchInput"
            placeholder="Search coupons..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-white placeholder:text-gray-400 font-light"
          />
        </div>
      </div>
      {/* Table */}
      {deleteModal && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <div className="w-80 h-48 bg-dashgrey rounded-lg">
            <div className="my-10 ml-5">
              Are you sure you want to Delete?
              <div className="flex justify-center my-1 font-semibold text-primary">
                <p>This coupons</p>
              </div>
            </div>
            <div className="flex justify-around items-center">
              <Button
                title="Cancel"
                styles="w-28"
                onClick={handleCancelDelete}
              />
              <Button
                title="Delete"
                styles="w-28 bg-red-400"
                onClick={handleConfirmDelete}
              />
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="md:flex items-center justify-center">
          <PuffLoader
            color="#6D31ED"
            cssOverride={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}
          />
        </div>
      ) : error ? (
        <>{showErrorToast(error)}</>
      ) : (
        <div className="overflow-x-scroll  bg-white p-2">
          <table className="w-full">
            <thead>
              <tr className="w-full bg-gray-100 rounded">
                <th
                  colSpan={2}
                  className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]"
                >
                  Code
                </th>
                <th className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Percentage(%)
                </th>
                <th className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Expiration Date
                </th>
                <th className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  A/P
                </th>
                <th className="px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Seller
                </th>
                <th
                  colSpan={2}
                  className="px-4 py-2 text-center text-sm uppercase font-normal text-[#565D6D]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((coupon) => (
                <React.Fragment key={coupon.id}>
                  <tr className="hover:bg-gray-100 cursor-pointer font-light">
                    <td className="px-4 py-2">
                      <IoIosArrowDown
                        size={24}
                        onClick={() => toggleRow(coupon.id)}
                      />
                    </td>
                    <td className="px-4 py-2 text-[#0095FF]">{coupon.code}</td>
                    <td className="px-4 py-2">{coupon.description}</td>
                    <td className="px-4 py-2">{coupon.percentage}%</td>
                    <td className="px-4 py-2">{coupon.expirationDate}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`${
                          getStatus(coupon.expirationDate) === 'Active'
                            ? 'border border-green-400 text-green-400'
                            : 'border border-red-400 text-red-400'
                        } px-2 py-1 text-xs rounded-md`}
                      >
                        {getStatus(coupon.expirationDate)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {coupon.applicableProducts.length}
                    </td>
                    <td className="px-4 py-2">
                      {coupon.vendor?.firstName || User}
                    </td>
                    {Role === 'Vendor' ? (
                      <div>
                        <td className="px-4 py-2 text-right">
                          <Link to={`/dashboard/editCoupon/${coupon.id}`}>
                            <MdOutlineEdit color="black" size={20} />
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <FaRegTrashAlt
                            color="crimson"
                            size={18}
                            onClick={() => showDeleteModal(coupon.id)}
                          />
                        </td>
                      </div>
                    ) : (
                      <p className="px-4 py-2 cursor-pointer text-primary">
                        Contact Own{' '}
                      </p>
                    )}
                  </tr>
                  {expandedRows.includes(coupon.id) && (
                    <tr className="bg-gray-50 border-b border-gray-200 transition-all duration-300 ease-in-out">
                      <td colSpan={10} className="p-4">
                        <div>
                          <h3 className="text-lg font-normal mb-4">
                            Applicable Products
                          </h3>
                          <div className="grid grid-cols-3 gap-1">
                            {coupon.applicableProducts.length > 0 &&
                              coupon.applicableProducts.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex border items-center"
                                >
                                  <div className="w-20 h-20">
                                    <img
                                      className="w-full  h-full object-contain"
                                      src={product.image}
                                      alt={product.name}
                                    />
                                  </div>
                                  <div className="w-1/2 p-2">
                                    <p className="text-sm">{product.name}</p>
                                    <p>
                                      {' '}
                                      <span className="font-light">
                                        Quantity:
                                      </span>{' '}
                                      {product.quantity}
                                    </p>
                                    <p>
                                      <span className="font-light">
                                        Prices:
                                      </span>{' '}
                                      <span className="text-red-500">
                                        {' '}
                                        $
                                        {product.salesPrice === 0
                                          ? product.regularPrice
                                          : product.salesPrice}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className=" flex flex-row justify-end pt-3 ">
            <CircularPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Coupons;
