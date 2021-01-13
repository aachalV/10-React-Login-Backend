# Node-User-Authentication
Tried to implement Backend User authentication. 
> This will take 
  > - "email", "password", "confirmPassword" as compulsory fields for "signup" and 
  > - "email", "password" as compulsory fields for "login".

## Validations mechanisms
  - isEmailValid
  - checkConfirmPassword
  - isEmailUnique
  - createPasswordHash
  - isUserRegistered

## Remember to add config.env file

* In config.env file add the following 
  * PORT = 5000
  * JWT_SECRET = "(Add some text here)"
