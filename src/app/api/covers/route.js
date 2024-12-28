import { connectDB } from '@/app/lib/mongoose';
import { Covers } from '@/app/models/covers';
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

export async function GET() {
    try {
        await connectDB();

        const covers = await Covers.find()
            .sort({ date: -1 })

        return NextResponse.json(covers);
    } catch (error) {
        console.error('Error en GET /api/covers:', error);
        return NextResponse.json(
            { error: 'Error al obtener las ventas' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const { password } = body;

        // Verificar la contraseña
        if (password !== process.env.SECRET_KEY) {
            return NextResponse.json(
                { error: 'Contraseña incorrecta' },
                { status: 401 }
            );
        }

        await connectDB();
        await Covers.deleteMany({});

        return NextResponse.json({
            message: 'Todos los registros han sido eliminados',
            success: true
        });
    } catch (error) {
        console.error('Error al eliminar registros:', error);
        return NextResponse.json(
            { error: 'Error al eliminar los registros' },
            { status: 500 }
        );
    }
}