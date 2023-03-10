import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast, ToastContainer } from "react-toastify";
import Dashboard from "../../components/dashboard";
import { ModalCamera } from "../../components/modalCamera";
import Navigation from "../../components/navigation";
import { Error, Notification, Success } from "../../components/notifikasi";
import { GET_LIST_TUKANG, GET_SESI_BUKA_HARI_INI } from "../../gql/listTukang";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { POST_PRESENSI_DATANG } from "../../gql/presensi";

function QRScanDatang({ dataSesi, dataTukang }) {
    const [data, setData] = useState("No result");
    const [loadingCamera, setLoadingCamera] = useState(false)

    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter()

    const [presensiDatang] = useMutation(POST_PRESENSI_DATANG);

    const [scanDelay, setScanDelay] = useState(3000)
    var d = new Date();

    async function postPresensi({ tukangId }) {
        try {
            // setIsOpen(true)
            console.log("a0a0a0a0")
            let tukang = dataTukang?.tukang?.find(x => x.id == tukangId);
            // await presensiDatang({
            //     variables: {
            //         "datang": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
            //         "jenis_presensi_datang": "qrcode",
            //         "jenis_presensi_pergi": "",
            //         "pergi": "",
            //         "sesi_id": dataSesi.id,
            //         "tukang_id": tukangId
            //     }
            // })
            console.log(tukang, "a0a0a0a0")
            toast.success(<Success text={`Terimakasih sudah datang: ${tukang.nama}`} />)
        } catch (error) {
            toast.error(<Error text={error.message} />)
        } finally {
            // setLoadingCamera(false)
        }
    }
    console.log(dataSesi, dataTukang)

    return (
        <div className="bg-yellow-300 " >
            <div className="flex h-full justify-center items-center text-white" onClick={() => { setIsOpen(true) }}>
                <div>
                    <p>Scan Untuk Datang</p>
                </div>
            </div>
            <ModalCamera title={"Scan untuk Datang"} closed={() => {
                setIsOpen(false);
                // router.reload() 
            }} isOpen={isOpen}>
                {/* <button onClick={() => { toast.success(<Success text={"error?.response?.data?.message ?? error?.message"} />) }}>aas</button> */}
                <div className="w-full  mt-4 relative">
                    <div className="absolute z-50 w-8 h-8 border-t-8 border-l-8 border-red-500" />
                    <div className="absolute right-0 z-50 w-8 h-8 border-t-8 border-r-8 border-red-500" />
                    <div className="absolute bottom-0 z-50 w-8 h-8 border-b-8 border-l-8 border-red-500" />
                    <div className="absolute bottom-0 right-0 z-50 w-8 h-8 border-b-8 border-r-8 border-red-500" />

                    {!loadingCamera ?
                        <div>
                            <QrReader
                                key="user"
                                videoId="video"
                                onResult={(result, error) => {
                                    if (!!result) {
                                        // console.log(result?.text);
                                        toast.success(<Success text={`Terimakasih sudah datang: ${result?.text}`} />)
                                        setScanDelay(false)
                                        setScanDelay(3000)
                                    }

                                    if (!!error) {
                                        console.info(error);
                                    }
                                }
                                }
                                constraints={{ facingMode: "environment" }}
                                scanDelay={scanDelay}
                                style={{ width: '100%' }}


                            />
                        </div>
                        :
                        <></>
                    }
                    {/* <p>{data}</p> */}
                </div>
                {/* <Notification /> */}


            </ModalCamera>
        </div>

    );
}

export default function Index() {
    const [isQRScanDatangOpen, setIsQRScanDatangOpen] = useState(false)
    const router = useRouter()
    const [isDrawerTukang, setIsDrawerTukang] = useState(false)

    const { data: dataTukang, refetch: refetchTukang, loading: loadTukang } = useQuery(GET_LIST_TUKANG);
    const { data: dataSesiHariIni, refetch: refetchSesiHariIni, loading: loadSesiHariIni } = useQuery(GET_SESI_BUKA_HARI_INI);

    console.log(dataSesiHariIni, "alsdsd")

    return (
        <>
            {/* <button onClick={() => { toast.success(<Success text={"error?.response?.data?.message ?? error?.message"} />); }}>aaak</button> */}
            <div className="absolute bottom-5 left-5" >
                {loadTukang && loadSesiHariIni ?
                    <p>Loading</p> :
                    <button onClick={() => { setIsDrawerTukang(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                        </svg>
                    </button>

                }

            </div>
            <Drawer
                open={isDrawerTukang}
                onClose={() => setIsDrawerTukang(false)}
                direction='bottom'
                size={"50%"}
            >
                <div className="overflow-scroll h-[50vh]">
                    <div className=" py-4">
                        <h2 className="text-2xl font-semibold px-2 ">Presensi Hari Ini</h2>
                        <h3 className="text-2xl font-semibold px-2 ">2022 02 22</h3>
                        <div className="w-screen mt-2 overflow-scroll px-2 ">
                            <table className="py-2 w-full">
                                <thead className="text-left border-b-2 border-gray-900">
                                    <tr>
                                        <th className="px-2 border-r border-gray-900">Nama</th>
                                        <th className="px-2 border-r border-gray-900">RT</th>
                                        <th className="px-2 border-r border-gray-900">Datang</th>
                                        <th className="px-2 border-r border-gray-900">Pergi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataSesiHariIni?.sesi[0] != undefined ?
                                        dataSesiHariIni?.sesi[0]?.presensis?.map((v, i) => {
                                            let tukang = dataTukang?.tukang?.find(x => x.id == v.tukang_id);
                                            {/* console.log(tukang, "wwapappspds") */ }
                                            return (
                                                <tr key={i} className="border-b border-gray-900">
                                                    <td className="p-2 border-r border-gray-900 ">
                                                        {tukang?.nama}
                                                    </td>
                                                    <td className="p-2 border-r border-gray-900">
                                                        {tukang?.rt}
                                                    </td>
                                                    <td className="p-2 border-r border-gray-900">
                                                        {v?.datang}
                                                    </td>
                                                    <td className="p-2 border-r border-gray-900">
                                                        {v?.pergi}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        : <></>
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Drawer>
            {/* <Navigation /> */}
            <Dashboard title={"Presensi"}>
                <div className=" grid grid-rows-2 gap-4 h-[85vh] mt-10">
                    <div className="border border-gray-500 p-2 flex flex-col h-full ">

                        <h2 className="font-bold text-center mb-1">Scan dengan QR Code</h2>
                        <div className="h-full w-full flex-1 grid grid-row-2 gap-2">
                            {dataSesiHariIni?.sesi[0] != undefined && !loadTukang ?
                                <QRScanDatang dataSesi={dataSesiHariIni?.sesi[0]} dataTukang={dataTukang} />
                                : <></>
                            }

                            <div className="bg-gray-500 " onClick={() => { router.reload() }} >
                                <div className="flex  h-full justify-center items-center text-white">
                                    <p>Scan Untuk Pergi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="bg-red-50">aa</div> */}
                </div>
                {/* <div class="bg-gray-500 flex flex-col h-screen">
                    <div class="flex h-32 bg-gray-200"></div>
                    <div class="flex-1 w-2/3 mx-auto p-4 text-lg bg-white h-full shadow-lg bg-gray-300">
                        <router-view />
                    </div>
                </div> */}
            </Dashboard>
        </>
    )
}