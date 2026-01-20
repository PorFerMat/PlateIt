
export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export const getCardType = (number: string): CardType => {
  const clean = number.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^6(?:011|5)/.test(clean)) return 'discover';
  return 'unknown';
};

export const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, '');
  const type = getCardType(clean);
  
  // Amex formatting (4-6-5)
  if (type === 'amex') {
    return clean.replace(/(\d{4})(\d{6})?(\d{5})?/, '$1 $2 $3').trim();
  }
  
  // Standard formatting (4-4-4-4)
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim().substring(0, 19);
};

export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '');
  if (clean.length >= 2) {
    return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
  }
  return clean;
};

export const validateLuhn = (number: string): boolean => {
  const clean = number.replace(/\D/g, '');
  if (clean.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop through values starting at the rightmost side
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (sum % 10) === 0;
};

export const validateExpiry = (expiry: string): boolean => {
  if (!expiry.includes('/')) return false;
  const [monthStr, yearStr] = expiry.split('/');
  
  const month = parseInt(monthStr);
  const year = parseInt(`20${yearStr}`); // Assume 20xx
  
  if (isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export const validateCVC = (cvc: string, type: CardType): boolean => {
  const clean = cvc.replace(/\D/g, '');
  if (type === 'amex') {
    return clean.length === 4;
  }
  return clean.length === 3;
};
