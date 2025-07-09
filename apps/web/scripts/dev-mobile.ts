/**
 * ---------------------------------------------------------
 * Dev Server + Mobile Tunnel Script (using `tsx`)
 * ---------------------------------------------------------
 *
 * This script starts your Next.js dev server and exposes it
 * to your local network (or mobile device) via an ngrok tunnel.
 * It also prints a QR code so you can scan and open the app
 * on your phone.
 *
 * 🛠 Setup Instructions:
 * 1. Install dependencies:
 *    yarn add -D tsx ngrok qrcode dotenv
 *
 * 2. Create a `.env` file in the root of your project:
 *    NGROK_AUTH_TOKEN=your_ngrok_token_here
 *
 * 3. Add this script to package.json:
 *    "scripts": {
 *      "dev": "next dev",
 *      "dev:mobile": "tsx scripts/dev-mobile.ts"
 *    }
 *
 * 4. Run with:
 *    yarn dev:mobile
 * ---------------------------------------------------------
 */
import 'dotenv/config';
import { spawn } from 'child_process';
import ngrok from 'ngrok';
import qrcode from 'qrcode';

async function run() {
  console.log('🚀 Starting Next.js dev server...');

  const devServer = spawn('yarn', ['next', 'dev'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  let resolved = false;
  let nextUrl = '';

  devServer.stdout?.on('data', async (data) => {
    const text = data.toString();
    process.stdout.write(text); // pipe to your terminal

    // Detect dev server URL from stdout
    const match = text.match(/http:\/\/localhost:(\d+)/);
    if (match && !resolved) {
      const port = match[1];
      nextUrl = `http://localhost:${port}`;
      resolved = true;

      console.log(`🌐 Detected Next.js on ${nextUrl}`);
      console.log('🚇 Starting ngrok tunnel...');

      const url = await ngrok.connect({
        addr: port,
        authtoken: process.env.NGROK_AUTH_TOKEN,
      });

      console.log(`🔗 Public URL: ${url}`);
      console.log('📱 Scan this QR code:\n');
      const qr = await qrcode.toString(url, { type: 'terminal' });
      console.log(qr);
    }
  });

  devServer.stderr?.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await ngrok.disconnect();
    await ngrok.kill();
    devServer.kill();
    process.exit();
  });
}

run();
