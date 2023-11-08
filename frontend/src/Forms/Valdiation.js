import dayjs from "dayjs";

export function isValidName(name) {
  const nameRegex = /^[A-Z][a-z]*$/;
  return nameRegex.test(name);
}

export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.(com)$/;
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
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
  if (password.length >= 7 && password.length <= 20) {
    return passwordRegex.test(password);
  }
  return false;
}

export function isValidBirthday(date) {
  if (date === null) {
    return false;
  } else {
    const age = dayjs().diff(dayjs(date), 'year');
    if (age > 18 || age < 115) {
      return true;
    }
    return false;
  }
 
}

export function isValidDriverLicense(driverLicense) {
  const driverLicenseRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{6,12}$/;
  return driverLicenseRegex.test(driverLicense);
}

export function isValidLicensePlate(licensePlate) {
  return licensePlate.length <= 7;
}

export function isValidMake(make) {
  const regex = /^[A-Za-z ]+$/;
  return regex.test(make);
}

export function isValidModel(model) {
  const modelRegex = /^[A-Za-z0-9 ]+$/;
  return modelRegex.test(model);
}

export function isValidCarYear(carYear) {
  const currentYear = new Date().getFullYear();
  const carYearRegex = /^\d{4}$/;
  if (
    carYearRegex.test(carYear) &&
    (carYear <= currentYear || currentYear - 25 <= carYear)
  ) {
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
