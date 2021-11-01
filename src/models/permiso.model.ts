import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {PermisoRol} from './permiso-rol.model';

@model()
export class Permiso extends Entity {
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

  @hasMany(() => Rol, {through: {model: () => PermisoRol, keyFrom: 'id_permiso', keyTo: 'id_rol'}})
  rols: Rol[];

  constructor(data?: Partial<Permiso>) {
    super(data);
  }
}

export interface PermisoRelations {
  // describe navigational properties here
}

export type PermisoWithRelations = Permiso & PermisoRelations;
