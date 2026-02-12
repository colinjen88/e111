
import { Client, RichMenu } from '@line/bot-sdk';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Load environment variables manually if not loaded automatically
// Only needed if not running via a runner that preloads env vars
if (!process.env.NUXT_LINE_CHANNEL_ACCESS_TOKEN) {
    console.warn("Warming: NUXT_LINE_CHANNEL_ACCESS_TOKEN not found in environment, checking .env file...");
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value && key.trim() === 'NUXT_LINE_CHANNEL_ACCESS_TOKEN') {
                process.env.NUXT_LINE_CHANNEL_ACCESS_TOKEN = value.trim();
            }
        });
    }
}

const client = new Client({
    channelAccessToken: process.env.NUXT_LINE_CHANNEL_ACCESS_TOKEN || '',
});

async function main() {
    if (!process.env.NUXT_LINE_CHANNEL_ACCESS_TOKEN) {
        throw new Error('NUXT_LINE_CHANNEL_ACCESS_TOKEN is not set');
    }

    console.log('Deploying Rich Menu...');

    // 1. Define Rich Menu Object
    const richMenuObject: RichMenu = {
        size: {
            width: 2500,
            height: 1686,
        },
        selected: true,
        name: 'Main Menu',
        chatBarText: '功能選單',
        areas: [
            // Top-Left: Start Booking -> /booking
            {
                bounds: { x: 0, y: 0, width: 1250, height: 843 },
                action: {
                    type: 'uri',
                    label: '立即預約',
                    uri: 'https://book.gowork.run/booking',
                },
            },
            // Top-Right: My Orders -> /order
            {
                bounds: { x: 1250, y: 0, width: 1250, height: 843 },
                action: {
                    type: 'uri',
                    label: '我的訂單',
                    uri: 'https://book.gowork.run/order',
                },
            },
            // Bottom-Left: Services -> /#services (or just home)
            {
                bounds: { x: 0, y: 843, width: 1250, height: 843 },
                action: {
                    type: 'uri',
                    label: '服務介紹',
                    uri: 'https://book.gowork.run/#services',
                },
            },
            // Bottom-Right: Contact -> Tel
            {
                bounds: { x: 1250, y: 843, width: 1250, height: 843 },
                action: {
                    type: 'uri',
                    label: '聯絡我們',
                    uri: 'tel:+88662221111', 
                },
            },
        ],
    };

    // 2. Create Rich Menu
    const richMenuId = await client.createRichMenu(richMenuObject);
    console.log(`Rich Menu created: ${richMenuId}`);

    // 3. Upload Image
    const imagePath = path.resolve(process.cwd(), 'rich-menu.png');
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image not found at ${imagePath}. Please place "rich-menu.png" in the project root.`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    await client.setRichMenuImage(richMenuId, imageBuffer); // Correct method and content-type is usually auto-detected or defaults to png/jpeg
    console.log('Rich Menu image uploaded.');

    // 4. Set as Default
    await client.setDefaultRichMenu(richMenuId);
    console.log(`Rich Menu ${richMenuId} set as default.`);
}

main().catch(err => {
    console.error('Error deploying Rich Menu:', err);
    process.exit(1);
});
