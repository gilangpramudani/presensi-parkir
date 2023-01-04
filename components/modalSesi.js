import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from "react"


export function ModalBuatSesi({ children, isOpen, closed, title }) {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={closed}>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 "
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-gray-100">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-150 transform"
                                enterFrom="-translate-y-full opacity-0"
                                enterTo="translate-y-0 opacity-100"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-y-0 opacity-100"
                                leaveTo="-translate-y-full opacity-0"
                            >

                                <Dialog.Panel className="text-white font-poppin py-2 relative m-auto bg-gray-900 w-full px-3">

                                    <div id="header" className="flexn">
                                        <h2 className="text-2xl font-semibold text-center">{title}</h2>
                                        {/* <button onClick={closed} className="hover:text-white text-gray-smooth  bg-gray-900 duration-300 ease-in-out transition-all">
                                        </button> */}
                                    </div>

                                    <div>
                                        {children}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}