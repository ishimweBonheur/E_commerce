import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Formik,
  Field,
  ErrorMessage,
  Form,
  useFormikContext,
  FormikHelpers,
} from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import BeatLoader from 'react-spinners/BeatLoader';
import axios from 'axios';
import Check from '@/assets/Check.png';
import { AppDispatch } from '@/app/store';
import { createProduct } from '@/features/Dashboard/addProductSlice';
import { uploadSingleImage, uploadGalleryImages } from '@/utils/cloudinary';
import { showErrorToast } from '@/utils/ToastConfig';

interface FormValues {
  name: string;
  shortDesc: string;
  longDesc: string;
  regularPrice: number;
  salesPrice: number;
  quantity: number;
  categoryId: number;
  image: string | null;
  gallery: string[];
  tags: string[];
  unitMeasure: string;
  type: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

interface Icategory {
  id: number;
  name: string;
}
interface MediaSectionProps {
  localImage: string | null;
  setLocalImage: React.Dispatch<React.SetStateAction<string | null>>;
  localGallery: string[];
  setLocalGallery: React.Dispatch<React.SetStateAction<string[]>>;
}

// eslint-disable-next-line react/function-component-definition
const MediaSection: React.FC<MediaSectionProps> = ({
  localImage,
  setLocalImage,
  localGallery,
  setLocalGallery,
}) => {
  const { setFieldValue } = useFormikContext<FormValues>();

  useEffect(() => {
    setFieldValue('image', localImage);
  }, [localImage, setFieldValue]);

  useEffect(() => {
    setFieldValue('gallery', localGallery);
  }, [localGallery, setFieldValue]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = await uploadSingleImage(e.target.files[0]);
      setLocalImage(imageUrl);
    }
  };

  const handleGalleryImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = await uploadGalleryImages(Array.from(e.target.files));
      setLocalGallery((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setLocalGallery((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      setFieldValue('gallery', updatedImages);
      return updatedImages;
    });
  };

  return (
    <div className="p-3 mt-5">
      <div className="flex flex-row w-full items-center gap-3 pb-4">
        <p className="text-[#323743] text-[18px] font-bold">Media</p>
        <img src={Check} alt="CheckImage" />
      </div>
      <label
        htmlFor="imageInput"
        className="text-[#323743] text-[14px] font-bold mb-3"
      >
        Feature Image
      </label>

      {localImage ? (
        <div>
          <div className="w-[332px] h-[187px] mb-5 p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md flex items-center justify-center">
            <img
              src={localImage}
              alt="Feature"
              className="object-contain bg-white w-full h-full"
            />
          </div>
          <div className="flex flex-row relative top-[-55px] w-[332px] items-center justify-end pr-2 rounded-br-lg rounded-bl-lg pb-1 pt-1 shadow-sm bg-black bg-opacity-50">
            <button
              type="button"
              onClick={() => setLocalImage(null)}
              className="text-[11px] text-white font-bold z-20 opacity-100"
            >
              Remove
            </button>
            <label htmlFor="imageInput">
              <input
                id="imageInput"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('imageInput')?.click()}
                className="border border-slate-50 text-[11px] ml-5 p-1 z-20 rounded-md font-bold outline-none text-white"
              >
                Change Image
              </button>
            </label>
          </div>
        </div>
      ) : (
        <div className="flex border border-dashed border-slate-400 text-center w-[125px] h-[125px] cursor-pointer justify-center items-center">
          <label
            htmlFor="imageInput"
            className="text-center w-full cursor-pointer"
          >
            <input
              id="imageInput"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <span className="text-[30px] text-[#9095A1]">+</span>
          </label>
        </div>
      )}
      <ErrorMessage name="image" component="div" className="text-red-500" />

      <p className="text-white font-bold mt-4 mb-3">
        <label
          htmlFor="galleryImageInput"
          className="text-[#323743] text-[14px] font-bold"
        >
          Gallery
        </label>
        <span className="text-[#323743] text-[12px] ml-3 font-normal">
          ({localGallery.length}/4 images)
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {localGallery.map((image, index) => (
          <div
            key={`galleryImage-${index}`}
            className="relative w-[125px] h-[125px] flex justify-center items-center"
          >
            <img
              src={image}
              alt={`Gallery ${index}`}
              className="object-contain bg-white w-full h-full"
            />
            <button
              type="button"
              onClick={() => removeGalleryImage(index)}
              className="absolute top-[-10px] right-0 text-[#565D6D] rounded-full p-1"
            >
              x
            </button>
          </div>
        ))}
        {localGallery.length < 4 && (
          <div className="flex border border-dashed border-slate-400 text-center w-[125px] h-[125px] cursor-pointer justify-center items-center">
            <label
              htmlFor="galleryImageInput"
              className="text-center w-full cursor-pointer"
            >
              <input
                id="galleryImageInput"
                type="file"
                multiple
                onChange={handleGalleryImageChange}
                style={{ display: 'none' }}
              />
              <span className="text-[30px] text-[#9095A1]">+</span>
            </label>
          </div>
        )}
      </div>
      <ErrorMessage name="gallery" component="div" className="text-red-500" />
    </div>
  );
};

