import {inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, Usuario, UsuarioRol, UsuarioRolRelations} from '../models';

export class UsuarioRolRepository extends DefaultCrudRepository<
  UsuarioRol,
  typeof UsuarioRol.prototype._id,
  UsuarioRolRelations
> {
  public readonly usuarios: HasManyThroughRepositoryFactory<Usuario, typeof Usuario.prototype._id,
          UsuarioRol,
          typeof Rol.prototype._id
        >;
  public readonly rol: HasManyThroughRepositoryFactory<Usuario, typeof Rol.prototype._id,
          UsuarioRol,
          typeof Usuario.prototype._id
        >;      
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(UsuarioRol, dataSource);
  }
}
