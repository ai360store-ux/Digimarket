
export const formatDuration = (type: 'preset' | 'calendar', value?: string, date?: string): string => {
  if (type === 'preset') return value || '';
  if (!date) return '';

  const expiry = new Date(date);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Expired';
  if (diffDays < 30) return `${diffDays} Days`;

  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;

  if (remainingDays === 0) return `${months} Month${months > 1 ? 's' : ''}`;
  return `${months}m ${remainingDays}d`;
};

export const calculateDiscount = (mrp: number, price: number): number => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

export const compressImage = async (file: File, quality: number = 0.7, format: string = 'image/webp'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL(format, quality);
        resolve(dataUrl);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateWhatsAppUrl = (
  phone: string,
  productName: string,
  optionName: string,
  duration: string,
  price: number,
  mrp: number,
  orderId: string,
  currency: string = '₹',
  tax: number = 0
) => {
  const discount = calculateDiscount(mrp, price);
  const totalWithTax = price + (price * (tax / 100));
  
  let text = `Hi, I want to buy licensed game: ${productName}
Edition: ${optionName}
Access: ${duration}
Price: ${currency}${price}`;

  if (tax > 0) {
    text += ` (+${tax}% Tax)
Total: ${currency}${totalWithTax.toFixed(2)}`;
  }

  text += `
(MRP ${currency}${mrp}, ${discount}% OFF)
Order ID: ${orderId}
Please share the license key activation steps.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
