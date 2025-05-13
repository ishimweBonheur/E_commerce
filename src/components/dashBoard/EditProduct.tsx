import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineCloudUpload, MdCheckCircle } from 'react-icons/md';
import { RootState } from '../../app/store';

import ConfirmationCard from './ConfirmationCard';
import Product from '@/interfaces/product';
import { uploadSingleImage, uploadGalleryImages } from '@/utils/cloudinary.tsx';

// -------------------------------------------------------------------------------------------

interface UpdateProduct {
  name: string;
  image: string;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  categoryId: number;
  quantity: number;
  regularPrice: number;
  salesPrice: number;
  tags: string[];
  type: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

function EditProducts() {
  const { id } = useParams();
  const DashboardProduct = useSelector((state: RootState) =>
    state.DeshboardProducts.DashboardProduct.find(
      (product) => product.id === Number(id)
    )
  );
  const navigate = useNavigate();
  const [product, setDashboardProduct] = useState<Product | null>(null);
  const [isConfirmationModalVisible, setModalVisible] = useState(false);
  const [PreviewOfFiles, setPreviewOfFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setupdating] = useState(false);
  const [imageLoading, setimageloading] = useState(true);

  useEffect(() => {
    if (DashboardProduct) {
      setDashboardProduct(DashboardProduct);
    } else {
      navigate(`/dashboard/product/`);
    }
  }, [id, DashboardProduct, navigate]);

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (product && name === 'image') {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const selectedFile = input.files[0];
        setLoading(true);
        try {
          const url = await uploadSingleImage(selectedFile);
          setDashboardProduct({ ...product, image: url });
          setimageloading(false);
        } catch (error) {
          throw new Error(`Error uploading images: ${error}`);
        }
      }
    } else if (product && name === 'gallery') {
      const input = e.target as HTMLInputElement;
      if (input.files) {
        const selectedFiles = Array.from(input.files).slice(0, 3);
        setPreviewOfFiles(
          selectedFiles.map((file) => URL.createObjectURL(file))
        );
        setLoading(true);
        try {
          const urls = await uploadGalleryImages(selectedFiles);
          const filesArray = Array.from(urls);
          setDashboardProduct({ ...product, gallery: filesArray });
          setLoading(false);
        } catch (error) {
          throw new Error(`Error uploading images: ${error}`);
        }
      }
    } else if (product) {
      if (name === 'category') {
        setDashboardProduct({
          ...product,
          category: { ...product.category, name: value },
        });
      } else if (name === 'tags') {
        const tagsArray = value.split(',').map((tag) => tag.trim());
        setDashboardProduct({ ...product, tags: tagsArray });
      } else {
        setDashboardProduct({ ...product, [name]: value });
      }
    }
  };

  const transformToNewProduct = (oldProduct: Product): UpdateProduct => {
    return {
      name: oldProduct.name,
      image: oldProduct.image,
      gallery: oldProduct.gallery,
      shortDesc: oldProduct.shortDesc,
      longDesc: oldProduct.longDesc,
      categoryId: DashboardProduct?.category.id || 5,
      quantity: oldProduct.quantity,
      regularPrice: oldProduct.regularPrice,
      salesPrice: oldProduct.salesPrice,
      tags: oldProduct.tags,
      type: oldProduct.type,
      isAvailable: oldProduct.isAvailable,
      isFeatured: oldProduct.isFeatured,
    };
  };

  const handleSubmit = async () => {
    let newproduct;
    setModalVisible(false);
    setupdating(true);

    if (product) {
      newproduct = transformToNewProduct(product);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/product/${id}`,
        newproduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/dashboard/product/`);
      setupdating(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Error updating product with id ${id}: ${error.message}`
        );
      } else {
        throw new Error(`Unexpected error occurred: ${error}`);
      }
      setModalVisible(false);
    }
  };

  const handleUpdate = () => {
    setModalVisible(true);
  };

  return (
    <div className="pr-[3%]">
      <div className=" mb-4">
        <div className="font-bold text-lg " data-testid="heading">
          Edit Product
        </div>
      </div>
      <div className="bg-white mr-[10%] w-full h-full flex flex-col pr-[5%] pt-[5%] pb-[10%] rounded-2xl">
        <div className=" grid gap-[5%] md:grid-cols-2 grid-rows-1 mb-[3%] sm:grid-cols-1 ">
          <div className="flex flex-col justify-start items-center text-[#3E3E3E] text-[14px] pl-[7%]">
            <div className=" w-full mx-[7%] mb-[2.5%] ">
              <div className="">Product Name</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <input
                  type="text"
                  data-testid="productName"
                  name="name"
                  id="name"
                  placeholder="Iphone"
                  value={product?.name || ''}
                  onChange={handleChange}
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                />
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Image</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <input
                  type="file"
                  data-testid="image"
                  name="image"
                  id="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full h-full outline-none  bg-[#F5F6F6]"
                />
                <div className={imageLoading ? 'hidden' : ''}>
                  <MdCheckCircle
                    className={imageLoading ? 'text-red-500' : 'text-green-800'}
                  />
                </div>
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Short Description</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <input
                  type="text"
                  data-testid="short"
                  name="shortDesc"
                  id="shortDesc"
                  value={product?.shortDesc || ''}
                  onChange={handleChange}
                  placeholder="Short Description"
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                />
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Long Description</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <textarea
                  name="longDesc"
                  data-testid="long"
                  id="longDesc"
                  value={product?.longDesc || ''}
                  onChange={handleChange}
                  placeholder="Long Description"
                  className=" w-full h-full outline-none pt-[8px] bg-[#F5F6F6]"
                />
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Quantity</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={product?.quantity || ''}
                  onChange={handleChange}
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                />
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Regular Price</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <input
                  type="number"
                  name="regularPrice"
                  id="regularPrice"
                  value={product?.regularPrice || ''}
                  onChange={handleChange}
                  placeholder="$2000"
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center text-[#3E3E3E] text-[14px] pl-[3%] sm:pl-[7%]">
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Type</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <select
                  name="type"
                  id="type"
                  value={product?.type || ''}
                  onChange={handleChange}
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                >
                  <option value="simple">Simple</option>
                  <option value="grouped">Grouped</option>
                  <option value="variable">Variable</option>
                  <option value="downloadable">Downloadable</option>
                  <option value="virtual">Virtual</option>
                  <option value="external">External</option>
                </select>
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Gallery</div>
              <div className="bg-[#F5F6F6] min-h-[142px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <div className=" w-full h-full flex flex-col">
                  <input
                    type="file"
                    name="gallery"
                    id="gallery_"
                    onChange={handleChange}
                    multiple
                    accept="image/*"
                    className=" hidden"
                  />
                  <label
                    htmlFor="gallery_"
                    className=" flex flex-col justify-center items-center"
                  >
                    <MdOutlineCloudUpload className=" w-[32px] h-[32px] text-primary" />
                    <div className=" text-lg">Click To upload</div>
                  </label>
                  <div className="ml-4 mb-2 flex flex-col">
                    {PreviewOfFiles.length > 0 && (
                      <div className="mt-2">
                        <strong className="text-primary flex flex-row">
                          Uploaded Files:
                          {loading ? (
                            <div className=" text-red-500 ml-1">
                              Uploading...
                            </div>
                          ) : (
                            <div className=" text-green-800 ml-1">Uploaded</div>
                          )}
                        </strong>
                        <ul className="flex flex-row items-center justify-evenly">
                          {PreviewOfFiles.map((preview, index) => (
                            <li key={index}>
                              <div className="flex flex-row justify-start items-center">
                                <div
                                  className={` border-2  rounded ${loading ? 'border-red-500' : 'border-green-800'}`}
                                >
                                  <img
                                    src={preview}
                                    alt=""
                                    className=" h-[80px] w-[80px]"
                                  />
                                </div>
                                <MdCheckCircle
                                  className={
                                    loading ? 'text-red-500' : 'text-green-800'
                                  }
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Category</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <select
                  name="category"
                  value={product?.category.name || ''}
                  onChange={handleChange}
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                >
                  <option value="shirt">Shirt</option>
                  <option value="pants">Pants</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                  <option value="electronics">Electronics</option>
                  <option value="home_appliances">Home Appliances</option>
                  <option value="books">Books</option>
                  <option value="beauty">Beauty</option>
                  <option value="fruits_vegetables">Fruits & Vegetables</option>
                  <option value="dairy_products">Dairy Products</option>
                  <option value="meat_poultry">Meat & Poultry</option>
                  <option value="seafood">Seafood</option>
                  <option value="bakery">Bakery</option>
                  <option value="beverages">Beverages</option>
                  <option value="snacks">Snacks</option>
                  <option value="frozen_foods">Frozen Foods</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Tags</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <input
                  type="text"
                  name="tags"
                  value={product?.tags || []}
                  onChange={handleChange}
                  placeholder="Tags"
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                />
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Is Available</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <select
                  name="isAvailable"
                  value={String(product?.isAvailable || false)}
                  onChange={handleChange}
                  className=" w-full h-full outline-none  bg-[#F5F6F6]"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>
            <div className="w-full mx-[7%] mb-[2.5%]">
              <div className="">Is Featured</div>
              <div className="bg-[#F5F6F6] min-h-[51px] w-full flex flex-row mt-[10px] items-center pl-[10px] rounded-lg">
                <select
                  name="isFeatured"
                  value={String(product?.isFeatured || false)}
                  onChange={handleChange}
                  className="w-full h-full outline-none bg-[#F5F6F6]"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between self-center">
          <button
            type="button"
            data-testid="edit-button"
            onClick={handleUpdate}
            className=" bg-primary border-[2px] h-full w-full border-primary text-white px-[60px] py-[7px] rounded-md flex justify-center items-center gap-2 text-lg
                hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out hover:bg-white hover:text-primary"
          >
            Edit Product
          </button>
        </div>
      </div>
      <div className="">
        <ConfirmationCard
          isVisible={isConfirmationModalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleSubmit}
          message="Are you sure you want to Update this item ?"
        />
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
            Updating....
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProducts;
