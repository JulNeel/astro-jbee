import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

export async function downloadImage(url: string, filename: string) {
  const dir = path.join(process.cwd(), 'src', 'assets', 'Images', 'wpImages');

  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filepath = path.join(dir, filename);

  // Ne pas retélécharger si le fichier existe déjà
  if (fs.existsSync(filepath)) {
    return filepath;
  }

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => { });
        reject(err);
      });
    }).on('error', reject);
  });
}