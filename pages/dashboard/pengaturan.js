import { useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';



const QrModal = ({ triggerID }) => {
    const modal = useRef(null);
    const video = useRef(null);
    const [qrScanner, setQrScanner] = useState();
    const [isOpen, setIsOpen] = useState(true)
    const [fakeTrigger, setFakeTrigger] = useState(false)

    var increment = 1

    const startScan = () => {


        qrScanner.start();

    }

    const terScan = (res) => {
        // onDissMiss()
        setIsOpen(false)
        console.log("aoaoaoa")
        console.log("asaaoaoaoa")
    }

    function onDissMiss() {
        qrScanner?.stop()
    }

    function handleScan(result) {
        //Logic with scanned qr code
        // qrScanner?.stop();
        // console.log("uiuiui")
        terScan(result)
    }

    async function close() {
        qrScanner?.stop();
        qrScanner?.destroy();
        setQrScanner(undefined);
    }

    useEffect(() => {
        // increment++
        // console.log(increment)
        if (video.current && !fakeTrigger) {
            const qrScannerW = new QrScanner(video.current, (result) => { handleScan(result) }, {
                highlightScanRegion: true,
                maxScansPerSecond: 0.3
            });
            setQrScanner(qrScannerW);
            qrScannerW.start();
            qrScannerW.stop();
        }
        if (video.current && fakeTrigger) {
            const qrScannerW = new QrScanner(video.current, (result) => { handleScan(result) }, {
                highlightScanRegion: true,
                maxScansPerSecond: 0.3
            });
            setQrScanner(qrScannerW);
            qrScannerW.start();
        }
        // increment++
        // console.log(increment)
        // Dependency array missing handleScan, since it should not set Scanner on handleScan change
        // eslint-disable-next-line
    }, [video.current, isOpen, fakeTrigger]);

    // useEffect(() => {
    //     if (video.current) {
    //         const qrScannerW = new QrScanner(video.current, (result) => { handleScan(result) }, {
    //             highlightScanRegion: true,
    //             maxScansPerSecond: 1
    //         });
    //         setQrScanner(qrScannerW);
    //         qrScannerW.start();
    //         // qrScannerW.stop();
    //     }
    //     // if (!isOpen) qrScanner.stop()
    //     // eslint-disable-next-line
    // }, [video.current, fakeTrigger])

    // useEffect(() => {
    //     if (!isOpen) qrScanner.stop()
    //     // eslint-disable-next-line
    // }, [isOpen])

    return (
        <>
            <button onClick={() => { qrScanner?.stop(); setQrScanner(null) }}>Onna</button>
            <button onClick={() => { setIsOpen(true); qrScanner?.start(); setFakeTrigger(true) }}>Onna</button>
            <div className='bg-red-500 relative'>
                {isOpen ?
                    <></>

                    : <></>}
                <video ref={video} className=""></video>
            </div>

        </>
    );
};

export default QrModal;


// import { useHtml5QrCodeScanner } from 'react-html5-qrcode-reader';

// export default function YourComponent() {
//     const { Html5QrcodeScanner } = useHtml5QrCodeScanner('/static/html5-qrcode.min.js');

//     useEffect(() => {
//         if (Html5QrcodeScanner) {
//             // Creates anew instance of `HtmlQrcodeScanner` and renders the block.
//             let html5QrcodeScanner = new Html5QrcodeScanner(
//                 "reader",
//                 { fps: 10, qrbox: { width: 250, height: 250 } },
//         /* verbose= */ false);
//             html5QrcodeScanner.render(
//                 (data) => console.log('success ->', data),
//                 (err) => console.log('err ->', err)
//             );
//         }
//     }, [Html5QrcodeScanner]);

//     // beware: id must be the same as the first argument of Html5QrcodeScanner
//     return (
//         <div id='reader'></div>
//     );
// }

// import React, { useEffect } from 'react';
// import { useHtml5QrCodeScanner, useAvailableDevices } from 'react-html5-qrcode-reader';

// const html5QrCodeScannerFile = '/html5-qrcode.min.js'; // <-- this file is in /public.

// function QWEFF() {
//     const { Html5QrcodeScanner } = useHtml5QrCodeScanner('/html5-qrcode.min.js');
//     const { devices, error } = useAvailableDevices(
//         () => {
//             script = document.createElement("script");
//             script.src = html5QrCodeScannerFile
//             script.async = true
//             document.body.appendChild(script)
//         }
//     );

//     useEffect(() => {
//         if (Html5QrcodeScanner) {
//             let html5QrcodeScanner = new Html5QrcodeScanner(
//                 "reader",
//                 { fps: 10, qrbox: { width: 250, height: 250 } },
//         /* verbose= */ false);
//             html5QrcodeScanner.render(
//                 (data) => console.log('success ->', data),
//                 (err) => console.log('err ->', err)
//             );
//         }
//     }, [Html5QrcodeScanner]);

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <div id='reader'></div>
//                 {error && `Devices error: ${error}`}
//                 {devices && (
//                     <div>
//                         <span>Available devices are:</span>
//                         <ul>
//                             {devices.map(v => (
//                                 <li key={v.i}>
//                                     id: {v.id}<br />
//                                     label: {v.label}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//                 <a
//                     className="App-link"
//                     href="https://reactjs.org"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                 >
//                     Learn React
//                 </a>
//             </header>
//         </div>
//     );
// }

// export default QWEFF;