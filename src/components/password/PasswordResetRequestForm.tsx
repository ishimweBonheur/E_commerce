import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { MdOutlineEmail } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import Button from '@/components/form/Button';
import HSInput from '@/components/form/HSInput';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { requestPasswordReset } from '@/features/Auth/password';
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from '@/utils/ToastConfig';

interface MyFormValues {
  email: string;
}

const initialValues: MyFormValues = {
  email: '',
};

const validationSchema: yup.ObjectSchema<MyFormValues> = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required!'),
});

export default function PasswordResetRequestForm() {
  const dispatch = useAppDispatch();

  const { status, error } = useAppSelector((state) => state.passwordRequest);

  const formik = useFormik<MyFormValues>({
    initialValues,
    onSubmit: (values) => {
      dispatch(requestPasswordReset(values.email));
    },
    validationSchema,
  });

  useEffect(() => {
    switch (status) {
      case 'loading':
        showInfoToast('Sending email...');
        break;
      case 'succeeded':
        showSuccessToast('Email sent successfully!');
        break;
      case 'failed':
        showErrorToast(error || 'failed');
        break;
      default:
        break;
    }
  }, [status, error]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-6 shadow-lg border border-gray-200 rounded-md">
        <h1 data-testid="title" className="text-center font-bold text-3xl mb-5">
          Forgot Password
        </h1>
        <form className="flex flex-col gap-5" data-testid="form">
          <div>
            <HSInput
              data-testid="email"
              label="Email"
              id="email"
              type="input"
              text="email"
              placeholder="Enter your email"
              icon={<MdOutlineEmail size={24} />}
              style={
                formik.touched.email && formik.errors.email
                  ? 'border-2 border-red-500 bg-white'
                  : ''
              }
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 mt-1 text-sm">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <Button
            data-testid="Sign In"
            title={
              status === 'loading' ? (
                <BeatLoader data-testid="Loading" color="#ffffff" size={8} />
              ) : (
                'Submit'
              )
            }
            onClick={formik.handleSubmit}
          />
          <div>
            <p className="text-center">
              Don&apos;t have an account?{' '}
              <Link to="/signUp" className="text-primary">
                Sign up
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-300 h-px"></div>
            <p className="font-light">OR</p>
            <div className="w-full bg-gray-300 h-px"></div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="https://DOB-ecomm-be.onrender.com/login"
              className="bg-white w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform transform active:scale-95 hover:scale-105"
            >
              <FcGoogle />
            </Link>
            <Link
              to="https://DOB-ecomm-be.onrender.com/login/auth/facebook"
              className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform transform active:scale-95 hover:scale-105"
            >
              <FaFacebook color="white" size={16} />
            </Link>
          </div>
        </form>
        <Link
          to="/signin"
          className="text-primary font-light mt-4 block text-center"
        >
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
}
