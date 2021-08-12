import React from 'react'

import { IIcon } from '@interfaces/data'
import Box from '@material-ui/core/Box'

const UsdtIcon: React.FC<IIcon> = ({ size }) => {
  return (
    <svg
      display="flex"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
    >
      <path d="M23.9785 11.9958C23.9785 18.5904 18.6328 23.9361 12.0382 23.9361C5.44381 23.9361 0.0979004 18.5904 0.0979004 11.9958C0.0979004 5.40131 5.44381 0.0555191 12.0382 0.0555191C18.6328 0.0555191 23.9785 5.40131 23.9785 11.9958Z" />
      <path
        d="M17.6421 6.07654H6.33588V8.80609H10.6242V12.818H13.3538V8.80609H17.6421V6.07654Z"
        fill="white"
      />
      <path
        d="M12.0149 13.2454C8.46744 13.2454 5.59138 12.6839 5.59138 11.9913C5.59138 11.2987 8.46732 10.7372 12.0149 10.7372C15.5624 10.7372 18.4383 11.2987 18.4383 11.9913C18.4383 12.6839 15.5624 13.2454 12.0149 13.2454ZM19.2274 12.2004C19.2274 11.3072 15.9983 10.5833 12.0149 10.5833C8.03162 10.5833 4.80225 11.3072 4.80225 12.2004C4.80225 12.9869 7.30625 13.6421 10.6243 13.7873V19.5466H13.3536V13.7896C16.6973 13.649 19.2274 12.9909 19.2274 12.2004Z"
        fill="white"
      />
    </svg>
  )
}

export default UsdtIcon
