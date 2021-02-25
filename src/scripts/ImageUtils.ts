export function loadImage(url: string): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(createImageBitmap(image));
    image.onerror = (e) => reject(e);
    image.src = url;
  });
}
