
export class Lecturer {
    constructor(
      public code: string,
      public name: string,
      public address: string,
      public email: string,
      public password: string,
      public courseName:string
    ) {}
  }
// import { User } from "./user.model";

// export class Lecturer {
//     public user: User;
//     public courseName: string;

//     constructor(user: User, courseName: string) {
//         this.user = user;
//         this.courseName = courseName;
//     }
// }
