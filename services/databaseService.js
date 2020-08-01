const createDocument = (data, id) => {
  return 'Created';
};

const readDocument = (id) => {
  return 'Read';
};
const updateDocument = (data, id) => {
  return 'Updated';
};
const deleteDocument = (id) => {
  return 'Deleted';
};

module.exports = {
  createDocument,
  readDocument,
  updateDocument,
  deleteDocument,
};
