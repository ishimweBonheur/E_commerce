import { Link, useNavigate } from 'react-router-dom';
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
import { registerUser } from '@/features/Auth/SignUpSlice';

interface MyFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'Vendor' | 'Buyer';
}

const initialValues: MyFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'Buyer',
};

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required!'),
  password: yup
    .string()
    .min(6, 'Password must contain at least 6 chars')
    .required('Password is required!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  userType: yup.string().required('User type is required'),
});

function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.signUp);

  const formik = useFormik<MyFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...registrationData } = values;
      dispatch(registerUser(registrationData))
        .then(() => {
          navigate('/signIn');
        })
        .catch(() => {
          // Error handling is done in the slice
        });
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-xl p-6 shadow-lg border border-gray-200 rounded-md">
        <h1 data-testid="title" className="text-center font-bold text-3xl mb-5">
          Sign up
        </h1>
        <form className="flex flex-col gap-5" data-testid="form">
          <div className="flex gap-4">
            <div className="flex-1">
              <HSInput
                data-testid="firstName"
                label="First Name"
                id="firstName"
                type="input"
                text="text"
                placeholder="Enter your first name"
                style={
                  formik.touched.firstName && formik.errors.firstName
                    ? 'border-2 border-red-500 bg-white'
                    : ''
                }
                {...formik.getFieldProps('firstName')}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 mt-1 text-sm">
                  {formik.errors.firstName}
                </div>
              ) : null}
            </div>
            <div className="flex-1">
              <HSInput
                data-testid="lastName"
                label="Last Name"
                id="lastName"
                type="input"
                text="text"
                placeholder="Enter your last name"
                style={
                  formik.touched.lastName && formik.errors.lastName
                    ? 'border-2 border-red-500 bg-white'
                    : ''
                }
                {...formik.getFieldProps('lastName')}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-500 mt-1 text-sm">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
          </div>
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
          <div>
            <HSInput
              data-testid="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              type="input"
              text="password"
              placeholder="Confirm your password"
              icon={<PiLockKeyBold size={24} />}
              style={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-2 border-red-500 bg-white'
                  : ''
              }
              {...formik.getFieldProps('confirmPassword')}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 mt-1 text-sm">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">I am a:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="Buyer"
                  checked={formik.values.userType === 'Buyer'}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                />
                <span>Customer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="Vendor"
                  checked={formik.values.userType === 'Vendor'}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                />
                <span>Vendor</span>
              </label>
            </div>
            {formik.touched.userType && formik.errors.userType ? (
              <div className="text-red-500 mt-1 text-sm">
                {formik.errors.userType}
              </div>
            ) : null}
          </div>
          <Button
            data-testid="Sign Up"
            title={
              loading ? (
                <BeatLoader data-testid="Loading" color="#ffffff" size={8} />
              ) : (
                'Sign Up'
              )
            }
            onClick={formik.handleSubmit}
          />
          <div>
            <p className="text-center">
              Already have an account?{' '}
              <Link to="/signIn" className="text-primary">
                Sign in
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

export default SignUp;
