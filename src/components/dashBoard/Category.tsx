import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineEdit } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import PuffLoader from 'react-spinners/PuffLoader';
import CircularPagination from './NavigateonPage';
import Button from '@/components/form/Button';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';
import HSInput from '@/components/form/HSInput';
import { AppDispatch, RootState } from '@/app/store';
import { fetchCategories } from '@/features/Products/categorySlice';

interface ICategory {
  id?: number;
  name: string;
  description: string;
  icon?: string;
}

function Category() {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [edit, setEdit] = useState(false);
  const { categories, isLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [visibleCategory, setVisbleCategory] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryPerPage = 8;
  const totalPages = Math.ceil(categories.length / categoryPerPage);
  const startIndex = (currentPage - 1) * categoryPerPage;

  const paginatedData = categories
    .filter((category) =>
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, startIndex + categoryPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setSelectedCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategory === null) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/category/${selectedCategory.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        showSuccessToast(' Deleted sucessfully');
        dispatch(fetchCategories());
      }
    } catch (error) {
      showErrorToast('Failed to delete category');
    }
  };

  const handleEdit = (category: ICategory) => {
    setEdit(!edit);
    setSelectedCategory(category);
  };

  const updateCategory = async (category: ICategory) => {
    if (!category.id) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/category/${category.id}`,
        {
          name: category.name,
          description: category.description,
          icon: category.icon,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        showSuccessToast(`${category.name} Updated sucessfully`);
        dispatch(fetchCategories());
      }
    } catch (error) {
      showErrorToast('Failed to update category');
    }
  };

  const HandleAddCategory = () => {
    setVisbleCategory(true);
  };
  const showDeleteModal = (category: ICategory) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const categoryInitialVal = {
    name: '',
    icon: '',
    description: '',
  };
  const validationSchemaCategory = Yup.object({
    name: Yup.string().required('Category name is required'),
    description: Yup.string().required('Category icon is required'),
    icon: Yup.string().required('Category description is required'),
  });

  const onsubmiting = async (
    values: ICategory,
    { resetForm }: { resetForm: () => void }
  ) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/category/`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        showSuccessToast('Category added successfully');
        dispatch(fetchCategories());
        resetForm();
      }
    } catch (error) {
      showErrorToast('Failed to add category');
    } finally {
      resetForm();
    }
  };

  return (
    <div className="p-5 max-w-screen-xl">
      <div className="flex gap-4 items-center py-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          type="button"
          onClick={HandleAddCategory}
          className="border-[2px] border-primary text-primary px-[5px] py-[5px] rounded-md flex justify-center items-center gap-2 text-sm
                hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
        >
          Add Category
        </button>
      </div>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:justify-between">
        <ul className="flex gap-4 items-center">
          <li className="flex gap-2 items-center">
            <button type="button" className="text-lg">
              All
            </button>
            ({categories.length})
          </li>
        </ul>
        <div className="flex gap-2 border border-gray-500 rounded items-center bg-white p-2">
          <IoIosSearch size={24} />
          <input
            id="searchInput"
            placeholder="Search category..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-white placeholder:text-gray-400 font-light"
          />
        </div>
      </div>

      {visibleCategory && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <Formik
            initialValues={categoryInitialVal}
            validationSchema={validationSchemaCategory}
            onSubmit={onsubmiting}
          >
            <Form>
              <div className="w-96 h-auto block items-center justify-center  bg-white rounded-lg p-4">
                <div className="py-4">
                  <h1 className="text-xl flex justify-center pb-5 uppercase font-normal">
                    Add Category
                  </h1>
                  <label htmlFor="name">Name</label>
                  <Field
                    as={HSInput}
                    placeholder="Name of the category"
                    name="name"
                    type="input"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-redBg"
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <Field
                    as={HSInput}
                    placeholder="Description of the category"
                    type="input"
                    name="description"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-redBg"
                  />
                </div>

                <div>
                  <label htmlFor="icon">Icon URL</label>
                  <Field
                    as={HSInput}
                    placeholder="URL of the category icon"
                    type="input"
                    name="icon"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-redBg"
                  />
                </div>
                <div className="flex items-center justify-center py-7 gap-4 mt-4">
                  <Button
                    title="Cancel"
                    onClick={() => setVisbleCategory(false)}
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      )}

      {edit && selectedCategory && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <div className="w-96 h-auto block items-center justify-center  bg-white rounded-lg p-4">
            <div className="py-4">
              <label htmlFor="name">Name</label>
              <HSInput
                placeholder="Name of the category"
                type="input"
                values={selectedCategory.name}
                id="name"
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <HSInput
                placeholder="Description of the category"
                type="input"
                values={selectedCategory.description}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="icon">Icon URL</label>
              {selectedCategory.icon && (
                <div className="mt-2">
                  <img
                    src={selectedCategory.icon}
                    alt="Icon Preview"
                    className="w-10 h-6 rounded-md"
                  />
                </div>
              )}

              <HSInput
                placeholder="URL of the category icon"
                type="input"
                values={selectedCategory.icon}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    icon: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-center py-7 gap-4 mt-4">
              <Button title="Cancel" onClick={() => setEdit(false)} />
              <Button
                title="Edit"
                onClick={() => {
                  if (selectedCategory) updateCategory(selectedCategory);
                }}
                styles="bg-blue-500 text-white"
              />
            </div>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-50 bg-black bg-opacity-50 top-0 left-0">
          <div className="w-80 h-56 bg-dashgrey rounded-lg">
            <div className="my-10 ml-5">
              Are you sure you want to delete this category?
              <div className="flex justify-center my-1 font-semibold text-primary">
                <p>{selectedCategory?.name}</p>
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
      {isLoading ? (
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
      ) : (
        <div className="overflow-x-scroll bg-white p-2">
          <table className="w-full table-fixed">
            <thead>
              <tr className="w-full bg-gray-100 rounded">
                <th className="w-1/6 px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  #
                </th>
                <th className="w-2/6 px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Category
                </th>
                <th className="w-2/6 px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Icon
                </th>
                <th className="w-2/6 px-4 py-2 text-left text-sm uppercase font-normal text-[#565D6D]">
                  Description
                </th>
                <th
                  className="w-1/6 px-4 py-2 text-center text-sm uppercase font-normal text-[#565D6D]"
                  colSpan={2}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((category, index) => (
                <React.Fragment key={category.id}>
                  <tr className="hover:bg-gray-100 cursor-pointer font-light border-b py-4">
                    <td className="w-1/6 px-4 py-2 text-[#0095FF]">
                      {index + 1 + (currentPage - 1) * categoryPerPage}
                    </td>
                    <td className="w-2/6 px-4 py-2">{category.name}</td>
                    <td className="w-2/6 px-4 py-2">
                      <div>
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-16 h-8 rounded-md"
                        />
                      </div>
                    </td>
                    <td className="w-2/6 px-4 py-2">{category.description}</td>
                    <td className="w-1/6 py-2 text-right">
                      <button
                        type="submit"
                        onClick={() => handleEdit(category)}
                        className=""
                      >
                        <MdOutlineEdit color="black" size={20} />
                      </button>
                    </td>
                    <td className="w-1/6 py-2 text-right">
                      <button
                        onClick={() => showDeleteModal(category)}
                        className="pr-4"
                        type="submit"
                      >
                        <FaRegTrashAlt color="crimson" size={18} />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row justify-end pt-3">
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

export default Category;
