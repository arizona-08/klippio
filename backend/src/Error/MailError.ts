export class MailNotSendedError extends Error{
  constructor(message: string){
    super(message)
    this.name = 'MailNotSendedError'
  }
}