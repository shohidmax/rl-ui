
export async function uploadImageToImgBB(file: File): Promise<string> {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error('IMGBB_API_KEY is not defined');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload image');
    }

    return data.data.url;
}
