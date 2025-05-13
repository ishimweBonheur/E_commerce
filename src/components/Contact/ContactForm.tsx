import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { MapIcon, PhoneIcon } from 'lucide-react';
import { FaEnvelope } from 'react-icons/fa6';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import Button from '@/components/form/Button';
import HSInput from '@/components/form/HSInputForm';
import HSTextarea from '@/components/form/HSTextarea';
import { sendMessage, resetStatus } from '@/features/contact/contactSlice';

interface MyFormValues {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

const initialValues: MyFormValues = {
  name: '',
  phoneNumber: '',
  email: '',
  message: '',
};

const validationSchema: yup.ObjectSchema<MyFormValues> = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required!'),
  name: yup.string().required('Name is required!'),
  message: yup.string().required('Message is required!'),
  phoneNumber: yup
    .string()
    .min(10, 'Phone number must contain at least 10 digits')
    .required('Phone number is required!'),
});

function ContactForm() {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.contact);

  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const formik = useFormik<MyFormValues>({
    initialValues,
    onSubmit: (values) => {
      dispatch(sendMessage(values));
    },
    validationSchema,
  });

  React.useEffect(() => {
    if (success) {
      formik.resetForm({ values: initialValues }); // Ensure initialValues are used for reset
      setSuccessMessage('Message sent successfully!');
      setErrorMessage(null); // Clear error message if successful
      dispatch(resetStatus());
    } else if (error) {
      setErrorMessage(`Error: ${error}`);
      setSuccessMessage(null);
      dispatch(resetStatus());
    }
  }, [success, error, dispatch, formik]);

  return (
    <div className="w-full mx-auto mt-8 md:mt-12 px-6 md:px-8 lg:px-32">
      <div className="flex flex-col md:flex-row justify-between gap-20 items-start mb-6">
        <div className="w-full md:w-1/2">
          <h1 className="text-md text-black text-left">Contact Us</h1>
          <p className="text-4xl font-light text-black text-left mt-3">
            Get in touch today.
          </p>

          <form
            className="flex flex-col gap-3 mt-6"
            data-testid="form"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <HSInput
                data-testid="Name"
                id="pname"
                type="input"
                placeholder="Enter your name"
                style={
                  formik.touched.name && formik.errors.name
                    ? 'border-2 border-red-500 bg-white'
                    : ''
                }
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 mt-1 text-sm">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>
            <div>
              <HSInput
                data-testid="email"
                id="email"
                type="input"
                placeholder="Enter your email"
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
                data-testid="phoneNumber"
                id="phoneNumber"
                type="input"
                placeholder="Enter your phone Number"
                style={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? 'border-2 border-red-500 bg-white'
                    : ''
                }
                {...formik.getFieldProps('phoneNumber')}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 mt-1 text-sm">
                  {formik.errors.phoneNumber}
                </div>
              ) : null}
            </div>

            <div>
              <HSTextarea
                data-testid="message"
                id="message"
                rows={4}
                placeholder="Enter your message here ..."
                style={
                  formik.touched.message && formik.errors.message
                    ? 'border-2 border-red-500 bg-white'
                    : ''
                }
                {...formik.getFieldProps('message')}
              />
              {formik.touched.message && formik.errors.message ? (
                <div className="text-red-500 mt-1 text-sm">
                  {formik.errors.message}
                </div>
              ) : null}
            </div>
            <Button
              data-testid="Send Message"
              title={
                loading ? (
                  <BeatLoader data-testid="Loading" color="#ffffff" size={8} />
                ) : (
                  'Send Message'
                )
              }
              onClick={formik.handleSubmit}
            />
          </form>

          {/* Success or Error message */}
          {successMessage && (
            <p
              className="mt-4 bg-green-500 text-white rounded-md p-3 text-xl"
              data-testid="successMessage"
            >
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p
              className="mt-4 bg-red-500 text-white rounded-md p-3 text-xl"
              data-testid="errorMessage"
            >
              {errorMessage}
            </p>
          )}
        </div>
      <div className="w-full md:w-1/2 p-0 bg-white shadow-md rounded-md">
  <div className="w-full p-8">
    <ul className="list-none">
      <li className="flex flex-row gap-8 font-light text-base">
        <MapIcon className="text-primary w-6" /> 2 KN St, Kigali - Rwanda
      </li>
      <li className="flex flex-row gap-8 font-light text-base my-5">
        <FaEnvelope className="text-primary w-6" /> info@DOBshop.rw
      </li>
      <li className="flex flex-row gap-8 font-light text-base">
        <PhoneIcon className="text-primary w-6" /> +250 782 222 000
      </li>
    </ul>

    {/* Embedded Google Map */}
    <div className="mt-6">
      <iframe
        title="DOB Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15952.191308942272!2d30.0567026!3d-1.9440726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6dc3a5b63b5%3A0x3b14e20e4b473295!2sKN%202%20St%2C%20Kigali%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1715615793625!5m2!1sen!2srw"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-md"
      ></iframe>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
export default ContactForm;
