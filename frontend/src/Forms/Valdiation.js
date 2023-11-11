export function isValidName(name) {
  const nameRegex = /^[A-Za-z]{1,15}$/;
  return nameRegex.test(name);
}

export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
}

export function isValidAddress(address) {
  const addressRegex = /^[a-zA-Z0-9 ]+$/;
  return addressRegex.test(address);
}

export function isValidZipCode(zipCode) {
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    return zipCodeRegex.test(zipCode);
  }

export function isValidPassword(password) {
  return password.length >= 8 && password.length <= 20;
}

export function isValidDriverLicense(driverLicense) {
  const driverLicenseRegex = /^[A-Za-z0-9]{6,12}$/;
  return driverLicenseRegex.test(driverLicense);
}

export function isValidLicensePlate(licensePlate) {
  return licensePlate.length == 7; 
}

export function isValidMake(make) {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(make);
}

export function isValidModel(model) {
  const modelRegex = /^[A-Za-z0-9\s]+$/;
  return modelRegex.test(model);
}

export function isValidCarYear(carYear) {
  const currentYear = new Date().getFullYear();
  const carYearRegex = /^\d{4}$/;
  if (carYearRegex.test(carYear) && (carYear <= currentYear || currentYear - 50 <= carYear)) {
    return true;
  }
  return false;
}

export function isValidCard(cardNumber) {
  const cardNumberRegex = /^\d{16}$/;
  return cardNumberRegex.test(cardNumber);
}

export function isValidCVV(CVV) {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(CVV);
}

export function isValidCardType(CardType) {
  const cardTypeRegex = /^[A-Za-z]{1,10}$/;
  return cardTypeRegex.test(CardType);
}

export function isValidExpiration(exp) {
  const expRegex = /^\d{1,2}\/\d{1,2}$/
  return expRegex.test(exp);
}

