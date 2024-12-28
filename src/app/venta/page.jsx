'use client'
import React, { useEffect, useState } from 'react'
import { dbTimeForHuman } from '../models/datetime'
import { toast, Toaster } from 'react-hot-toast'

const page = () => {

    const [quantity, setQuantity] = useState(1)
    const [paymentAmount, setPaymentAmount] = useState(0)
    const [customAmount, setCustomAmount] = useState('')
    const [showSales, setShowSales] = useState(false);
    const [sales, setSales] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [password, setPassword] = useState('');

    const handleDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteAll = async () => {
        try {
            const response = await fetch('/api/covers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSales([]);
                setShowDeleteModal(false);
                setPassword('');
                
                toast.success('Todos los registros han sido eliminados', {
                    duration: 3000,
                    position: 'top-right',
                    style: {
                        background: '#10b981',
                        color: '#fff'
                    },
                });
            } else {
                throw new Error(data.error || 'Error al eliminar los registros');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al eliminar los registros', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#ff4b4b',
                    color: '#fff'
                }
            });
        }
    };


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
        totalCovers: 0,
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

    const handleSells = async () => {
        try {
            const response = await fetch('/api/covers');
            if (response.ok) {
                const data = await response.json();
                setSales(data);
                setShowSales(!showSales);
            } else {
                toast.error('Error al cargar las ventas', {
                    duration: 3000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
            toast.error('Error al cargar las ventas');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };


    const handleCover = async (e) => {
        e.preventDefault();

        if (quantity <= 0) {
            toast.error('La cantidad de covers debe ser mayor a 0', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#ff4b4b',
                    color: '#fff'
                }
            });
            return;
        }

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
                setQuantity(1);
                setPaymentAmount(0);
                setCustomAmount('');

                const newSale = await response.json();

                setSales(prevSales => [newSale, ...prevSales]);

                if (!showSales) {
                    setShowSales(true);
                }

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
            toast.error('Error al registrar la venta: ' + error.message);
        }
    }

    


    return (
        <div className='bg-black w-full h-full min-h-screen flex flex-col py-8 items-center justify-center'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <h1 className='text-white font-semibold text-center text-xl py-4'>Taquilla</h1>
            <p className='text-white mb-4' >
                Fecha: {new Date().toLocaleDateString()} ~ Valor cover: ${orderData.coverValue.toLocaleString()}COP
            </p>
            <div className="max-w-4xl md:w-full md:pl-2 bg-gray-300 flex flex-col md:flex-row rounded-lg justify-between overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 py-10">
                    <div className="  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Cantidad: {quantity}</p>
                    </div>
                    <div className="  p-2 flex  justify-center gap-4 ">
                        <button className='bg-gray-700 text-white text-4xl p-4 rounded-xl' onClick={handleDecrement}>-</button>
                        <button className='bg-black text-white text-4xl p-4 rounded-xl' onClick={handleIncrement}>+</button>
                    </div>
                    <div className="  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>Total: ${total.toLocaleString()}</p>
                    </div>
                    <div className="  p-2 flex  justify-center gap-4 items-center">
                        <p className='text-4xl'>{cambio < 0 ? `Completa el pago` : `Cambio: ${cambio.toLocaleString()}`}</p>
                    </div>
                </div>
                <button
                    className='bg-green-400 text-white font-extralight text-wrap text-xl  px-4 py-4 md:py-0'
                    type='submit'
                    onClick={handleCover}
                >
                    Registrar venta
                </button>
            </div>
            <div className="max-w-4xl md:w-full m-8 px-2 bg-gray-300 flex rounded-lg md:justify-between  overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 py-10 ">
                    <div className=" md:w-[30%]  p-2 flex  text-center gap-4 items-center">
                        <p className='text-4xl'>Paga con ${paymentAmount.toLocaleString()}COP</p>
                    </div>
                    <div className=" md:w-[60%] max-w-4xl flex flex-wrap gap-2 md:gap-4 justify-center md:justify-normal  ">
                        <button className='bg-black    text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(100000)} >100k</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(50000)} >50K</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(20000)} >20K</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(10000)} >10K</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(5000)} >5K</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(2000)} >2K</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(1000)} >1K</button>
                        <button className='bg-gray-700 text-white md:text-4xl p-4 rounded-xl  text-sm ' onClick={() => handlePaymentAmount(-paymentAmount)} >Reset</button>
                        <div className="flex flex-col max-w-xl md:flex-row gap-4">
                            <input
                                type='text'
                                className='bg-gray-700 text-white md:text-4xl p-2 md:p-4 rounded-xl'
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


            {(() => {
                const totalCovers = sales.reduce((total, sale) => total + sale.coversQuantity, 0);
                const totalCaja = orderData.baseAmount + sales.reduce((total, sale) => total + sale.totalAmount, 0);
                const totalGanancias = sales.reduce((total, sale) => total + sale.totalAmount, 0);
                const coversDisponibles = (orderData.totalCovers || 0) - totalCovers;

                return (
                    <div className="my-6 grid md:grid-cols-5   gap-4">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700">Covers Disponibles</h3>
                            <p className="text-2xl font-bold text-gray-900">{coversDisponibles}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700">Covers Vendidos</h3>
                            <p className="text-2xl font-bold text-gray-900">{totalCovers}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700">Dinero en Caja</h3>
                            <p className="text-2xl font-bold text-gray-900">${totalCaja.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700">Base</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                ${orderData.baseAmount?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700">Ganancias</h3>
                            <p className="text-2xl font-bold text-gray-900">${totalGanancias.toLocaleString()}</p>
                        </div>
                    </div>
                );
            })()}

            <div className="flex md:flex-row flex-col gap-4">
                <button
                    className='bg-zinc-200 px-4 py-2 rounded hover:bg-zinc-300'
                    onClick={handleSells}
                >
                    {showSales ? 'Ocultar ventas' : 'Mostrar ventas'}
                </button>

                <button
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                onClick={handleDeleteModal}
            >
                Cierre de Taquilla
            </button>

            {/* Modal de confirmación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Confirmar Cierre de Taquilla</h2>
                        <p className="mb-4 text-gray-600">
                            Esta acción eliminará todos los registros. Por favor, ingrese la contraseña para continuar.
                        </p>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Ingrese la contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setPassword('');
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDeleteAll}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>

            {showSales && (
                <div className="max-w-4xl w-full m-8 px-4 py-8 bg-gray-300 rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha y Hora
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor Cover
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pago Recibido
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cambio
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.map((sale, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(sale.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {sale.coversQuantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${sale.coverValue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${sale.totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${sale.paymentReceived.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${sale.change.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default page

