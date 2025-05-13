import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt, FaWindowClose } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import {
  ChevronLeft,
  ChevronRight,
  Power,
  RefreshCcw,
  Search,
} from 'lucide-react';
import PuffLoader from 'react-spinners/PuffLoader';
import ConfirmationCard from '@/components/dashBoard/ConfirmationCard';
import { RootState, AppDispatch } from '@/app/store';
import { fetchBuyers } from '@/app/Dashboard/buyerSlice';
import Button from '@/components/form/Button';

import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';

interface Buyer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  status: string;
  updatedAt: string;
  userType: {
    id: string;
    name: string;
  };
}

interface UserRoleUpdate {
  userId: number;
  newRoleId: number;
}

function Customer() {
  const dispatch = useDispatch<AppDispatch>();
  const { buyers, status } = useSelector((state: RootState) => state.buyer);

  const navigate = useNavigate();

  const [numberofItemPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearch] = useState('');
  const [filteredcustomers, setFilteredcustomer] = useState<Buyer[]>([]);
  const [reRenderTrigger, setReRenderTrigger] = useState(false);

  const [clickedcustomer, setClickedcustomer] = useState<Buyer | null>(null);
  const [deactivate, setDeactivate] = useState(false);
  const [activate, setActivate] = useState(false);
  const [mode, setmode] = useState('');
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [updating, setupdating] = useState(false);
  const [updateRole, setupRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number>(4);

  useEffect(() => {
    dispatch(fetchBuyers());
  }, [dispatch]);

  useEffect(() => {
    if (buyers) {
      setFilteredcustomer(buyers.filter((v) => v.userType.name === 'Buyer'));
    }
  }, [buyers, reRenderTrigger]);

  const customers = filteredcustomers;
  const TotalPages = Math.ceil(customers.length / numberofItemPerPage);
  const pages = [...Array(TotalPages + 1).keys()].slice(1);
  const itemsOnNextPage = currentPage * numberofItemPerPage;
  const itemsOnPreviousPage = itemsOnNextPage - numberofItemPerPage;
  const visiblePage = customers.slice(itemsOnPreviousPage, itemsOnNextPage);

  const handleEdit = (customer: Buyer) => {
    setClickedcustomer(customer);
    setmode('edit');
    setDeactivate(true);
  };

  const handleRole = (customer: Buyer | null) => {
    if (!customer) return;
    setClickedcustomer(customer);
    setupRole(true);
    // Set initial role based on current user type
    const currentRoleId = customer.userType.id ? parseInt(customer.userType.id) : 4; // Convert string to number
    setSelectedRole(currentRoleId);
  };

  const HandleActive = (customer: Buyer | null) => {
    setActivate(true);
    setClickedcustomer(customer);
  };

  const HandleDelete = (customer: Buyer | null) => {
    setClickedcustomer(customer);
    setModalVisible(true);
    setmode('delete');
  };
  const confirmDelete = async () => {
    setModalVisible(false);
    setupdating(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/user/delete/${clickedcustomer?.id}`
      );
      navigate(`/dashboard/customer`);
      dispatch(fetchBuyers());
      setupdating(false);
      showSuccessToast(`${clickedcustomer?.firstName} was Delete Successfully`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        navigate(`/dashboard/customer`);
        setupdating(false);
        showErrorToast(`Deleting ${clickedcustomer?.firstName} failed`);
        throw new Error(
          `Error Deleting product with id ${clickedcustomer?.firstName}: ${error.message}`
        );
      } else {
        navigate(`/dashboard/customer`);
        setupdating(false);
        showErrorToast(`Deleting ${clickedcustomer?.firstName} failed`);
        throw new Error(`Unexpected error occurred: ${error}`);
      }
    }
  };
  const comformedit = async () => {
    if (!clickedcustomer) return;
    
    setupRole(false);
    setupdating(true);
    
    const formData: UserRoleUpdate = {
      userId: clickedcustomer.id,
      newRoleId: selectedRole,
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/roles/change_user_role`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(fetchBuyers());
        setupdating(false);
        showSuccessToast(
          `${clickedcustomer.firstName}'s role was changed successfully`
        );
      } else {
        throw new Error('Failed to change role');
      }
    } catch (error) {
      setupdating(false);
      if (axios.isAxiosError(error)) {
        showErrorToast(
          `Failed to change role: ${error.response?.data?.message || error.message}`
        );
      } else {
        showErrorToast('An unexpected error occurred while changing role');
      }
    }
  };

  const closedit = () => {
    setupRole(false);
  };

  const handleStatusChange = async (customer: Buyer, newStatus: 'active' | 'inactive') => {
    if (!customer) return;
    
    setupdating(true);
    const endpoint = newStatus === 'active' 
      ? `${import.meta.env.VITE_BASE_URL}/activate/${customer.id}`
      : `${import.meta.env.VITE_BASE_URL}/deactivate/${customer.id}`;

    try {
      const response = await axios.put(
        endpoint,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(fetchBuyers());
        setupdating(false);
        showSuccessToast(
          `${customer.firstName} ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`
        );
        setReRenderTrigger((prev) => !prev);
      } else {
        throw new Error(`Failed to ${newStatus === 'active' ? 'activate' : 'suspend'} user`);
      }
    } catch (error) {
      setupdating(false);
      if (axios.isAxiosError(error)) {
        showErrorToast(
          `Failed to ${newStatus === 'active' ? 'activate' : 'suspend'} user: ${error.response?.data?.message || error.message}`
        );
      } else {
        showErrorToast(`An unexpected error occurred while updating user status`);
      }
    }
  };

  const HandleActivate = (customer: Buyer | null) => {
    if (!customer) return;
    if (customer.status === 'active') {
      showErrorToast('User is already active');
      return;
    }
    handleStatusChange(customer, 'active');
  };

  const handleSuspend = (customer: Buyer | null) => {
    if (!customer) return;
    if (customer.status === 'inactive') {
      showErrorToast('User is already inactive');
      return;
    }
    handleStatusChange(customer, 'inactive');
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
      setFilteredcustomer(buyers.filter((v) => v.userType.name === 'Buyer'));
    } else {
      setFilteredcustomer(
        buyers
          .filter((v) => v.userType.name === 'Buyer')
          .filter((v) =>
            `${v.firstName} ${v.lastName} ${v.email}`
              .toLowerCase()
              .includes(value.toLowerCase())
          )
      );
    }
  };

  return (
    <div className="mt-8 ml-4 text-md text-dashgreytext">
      {mode === 'delete' && (
        <div className="">
          <ConfirmationCard
            isVisible={isConfirmationModalVisible}
            onClose={() => setModalVisible(false)}
            onConfirm={confirmDelete}
            message="Are you sure you want to Delete this customer ?"
          />
        </div>
      )}
      {deactivate && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <div className="w-80 h-48 bg-dashgrey rounded-lg">
            <div className="my-10 ml-5">
              Are you sure you want to suspend?
              <div className="flex justify-center my-1">
                {clickedcustomer?.firstName}
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
                onClick={() => handleSuspend(clickedcustomer)}
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
                {clickedcustomer?.firstName}
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
                onClick={() => HandleActivate(clickedcustomer)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="ml-3">
        <div className="md:flex md:gap-5">
          <div className="text-2xl font-medium">Customers</div>
        </div>
        <div className="md:flex justify-between">
          <div className="flex gap-5 py-2">
            <p>All ({customers.length})</p>
            <p className="text-primary">
              Approved ({customers.filter((v) => v.status === 'active').length})
            </p>
            <p className="text-primary">
              Suspended (
              {customers.filter((v) => v.status === 'inactive').length})
            </p>
          </div>
          <div className="relative">
            <Search className="absolute w-5 left-2 top-2" />
            <input
              type="text"
              placeholder="Search Customer"
              className="rounded-lg pl-10 gap-2 py-2 focus:border-none focus:outline-none w-full border-2 border-[#9095A1]"
              value={searchTerm}
              onChange={(e) => HandleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-10">
        {status === 'loading' && (
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
        )}
      </div>
      <div className="hidden md:block">
        <div className="bg-white pt-5 w-full rounded-xl px-[10px]">
          <div className="bg-dashgrey rounded-md flex justify-between pl-[20px]">
            <div className="font-semibold text-grey column-img">Image</div>
            <div className="font-semibold text-grey column-firstName">
              First Name
            </div>
            <div className="font-semibold text-grey column-lastName">
              Last Name
            </div>
            <div className="font-semibold text-grey column-email">Email</div>
            <div className="font-semibold text-grey column-date">Date</div>
            <div className="font-semibold text-grey column-status">Status</div>
            <div className="font-semibold text-grey column-status">Role</div>
            <div className="font-semibold text-grey column-action">Action</div>
          </div>
          {customers.length > 0 ? (
            visiblePage.map((v, id) => (
              <div
                key={id}
                className="border-b flex items-center justify-between py-3 pl-[22px]"
              >
                <div className="text-grey font-normal column-img">
                  <img
                    src={v.picture}
                    alt=""
                    className="w-16 h-14 rounded-full ml-2"
                  />
                </div>
                <div className="text-grey font-normal column-firstName">
                  {v.firstName}
                </div>
                <div className="text-grey font-normal column-lastName">
                  {v.lastName}
                </div>
                <div className="text-grey font-normal column-email">
                  {v.email}
                </div>
                <div className="text-grey font-normal column-date">
                  {DateFormat(v.updatedAt)}
                </div>
                <div className="text-grey font-normal column-status leading-none">
                  <span
                    className={
                      v.status === 'active'
                        ? 'bg-statusBlue rounded-lg px-2 text-white py-1'
                        : 'bg-[#E06207] rounded-lg px-2 text-white py-1'
                    }
                  >
                    {v.status}
                  </span>
                </div>
                <div className="text-grey font-normal column-Role leading-none flex flex-row justify-center items-center">
                  <span className="">Buyer</span>
                  <div className=" h-[36px] w-[36px] rounded-full flex items-center justify-center hover:border-primary hover:border ">
                    <MdOutlineEdit
                      type="button"
                      className=" text-textBlack cursor-pointer  h-[18px] w-[18px]"
                      onClick={() => handleRole(v)}
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-start column-action mr-5">
                  <button type="submit" onClick={() => HandleActive(v)}>
                    <RefreshCcw className="w-5 hover:text-primary" />
                  </button>
                  <button type="submit" onClick={() => handleEdit(v)}>
                    <Power className="w-5 text-redBg hover:text-primary" />
                  </button>
                  <button
                    type="submit"
                    className="h-[36px] w-[36px] flex items-center justify-center"
                    onClick={() => HandleDelete(v)}
                  >
                    <FaRegTrashAlt className=" text-redBg  h-[20px] w-[20px] hover:text-primary" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="ml-8 mt-10">No customer Found</div>
          )}
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
      </div>

      <div className="md:hidden">
        {customers &&
          visiblePage.map((v, id) => (
            <div key={id} className="border p-4 rounded-lg mb-4 bg-white">
              <div className="flex items- mb-2 gap-4 ">
                <img
                  src={v.picture}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4 ">
                  <p className="font-semibold text-grey">
                    {v.firstName} {v.lastName}
                  </p>
                  <p className="text-grey">{v.email}</p>
                </div>
              </div>
              <div className="pt-16 ml-2 leading-7">
                <p className="text-grey">First Name: {v.firstName}</p>
                <p className="text-grey">Date: {DateFormat(v.updatedAt)}</p>
                <p className="text-grey">
                  Status:
                  <span
                    className={
                      v.status === 'active'
                        ? 'bg-statusBlue px-2 py-0.5 ml-1 rounded-md'
                        : 'bg-[#E06207] px-2 py-0.5 ml-1 rounded-md'
                    }
                  >
                    {v.status}
                  </span>
                </p>
              </div>
              <div className="flex justify-end items-end ">
                <button
                  type="submit"
                  onClick={() => HandleActive(v)}
                  className="mr-2"
                >
                  <RefreshCcw className="w-5 hover:text-primary" />
                </button>
                <button type="submit" className="mr-2">
                  <Power
                    className="w-5 text-redBg hover:text-primary"
                    onClick={() => handleEdit(v)}
                  />
                </button>
                <button
                  type="submit"
                  className=""
                  onClick={() => HandleDelete(v)}
                >
                  <FaRegTrashAlt className="w-5 h-5 text-redBg  hover:text-primary " />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div
        className={`fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 ${updating ? '' : 'hidden'}`}
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
            Processing....
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {updateRole && (
        <div className="fixed top-0 z-50 bg-opacity-50 bg-black left-0 w-screen h-screen flex flex-row justify-center items-center">
          <div className="p-8 bg-white rounded-lg shadow-lg min-w-[50px] mx-auto">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-[10%]">Change Role</h2>
                <div className="flex flex-col gap-2">
                  <div className="text-primary font-bold">Current Details:</div>
                  <div className=" flex flex-row ml-2">
                    <h2 className=" mr-1">Name:</h2>
                    <h2>
                      {clickedcustomer?.firstName} {clickedcustomer?.lastName}
                    </h2>
                  </div>
                  <div className=" flex flex-row ml-2">
                    <h2 className=" mr-1">Email:</h2>
                    <h2>{clickedcustomer?.email}</h2>
                  </div>
                  <div className=" flex flex-row ml-2">
                    <h2 className=" mr-1">Status:</h2>
                    <span className="bg-statusBlue px-2 py-0.5 ml-1 rounded-md">
                      {clickedcustomer?.status}
                    </span>
                  </div>
                  <div className=" flex flex-row ml-2">
                    <h2 className=" mr-1">Current Role:</h2>
                    <span className="bg-statusBlue px-2 py-0.5 ml-1 rounded-md">
                      Buyer
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-primary font-bold mt-[5%] mb-[2.5%]">
                    Make change:
                  </div>
                  <div className="flex flex-col">
                    <div>Select Role</div>
                    <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg hover:border hover:border-primary">
                      <select
                        name="Role"
                        onChange={(e) =>
                          setSelectedRole(parseInt(e.target.value, 10))
                        }
                        value={selectedRole}
                        className="min-h-full min-w-full font-bold bg-[#F5F6F6] outline-none"
                      >
                        <option value="4">Buyer</option>
                        <option value="6">Vendor</option>
                        <option value="7">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center ml-[20vw]">
                <button
                  onClick={() => closedit()}
                  type="button"
                  className="ml-4 text-xl text-gray-400 hover:text-gray-600"
                >
                  <FaWindowClose className="bg-white text-primary hover:text-gray-950" />
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => comformedit()}
                className="px-4 py-1 bg-primary text-sm text-white rounded-md"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => closedit()}
                className="px-4 py-1 bg-red-500 text-sm text-white rounded-md"
              >
                Concel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* -------------------------------------------------------- */}
    </div>
  );
}

export default Customer;
