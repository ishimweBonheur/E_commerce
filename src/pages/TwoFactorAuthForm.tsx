import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import HSButton from '@/components/form/Button';
import otpVector from '../assets/otp.png';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { twoFactorverify } from '@/features/Auth/SignInSlice';
import { showSuccessToast } from '@/utils/ToastConfig';

// formik global valiables
interface MyFormValues {
  code: string[];
}

const initialValues: MyFormValues = {
  code: new Array(6).fill(''),
};

const validationSchema = yup.object().shape({
  code: yup
    .array()
    .of(
      yup
        .string()
        .matches(/^\d$/, 'Must be a single digit')
        .required('Required')
    ),
});

function TwoFactorAuthForm() {
  const navigate = useNavigate();
  const { id, email } = useParams();
  const [otp, setOtp] = useState(new Array(6).fill(''));

  // function handle input Next sibling
  function handleChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const inputValue = e.target.value;
    if (Number.isNaN(Number(inputValue))) {
      return false;
    }
    setOtp([...otp.map((data, indx) => (indx === index ? inputValue : data))]);

    const nextInput = e.target.nextSibling as HTMLInputElement | null;

    if (inputValue && nextInput) {
      nextInput.focus();
    }
    return true;
  }

  // function handle input Previous sibling
  function handleSpaceBack(e: React.KeyboardEvent<HTMLInputElement>) {
    const { value } = e.target as HTMLInputElement;
    const { key } = e;
    const previousInput = (e.target as HTMLInputElement)
      .previousSibling as HTMLInputElement | null;

    if (!value && key === 'Backspace' && previousInput) {
      previousInput.focus();
    }
  }

  // function handle paste

  // function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
  //   const value = e.clipboardData.getData('text');
  //   if (Number.isNaN(Number(value))) {
  //     return false;
  //   }
  //   const updatedValue = value.toString().split('').slice(0, otp.length);

  //   console.log(updatedValue);
  //   setOtp(updatedValue);
  // }

  const dispatch = useAppDispatch();
  const { loading, token, user } = useAppSelector((state) => state.signIn);

  // Validating form using formik
  const formik = useFormik<MyFormValues>({
    initialValues,
    onSubmit: (values) => {
      const codes = parseInt(values.code.join(''), 10);
      dispatch(twoFactorverify({ id, codes }));
    },
    validationSchema,
  });

  useEffect(() => {
    if (token && user?.userType.name === 'Vendor') {
      showSuccessToast('Vendor Logged In Sucessfully');
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-6 shadow-lg border border-gray-200 rounded-md">
        <div className="flex justify-center mb-2">
          <img src={otpVector} alt="otp-secure-verification" className="w-20" />
        </div>
        <h3 className="text-2xl text-center mb-4 text-black">
          Please Submit your code
        </h3>
        <p className="text-sm text-center text-gray-500 font-light">
          An email has been send to the email{' '}
          <span className="font-medium">{email}</span> with a 6 digits
          verfication enclosed.
        </p>
        <form data-testid="form">
          <div className="my-3 flex gap-2 items-center justify-center">
            {otp.map((data, index) => {
              return (
                <input
                  data-testid="inputField"
                  key={index}
                  type="text"
                  value={data}
                  name={`code[${index}]`}
                  onChange={(e) => {
                    handleChange(e, index);
                    formik.handleChange(e);
                  }}
                  onKeyDown={(e) => {
                    handleSpaceBack(e);
                  }}
                  onBlur={formik.handleBlur}
                  // onPaste={(e) => {
                  //   handlePaste(e);
                  // }}
                  maxLength={1}
                  className={`${formik.errors.code ? 'border-2 border-red-500' : 'border-0'} w-12 text-xl text-center p-2 bg-grayLight text-black rounded-md font-base`}
                />
              );
            })}
          </div>
          <HSButton
            title={loading ? 'Verifying...' : 'submit'}
            onClick={formik.handleSubmit}
          />
        </form>
        <Link to="/signIn" className="w-ful">
          <p className="text-center text-sm text-primary mt-2">
            Don&#39;t receive the code ?
          </p>
        </Link>
      </div>
    </div>
  );
}

export default TwoFactorAuthForm;
