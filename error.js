class MyError extends Error {
  constructor(data) {
    super(data.message);
    this.status = data.status;
  }
}

const errorHandler = (err) => {
  if (err.name === "SequelizeUniqueConstraintError") {
    const localError = { status: 409 };

    const message =
      "username" in err.fields
        ? "username already exists"
        : "email already exists";

    localError.message = message;
    throw new MyError(localError);
  } else throw new MyError(err);
};

module.exports = errorHandler;
