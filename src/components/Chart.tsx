import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { showErrorToast } from '@/utils/ToastConfig';
import { useAppSelector } from '@/app/hooks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function UserMetricsChart() {
  const token = useAppSelector((state) => state.signIn.token);
  const [buyerData, setBuyerData] = useState([]);
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/user/get_metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBuyerData(response.data.buyerData);
        setVendorData(response.data.vendorData);
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  }, [token]);

  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ], // x-axis labels
    datasets: [
      {
        label: 'Buyers',
        data: buyerData,
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        fill: false,
        lineTension: 0.4,
      },
      {
        label: 'Vendors',
        data: vendorData,
        borderColor: '#3CD856',
        backgroundColor: '#3CD856',
        fill: false,
        lineTension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Allowed values: 'top', 'left', 'right', 'bottom', 'center', 'chartArea'
      },
      title: {
        display: true,
        text: 'Visitor Insights',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Users',
        },
      },
    },
  };

  return (
    <div className="lg:w-[60%] h-64 xs:w-full flex items-center justify-center rounded-lg p-2 bg-white">
      <Line data={data} options={options} />
    </div>
  );
}

export default UserMetricsChart;
