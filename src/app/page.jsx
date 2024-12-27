'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { GiTakeMyMoney } from "react-icons/gi";
import { PiDiscoBallBold } from "react-icons/pi";
import { useRouter } from 'next/navigation';



const page = () => {

  const router = useRouter();
  const [formData, setFormData] = useState({
    'coverValue': '',
    'baseAmount': '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverValue: Number(formData.coverValue),
          baseAmount: Number(formData.baseAmount),
          taquillero: "Taquillero",
        })
      });

      if (response.ok) {
        router.push('/venta')
      } else {
        console.log('Error al guardar los datos');
      }
    } catch (error) {
      console.log('Error:', error)
    }

  };

  return (
    <div className='bg-black w-full h-full min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-white font-semibold text-center text-xl py-4'>Taquilla</h1>
      <p className=' py-2 px-8 bg-gray-200 rounded my-4'>Complete los valores para el gestor</p>
      <form className="max-w-4xl p-10 flex justify-center gap-4" onSubmit={handleSubmit} >

        <div className="max-w-4xl w-full bg-gray-300 flex rounded-lg overflow-hidden">
          <div className="max-w-4xl w-full  p-10 flex justify-center gap-4">
            <label htmlFor="base"><PiDiscoBallBold className='text-4xl' /></label>
            <input
              type="text"
              id='coverValue'
              className='rounded px-2'
              placeholder='Costo del cover'
              value={formData.coverValue}
              onChange={handleChange}
              required
            />
            <label htmlFor="base"><GiTakeMyMoney className='text-4xl ' />
            </label>
            <input
              type="text"
              id='baseAmount'
              className='rounded px-2'
              placeholder='Ingrese la base'
              value={formData.baseAmount}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type='submit'
            className='bg-green-400 text-white font-extralight  px-4'>
            Continuar
          </button>
        </div>
      </form>
    </div>
  )
}

export default page
