// gitscribe-test: include: validates card number format (Luhn check)
// gitscribe-test: include: rejects expired cards
// gitscribe-test: exclude: third-party API calls

export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const clean = cardNumber.replace(/[\s-]/g, '');
  
  // Check length (13-19 digits)
  if (!/^\d{13,19}$/.test(clean)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateExpiry(month: number, year: number): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // Must be this year or future
  if (year < currentYear) return false;
  
  // If this year, month must be current or future
  if (year === currentYear && month < currentMonth) {
    return false;
  }
  
  // Basic range checks
  return month >= 1 && month <= 12;
}

export async function processPayment(
  amount: number,
  cardToken: string,
  merchantId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // This calls Stripe API - excluded from tests per directive
  const result = await fetch('/api/stripe/charge', {
    method: 'POST',
    body: JSON.stringify({ amount, cardToken, merchantId }),
  });
  
  if (!result.ok) {
    return { success: false, error: 'Payment failed' };
  }
  
  const data = await result.json();
  return { success: true, transactionId: data.id };
}
