import { useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { PiLockKeyBold } from 'react-icons/pi';
import Button from '@/components/form/Button';
import HSInput from '@/components/form/HSInput';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetPassword } from '@/features/Auth/password';
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from '@/utils/ToastConfig';

interface MyFormValues {
  password: string;
  confirmPassword: string;
}

const initialValues: MyFormValues = {
  password: '',
  confirmPassword: '',
};

const validationSchema: Yup.ObjectSchema<MyFormValues> = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>() as { token: string };

  const { status, error } = useAppSelector((state) => state.passwordReset);

  const formik = useFormik<MyFormValues>({
    initialValues,
    onSubmit: (values) => {
      dispatch(resetPassword({ ...values, token }));
    },
    validationSchema,
  });

  useEffect(() => {
    switch (status) {
      case 'loading':
        showInfoToast('Setting your new password...');
        break;
      case 'succeeded':
        showSuccessToast('Password reset successfully!');
        navigate('/signin');
        break;
      case 'failed':
        showErrorToast(error || 'failed');
        break;
      default:
        break;
    }
  }, [status, navigate, error]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md p-6 shadow-lg border border-gray-200 rounded-md">
        <h1 data-testid="title" className="text-center font-bold text-3xl mb-5">
          Reset Password
        </h1>
        <form className="flex flex-col gap-5" data-testid="form">
          <div>
            <HSInput
              data-testid="password"
              label="New Password"
              id="password"
              type="input"
              text="password"
              placeholder="Enter new password"
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
              data-testid="password"
              label="Confirm Password"
              id="confirmPassword"
              type="input"
              text="password"
              placeholder="Confirm new password"
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
        </form>
      </div>
    </div>
  );
}
