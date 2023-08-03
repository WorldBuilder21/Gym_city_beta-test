const totalFileSize = (pickedFiles) => {
  var sum = 0;
  sum = pickedFiles.size;
  return sum;
};

export default function checkLimit(pickedFiles) {
  const totalSize = totalFileSize(pickedFiles);
  const sizeInMB = totalSize / (1024 * 1024);
  if (sizeInMB > 20) {
    // The file Limit has been exceeded
    return true;
  }
  // The file Limit has not been exceeded
  return false;
}
