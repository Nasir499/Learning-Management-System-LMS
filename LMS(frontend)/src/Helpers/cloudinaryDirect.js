import axiosInstance from './axiosinstance';

// Directly upload a file from browser to Cloudinary using signed params from server
export async function uploadToCloudinaryDirect(file, folder = 'lms') {
  // 1) Get signature from server
  const signResp = await axiosInstance.post('/cloudinary/sign', { folder });
  if (!signResp?.data?.success) throw new Error('Failed to get Cloudinary signature');

  const { signature, timestamp, api_key, cloud_name } = signResp.data;

  // 2) Prepare form data for Cloudinary
  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', api_key);
  fd.append('timestamp', timestamp);
  fd.append('signature', signature);
  fd.append('folder', folder);

  // 3) Upload directly to Cloudinary
  const resp = await fetch(url, { method: 'POST', body: fd });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Cloudinary upload failed: ${resp.status} ${txt}`);
  }
  const result = await resp.json();
  return result; // contains public_id, secure_url, etc.
}
