import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { MdOutlineEmail } from 'react-icons/md';
import { PiLockKeyBold } from 'react-icons/pi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import Button from '@/components/form/Button';
import HSInput from '@/components/form/HSInput';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginUser, socialLogin } from '@/features/Auth/SignInSlice';
import { showSuccessToast } from '@/utils/ToastConfig';

interface MyFormValues {
  email: string;
  password: string;
}

const initialValues: MyFormValues = {
  email: '',
  password: '',
};

const validationSchema: yup.ObjectSchema<MyFormValues> = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required!'),
  password: yup
    .string()
    .min(6, 'Password must contain at least 6 chars')
    .required('Password is required!'),
});

function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const socialToken = searchParams.get('token');
    if (socialToken) {
      dispatch(socialLogin(socialToken));
    }
  }, [searchParams, dispatch]);

  const { loading, token, role, needsVerification, needs2FA, vendor } =
    useAppSelector((state) => state.signIn);

  const formik = useFormik<MyFormValues>({
    initialValues,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
    validationSchema,
  });

  useEffect(() => {
    if (needs2FA) {
      const { id, email } = vendor;
      navigate(`/verify-2fa/${id}/${email}`);
    } else if (token) {
      if (role === 'Admin') {
        showSuccessToast('Admin Logged in Successfully');
        navigate('/dashboard');
      } else {
        showSuccessToast('Buyer Logged in Successfully');
        navigate('/');
      }
    }
  }, [role, needsVerification, needs2FA, vendor, token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-6 shadow-lg border border-gray-200 rounded-md">
        <h1 data-testid="title" className="text-center font-bold text-3xl mb-5">
          Sign in
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
          <div>
            <HSInput
              data-testid="password"
              label="Password"
              id="password"
              type="input"
              text="password"
              placeholder="Enter your password"
              icon={<PiLockKeyBold size={24} />}
              style={
                formik.touched.password && formik.errors.password
                  ? 'border-2 border-red-500 bg-white'
                  : ''
              }
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 mt-1 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <p className="font-light">Remember me</p>
            </div>
            <div>
              <Link to="/forgot-password" className="text-primary font-light">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button
            data-testid="Sign In"
            title={
              loading ? (
                <BeatLoader data-testid="Loading" color="#ffffff" size={8} />
              ) : (
                'Sign In'
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
              to={`${import.meta.env.VITE_SOCIAL_URL}/auth/google`}
              className="bg-white w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform transform active:scale-95 hover:scale-105"
            >
              <FcGoogle />
            </Link>
            <Link
              to={`${import.meta.env.VITE_SOCIAL_URL}/auth/facebook`}
              className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform transform active:scale-95 hover:scale-105"
            >
              <FaFacebook color="white" size={16} />
            </Link>
          </div>
        </form>
        <Link to="/" className="text-primary font-light mt-4 block text-center">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
