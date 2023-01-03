import { setCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Kepala from '../components/kepala'


export default function Home() {

  const router = useRouter()

  const handleChange = (event) => {
    if (event.target.value == "k2DalLb8lPwDxyA6f028v2GZv278pzPQUAPQ23ouGw2PbPjNsenpe4xuJCKttO0t") {
      router.replace("/dashboard")
      setCookies("token", event.target.value)
    }
  };

  return (
    <>
      <Kepala title={"Autentikasi"} />
      <main>
        <div className='w-screen h-screen flex justify-center items-center py-10 px-5 relative'>
          {/* <div className='absolute top-0 w-full h-10 bg-yellow-300' />
          <div className='absolute bottom-0 w-full h-10 bg-gray-800' /> */}
          <div className='w-full'>
            <h1 className='text-3xl font-bold text-center'>Login Parkir</h1>
            <input type="text" id="kode" name='kode' onChange={handleChange}
              className='w-full mt-10 px-2 py-4 border-2 border-black hover:border-yellow-500' placeholder='Copy kode yang sudah diberikan' />
          </div>
        </div>
      </main>
    </>
  )
}
