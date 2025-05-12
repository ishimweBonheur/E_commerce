import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Power, Search } from 'lucide-react';
import PuffLoader from 'react-spinners/PuffLoader';
import { RootState, AppDispatch } from '@/app/store';
import { fetchProducts } from '@/app/Dashboard/AllProductSlices';
import { fetchBuyers } from '@/app/Dashboard/buyerSlice';
import Button from '@/components/form/Button';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';

interface Vendor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  status: string;
  updatedAt: string;
}

function Seller() {
  const dispatch = useDispatch<AppDispatch>();
  const { buyers, status } = useSelector((state: RootState) => state.buyer);
  const { allProducts } = useSelector((state: RootState) => state.products);

  const [numberofItemPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [reRenderTrigger, setReRenderTrigger] = useState(false);
  const [clickedVendor, setClickedVendor] = useState<Vendor | null>(null);
  const [deactivate, setDeactivate] = useState(false);
  const [activate, setActivate] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBuyers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredVendors(buyers.filter((v) => v.userType.name === 'Vendor'));
  }, [buyers, reRenderTrigger]);

  const vendors = filteredVendors;
  const TotalPages = Math.ceil(vendors.length / numberofItemPerPage);
  const pages = [...Array(TotalPages + 1).keys()].slice(1);
  const itemsOnNextPage = currentPage * numberofItemPerPage;
  const itemsOnPreviousPage = itemsOnNextPage - numberofItemPerPage;
  const visiblePage = vendors.slice(itemsOnPreviousPage, itemsOnNextPage);

  const HandleEdit = (vendor: Vendor | null) => {
    setDeactivate(true);
    setClickedVendor(vendor);
  };

  const HandleActive = (vendor: Vendor | null) => {
    setActivate(true);
    setClickedVendor(vendor);
  };

  const activateVendor = `${import.meta.env.VITE_BASE_URL}/activate/${clickedVendor?.id}`;

  const HandleActivate = (vendor: Vendor | null) => {
    if (vendor?.status !== 'active') {
      axios
        .put(activateVendor, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            showSuccessToast(`${vendor?.firstName} Activated Successfully`);
            setReRenderTrigger((prev) => !prev);
            dispatch(fetchBuyers());
          } else {
            showErrorToast('Failed to Activate the vendor');
          }
        })
        .catch((error) => {
          showErrorToast(error.message);
        });
    } else {
      showErrorToast('User is Already Active');
    }
  };

  const updateVendorStatus = `${import.meta.env.VITE_BASE_URL}/deactivate/${clickedVendor?.id}`;

  const handleSuspend = (vendor: Vendor | null) => {
    if (vendor?.status !== 'inactive') {
      axios
        .put(updateVendorStatus, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            showSuccessToast(`${vendor?.firstName} Suspended Successfully`);
            setReRenderTrigger((prev) => !prev);
            dispatch(fetchBuyers());
          } else {
            showErrorToast('Failed to Suspend the vendor');
          }
        })
        .catch((error) => {
          showErrorToast(error.message);
        });
    } else {
      showErrorToast('User is Already Inactive');
    }
  };

  const ItemCount = (vendorfirstName: string) => {
    return allProducts.filter(
      (product) => product.vendor.firstName === vendorfirstName
    ).length;
  };

  const DateFormat = (udpdatedAt: string) => {
    const date = new Date(udpdatedAt);
    return date.toLocaleDateString();
  };

  const HandleNext = () => {
    if (currentPage < TotalPages) setCurrentPage(currentPage + 1);
  };

  const HandlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const HandleSearch = (value: string) => {
    setSearch(value);
    if (value.trim() === '') {
      setFilteredVendors(buyers.filter((v) => v.userType.name === 'Vendor'));
    } else {
      setFilteredVendors(
        buyers
          .filter((v) => v.userType.name === 'Vendor')
          .filter((v) =>
            `${v.firstName} ${v.lastName} ${v.email}`
              .toLowerCase()
              .includes(value.toLowerCase())
          )
      );
    }
  };

  return (
    <div className="mt-8 text-md text-dashgreytext">
      {deactivate && (
        <div className="fixed w-screen md:h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <div className="w-80 h-48 bg-dashgrey rounded-lg">
            <div className="my-10 ml-5">
              Are you sure you want to suspend?
              <div className="flex justify-center my-1">
                {clickedVendor?.firstName}
              </div>
            </div>
            <div className="flex justify-around items-center">
              <Button
                title="Cancel"
                styles="w-28"
                onClick={() => setDeactivate(false)}
              />
              <Button
                title="Suspend"
                styles="w-28 bg-red-600"
                onClick={() => handleSuspend(clickedVendor)}
              />
            </div>
          </div>
        </div>
      )}

      {activate && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <div className="w-80 h-48 bg-dashgrey rounded-lg">
            <div className="my-10 ml-5">
              Are you sure you want to activate?
              <div className="flex justify-center my-1 font-semibold text-primary">
                {clickedVendor?.firstName}
              </div>
            </div>
            <div className="flex justify-around items-center">
              <Button
                title="Cancel"
                styles="w-28"
                onClick={() => setActivate(false)}
              />
              <Button
                title="Activate"
                styles="w-28 bg-red"
                onClick={() => HandleActivate(clickedVendor)}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="md:flex md:gap-5 md:p-5">
          <div className="text-2xl font-medium">Sellers</div>
          <button
            type="button"
            className="border-[2px] border-primary text-primary px-[5px] py-[5px] rounded-md flex justify-center items-center gap-2 text-sm
                hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
          >
            Add Seller
          </button>
        </div>
        <div className="md:flex justify-between md:p-5">
          <div className="flex gap-5 py-2">
            <p>All ({vendors.length})</p>
            <p className="text-primary">
              Approved ({vendors.filter((v) => v.status === 'active').length})
            </p>
            <p className="text-primary">
              Suspended ({vendors.filter((v) => v.status === 'inactive').length}
              )
            </p>
          </div>
          <div className="relative">
            <Search className="absolute w-5 left-2 top-2" />
            <input
              type="text"
              placeholder="Search Seller"
              className="rounded-lg pl-10 gap-2 py-2 focus:border-none focus:outline-none w-full border-2 border-[#9095A1]"
              value={searchTerm}
              onChange={(e) => HandleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-10">
        {status === 'loading' && (
          <div className="md:flex items-center justify-center h-[60vh]">
            <PuffLoader size={100} color="#1A8CD8" />
          </div>
        )}
        {status === 'succeeded' && (
          <div className="overflow-x-auto md:p-5">
            <table className="table-auto w-full rounded-lg">
              <thead className="bg-white border-[1px] border-t-0 border-dashborder">
                <tr>
                  <th className="py-5 pl-5 text-left">Name</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Items</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {visiblePage.map((vendor, i) => (
                  <tr
                    className={`border border-b-0 border-dashborder ${
                      i % 2 !== 0 ? 'bg-white' : 'bg-[#F7F7F7]'
                    }`}
                    key={vendor.id}
                  >
                    <td className="py-3 pl-5 flex items-center gap-3 whitespace-nowrap">
                      <img
                        src={vendor.picture}
                        alt="seller avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span>{`${vendor.firstName} ${vendor.lastName}`}</span>
                      </div>
                    </td>
                    <td>{vendor.email}</td>
                    <td>{ItemCount(vendor.firstName)}</td>
                    <td>{DateFormat(vendor.updatedAt)}</td>
                    <td>
                      <span
                        className={`${
                          vendor.status === 'inactive'
                            ? 'bg-[#FFEBEB] text-[#D61B1F]'
                            : 'bg-[#E3F9F1] text-[#38CB89]'
                        } px-2 py-1 rounded-md text-[10px]`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="relative">
                      <div className="flex gap-2 items-center">
                        {vendor.status === 'inactive' && (
                          <button
                            type="button"
                            className="px-[5px] py-[5px] rounded-md flex justify-center items-center gap-2 text-sm
                            hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                            onClick={() => HandleActive(vendor)}
                          >
                            <Power className="w-5 text-[#00FF00]" />
                          </button>
                        )}
                        {vendor.status === 'active' && (
                          <button
                            type="button"
                            className="px-[5px] py-[5px] rounded-md flex justify-center items-center gap-2 text-sm
                            hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                            onClick={() => HandleEdit(vendor)}
                          >
                            <Power className="w-5 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex p-3 justify-end items-center mt-2 mr-2 text-xl text-[#9095A1]">
              <button
                type="submit"
                className="pr-2 cursor-pointer"
                onClick={() => HandlePrev()}
              >
                <ChevronLeft />
              </button>
              {pages &&
                pages.map((page) => (
                  <button
                    key={page}
                    type="submit"
                    className={`cursor-pointer w-10 h-10  hover:translate ${
                      currentPage === page
                        ? 'border border-primary rounded-full'
                        : ''
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {`${page} `}
                  </button>
                ))}
              <button
                type="submit"
                className="pl-2 cursor-pointer"
                onClick={() => HandleNext()}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
        {status === 'failed' && (
          <div className="md:flex items-center justify-center h-[60vh]">
            <div className="text-red-500">Failed to fetch sellers</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Seller;
