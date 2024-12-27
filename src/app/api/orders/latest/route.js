import { connectDB } from '@/app/lib/mongoose';
import { Order } from '@/app/models/Order';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        
        // Obtener la última orden creada
        const latestOrder = await Order.findOne()
            .sort({ date: -1 }) // Ordenar por fecha en orden descendente
            .limit(1);         // Obtener solo el primer resultado

        if (!latestOrder) {
            return NextResponse.json(
                { error: 'No se encontró ninguna orden' },
                { status: 404 }
            );
        }

        return NextResponse.json(latestOrder);
    } catch (error) {
        console.error('Error en GET /api/orders/latest:', error);
        return NextResponse.json(
            { error: 'Error al obtener la última orden' },
            { status: 500 }
        );
    }
}
