function authErrorHandler(authCode) {
  switch (authCode) {
    case "auth/invalid-password":
      return "The password provided is in invalid.";
    case "auth/invalid-email":
      return "The email provided is invalid.";
    case "auth/email-already-exists":
      return "The provided email is already being used by an existing user.";
    case "auth/too-many-requests":
      return "Too many failed authentication attempts, wait a few minutes before trying again.";
    case "auth/invalid-email-verified":
      return "The provided value for the emailVerified user property is invalid. It must be a boolean.";
    case "auth/internal-error":
      return "An unexpected error has been encountered while processing this request, please try again later.";
    default:
      return "An error has occuured, please try again later.";
  }
}

export default authErrorHandler;
