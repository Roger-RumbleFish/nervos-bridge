import React from 'react'

import { IIcon } from '@interfaces/data'

const DropdownArrowIcon: React.FC<IIcon> = ({ size }) => {
  return (
    <svg
      display="flex"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 7H7.00001C6.63701 7 6.30201 7.197 6.12501 7.515C5.94901 7.833 5.95901 8.222 6.15201 8.53L11.152 16.53C11.335 16.822 11.655 17 12 17C12.345 17 12.665 16.822 12.848 16.53L17.848 8.53C18.041 8.222 18.051 7.833 17.875 7.515C17.698 7.197 17.363 7 17 7Z"
        fill="#0A2540"
      />
    </svg>
  )
}

export default DropdownArrowIcon
