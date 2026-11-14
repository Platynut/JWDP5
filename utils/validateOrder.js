const contactFields = ['firstName', 'lastName', 'address', 'city', 'email'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

exports.isValidOrder = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return false;
  }

  const { contact, products } = body;
  if (!contact || typeof contact !== 'object' || Array.isArray(contact)) {
    return false;
  }

  return contactFields.every((field) => isNonEmptyString(contact[field])) &&
    Array.isArray(products) &&
    products.length > 0 &&
    products.every(isNonEmptyString);
};

exports.getContact = (contact) => contactFields.reduce((result, field) => {
  result[field] = contact[field].trim();
  return result;
}, {});
