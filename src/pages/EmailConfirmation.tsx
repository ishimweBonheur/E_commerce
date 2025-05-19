// import { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import BeatLoader from 'react-spinners/BeatLoader';
// import { showSuccessToast, showErrorToast } from '@/utils/ToastConfig';
// import { FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// function EmailConfirmation() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
//     'loading'
//   );
//   const [message, setMessage] = useState('');
//   const token = searchParams.get('token');

//   useEffect(() => {
//     const confirmEmail = async () => {
//       if (!token) {
//         setStatus('error');
//         setMessage('Invalid confirmation link');
//         showErrorToast('Invalid confirmation link');
//         setTimeout(() => navigate('/signin'), 3000);
//         return;
//       }

//       try {
//         console.log('Confirming email with token:', token);
//         console.log(
//           'API URL:',
//         `${import.meta.env.VITE_BASE_URL}/user/confirm?token=${token}`
//         );

//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/user/confirm?token=${token}`,
//           {
//             withCredentials: true,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data.success) {
//           setStatus('success');
//           setMessage('Email confirmed successfully!');
//           showSuccessToast('Email confirmed successfully!');
//           setTimeout(() => navigate('/signin'), 3000);
//         }
//       } catch (error: any) {
//         console.error('Email confirmation error:', error.response?.data);
//         setStatus('error');
//         const errorMessage =
//           error.response?.data?.message || 'Failed to confirm email';
//         setMessage(errorMessage);
//         showErrorToast(errorMessage);
//         setTimeout(() => navigate('/signin'), 3000);
//       }
//     };

//     confirmEmail();
//   }, [token, navigate]);

//   const renderContent = () => {
//     if (status === 'success') {
//       return (
//         <div className="flex flex-col items-center gap-4">
//           <FaCheckCircle className="text-green-500 text-5xl" />
//           <h2 className="text-2xl font-bold text-gray-800">Email Confirmed!</h2>
//           <p className="text-gray-600">{message}</p>
//           <p className="text-sm text-gray-500">Redirecting to login page...</p>
//         </div>
//       );
//     }

//     if (status === 'error') {
//       return (
//         <div className="flex flex-col items-center gap-4">
//           <FaTimesCircle className="text-red-500 text-5xl" />
//           <h2 className="text-2xl font-bold text-gray-800">
//             Confirmation Failed
//           </h2>
//           <p className="text-gray-600">{message}</p>
//           <p className="text-sm text-gray-500">Redirecting to login page...</p>
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-col items-center gap-4">
//         <BeatLoader color="#6D31ED" size={10} />
//         <FaEnvelope className="text-[#6D31ED] text-5xl" />
//         <h2 className="text-2xl font-bold text-gray-800">Email Confirmation</h2>
//         <p className="text-gray-600">
//           Please wait while we confirm your email address...
//         </p>
//       </div>
//     );
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md p-8 shadow-xl border border-gray-200 rounded-lg text-center bg-white transform transition-all duration-300 hover:shadow-2xl">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default EmailConfirmation;
