import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, FieldArray, ErrorMessage } from 'formik';
import BeatLoader from 'react-spinners/BeatLoader';
import { IoIosCloseCircle } from 'react-icons/io';
import PuffLoader from 'react-spinners/PuffLoader';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { updateCoupon } from '@/features/Coupons/CouponsFeature';
import { RootState } from '@/app/store';
import { showErrorToast } from '@/utils/ToastConfig';
import Product from '@/interfaces/product';

interface CouponFormData {
  description: string;
  percentage: number;
  expirationDate: string;
  applicableProducts: Product[];
}

function EditCoupon() {
  const [products, setProducts] = useState<Product[]>([]);
  const [initialValues, setInitialValues] = useState<CouponFormData | null>(
    null
  );
  const token = useAppSelector((state: RootState) => state.signIn.token)!;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.coupons);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/product/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((err) => {
        showErrorToast(err.message);
      });

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/coupons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const coupon = response.data;
        setInitialValues({
          description: coupon.description,
          percentage: coupon.percentage,
          expirationDate: coupon.expirationDate,
          applicableProducts: coupon.applicableProducts,
        });
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  }, [token, id]);

  const handleSubmit = (
    values: CouponFormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    const updatedCoupon = {
      id: parseInt(id!, 10),
      description: values.description,
      percentage: values.percentage,
      expirationDate: values.expirationDate,
      applicableProducts: values.applicableProducts.map(
        (product) => product.id
      ),
    };

    dispatch(updateCoupon(updatedCoupon))
      .unwrap()
      .then(() => {
        resetForm();
        navigate('/dashboard/coupons');
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  };

  if (!initialValues) {
    return (
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
    );
  }

  return (
    <div className="mt-10">
      <div>
        <h2 className="text-2xl font-bold mb-5">Edit Coupon</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            description: Yup.string().required('Description is required'),
            expirationDate: Yup.date().required('Expiration date is required'),
            percentage: Yup.number()
              .min(0, 'Percentage must be at least 0')
              .max(100, 'Percentage must be at most 100')
              .required('Percentage is required'),
            applicableProducts: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.number().required(),
                  name: Yup.string().required(),
                  image: Yup.string().required(),
                  salesPrice: Yup.number().required(),
                  regularPrice: Yup.number().required(),
                })
              )
              .min(1, 'At least one product must be selected')
              .required('Applicable products are required'),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Description
                    </label>
                    <Field
                      type="text"
                      id="description"
                      name="description"
                      className={`w-full p-2 border rounded ${
                        touched.description && errors.description
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="expirationDate"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Expiration Date
                    </label>
                    <Field
                      type="date"
                      id="expirationDate"
                      name="expirationDate"
                      className={`w-full p-2 border rounded ${
                        touched.expirationDate && errors.expirationDate
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage
                      name="expirationDate"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="percentage"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Percentage
                    </label>
                    <Field
                      type="number"
                      id="percentage"
                      name="percentage"
                      className={`w-full p-2 border rounded ${
                        touched.percentage && errors.percentage
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage
                      name="percentage"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="applicableProducts"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Applicable Products
                    </label>
                    <FieldArray name="applicableProducts">
                      {({ push }) => (
                        <>
                          <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => {
                              const selectedProduct = products.find(
                                (p) => p.id === parseInt(e.target.value, 10)
                              );
                              if (
                                selectedProduct &&
                                !values.applicableProducts.some(
                                  (p) => p.id === selectedProduct.id
                                )
                              ) {
                                push(selectedProduct);
                              }
                            }}
                          >
                            <option value="">Select a product</option>
                            {products.map((product) => (
                              <option
                                key={product.id}
                                value={product.id}
                                disabled={values.applicableProducts.some(
                                  (p) => p.id === product.id
                                )}
                              >
                                {product.name}
                              </option>
                            ))}
                          </select>
                          <ErrorMessage
                            name="applicableProducts"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <div className="p-2">
                  <div className="overflow-y-auto h-80">
                    {values.applicableProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              ${product.salesPrice}
                            </p>
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue(
                                'applicableProducts',
                                values.applicableProducts.filter(
                                  (p) => p.id !== product.id
                                )
                              );
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IoIosCloseCircle size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:justify-end mt-4">
                <button
                  type="submit"
                  className="bg-primary text-white font-medium py-2 px-4 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <BeatLoader size={8} color="white" />
                  ) : (
                    'Update Coupon'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditCoupon;
