import {injectable, /* inject, */ BindingScope} from '@loopback/core';
var CryptoJS = require("crypto-js");
import GeneratePassword from 'generate-password';

@injectable({scope: BindingScope.TRANSIENT})
export class AdministradorClaveService {
  constructor(/* Add @inject to inject parameters */) {}


  
  CrearClaveAleatoria(){
    let password = GeneratePassword.generate({
      length: 10,
      numbers: true,
      uppercase: true
    })

    return password;
  }

  CifrarTexto(text: string){
    let textoCifrado = CryptoJS.MD5(text).toString();
    return textoCifrado;
  }
}
