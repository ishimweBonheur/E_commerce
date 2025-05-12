import { format, parseISO } from 'date-fns';
import Order from '@/interfaces/order';

interface TableProps {
  orders: Order[];
  handleSort: (column: string) => void;
  select: (id: number) => void;
  cancel: (id: number) => void;
}

export default function Table({
  orders,
  handleSort,
  cancel,
  select,
}: TableProps) {
  return (
    <div className="overflow-x-auto p-4 bg-white">
      <table className="w-full bg-white">
        <thead>
          <tr className="w-full bg-gray-100 rounded">
            <th
              className="px-4 text-left cursor-pointer text-sm uppercase font-normal text-[#565D6D]"
              onClick={() => handleSort('id')}
            >
              ID
            </th>
            <th
              className="px-4 text-left cursor-pointer text-sm uppercase font-normal text-[#565D6D]"
              onClick={() => handleSort('trackingNumber')}
              data-testid="trackingNumber"
            >
              Order
            </th>
            <th
              className="px-4 text-left cursor-pointer text-sm uppercase font-normal text-[#565D6D]"
              onClick={() => handleSort('updatedAt')}
              data-testid="updatedAt"
            >
              Date
            </th>
            <th
              className="px-4 text-left cursor-pointer text-sm uppercase font-normal text-[#565D6D]"
              onClick={() => handleSort('status')}
              data-testid="status"
            >
              Status
            </th>
            <th
              className="px-4 text-left cursor-pointer text-sm uppercase font-normal text-[#565D6D]"
              onClick={() => handleSort('totalAmount')}
              data-testid="totalAmount"
            >
              Total
            </th>
            <th
              className="px-4 text-right text-[#565D6D] uppercase font-normal text-sm w-24"
              data-testid="action"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="py-4 px-4 text-[#565D6D] font-light text-sm">
                {order.id}
              </td>
              <td className="py-4 px-4 text-[#0095FF] text-sm">
                {order.trackingNumber}
              </td>
              <td className="py-4 px-4 text-[#565D6D] font-light text-sm">
                {format(parseISO(order.updatedAt), 'MMM dd, yyyy')}
              </td>
              <td className="py-4 px-4 text-[#565D6D] font-light text-sm">
                {order.status}
              </td>
              <td className="py-4 px-4  text-[#565D6D] font-light text-sm">
                {order.totalAmount}
              </td>
              <td className="py-4 px-4 flex gap-3 text-right justify-end w-24">
                <button
                  className="text-blue-500 hover:underline"
                  type="button"
                  onClick={() => select(order.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      color="currentColor"
                    >
                      <path d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045"></path>
                      <path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0"></path>
                    </g>
                  </svg>
                  <span className="hidden">view</span>
                </button>
                <button
                  className="text-red-500 hover:underline ml-2"
                  type="button"
                  onClick={() => cancel(order.id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.625 14C2.14375 14 1.73162 13.8476 1.38862 13.5427C1.04562 13.2378 0.874417 12.8717 0.875 12.4444V2.33333H0V0.777778H4.375V0H9.625V0.777778H14V2.33333H13.125V12.4444C13.125 12.8722 12.9535 13.2386 12.6105 13.5434C12.2675 13.8483 11.8557 14.0005 11.375 14H2.625ZM11.375 2.33333H2.625V12.4444H11.375V2.33333ZM4.375 10.8889H6.125V3.88889H4.375V10.8889ZM7.875 10.8889H9.625V3.88889H7.875V10.8889Z"
                      fill="#8D0303"
                    />
                  </svg>
                  <span className="hidden">delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
