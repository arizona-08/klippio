import { Injectable } from '@nestjs/common';
import { $Enums } from 'generated/prisma';
import { CreateUserDTO } from './user/dto/create-user.dto';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private userService: UserService){}

  getHello(): string {
    return 'Hello World!';
  }

  getTest(){
    return {message: "test reussi"};
  }

  async createAdmin(){
    const existingAdmin = await this.userService.findOneBy('role', process.env.ADMIN_ROLE as string);
    if(existingAdmin){
      console.log("Admin user already exists. Skipping creation.");
      return;
    }

    const adminUser: CreateUserDTO = {
      firstname: process.env.ADMIN_FIRSTNAME as string,
      lastname: process.env.ADMIN_LASTNAME as string,
      email: process.env.ADMIN_EMAIL as string,
      password: process.env.ADMIN_PASSWORD as string,
      role: process.env.ADMIN_ROLE as $Enums.Role,
    }

    const check = this.checkMissingProperties(adminUser);
    if(!check.status){
      console.error("Admin user not created. Missing env variables:", check.errors);
      return;
    }
    
    try{
      await this.userService.createUser(adminUser);
      console.log("Admin créé avec succès");
    } catch (error){
      console.error("Admin user not created. Error:", error);
    }
  }


  checkMissingProperties(obj: any){
    const errorsArr: string[] = [];
    for(const key in obj){
      if(obj[key] === undefined || obj[key] === null || obj[key] === ''){
        errorsArr.push(`Missing property: ${key}`);
      }
    }

    if(errorsArr.length > 0){
      return {
        status: false,
        errors: errorsArr
      }
    }

    return {status: true}
  }
}
