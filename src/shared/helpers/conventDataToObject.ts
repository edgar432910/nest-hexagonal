
export class dataToObj<T> {
    static format(user:string[]) {
        const userModel:any = {
            dni: user[0],
            name:  user[1],
            lastname:  user[2],
            email:  user[0],
            active: true
        }
      return userModel;
    }
  }
  