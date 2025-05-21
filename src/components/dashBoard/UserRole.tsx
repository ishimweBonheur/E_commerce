/* eslint-disable react/button-has-type */
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineEdit } from 'react-icons/md';
import BeatLoader from 'react-spinners/BeatLoader';
import { RootState, AppDispatch } from '@/app/store';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';
import {
  fetchUserRoles,
  deleteUserRole,
  createUserRole,
  updateUserRole,
} from '@/features/userRole/userRoleSlice';
import ConfirmationCard from './ConfirmationCard';
import CircularPagination from './NavigateonPage';
import TableLogo from '@/assets/TableLogo.png';

function TableUserRole() {
  const dispatch: AppDispatch = useDispatch();
  const { roles, status } = useSelector((state: RootState) => state.userRoles);
  const [editRole, setEditRole] = useState<{
    id: number;
    name: string;
    permissions: string[];
  } | null>(null);

  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState<number | null>(null);
  const [mode, setMode] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [newPermission, setNewPermission] = useState('');
  const [roleName, setRoleName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    dispatch(fetchUserRoles());
  }, [dispatch]);

  const handleDelete = useCallback(async () => {
    if (itemSelected !== null) {
      const response = await dispatch(deleteUserRole(itemSelected));
      if (deleteUserRole.fulfilled.match(response)) {
        setPopupMessage('User Role deleted permanently');
        setColor('green');
        dispatch(fetchUserRoles());
      } else {
        setPopupMessage(
          'Delete User Role failed. This may be due to a network issue.'
        );
        setColor('red');
      }
      setDeleting(false);
      setModalVisible(false);
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 10000);
    }
  }, [dispatch, itemSelected]);

  useEffect(() => {
    if (deleting) {
      handleDelete();
    }
  }, [deleting, handleDelete]);

  useEffect(() => {
    if (editRole) {
      setRoleName(editRole.name);
      setPermissions(editRole.permissions);
    } else {
      setRoleName('');
      setPermissions([]);
    }
  }, [editRole]);

  const addPermission = () => {
    const trimmedPermission = newPermission.trim();
    if (trimmedPermission && !permissions.includes(trimmedPermission)) {
      setPermissions([...permissions, trimmedPermission]);
      setNewPermission('');
    } else {
      showErrorToast('Permission cannot be empty');
    }
  };

  const removePermission = (permissionToRemove: string) => {
    setPermissions(
      permissions.filter((permission) => permission !== permissionToRemove)
    );
  };

  const handleDeleteClick = (roleId: number) => {
    setItemSelected(roleId);
    setMode('delete');
    setModalVisible(true);
  };

  const handleAddRole = async () => {
    if (roleName.trim() === '') {
      showErrorToast('Role name cannot be empty');
      return;
    }
    dispatch(fetchUserRoles());
    setIsSubmitting(true);
    await dispatch(createUserRole({ name: roleName, permissions }));
    showSuccessToast('Success Role added');
    setRoleName('');
    setPermissions([]);
    setIsSubmitting(false);
  };

  const handleEditRole = async () => {
    if (editRole && roleName.trim() !== '') {
      setIsSubmitting(true);
      try {
        const response = await dispatch(
          updateUserRole({
            id: editRole.id,
            name: roleName,
            permissions,
          })
        );

        if (updateUserRole.fulfilled.match(response)) {
          dispatch(fetchUserRoles());
          setEditRole(null);
          showSuccessToast('Success Role updated');
        } else {
          showErrorToast('Failed to update role');
        }
      } catch (error) {
        showErrorToast('Failed to update role');
      }
      setIsSubmitting(false);
    } else {
      showErrorToast('Role name cannot be empty');
    }
  };

  return (
    <div className="p-5">
      <p className="mt-3 mb-3 font-bold">Manage User Role</p>
      <div className="flex flex-col w-[100%] gap-5 lg:flex-row md:flex-row">
        <div className="bg-white flex-1 h-full rounded-xl p-5">
          <table className="w-full h-full">
            <thead className="text-[12px] leading-[26px]">
              <tr className="bg-[#F5F6F6] rounded-[10px]">
                <th className="px-4 text-left text-grey text-[12px] leading-[26px]">
                  ID
                </th>
                <th className="px-4 text-left text-grey text-[12px] leading-[26px]">
                  Role Name
                </th>
                <th className="px-4 text-left text-grey text-[12px] leading-[26px]">
                  Action
                </th>
              </tr>
              <tr className="h-[20px]"></tr>
            </thead>
            <tbody>
              {status === 'loading' &&
                Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <tr
                      key={index}
                      className="border-b-[2.5px] min-w-full h-[60px] border-[#F5F6F6] last:border-none"
                    >
                      <td colSpan={3}>
                        <div className="shadow-lg animate-pulse bg-slate-300 rounded-lg h-[40px]"></div>
                      </td>
                    </tr>
                  ))}
              {status === 'failed' &&
                Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <tr
                      key={index}
                      className="border-b-[2.5px] min-w-full h-[60px] border-[#F5F6F6] last:border-none"
                    >
                      <td colSpan={3}>
                        <div className="shadow-lg bg-red-100 rounded-lg h-[40px] text-center text-red-500">
                          Failed to load roles...
                        </div>
                      </td>
                    </tr>
                  ))}
              {status === 'succeeded' &&
                roles?.map((role) => (
                  <tr
                    key={role.id}
                    className="h-[68px] text-grey leading-[16px] text-[12px] font-normal border-b-[2px] border-[#F5F6F6] last:border-none hover:translate-x-[0.7px] hover:border hover:bg-[#F5F6F6]"
                  >
                    <td className="px-2">{role.id}</td>
                    <td className="px-2">{role.name}</td>
                    <td className="px-0 flex gap-2 mt-3">
                      <div className="h-[36px] w-[36px] rounded-full flex items-center justify-center hover:border-primary hover:border">
                        <MdOutlineEdit
                          className=" text-textBlack cursor-pointer  h-[18px] w-[18px]"
                          type="button"
                          onClick={() => setEditRole(role)}
                        />
                      </div>

                      <div className='className="h-[36px] w-[36px] rounded-full flex items-center justify-center hover:border-primary hover:border'>
                        <FaRegTrashAlt
                          onClick={() => handleDeleteClick(role.id)}
                          className="text-red-500 cursor-pointer h-[16px] w-[16px]"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex items-end justify-end w-[75%]">
            <CircularPagination
              totalPages={Math.ceil((roles?.length || 0) / 6)}
              currentPage={1}
              onPageChange={() => {}}
            />
          </div>
        </div>
        <div className="flex-1 p-5">
          <div className="w-full h-10 flex flex-row items-center justify-center">
            <img
              src={TableLogo}
              alt=""
              className="w-[50px] h-[50px] text-gray600"
            />
            <p className="mt-3 text-[20px] font-bold">Register Role</p>
          </div>
          <div className="w-full mt-10 flex flex-col">
            <label htmlFor="roleName" className="mb-3">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              placeholder="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-[100%] border relative bg-grayLight text-black duration-100 outline-none justify-between flex items-center gap-2 px-3 rounded-md font-light group-hover:border-grayDark p-3 mb-5 lg:w-[70%] md:w-[70%]"
            />
          </div>

          <div className="w-full flex flex-col">
            <label htmlFor="permissions">Permissions</label>
            <div>
              <div className="flex flex-row gap-2 flex-wrap pl-5 pr-5 mb-3">
                {permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="text-white flex flex-row text-center bg-[#6D31ED] gap-3 pr-4 pl-4 rounded-sm"
                  >
                    {permission}
                    <button
                      type="button"
                      onClick={() => removePermission(permission)}
                      className="text-white text-[15px]"
                    >
                      X
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5 mb-3 md:flex-row lg:flex-row">
              <input
                type="text"
                placeholder="Enter permissions"
                id="newPermission"
                name="newPermission"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                className="w-[100%] border relative bg-grayLight duration-100 outline-none justify-between flex items-center gap-2 px-3 rounded-md font-light group-hover:border-grayDark p-3 lg:w-[70%] md:w-[70%]"
              />
              <button
                type="button"
                onClick={addPermission}
                className="w-[25%] text-primary rounded-md flex justify-center items-center gap-2 text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
              >
                + Add Permissions
              </button>
            </div>
          </div>

          <div className="flex mt-4">
            {editRole ? (
              <button
                onClick={handleEditRole}
                className=" bg-primary text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm hover:text-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  'Update Role'
                )}
              </button>
            ) : (
              <button
                onClick={handleAddRole}
                className=" bg-primary text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm hover:text-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  'Add Role'
                )}
              </button>
            )}
          </div>
        </div>

        {mode === 'delete' && (
          <div>
            <ConfirmationCard
              isVisible={isConfirmationModalVisible}
              onClose={() => setModalVisible(false)}
              onConfirm={() => setDeleting(true)}
              message="Are you sure you want to delete this user role?"
            />
          </div>
        )}

        {isPopupVisible && (
          <div
            className={`fixed inset-0 z-50 left-[65%] top-[2%] min-w-fit h-fit ${color === 'green' ? 'bg-teal-100 border-teal-500 text-teal-900' : 'bg-red-100 border-red-300'} border-t-4 rounded-b px-4 py-3 shadow-md`}
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className={`h-6 w-6 fill-current ${color === 'green' ? 'text-teal-500' : 'text-red-500'} mr-4`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">DELETE ROLE</p>
                <p className="text-sm">{popupMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableUserRole;