const validationSchema = Yup.object({
  name: Yup.string().required('Product Name is required'),
  shortDesc: Yup.string().required('Short Description is required'),
  longDesc: Yup.string().required('Long Description is required'),
  regularPrice: Yup.number().required('Regular Price is required'),
  salesPrice: Yup.number().required('Sales Price is required'),
  quantity: Yup.number().required('Quantity is required'),
  image: Yup.string().required('Feature Image is required'),
  gallery: Yup.array().min(1, 'At least one gallery image is required'),
  categoryId: Yup.number()
    .min(1, 'Please select a valid category')
    .required('Category is required'),
  type: Yup.string()
    .oneOf(['Simple', 'Grouped', 'Variable'], 'Please select a valid type')
    .required('Type is required'),
  unitMeasure: Yup.string()
    .oneOf(
      [
        'item',
        'kg',
        'g',
        'lb',
        'oz',
        'l',
        'ml',
        'pack',
        'box',
        'dozen',
        'piece',
        'set',
        'pair',
        'bottle',
        'can',
        'bag',
      ],
      'Please select a valid unit/measure'
    )
    .required('Unit/Measure is required'),
  isAvailable: Yup.boolean(),
  isFeatured: Yup.boolean(),
});

// eslint-disable-next-line react/function-component-definition
const AddProducts: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const [category, setCategory] = useState([]);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [localGallery, setLocalGallery] = useState<string[]>([]);
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    } else {
      showErrorToast('Tag does not be empty');
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showErrorToast('Please login to add products');
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategory(response.data.data);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          showErrorToast('You do not have permission to access this feature');
        } else {
          showErrorToast('Failed to load categories');
        }
      });
  }, []);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showErrorToast('Please login to add products');
      setSubmitting(false);
      return;
    }

    try {
      const updatedValues = {
        ...values,
        tags,
      };

      await dispatch(createProduct(updatedValues)).unwrap();
      setSubmitting(false);
      resetForm();
      setTags([]);
      setLocalImage(null);
      setLocalGallery([]);
    } catch (error) {
      setSubmitting(false);
      // Error is already handled in the thunk
    }
  };

  const initialValues: FormValues = {
    name: '',
    shortDesc: '',
    longDesc: '',
    regularPrice: 0,
    salesPrice: 0,
    quantity: 0,
    categoryId: 0,
    image: '',
    gallery: [],
    tags: [],
    type: '',
    unitMeasure: '',
    isAvailable: false,
    isFeatured: false,
  };
  return (
    <Formik
      initialValues={{ ...initialValues, tags }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <p className="text-[#6B7280] text-[22px]">Create new product</p>

          <div className="w-full  p-2 bg-[#FFFFFF] flex flex-col justify-between gap-10 md:flex-row lg:flex-row">
            <div className=" p-2 flex flex-1 flex-row bg-white">
              <div className=" p-2 flex-1 flex-col">
                {/* section one */}
                <div className=" p-3">
                  <div className="flex flex-row w-full  items-center gap-3 pb-3">
                    <p className="text-[#323743] text-[18px] font-bold">
                      General Information
                    </p>
                    <img src={Check} alt="CheckImage" />
                  </div>
                  <div className="flex flex-col p-1 mb-3">
                    <label
                      htmlFor="Product Names"
                      className="text-[#424856] text-[14px] font-bold"
                    >
                      Product Names is required
                    </label>
                    <Field
                      name="name"
                      as="input"
                      id="name"
                      placeholder="Casual Button-Down Shirt"
                      type="input"
                      text="text"
                      className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row ">
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="type"
                        className="text-[#424856] text-[14px] font-bold mb-2"
                      >
                        Type
                      </label>
                      <Field
                        as="select"
                        id="type"
                        name="type"
                        title="category"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px] group-hover:border-grayDark px-5 py-3 bg-white"
                      >
                        <option value="" disabled selected label="Select Type">
                          Select Type
                        </option>
                        <option value="Variable">Variable</option>
                        <option value="Simple">Simple</option>
                        <option value="Grouped">Grouped</option>
                      </Field>
                      <ErrorMessage
                        name="type"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="ProductCategory2"
                        className="text-[#424856] text-[14px] font-bold mb-2"
                      >
                        Category
                      </label>
                      <Field
                        as="select"
                        id="categoryId"
                        name="categoryId"
                        title="category"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px] group-hover:border-grayDark px-5 py-3 bg-white"
                      >
                        <option value="0" disabled selected>
                          Select Category
                        </option>
                        {category.map((item: Icategory) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                        <option value="-1">Others</option>
                      </Field>
                      <ErrorMessage
                        name="categoryId"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col p-1 mb-3">
                    <label
                      htmlFor="shortDesc"
                      className="text-[#424856] text-[14px] font-bold"
                    >
                      Short Description
                    </label>
                    <Field
                      name="shortDesc"
                      as="textarea"
                      id="shortDesc"
                      placeholder="Short Description"
                      className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      rows={3}
                    />
                    <ErrorMessage
                      name="shortDesc"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="flex flex-col p-1 mb-3">
                    <label
                      htmlFor="longDesc"
                      className="text-[#424856] text-[14px] font-bold"
                    >
                      Long Description
                    </label>
                    <Field
                      name="longDesc"
                      as="textarea"
                      id="longDesc"
                      placeholder="Enter a long description"
                      className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      rows={8}
                    />
                    <ErrorMessage
                      name="longDesc"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>

                {/* section two */}
                <MediaSection
                  localImage={localImage}
                  setLocalImage={setLocalImage}
                  localGallery={localGallery}
                  setLocalGallery={setLocalGallery}
                />

                <div className="p-3 mt-5">
                  <div className="flex flex-row w-full  items-center gap-3 pb-3">
                    <p className="text-[#323743] text-[18px] font-bold">
                      Organization
                    </p>
                    <img src={Check} alt="CheckImage" />
                  </div>
                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row ">
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="regularPrice"
                        className="text-[#424856] text-[14px] font-bold"
                      >
                        Regular Price
                      </label>
                      <Field
                        name="regularPrice"
                        as="input"
                        id="regularPrice"
                        placeholder="99"
                        type="input"
                        text="text"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      />
                      <ErrorMessage
                        name="regularPrice"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="salesPrice"
                        className="text-[#424856] text-[14px] font-bold"
                      >
                        Sales Price
                      </label>
                      <Field
                        name="salesPrice"
                        as="input"
                        id="salesPrice"
                        placeholder="79"
                        type="input"
                        text="text"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      />
                      <ErrorMessage
                        name="salesPrice"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 lg:flx-row md:flex-row ">
                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="quantity"
                        className="text-[#424856] text-[14px] font-bold"
                      >
                        quantity
                      </label>
                      <Field
                        name="quantity"
                        as="input"
                        id="quantity"
                        placeholder="1"
                        type="input"
                        text="text"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px]  group-hover:border-grayDark px-5 py-3"
                      />
                      <ErrorMessage
                        name="quantity"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                      <label
                        htmlFor="unitMeasure"
                        className="text-[#424856] text-[14px] font-bold mb-2"
                      >
                        Unit / Measure
                      </label>
                      <Field
                        as="select"
                        id="unitMeasure"
                        name="unitMeasure"
                        title="item"
                        className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px] group-hover:border-grayDark px-3 py-3 bg-white"
                      >
                        <option value="" disabled selected>
                          Select Unit / Measure
                        </option>
                        <option value="item">Item</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="lb">Pound (lb)</option>
                        <option value="oz">Ounce (oz)</option>
                        <option value="l">Liter (L)</option>
                        <option value="ml">Milliliter (ml)</option>
                        <option value="pack">Pack</option>
                        <option value="box">Box</option>
                        <option value="dozen">Dozen</option>
                        <option value="piece">Piece</option>
                        <option value="set">Set</option>
                        <option value="pair">Pair</option>
                        <option value="bottle">Bottle</option>
                        <option value="can">Can</option>
                        <option value="bag">Bag</option>
                      </Field>
                      <ErrorMessage
                        name="unitMeasure"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full p-8 pt-0 lg:w-[30%] md:w-[30%] lg:p-0 md:p-0">
              <div className="flex flex-col p-1 mb-3 w-[100%] justify-center">
                <label
                  htmlFor="Tags"
                  className="text-[#171A1F] text-[14px] font-bold items-start  justify-start flex"
                >
                  Tags
                </label>
                <div className="flex flex-row gap-2 flex-wrap pl-5 pr-5 mb-5 mt-5">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-white flex flex-row items-center text-center bg-[#6D31ED] gap-3 pr-4 pl-4 rounded-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white text-[15px]"
                      >
                        X
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col w-[100%] lg:w-[80%] md:w-[80%] ">
                  <Field
                    type="text"
                    id="Tags"
                    placeholder="Enter a tag"
                    className="h-full w-[100%] bg-transparent py-3 o p-2 outline-none rounded-md"
                    value={newTag}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewTag(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-[#6D31ED] text-[14px] outline-none flex justify-start mt-5 mb-5"
                  >
                    + Add another Tag
                  </button>
                </div>
              </div>
              <div>
                <div className="flex flex-col  p-1 mt-4 justify-center ">
                  <button
                    type="submit"
                    className="bg-primary w-[100%] text-white px-6 py-3 rounded-md flex justify-center items-center gap-2 text-sm hover:text-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out lg:w-[80%] md:w-[80%]"
                  >
                    {isSubmitting ? (
                      <BeatLoader color="#ffffff" size={8} />
                    ) : (
                      'Save Product'
                    )}
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-full p-1 mb-3 lg:w-1/2 md:w-1/2">
                <label
                  htmlFor="isFeatured"
                  className="text-[#424856] text-[14px] font-bold mb-2"
                >
                  Featured Product
                </label>
                <Field
                  as="select"
                  id="isFeatured"
                  name="isFeatured"
                  className="text-black text-xs md:text-sm duration-150 w-full outline-none rounded-md border-[1px] group-hover:border-grayDark px-3 py-3 bg-white"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </Field>
                <ErrorMessage
                  name="isFeatured"
                  component="div"
                  className="text-red-500"
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddProducts;
