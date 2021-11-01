import {injectable, /* inject, */ BindingScope} from '@loopback/core';
var CryptoJS = require("crypto-js");
import GeneratePassword from 'generate-password';
import { Credenciales } from '../models/credenciales.model';
import { UsuarioRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { Usuario } from '../models';
import { CambioClave } from '../models/cambio-clave.model';

@injectable({scope: BindingScope.TRANSIENT})
export class AdministradorClaveService {
  constructor(/* Add @inject to inject parameters */
    @repository(UsuarioRepository) public usuarioRepository: UsuarioRepository
    ) {}
  


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


  async CambiarClave(credenciales: CambioClave): Promise<Usuario | null>{
    let usuario = await this.usuarioRepository.findOne({
      where:{
        correo: credenciales.correo,
        password: this.CifrarTexto(credenciales.clave_actual)
      }
    })
    if(usuario){
      //se actualizan los datos en la base de datos
      usuario.password = this.CifrarTexto(credenciales.clave_nueva)
      await this.usuarioRepository.updateById(usuario._id, usuario)
      return usuario;
    }else{
      return null;
    }
  }
}
