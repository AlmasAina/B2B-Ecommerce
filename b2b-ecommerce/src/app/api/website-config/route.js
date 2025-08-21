import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import WebsiteConfig from '@/app/models/WebsiteConfig';

export async function GET() {
    try {
        await dbConnect();
        const config = await WebsiteConfig.findOne({}).lean();
        return NextResponse.json(config || {}, { status: config ? 200 : 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const {
            websiteName = 'B2B-eCommerce',
            websiteLogo = '/logos.png',
            colorTheme = '#1976d2',
            fontColor = 'white'
        } = body || {};

        let config = await WebsiteConfig.findOne({});
        if (config) {
            config.websiteName = websiteName;
            config.websiteLogo = websiteLogo;
            config.colorTheme = colorTheme;
            config.fontColor = fontColor;
            await config.save();
        } else {
            config = await WebsiteConfig.create({ websiteName, websiteLogo, colorTheme, fontColor });
        }

        return NextResponse.json(config, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

