import { connectDB } from '@/app/lib/mongoose';
import { Order } from '@/app/models/Order';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        
        const body = await request.json();
        
        const newOrder = await Order.create({
            taquillero: body.taquillero,
            coverValue: body.coverValue,
            baseAmount: body.baseAmount,
            date: new Date(),
            paid: false,
            value: 0 // Valor inicial de ventas
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Error en POST /api/orders:', error);
        return NextResponse.json(
            { error: 'Error al crear la orden' },
            { status: 500 }
        );
    }
}
