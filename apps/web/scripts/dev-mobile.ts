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
import { spawn, ChildProcess } from 'child_process';
import ngrok from 'ngrok';
import qrcode from 'qrcode';

const TIMEOUT_MS = 30000; // 30 seconds timeout for dev server detection

async function run() {
  console.log('🚀 Starting Next.js dev server...');

  const devServer: ChildProcess = spawn('yarn', ['next', 'dev'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  let resolved = false;
  let nextUrl = '';
  let ngrokConnected = false;
  let shutdownInProgress = false;

  // Timeout for dev server detection
  const timeout = setTimeout(() => {
    if (!resolved) {
      console.error(
        '❌ Timeout: Could not detect Next.js dev server after 30 seconds'
      );
      cleanup();
    }
  }, TIMEOUT_MS);

  devServer.stdout?.on('data', async (data) => {
    const text = data.toString();
    process.stdout.write(text);

    // Detect dev server URL from stdout (more robust pattern)
    const match = text.match(/(?:Local:|http:\/\/localhost:)(\d+)/);
    if (match && !resolved) {
      clearTimeout(timeout);
      const port = match[1];
      nextUrl = `http://localhost:${port}`;
      resolved = true;

      console.log(`🌐 Detected Next.js on ${nextUrl}`);
      console.log('🚇 Starting ngrok tunnel...');

      try {
        const url = await ngrok.connect({
          addr: parseInt(port),
          onStatusChange: (status) => {
            if (status === 'connected') {
              console.log('✅ Ngrok tunnel established');
            }
          },
        });

        ngrokConnected = true;
        console.log(`🔗 Public URL: ${url}`);
        console.log('📱 Scan this QR code:\n');
        const qr = await qrcode.toString(url, { type: 'terminal' });
        console.log(qr);
        console.log('\n💡 Press Ctrl+C to stop the server and tunnel');
      } catch (error) {
        console.error('❌ Failed to start ngrok tunnel:', error);
      }
    }
  });

  devServer.stderr?.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  devServer.on('error', (error) => {
    console.error('❌ Failed to start dev server:', error);
    cleanup();
  });

  devServer.on('exit', (code, signal) => {
    if (!shutdownInProgress) {
      console.log(
        `\n⚠️  Dev server exited with code ${code} and signal ${signal}`
      );
      cleanup();
    }
  });

  async function cleanup() {
    if (shutdownInProgress) return;
    shutdownInProgress = true;

    console.log('\n🛑 Shutting down...');
    clearTimeout(timeout);

    if (ngrokConnected) {
      try {
        console.log('🚇 Closing ngrok tunnel...');
        await ngrok.disconnect();
        await ngrok.kill();
        console.log('✅ Ngrok tunnel closed');
      } catch (error) {
        // Ignore ngrok cleanup errors - it might already be disconnected
      }
    }

    if (devServer && !devServer.killed) {
      devServer.kill('SIGTERM');

      // Force kill after 5 seconds if it doesn't exit gracefully
      setTimeout(() => {
        if (!devServer.killed) {
          devServer.kill('SIGKILL');
        }
      }, 5000);
    }

    process.exit(0);
  }

  // Handle various exit signals
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('SIGHUP', cleanup);
}
run();
