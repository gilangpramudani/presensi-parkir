

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function Notification() {


    return (
        <div className="">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"

            />
        </div>
    )
}

export const Error = ({ closeToast, toastProps, text }) => (
    <div className=" flex font-poppin w-full">
        <p className="text-red-500 text-sm">
            <span className="font-bold">Error</span>: {text}</p>
    </div>
)

export const Success = ({ closeToast, toastProps, text }) => (
    <div className="flex font-poppin w-full">
        <p className="text-green-500 text-sm">
            <span className="font-bold">Success</span>: {text}</p>
    </div>
)