import * as Yup from 'yup';
import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';
import { MdOutlineMail } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { AppDispatch } from '@/app/store';
import { submitForm } from '@/app/Footer/Subscribe';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';
import LanguageSelector from '../LanguageSelector';

interface FormValues {
  email: string;
}

function Footer() {
  const dispatch: AppDispatch = useDispatch();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is Required'),
  });

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    dispatch(submitForm(values))
      .then((result) => {
        actions.setSubmitting(false);
        if (submitForm.fulfilled.match(result)) {
          showSuccessToast('Subscription successful!');
        } else {
          showErrorToast(
            'Subscription failed. Please try again with another email.'
          );
        }
      })
      .catch(() => {
        actions.setSubmitting(false);
      });
  };

  const scroolUp = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className="bg-footerGray bottom-0 left-0 right-0 p-4 md:p-10">
      <div className="md:flex justify-around flex-wrap">
        <div className="py-4 md:py-10">
          <div className="flex items-center ">
            <img src="/iconcart.svg" alt="" className="w-10 text-primary [filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(104%)_contrast(101%)]" />
            <Link to="/" className="font-semibold text-xl" onClick={scroolUp}>
              DOB
            </Link>
          </div>
        </div>
        <div className="md:py-0 ">
          <Link
            to="/shop"
            className="text-xl font-semibold hover:text-primary transition-colors duration-300 "
          >
            Products
          </Link>
          <Link
            to="/features"
            className="text-lg py-2 font-light text-grey block cursor-pointer hover:text-primary transition-colors duration-300"
          >
            Features
          </Link>
    
        </div>
        <div className="py-2 md:py-0">
          <Link
            to="/resources"
            className="text-xl font-semibold  hover:text-primary transition-colors duration-300"
          >
            Resources
          </Link>
    
          <Link
            to="/user-guides"
            className="text-lg py-2 font-light text-grey block cursor-pointer hover:text-primary transition-colors duration-300"
          >
            User Guides
          </Link>
          <Link
            to="/webinars"
            className="text-lg py-2 font-light text-grey block cursor-pointer hover:text-primary transition-colors duration-300"
          >
            Webinars
          </Link>
        </div>
        <div className="py-2 md:py-0">
          <Link
            to="/company"
            className="text-xl font-semibold  hover:text-primary transition-colors duration-300"
          >
            Company
          </Link>
          <Link
            to="/about"
            className="text-lg py-2 font-light text-grey block cursor-pointer  hover:text-primary transition-colors duration-300"
          >
            About
          </Link>
          <Link
            to="/signUp"
            className="text-lg py-2 font-light text-grey block cursor-pointer  hover:text-primary transition-colors duration-300"
          >
            Join Us
          </Link>
          <Link
            to="/contact"
            className="text-lg py-2 font-light text-grey cursor-pointer hover:text-primary transition-colors duration-300"
          >
            Contact
          </Link>
        </div>
        <div className="py-2 md:py-0 flex flex-col">
          <div className="text-primary py-1 text-xl">
            Subscribe To Our Newsletter
          </div>
          <div className="text-dashgreytext font-normal text-md">
            For product announcements and exclusive insights
          </div>
          <div className="mt-2">
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ handleChange, handleBlur, values, isSubmitting }) => (
                <Form>
                  <MdOutlineMail
                    style={{
                      fontSize: '24px',
                      width: '50px',
                      height: '20px',
                      marginTop: '12px',
                      position: 'absolute',
                      zIndex: '1',
                    }}
                  />
                  <div className="flex gap-2 mt-2 grow">
                    <input
                      type="email"
                      id="email"
                      placeholder="Input your email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="md:w-90 py-2 relative border-2 rounded-md px-10"
                    />
                    <button
                      className="bg-primary text-white px-4 py-1 z-0 rounded-md"
                      id="subscribe"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <BeatLoader
                          data-testid="Loading"
                          color="#ffffff"
                          size={8}
                        />
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-redBg py-3"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <hr className="bg-grayLight " />
      <div className="md:flex justify-around flex-wrap  border-0 mt-5">
      <LanguageSelector />
        <ul className="flex md:space-x-4 mt-2 md:mt-0">
          <li>©️2025 Brand, Inc.</li>
          <li>
            <Link to="/privacy" className="hover:text-primary transition-colors duration-300">Privacy</Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-primary transition-colors duration-300">Terms</Link>
          </li>
          <li>
            <Link to="/site-map" className="hover:text-primary transition-colors duration-300">Site Map</Link>
          </li>
        </ul>
        <div>
          <ul className="flex gap-2 mt-2 md:mt-0">
            <Link to="x.com" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
              >
                <path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>
              </svg>
            </Link>
            <Link to="facebook.com" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
              >
                <path
                  d="M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z"
                  fill="#2E6FE8"
                ></path>
              </svg>
            </Link>
            <Link to="linkedIn.com" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
              >
                <path
                  d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
                  fillRule="evenodd"
                  fill="#2148A5"
                ></path>
              </svg>
            </Link>
            <Link to="youtube.com" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
              >
                <path
                  d="M31.331,8.248c-.368-1.386-1.452-2.477-2.829-2.848-2.496-.673-12.502-.673-12.502-.673,0,0-10.007,0-12.502,.673-1.377,.37-2.461,1.462-2.829,2.848-.669,2.512-.669,7.752-.669,7.752,0,0,0,5.241,.669,7.752,.368,1.386,1.452,2.477,2.829,2.847,2.496,.673,12.502,.673,12.502,.673,0,0,10.007,0,12.502-.673,1.377-.37,2.461-1.462,2.829-2.847,.669-2.512,.669-7.752,.669-7.752,0,0,0-5.24-.669-7.752ZM12.727,20.758V11.242l8.364,4.758-8.364,4.758Z"
                  fill="#E82E2E"
                ></path>
              </svg>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
