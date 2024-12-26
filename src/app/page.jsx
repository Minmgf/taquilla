import React from 'react'
import { GiTakeMyMoney } from "react-icons/gi";
import { PiDiscoBallBold } from "react-icons/pi";



const page = () => {
  return (
    <div className='bg-black w-full h-full min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-white font-semibold text-center text-xl py-4'>Taquilla</h1>
        <p className=' py-2 px-8 bg-gray-200 rounded my-4'>Complete los valores para el gestor</p>
      <div className="max-w-4xl w-full bg-gray-300 flex rounded-lg overflow-hidden">
        <div className="max-w-4xl w-full  p-10 flex justify-center gap-4">
          <div className="flex gap-2">
            <label htmlFor="base"><PiDiscoBallBold className='text-4xl ' /></label>
            <input type="text" id='base' className='rounded px-2' placeholder='Costo del cover '  />
          </div>
          <div className=" flex gap-2">
            <label htmlFor="base"><GiTakeMyMoney className='text-4xl ' />
            </label>
            <input type="text" id='base' className='rounded bg px-2' placeholder='Ingrese la base'  />
          </div>
        </div>
        <button className='bg-green-400 text-white font-extralight  px-4'>Continuar</button>
      </div>
    </div>
  )
}

export default page
