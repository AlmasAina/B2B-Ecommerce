import dbConnect from '@/lib/dbConnect';

export async function GET() {
    try {
        await dbConnect();
        return new Response(
            JSON.stringify({ message: '✅ MongoDB connected successfully!' }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: '❌ MongoDB connection failed', error: error.message }),
            { status: 500 }
        );
    }
}
