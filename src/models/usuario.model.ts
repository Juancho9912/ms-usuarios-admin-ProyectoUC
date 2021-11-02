import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {UsuarioRol} from './usuario-rol.model';

@model()
export class Usuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;
  
  @property({
    type: 'string',
    required: true,
  })
  telefono: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  correo: string;

  @property({
    type: 'string',
    required: true,
    index:{
      unique: true
    }
  })
  documento: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaNacimiento: string;

  @hasMany(() => Rol, {through: {model: () => UsuarioRol, keyFrom: 'id_usuario', keyTo: 'id_rol'}})
  rols: Rol[];

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
