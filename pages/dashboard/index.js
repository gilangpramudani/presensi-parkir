import { useMutation, useQuery, } from "@apollo/client";
import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Dashboard from "../../components/dashboard";
import { ModalCamera } from "../../components/modalCamera";
import Navigation from "../../components/navigation";
import { Error, Notification, Success } from "../../components/notifikasi";
import { GET_LIST_TUKANG } from "../../gql/listTukang";
import { GET_SESI_BUKA_HARI_INI } from "../../gql/sesi"
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { GET_CHECK_APAKAH_DATANG, POST_UPDATE_PRESENSI_PERGI, POST_UPSERT_PRESENSI_DATANG } from "../../gql/presensi";
import QrScanner from 'qr-scanner';
import axios from "axios";
import Link from "next/link";
import Kepala from "../../components/kepala";


function QRScanDatang({ dataSesi, dataTukang }) {
    const video = useRef(null);

    const [bukaKamera, setBukaKamera] = useState(false)
    const [loadingAbsen, setLoadingAbsen] = useState(false)
    const [loadingAbsenNama, setLoadingAbsenNama] = useState(false)

    const [isOpen, setIsOpen] = useState(false)


    const [presensiDatang] = useMutation(POST_UPSERT_PRESENSI_DATANG);

    var d = new Date();

    const [qrScanner, setQrScanner] = useState();

    async function handleScan(result) {
        console.log(result.data)
        try {
            setIsOpen(true)
            let tukangId = result.data

            let tukang = dataTukang?.tukang?.find(x => x.id == tukangId);
            if (tukang) {
                setLoadingAbsen(true)
                setLoadingAbsenNama(<span>sedang mengabsen <span className="font-semibold">{tukang.nama}</span></span>)
                const res = await presensiDatang({
                    variables: {
                        "id": dataSesi.id + "+" + tukangId,
                        "datang": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                        "jenis_presensi_datang": "qrcode",
                        "jenis_presensi_pergi": "",
                        "pergi": "",
                        "sesi_id": dataSesi.id,
                        "tukang_id": tukangId
                    }
                })

                if (res.data.insert_presensi.returning.length == 0) {
                    toast.success(<Success text={<span>Sudah absen luwh: <span className="font-semibold">{tukang.nama}</span></span>} />)
                } else {
                    toast.success(<Success text={<span>Terimakasih sudah datang: <span className="font-semibold">{tukang.nama}</span></span>} />)

                }
            } else throw { message: "Qr tidak valid/ terdaftar" }



        } catch (error) {
            toast.error(<Error text={error.message} />)
        } finally {
            setLoadingAbsen(false)
            setLoadingAbsenNama(0)
        }
    }


    return (
        <div className="bg-green-500 " >
            <div className="flex h-full justify-center items-center text-white" onClick={() => { setIsOpen(true) }}>
                <div>
                    <p>Scan Untuk Datang</p>
                </div>
            </div>
            <ModalCamera title={"Scan untuk Datang"} closed={() => {
                qrScanner?.stop();
                qrScanner?.destroy();
                setQrScanner(null)
                setIsOpen(false);
                setBukaKamera(false)
            }} isOpen={isOpen}>
                <div>
                    <p>Info: {loadingAbsen && loadingAbsenNama && loadingAbsenNama}</p>
                    <div className="w-full  mt-4 relative h-[50vh] overflow-hidden">

                        {!bukaKamera &&
                            <button onClick={() => {
                                const qrScannerW = new QrScanner(video.current, (result) => { handleScan(result) }, {
                                    highlightScanRegion: true,
                                    maxScansPerSecond: 0.4
                                });
                                setQrScanner(qrScannerW);
                                qrScannerW.start();
                                setBukaKamera(true)
                            }}
                                className="w-full bg-white text-black text-center h-full text-2xl font-semibold"
                            >
                                Buka Kamera
                            </button>

                        }
                        <div className="flex items-center justify-center w-full h-full overflow-hidden">
                            <div className="scale-[1.5]">
                                <div>
                                    <video ref={video} className=""></video>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </ModalCamera>
        </div>

    );
}

