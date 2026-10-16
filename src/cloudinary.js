const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', PRESET)
  fd.append('folder', 'excessory')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed — check Cloudinary cloud name and unsigned preset')
  return (await res.json()).secure_url
}

// Auto format + quality + width = fast loading
export const img = (url, w = 600) =>
  url && url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${w}/`) : url
