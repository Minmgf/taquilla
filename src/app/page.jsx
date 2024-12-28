'use client'
import Link from 'next/link';
import React, { useState } from 'react'
import { GiTakeMyMoney } from "react-icons/gi";
import { PiDiscoBallBold } from "react-icons/pi";
import { AiOutlineNumber } from "react-icons/ai";
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    'coverValue': '',
    'totalCovers': '',
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
          totalCovers: Number(formData.totalCovers),
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
    <div className='bg-black w-full h-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
      <h1 className='text-white font-semibold text-center text-xl sm:text-2xl lg:text-3xl py-4'>
        Taquilla
      </h1>
      <p className='py-2 px-4 sm:px-8 bg-gray-200 rounded my-4 text-sm sm:text-base text-center'>
        Complete los valores para el gestor
      </p>
      
      <form className="w-full max-w-4xl p-4 sm:p-6 lg:p-10" onSubmit={handleSubmit}>
        <div className="w-full bg-gray-300 rounded-lg flex flex-col sm:flex-row">
          <div className="w-full p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="totalCovers" className="flex items-center">
                <AiOutlineNumber className='text-2xl sm:text-3xl lg:text-4xl' />
              </label>
              <input
                type="text"
                id='totalCovers'
                className='w-full sm:w-auto rounded px-2 py-1'
                placeholder='Covers Disponibles'
                value={formData.totalCovers}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="coverValue" className="flex items-center">
                <PiDiscoBallBold className='text-2xl sm:text-3xl lg:text-4xl' />
              </label>
              <input
                type="text"
                id='coverValue'
                className='w-full sm:w-auto rounded px-2 py-1'
                placeholder='Costo del cover'
                value={formData.coverValue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label htmlFor="baseAmount" className="flex items-center">
                <GiTakeMyMoney className='text-2xl sm:text-3xl lg:text-4xl' />
              </label>
              <input
                type="text"
                id='baseAmount'
                className='w-full sm:w-auto rounded px-2 py-1'
                placeholder='Ingrese la base'
                value={formData.baseAmount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button
            type='submit'
            className='w-full sm:w-auto bg-green-400 text-white font-extralight rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none px-4 py-2 hover:bg-green-500 transition-colors'>
            Continuar
          </button>
        </div>
      </form>
    </div>
  )
}

export default page