function QRScanPergi({ dataSesi, dataTukang }) {
    const video = useRef(null);

    const [bukaKamera, setBukaKamera] = useState(false)
    const [loadingAbsen, setLoadingAbsen] = useState(false)
    const [loadingAbsenNama, setLoadingAbsenNama] = useState(false)

    const [isOpen, setIsOpen] = useState(false)


    const [presensiPergi] = useMutation(POST_UPDATE_PRESENSI_PERGI);


    var d = new Date();

    const [qrScanner, setQrScanner] = useState();

    async function handleScan(result) {
        try {
            setIsOpen(true)
            let tukangId = result.data

            let tukang = dataTukang?.tukang?.find(x => x.id == tukangId);

            if (tukang) {
                setLoadingAbsen(true)
                setLoadingAbsenNama(<span>sedang mengabsen <span className="font-semibold">{tukang.nama}</span></span>)

                const checkDatang = await axios.post("https://together-scorpion-14.hasura.app/v1/graphql", {
                    query: `
                    query{
                        presensi(where:{id:{_eq:"${dataSesi.id + "+" + tukangId}"}}){
                          id
                        }
                      }`
                }, {
                    headers: {
                        "x-hasura-admin-secret": "k2DalLb8lPwDxyA6f028v2GZv278pzPQUAPQ23ouGw2PbPjNsenpe4xuJCKttO0t",
                    }
                })

                // console.log(checkDatang.data.data.presensi.length > 0, "aalla")
                if (checkDatang.data.data.presensi.length > 0) {
                    const res = await presensiPergi({
                        variables:
                        {
                            "id": dataSesi.id + "+" + tukangId,
                            "jenis_presensi_pergi": "qrcode",
                            "pergi": d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
                        }
                    })

                    if (res.data.update_presensi.returning.length == 0) {
                        toast.success(<Success text={<span>Sudah absen pergi: <span className="font-semibold">{tukang.nama}</span></span>} />)
                    } else {
                        toast.success(<Success text={<span>Terimakasih sudah parkir: <span className="font-semibold">{tukang.nama}</span></span>} />)

                    }

                } else throw { message: "Belum absen datang" }

            } else throw { message: "Qr tidak valid/ terdaftar" }

        } catch (error) {
            toast.error(<Error text={error.message} />)
        } finally {
            setLoadingAbsen(false)
            setLoadingAbsenNama(0)
        }
    }


    return (
        <div className="bg-yellow-500 " >
            <div className="flex h-full justify-center items-center text-white" onClick={() => { setIsOpen(true) }}>
                <div>
                    <p>Scan Untuk Pergi</p>
                </div>
            </div>
            <ModalCamera title={"Scan untuk Pergi"} closed={() => {
                qrScanner?.stop();
                qrScanner?.destroy();
                setQrScanner(null)
                setIsOpen(false);
                setBukaKamera(false)
            }} isOpen={isOpen}>
                <div>
                    <p>Info: {loadingAbsen && loadingAbsenNama && loadingAbsenNama}</p>
                    <div className="w-full  mt-4 relative h-[50vh]">

                        {!bukaKamera &&
                            <button onClick={() => {
                                const qrScannerW = new QrScanner(video.current, (result) => { handleScan(result) }, {
                                    highlightScanRegion: true,
                                    maxScansPerSecond: 0.4
                                });
                                setQrScanner(qrScannerW);
                                qrScannerW.start();
                                setBukaKamera(true)
                            }}
                                className="w-full bg-white text-black text-center h-full text-2xl font-semibold"
                            >
                                Buka Kamera
                            </button>

                        }
                        <div className="flex items-center justify-center w-full h-full  overflow-hidden">
                            <div className="scale-[1.5]">
                                <div>
                                    <video ref={video} className=""></video>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </ModalCamera>
        </div>

    );
}

export default function Index() {
    const [isQRScanDatangOpen, setIsQRScanDatangOpen] = useState(false)
    const router = useRouter()
    const [isDrawerTukang, setIsDrawerTukang] = useState(false)

    const { data: dataTukang, refetch: refetchTukang, loading: loadTukang, error: errorTukang } = useQuery(GET_LIST_TUKANG);
    const { data: dataSesiHariIni, refetch: refetchSesiHariIni, loading: loadSesiHariIni, error: errorSesiHariIni } = useQuery(GET_SESI_BUKA_HARI_INI);

    function hariIniAdalah(tanggal) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today = new Date(tanggal);

        return today.toLocaleDateString("id-ID", options)
    }

    return (
        <>
            <Kepala title={"Presensi"} />
            {errorTukang || errorSesiHariIni ?
                toast.error(<Error text={"Ada kesalahan, coba reload"} />) : <></>
            }
            <Navigation />
            {!loadTukang && !loadSesiHariIni ?
                <div>
                    {dataSesiHariIni?.sesi[0] != undefined ?
                        <div>
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
                                        {/* var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date("5-1-2023");

console.log(today.toLocaleDateString("id-ID")); // 9/17/2016
console.log(today.toLocaleDateString("id-ID", options));  */}
                                        <h2 className="text-2xl font-semibold px-2 ">Presensi: {dataSesiHariIni?.sesi[0] != undefined && dataSesiHariIni?.sesi[0]?.tanggal}</h2>
                                        <h3 className="px-2 text-lg">{hariIniAdalah(dataSesiHariIni?.sesi[0]?.tanggal)}</h3>

                                        {/* <h3 className="text-2xl font-semibold px-2 ">Rabu</h3> */}
                                        <button className="px-2 border" onClick={() => { refetchSesiHariIni() }}>refetch</button>
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
                            <Dashboard title={"Presensi"}>
                                <div className=" grid grid-rows-2 gap-4 h-[85vh] mt-10">
                                    <div className="border border-gray-500 p-2 flex flex-col h-full ">

                                        <h2 className="font-bold text-center mb-1">Scan dengan QR Code</h2>
                                        <div className="h-full w-full flex-1 grid grid-row-2 gap-2">
                                            {dataSesiHariIni?.sesi[0] != undefined && !loadTukang ?
                                                <>
                                                    <QRScanDatang dataSesi={dataSesiHariIni?.sesi[0]} dataTukang={dataTukang} />
                                                    <QRScanPergi dataSesi={dataSesiHariIni?.sesi[0]} dataTukang={dataTukang} />
                                                </>
                                                : <></>
                                            }

                                            {/* <div className="bg-yellow-500 " onClick={() => { router.reload() }} >
                                <div className="flex  h-full justify-center items-center text-white">
                                    <p>Scan Untuk Pergi</p>
                                </div>
                            </div> */}
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
                        </div> :
                        <div className="w-screen h-screen flex items-center justify-center">
                            <div>
                                <p className="text-lg text-center">Sesi hari ini belum dimulai</p>
                                <br />
                                <Link className="text-2xl font-bold text-center px-5 py-4 bg-green-500 text-white" href="dashboard/sesi">Ke Halaman Sesi</Link>
                            </div>
                        </div>}
                </div> :
                <div className="w-screen h-screen flex items-center justify-center">
                    <p className="text-2xl font-bold text-center">Loading...</p>
                </div>}
        </>
    )
}