const images = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg,svg,webp}', { eager: true });

export const Images = Object.fromEntries(
  Object.entries(images).map(([key, value]) => {
    const imageName = key.split('/').pop().split('.')[0]; 
    return [imageName, value.default || value]; 
  })
);

console.log(Images);