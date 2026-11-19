import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { setWallpaper } from 'wallpaper';

interface ApodResponse {
  date: string;
  title: string;
  explanation: string;
  media_type: 'image' | 'video';
  url: string;
  hdurl?: string;
}

const ENDPOINT = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';
const WALLPAPER_DIR = path.join(os.homedir(), 'Pictures', 'NASA_APOD');

async function updateNasaWallpaper(): Promise<void> {
  try {
    console.log('Fetching NASA Astronomy Picture of the Day from science.nasa.gov...');

   const response = await fetch(ENDPOINT, {
      signal: AbortSignal.timeout(30_000),
      headers: {
        'User-Agent': 'NASA-APOD-Wallpaper-Updater/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    const data: ApodResponse | undefined = Array.isArray(rawData) ? rawData[0] : rawData;

    if (!data) {
      throw new Error('Empty response received from NASA APOD endpoint.');
    }

    if (data.media_type !== 'image') {
      console.log(`[${data.date}] Today's APOD is a video ("${data.title}"). Keeping current wallpaper.`);
      return;
    }

    const imageUrl = data.hdurl;
    if (!imageUrl) {
      throw new Error(`No image URL (hdurl) found for "${data.title}".`);
    }

    console.log(`Downloading "${data.title}" from ${imageUrl}...`);

   const imageResponse = await fetch(imageUrl, {
      signal: AbortSignal.timeout(60_000),
    });
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    await fs.mkdir(WALLPAPER_DIR, { recursive: true });
    // Clean up any previous files in the folder 
    const existingFiles = await fs.readdir(WALLPAPER_DIR);
    await Promise.all(
      existingFiles.map((file) => fs.rm(path.join(WALLPAPER_DIR, file), { force: true }))
    );

    const pathname = new URL(imageUrl).pathname;
    const extension = path.extname(pathname) || '.jpg';
    const filePath = path.join(WALLPAPER_DIR, `nasa_apod${extension}`);

    const arrayBuffer = await imageResponse.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    await setWallpaper(filePath);
    console.log(`Success! Wallpaper updated to: "${data.title}" (${data.date})`);

  } catch (error) {
    console.error('Error updating NASA wallpaper:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

updateNasaWallpaper();