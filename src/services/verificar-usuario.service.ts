import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Configuracion } from '../keys/config';
import { Credenciales, Usuario } from '../models';
import { UsuarioRepository } from '../repositories';
const fetch = require('node-fetch')

@injectable({scope: BindingScope.TRANSIENT})
export class VerificarUsuarioService {
  constructor(
    @repository(UsuarioRepository) private usuarioRepository: UsuarioRepository
  ) {}

  /*
   * Add service methods here
   */

  async VerificarUsuario(credenciales: Credenciales){
    let usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        password: credenciales.clave
      }
    })

    return usuario
  }

  async GenerarToken(usuario: Usuario): Promise<string>{
    let url = `${Configuracion.urlToken}?nombre=${usuario.nombre}&id_persona=${usuario._id}&id_rol=${usuario.id_rol}`;
    let token = ''
    await fetch(url)
      .then(async(res: any) => {
        // return res.text() == 'OK';
        token = await res.text()
      })

    return token
  }
}
