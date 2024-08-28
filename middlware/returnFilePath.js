const returnFilePath = async (req, res, next) => {
  try {
    const uploadedFileName = req.file.path;
    res.json({ fileName: uploadedFileName });
  } catch (err) {
    const error = new HttpError('Failed returning file directory ' + err, 500);
    return next(error);
  }
};

export default returnFilePath;
