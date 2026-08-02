// Directly upload a file from browser to Cloudinary using signed params from server
// Uses VITE_API_URL (backend base) when available, otherwise falls back to http://localhost:8000
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = rawBase.replace(/\/api\/v1\/?$/, '');

export function uploadToCloudinaryDirect(file, folder = 'lms', onProgress = null) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // 1) Get signature from server
        const signUrl = `${API_BASE}/api/v1/cloudinary/sign`;
        console.log('[cloudinaryDirect] signUrl ->', signUrl);

        const signResp = await fetch(signUrl, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder }),
        });

        if (!signResp.ok) {
          const txt = await signResp.text();
          return reject(new Error(`Failed to get Cloudinary signature: ${signResp.status} ${txt}`));
        }

        const signJson = await signResp.json();
        if (!signJson?.success) return reject(new Error('Failed to get Cloudinary signature'));

        const { signature, timestamp, api_key, cloud_name } = signJson;

        // 2) Prepare XHR for direct upload with real-time progress
        // Use video/upload endpoint for browser uploads (auto/upload can cause CORS issues)
        const url = `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('api_key', api_key);
        fd.append('timestamp', timestamp);
        fd.append('signature', signature);
        fd.append('folder', folder);

        const xhr = new XMLHttpRequest();
        const startTime = Date.now();
        const totalBytes = file.size;

        if (onProgress && xhr.upload) {
          xhr.upload.onprogress = (e) => {
            const bytesUploaded = e.loaded;
            const total = e.total || totalBytes || 0;
            let progress = 0;
            if (total > 0) {
              progress = Math.round((bytesUploaded / total) * 100);
              progress = Math.min(progress, 95);
            }
            const elapsedSeconds = Math.max((Date.now() - startTime) / 1000, 0.001);
            const uploadSpeed = bytesUploaded / elapsedSeconds;
            const remainingBytes = Math.max(total - bytesUploaded, 0);
            const estimatedTimeRemaining = uploadSpeed > 0 ? Math.max(remainingBytes / uploadSpeed, 0) : 0;

            onProgress({
              progress,
              bytesUploaded,
              totalBytes: total,
              uploadSpeed,
              estimatedTimeRemaining
            });
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              if (onProgress) {
                onProgress({
                  progress: 100,
                  bytesUploaded: totalBytes,
                  totalBytes,
                  uploadSpeed: 0,
                  estimatedTimeRemaining: 0
                });
              }
              resolve(result);
            } catch {
              reject(new Error('Invalid JSON response from Cloudinary'));
            }
          } else {
            reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
        xhr.open('POST', url);
        xhr.send(fd);
      } catch (error) {
        reject(error);
      }
    })();
  });
}
