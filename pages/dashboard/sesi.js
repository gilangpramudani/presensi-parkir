import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Dashboard from "../../components/dashboard";
import Kepala from "../../components/kepala";
import { ModalBuatSesi } from "../../components/modalSesi";
import Navigation from "../../components/navigation";
import { Error, Success } from "../../components/notifikasi";
import { GET_LIST_TUKANG } from "../../gql/listTukang";
import { GET_SESI_BUKA_HARI_INI, POST_BUAT_SESI, POST_TUTUP_SESI } from "../../gql/sesi";

function BuatSesi({ dataTukang }) {
    const [isOpen, setIsOpen] = useState(false)
    const [buatSesi] = useMutation(POST_BUAT_SESI);
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const date = new Date();

    async function handleSubmit() {

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = (date.getDate()).toString().padStart(2, '0');
        const hari = [year, month, day].join('-');
        console.log({ "buka": true, "tanggal": hari })
        try {
            setIsOpen(false)
            setIsLoading(true)
            const res = await buatSesi({ variables: { "buka": true, "tanggal": hari } })
            console.log(res)
            if (res.data.insert_sesi) {
                toast.success(<Success text={"Berhasil membuka sesi untuk hari ini, harap tunggu sampai halaman di reload"} />)
                setTimeout(() => {
                    router.reload()
                }, 3000)
            }
        } catch (error) {
            toast.error(<Error text={error.message} />)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div>
                <p className="text-lg text-center">Mulai sesi hari ini</p>
                {isLoading ?
                    <div>
                        <p className="text-2xl text-center">Loading</p>
                    </div> :
                    <button className="text-2xl font-bold text-center px-5 py-4 bg-yellow-500 text-white" onClick={() => { setIsOpen(true) }}>Buat Sesi</button>
                }
            </div>

            <ModalBuatSesi title={"Mulai Sesi Hari Ini"} isOpen={isOpen} closed={() => { setIsOpen(false) }}>
                <div className="h-[50vh] flex items-center justify-center">
                    <div>
                        <p className="text-lg text-center">Bertanggung jawab atas </p>
                        <p className="text-lg text-center">presensi hari ini</p>
                        <button className="text-2xl font-bold text-center px-5 py-4 bg-yellow-500 text-white mt-5" onClick={() => { handleSubmit() }}>Ya, Buat Sesi!</button>
                    </div>
                </div>
            </ModalBuatSesi>
        </div>

    );
}

function TutupSesi({ idSesi }) {
    const [isOpen, setIsOpen] = useState(false)
    const [tutupSesi] = useMutation(POST_TUTUP_SESI);
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    async function handleSubmit() {
        try {
            setIsOpen(false)
            setIsLoading(true)
            const res = await tutupSesi({ variables: { "id": idSesi } })
            console.log(res)
            if (res.data.update_sesi) {
                toast.success(<Success text={"Berhasil menutup sesi untuk hari ini, harap tunggu sampai halaman di reload"} />)
                setTimeout(() => {
                    router.reload()
                }, 3000)
            }
            //
        } catch (error) {
            toast.error(<Error text={error.message} />)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="">
            <div>
                {isLoading ?
                    <div>
                        <p className="text-2xl text-center">Loading</p>
                    </div> :
                    <button className="text-2xl font-bold text-center px-2 py-1 bg-red-500 text-white" onClick={() => { setIsOpen(true) }}>Tutup Sesi</button>
                }
            </div>

            <ModalBuatSesi title={"Tutup Sesi Hari Ini"} isOpen={isOpen} closed={() => { setIsOpen(false) }}>
                <div className="h-[50vh] flex items-center justify-center">
                    <div>
                        <p className="text-lg text-center">Bertanggung jawab atas </p>
                        <p className="text-lg text-center">presensi hari ini</p>
                        <button className="text-2xl font-bold text-center px-5 py-4 bg-red-500 text-white mt-5" onClick={() => { handleSubmit() }}>Tutup Sesi Hari Ini!</button>
                    </div>
                </div>
            </ModalBuatSesi>
        </div>

    );
}

export default function Sesi() {
    const { data: dataTukang, refetch: refetchTukang, loading: loadTukang, error: errorTukang } = useQuery(GET_LIST_TUKANG);
    const { data: dataSesiHariIni, refetch: refetchSesiHariIni, loading: loadSesiHariIni, error: errorSesiHariIni } = useQuery(GET_SESI_BUKA_HARI_INI);
    // const router = useRouter()

    function hariIniAdalah(tanggal) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var today = new Date(tanggal);

        return today.toLocaleDateString("id-ID", options)
    }
    // useEffect(() => {
    //     refetchSesiHariIni()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [router])

    return (
        <>
            <Kepala title={"Sesi hari Ini"} />
            {errorTukang || errorSesiHariIni ?
                toast.error(<Error text={"Ada kesalahan, coba reload"} />) : <></>
            }
            <Navigation />
            {/* <Dashboard title={"Sesi Hari Ini"}>
                        </Dashboard> */}
            {!loadTukang && !loadSesiHariIni ?
                <div>
                    {dataSesiHariIni?.sesi[0] != undefined ?
                        <div>
                            <div className="w-screen mt-20">
                                <div className="px-2">
                                    <h1 className="text-3xl font-semibold">Recap hari ini</h1>

                                    <h2 className="text-2xl font-semibold my-2">Presensi: {dataSesiHariIni?.sesi[0] != undefined && dataSesiHariIni?.sesi[0]?.tanggal}</h2>
                                    <h3 className="text-lg">{hariIniAdalah(dataSesiHariIni?.sesi[0]?.tanggal)}</h3>
                                    <button className="px-2 border h-10 border-black" onClick={() => { refetchSesiHariIni() }}>Refetch</button>

                                </div>
                                <div className="w-screen  overflow-scroll">
                                    <table className="py-2 mb-10">
                                        <thead className="text-left border-b-2 border-gray-900">
                                            <tr>
                                                <th className="px-2 border-r border-gray-900">Nama</th>
                                                <th className="px-2 border-r border-gray-900">RT</th>
                                                <th className="px-2 border-r border-gray-900">Datang</th>
                                                <th className="px-2 border-r border-gray-900">Pergi</th>
                                                <th className="px-2 border-r border-gray-900">Presensi Datang</th>
                                                <th className="px-2 border-r border-gray-900">Presensi Pergi</th>
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
                                                            <td className="p-2 border-r border-gray-900">
                                                                {v?.jenis_presensi_datang}
                                                            </td>
                                                            <td className="p-2 border-r border-gray-900">
                                                                {v?.jenis_presensi_pergi}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                : <></>
                                            }

                                        </tbody>
                                    </table>

                                </div>
                                <TutupSesi idSesi={dataSesiHariIni?.sesi[0].id} />
                            </div>
                        </div>
                        : <BuatSesi />
                    }
                </div>
                : <div className="w-screen h-screen flex items-center justify-center">
                    <p className="text-2xl font-bold text-center">Loading...</p>
                </div>}
            {/* <BuatSesi /> */}
        </>
    )
}