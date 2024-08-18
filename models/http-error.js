class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // adds message prop
    this.code = errorCode;
  }
}

export default HttpError;
