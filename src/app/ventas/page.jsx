import React from 'react'

const page = () => {
    return (
        <div className='bg-black w-full h-full min-h-screen flex flex-col items-center justify-center'>
            <h1 className='text-white font-semibold text-center text-xl py-4'>Taquilla</h1>
            <p className='text-white mb-4 '>Fecha: **/**/**  Valor cover: $20.000 COP</p>
            <div className="max-w-4xl w-full bg-gray-300 flex rounded-lg  justify-between overflow-hidden">
                <div className="flex">
                    <div className="  p-10 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Cantidad: 1</p>
                    </div>
                    <div className="  p-10 flex  justify-center gap-4 ">
                        <button className='bg-black text-white text-4xl p-4 rounded-xl'>+</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl'>-</button>
                    </div>
                    <div className="  p-10 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Total: $20.000</p>
                    </div>

                </div>
                <button className='bg-green-400 text-white font-extralight text-wrap text-xl  px-4'>Registrar venta</button>
            </div>
        </div>
    )
}

export default page
