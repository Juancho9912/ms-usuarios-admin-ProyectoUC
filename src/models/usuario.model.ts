import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Rol} from './rol.model';

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
    index: {
      unique: true
    }
  })
  documento: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
    required: true,
  })
  fechaNacimiento: string;

  @belongsTo(() => Rol, {name: 'tiene'})
  id_rol: string;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
