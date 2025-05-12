import { useEffect, useState } from 'react';
import axios from 'axios';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import { useAppSelector } from '@/app/hooks';
import { showErrorToast } from '@/utils/ToastConfig';

function SalesMap() {
  const token = useAppSelector((state) => state.signIn.token);
  const [Data, setData] = useState<{ [key: string]: number } | undefined>(
    undefined
  );

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/category/getSalesByCountry`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.counter);
      })
      .catch((err) => {
        showErrorToast(err.message);
      });
  }, [token]);

  return (
    <div className="p-4 w-full h-[250px] md:h-[550px] lg:w-[600px] lg:h-[400px] bg-white rounded-lg overflow-hidden">
      <h1 className="text-xl">Sales Mapping by Country</h1>
      {Data && (
        <VectorMap
          map={worldMill}
          backgroundColor="white"
          regionStyle={{
            initial: {
              fill: '#D1D5DB',
              stroke: '#265cff',
            },
          }}
          series={{
            regions: [
              {
                scale: ['#DEEBF7', '#08519C'],
                attribute: 'fill',
                values: Data,
                normalizeFunction: 'polynomial',
              },
            ],
          }}
          onRegionTipShow={(_, label, code) => {
            (label as any).html(
              `<div style="background-color: white; border: 1px solid white; outline: 10px solid white; border-radius: 6px; min-height: 70px; width: 150px; color: black; padding-left: 10px;">
          <p><b>${(label as any).html()}</b></p>
          <p>Sales: <b>${code in Data ? Data[code] : 0}</b></p>
        </div>`
            );
          }}
        />
      )}
    </div>
  );
}

export default SalesMap;
