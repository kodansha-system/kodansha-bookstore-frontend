import React from "react";

interface OrderHistoryProps {
  events: any;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ events }) => {
  return (
    <div className="h-auto grow">
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white md:text-xl">
          Theo dõi đơn hàng
        </h3>

        <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
          {events?.map((event: any, index: number) => (
            <li className="mb-10 ms-6" key={index}>
              <span className="absolute -start-3 flex size-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-700 dark:ring-gray-800">
                <svg
                  aria-hidden="true"
                  className="size-4 text-blue-500 dark:text-blue-400"
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 11.917 9.724 16.5 19 7.5"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </span>

              <h4 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white md:text-base">
                {event.date}
              </h4>

              <p className="text-sm font-normal italic text-blue-500 dark:text-gray-400">
                {event?.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default OrderHistory;
