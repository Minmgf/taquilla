import { connectDB } from '@/app/lib/mongoose';
import  {Covers} from '@/app/models/covers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const newCovers = await Covers.create({
            taquillero: body.taquillero,
            coversQuantity: body.coversQuantity,
            coverValue: body.coverValue,
            totalAmount: body.totalAmount,
            paymentReceived: body.paymentReceived,
            change: body.change,
            date: body.date,
            paid: body.paid
        });

        return NextResponse.json(newCovers, { status: 201 });
    } catch (error) {
        console.error('Error en POST /api/covers :', error);
        return NextResponse.json(
            { error: 'Error al crear la orden' },
            { status: 500 }
        );
    }
}
