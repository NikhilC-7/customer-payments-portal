export const fullNamePattern = /^[a-zA-Z\s]{2,50}$/;
export const idNumberPattern = /^\d{13}$/;
export const accountNumberPattern = /^\d{10,12}$/;
export const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
export const amountPattern = /^\d+(\.\d{1,2})?$/;
export const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
