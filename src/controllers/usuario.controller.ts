import { service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Usuario} from '../models';
import { CambioClave } from '../models/cambio-clave.model';
import { CredencialesRecuperarClave } from '../models/credenciales-recuperar-clave.model';
import { Credenciales } from '../models/credenciales.model';
import {UsuarioRepository} from '../repositories';
import { AdministradorClaveService } from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @service(AdministradorClaveService)
    public servicioClaves : AdministradorClaveService,
  ) {}

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['_id'],

          }),
        },
      },
    })
    usuario: Omit<Usuario, '_id'>,
  ): Promise<Usuario | null> {
    //Se verifica si el usuario ingreso clave, si no se crea una aleatoreamente
      let busqueda = await this.usuarioRepository.findOne({
        where: {
          correo: usuario.correo,
        }
      })
      if (!busqueda) {
        //Creacion de la clave 
        let clave = this.servicioClaves.CrearClaveAleatoria();
        console.log(clave);
        
        let claveCifrada = this.servicioClaves.CifrarTexto(clave);
        usuario.password = claveCifrada
        let usuarioCreado = this.usuarioRepository.create(usuario);
        return usuarioCreado
      }
      console.log("Correo en uso");
      return null
      //Enviar clave por correo electronico
      
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
  //--------------------- CREACION DE NUEVOS METODOS ------------------------------------------
  
  @post('/identificar-usuario')
  @response(200, {
    description: 'Identificacion de usuarios',
    content: { 'application/json': { schema: getModelSchemaRef(Credenciales) } },
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credenciales, {
            title: 'Identificar usuario'
          }),
        },
      },
    })
    credenciales: Credenciales,
  ): Promise<Usuario | null> {
    let claveCifrada = this.servicioClaves.CifrarTexto(credenciales.clave);
    let usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        password: claveCifrada
      }
    })
    if (usuario) {
      usuario.password = '';
      //generar token y agregarlo a la respuesta
    }
    // console.log(usuario)
    return usuario;
  }

  @post('/recuperar-clave')
  @response(200, {
    description: 'Recuperar clave de usuarios',
    content: {
      'application/json': { schema: getModelSchemaRef(CredencialesRecuperarClave)}},
    })
  async recuperarClave(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CredencialesRecuperarClave, {
            title: 'Recuperar clave de usuario'
          }),
        },
      },
    })
    credenciales: CredencialesRecuperarClave,
  ): Promise<Usuario | null> {
    let usuario = await this.usuarioRepository.findOne({
      where:{
        correo: credenciales.correo,
      }
    })
    if (usuario) {
      const clave = this.servicioClaves.CrearClaveAleatoria();
      usuario.password = this.servicioClaves.CifrarTexto(clave);
      await this.usuarioRepository.updateById(usuario._id, usuario)
      //invocar al servicio de notificaciones para enviar SMS al usuario con la nueva clave
      //let datos = new NotificacionSms();
      //datos.destino = usuario.celular;
      //datos.mensaje = `Hola ${usuario.nombre} <br> ${Configuracion.mensajeRecuperar} <br> ${clave}`
      //this.servicioNotificaciones.EnviarSms(datos);
      console.log("¡Clave creada exitosamente! "+" Su nueva clave es: "+clave );
    }
    console.log("¡Clave creada exitosamente! "+" Su nueva clave es: "+usuario?.password );
    
    return usuario;
  }


  @post('/cambiar-clave')
  @response(200, {
    description: 'Cambio de clave de usuarios',
    content: { 'application/json': { schema: getModelSchemaRef(CambioClave) } },
  })
  async cambiarClave(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CambioClave, {
            title: 'Cambio de clave usuario'
          }),
        },
      },
    })
    credencialesClave: CambioClave,
  ): Promise<Boolean> {

    let usuario = await this.servicioClaves.CambiarClave(credencialesClave);
    if (usuario) {
      //invocar al servicio de notificaciones para enviar correo al usuario
      // let datos = new NotificacionCorreo();
      // datos.destino = usuario.correo;
      // datos.asunto = Configuracion.asuntoCambioClave;
      // datos.mensaje = `Hola ${usuario.nombre} <br> ${Configuracion.mensajeCambioClave}`
      // this.servicioNotificaciones.EnviarCorreo(datos);
    }

    return usuario != null;
  }

  

}
