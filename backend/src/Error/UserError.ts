export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class UserCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserCreationError';
  }
}

export class PasswordDoNotMatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordDoNotMatchError';
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class CouldNotCreateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CouldNotCreateUserError';
  }
}

export class CouldNotUpdateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CouldNotUpdateUserError';
  }
}
