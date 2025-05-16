import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Formik, Field, ErrorMessage, Form, FormikHelpers } from 'formik';
import BeatLoader from 'react-spinners/BeatLoader';
import { RootState, AppDispatch } from '@/app/store';
import { registerUser } from '@/features/Auth/SignUpSlice';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'Vendor' | 'Buyer';
}

function SignUp() {
  const dispatch: AppDispatch = useDispatch();
  const signUpState = useSelector((state: RootState) => state.signUp);
  const navigate = useNavigate();

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    // Remove confirmPassword and ensure userType is properly typed
    const { confirmPassword, ...registrationData } = values;
    const formattedData = {
      ...registrationData,
      userType: registrationData.userType as 'Vendor' | 'Buyer'
    };
    
    console.log('Submitting registration data:', formattedData);
    
    dispatch(registerUser(formattedData))
      .then(() => {
        actions.setSubmitting(false);
        navigate('/signIn');
      })
      .catch(() => {
        actions.setSubmitting(false);
      });
  };

  const renderField = (
    id: string,
    name: string,
    label: string,
    type: string = 'text'
  ) => {
    if (type === 'radio') {
      return (
        <label htmlFor={id} key={id}>
          <Field
            id={id}
            type="radio"
            name={name}
            value={id}
            className="mr-2 border border-gray-200"
          />
          {label}
        </label>
      );
    }
    if (type === 'checkbox') {
      return (
        <label htmlFor={id} key={id} className="flex items-center">
          <Field
            id={id}
            type="checkbox"
            name={name}
            className="mr-2 border border-gray-200"
          />
          {label}
        </label>
      );
    }
    return (
      <label htmlFor={id} key={id} className="flex flex-col">
        {label}
        <Field
          id={id}
          type={type}
          name={name}
          className="mr-2 border border-gray-400 p-2 rounded-md"
        />
      </label>
    );
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .notOneOf(['test@test.com'], 'That email is not allowed'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    userType: Yup.string().required('User type is required'),
  });

  return (
    <div className="flex justify-center items-center h-[90vh] sm:h-screen bg-white m-2">
      <div className="w-[80%] md:w-[60%] lg:w-[40%] p-5 shadow-lg border-[1px] border-gray-300 rounded-md ">
        <h1 className="text-center font-bold text-3xl mb-4 ">Sign Up</h1>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'Buyer',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-2" role="form">
              <div className="flex gap-3">
                <div className="flex flex-col w-1/2">
                  {renderField('firstName', 'firstName', 'First name')}
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-400 text-xs mt-1 p-1 rounded-md"
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  {renderField('lastName', 'lastName', 'Last name')}
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-400 text-xs  mt-1  p-1 rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                {renderField('email', 'email', 'Enter your email')}
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-400 text-xs mt-1 p-1 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                {renderField(
                  'password',
                  'password',
                  'Enter your password',
                  'password'
                )}
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-400 text-xs  mt-1  p-1 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                {renderField(
                  'confirmPassword',
                  'confirmPassword',
                  'Confirm your password',
                  'password'
                )}
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-400 text-xs mt-1 p-1 rounded-md"
                />
              </div>
              <div className="flex flex-col items-left justify-between text-gray-600 text-sm md:text-md">
                {renderField('Buyer', 'userType', 'I am a customer', 'radio')}
                {renderField('Vendor', 'userType', 'I am a vendor', 'radio')}
                <ErrorMessage
                  name="userType"
                  component="div"
                  className="text-red-400 text-xs mt-1 bg-red-100 p-1 rounded-md"
                />
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {renderField(
                  'agreeCheckbox',
                  'agreeCheckbox',
                  'By signing up, I agree with the Terms of Use & Privacy Policy.',
                  'checkbox'
                )}
              </div>
              {signUpState.loading && (
                <div className="flex justify-center"></div>
              )}
              {signUpState.error && (
                <p className="text-red-500 text-center mt-2">
                  {signUpState.error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || signUpState.loading}
                aria-label="Submit Form"
                className="w-full flex justify-center py-2 sm:py-4 bg-[#6d31ed] text-white rounded-md hover:bg-blue-[#6d31ed] transition-colors"
              >
                {isSubmitting || signUpState.loading ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  'Sign Up'
                )}
              </button>
              <div>
                <p className="text-center text-gray-600 text-xs sm:text-sm md:text-sm">
                  Already have an account?{' '}
                  <Link to="/signIn" className="text-primary">
                    Login
                  </Link>
                </p>
              </div>
              <div className="flex items-center text-xs sm:text-sm md:text-lg">
                <div className="w-full bg-grayLight h-[1px]" />
                <p className="font-light">OR</p>
                <div className="w-full bg-grayLight h-[1px]" />
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;
