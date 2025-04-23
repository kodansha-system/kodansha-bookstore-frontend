import React from "react";

const PlusIcon = (props: any) => {
  return (
    <svg
      className="size-6"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 6v12m6-6H6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export default PlusIcon;
