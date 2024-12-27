'use client'
import React, { useEffect, useState } from 'react'
import { dbTimeForHuman } from '../models/datetime'
import { toast, Toaster } from 'react-hot-toast'

const page = () => {

    const [quantity, setQuantity] = useState(1)
    const [paymentAmount, setPaymentAmount] = useState(0)
    const [customAmount, setCustomAmount] = useState('')

    const handleIncrement = () => {
        setQuantity(prev => prev + 1)
    }
    const handleDecrement = () => {
        setQuantity(prev => prev - 1)
    }

    const handlePaymentAmount = (value) => {
        setPaymentAmount(prev => prev + value);
    }
    const handleCustomInput = (e) => {
        const value = e.target.value;
        setCustomAmount(value)
    }
    const handleAddCustomAmount = () => {
        if (customAmount) {
            setPaymentAmount(prev => prev + Number(customAmount));
            console.log(setPaymentAmount)
            setCustomAmount('')
        }
    }

    const [orderData, setOrderData] = useState({
        coverValue: 0,
        baseAmount: 0
    });
    useEffect(() => {
        const fetchLatestOrder = async () => {
            try {
                const response = await fetch('/api/orders/latest');
                if (response.ok) {
                    const data = await response.json();
                    setOrderData(data);
                }
            } catch (error) {
                console.error('Error al obtener la Configuracion:', error);
            }
        };

        fetchLatestOrder();
    }, []);


    const total = quantity * orderData.coverValue;
    const cambio = paymentAmount - total;


    const handleCover = async (e) => {
        e.preventDefault();

        if (paymentAmount < total) {
            toast.error('El pago es insuficiente para completar la venta', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#ff4b4b',
                    color: '#fff'
                }
            });
            return;
        }

        try {
            const total = quantity * orderData.coverValue;
            const change = paymentAmount - total;

            const saleData = {
                taquillero: "Taquillero",
                coversQuantity: quantity,
                coverValue: orderData.coverValue,
                totalAmount: total,
                paymentReceived: paymentAmount,
                change: change,
                date: new Date(),
                paid: paymentAmount >= total,
            }

            const response = await fetch('/api/covers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData)
            });

            if (response.ok) {
                // Resetear los estados después de una venta exitosa
                setQuantity(1);
                setPaymentAmount(0);
                setCustomAmount('');
                toast.success('Venta registrada exitosamente', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#10b981',
                        color: '#fff'
                    },
                    icon: '💰',
                });
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Error al registrar la venta');
            }
        } catch (error) {
            console.error('Error al registrar la venta:', error);
            alert('Error al registrar la venta');
        }
    }


    return (
        <div className='bg-black w-full h-full min-h-screen flex flex-col items-center justify-center'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <h1 className='text-white font-semibold text-center text-xl py-4'>Taquilla</h1>
            <p className='text-white mb-4' >
                Fecha: {new Date().toLocaleDateString()} ~ Valor cover: ${orderData.coverValue.toLocaleString()}COP
            </p>
            <div className="max-w-4xl w-full pl-2 bg-gray-300 flex rounded-lg justify-between overflow-hidden">
                <div className="flex gap-4 py-10">
                    <div className="  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Cantidad: {quantity}</p>
                    </div>
                    <div className="  p-2 flex  justify-center gap-4 ">
                        <button className='bg-black text-white text-4xl p-4 rounded-xl' onClick={handleIncrement}>+</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={handleDecrement}>-</button>
                    </div>
                    <div className="  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Total: ${total.toLocaleString()}</p>
                    </div>
                    <div className="  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>{cambio < 0 ? `Completa el pago` : `Cambio: ${cambio.toLocaleString()}`}</p>
                    </div>
                </div>
                <button
                    className='bg-green-400 text-white font-extralight text-wrap text-xl  px-4'
                    type='submit'
                    onClick={handleCover}
                >
                    Registrar venta
                </button>
            </div>
            <div className="max-w-4xl w-full mt-8 px-2 bg-gray-300 flex rounded-lg justify-between overflow-hidden">
                <div className="flex gap-4 py-10">
                    <div className=" w-[30%]  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Paga con ${paymentAmount.toLocaleString()}COP</p>
                    </div>
                    <div className=" w-[60%]  p-2 flex flex-wrap gap-4 ">
                        <button className='bg-black    text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(100000)} >100k</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(50000)} >50K</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(20000)} >20K</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(10000)} >10K</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(5000)} >5K</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(2000)} >2K</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(1000)} >1K</button>
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={() => handlePaymentAmount(-paymentAmount)} >Reset</button>
                        <div className="flex gap-4">

                            <input
                                type='text'
                                className='bg-gray-700 text-white text-4xl p-4 rounded-xl'
                                placeholder='Ingrese el valor'
                                value={customAmount}
                                onChange={handleCustomInput}
                            />
                            <button
                                onClick={handleAddCustomAmount}
                                className='bg-gray-500 text-white text-2xl p-4 rounded-xl'
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
