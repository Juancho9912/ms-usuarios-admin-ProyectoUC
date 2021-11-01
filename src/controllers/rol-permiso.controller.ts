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
import {PermisoRol} from '../models';
import {PermisoRolRepository} from '../repositories';

export class RolPermisoController {
  constructor(
    @repository(PermisoRolRepository)
    public permisoRolRepository : PermisoRolRepository,
  ) {}

  @post('/permiso-rols')
  @response(200, {
    description: 'PermisoRol model instance',
    content: {'application/json': {schema: getModelSchemaRef(PermisoRol)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PermisoRol, {
            title: 'NewPermisoRol',
            exclude: ['_id'],
          }),
        },
      },
    })
    permisoRol: Omit<PermisoRol, '_id'>,
  ): Promise<PermisoRol> {
    return this.permisoRolRepository.create(permisoRol);
  }

  @get('/permiso-rols/count')
  @response(200, {
    description: 'PermisoRol model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PermisoRol) where?: Where<PermisoRol>,
  ): Promise<Count> {
    return this.permisoRolRepository.count(where);
  }

  @get('/permiso-rols')
  @response(200, {
    description: 'Array of PermisoRol model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PermisoRol, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PermisoRol) filter?: Filter<PermisoRol>,
  ): Promise<PermisoRol[]> {
    return this.permisoRolRepository.find(filter);
  }

  @patch('/permiso-rols')
  @response(200, {
    description: 'PermisoRol PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PermisoRol, {partial: true}),
        },
      },
    })
    permisoRol: PermisoRol,
    @param.where(PermisoRol) where?: Where<PermisoRol>,
  ): Promise<Count> {
    return this.permisoRolRepository.updateAll(permisoRol, where);
  }

  @get('/permiso-rols/{id}')
  @response(200, {
    description: 'PermisoRol model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PermisoRol, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PermisoRol, {exclude: 'where'}) filter?: FilterExcludingWhere<PermisoRol>
  ): Promise<PermisoRol> {
    return this.permisoRolRepository.findById(id, filter);
  }

  @patch('/permiso-rols/{id}')
  @response(204, {
    description: 'PermisoRol PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PermisoRol, {partial: true}),
        },
      },
    })
    permisoRol: PermisoRol,
  ): Promise<void> {
    await this.permisoRolRepository.updateById(id, permisoRol);
  }

  @put('/permiso-rols/{id}')
  @response(204, {
    description: 'PermisoRol PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() permisoRol: PermisoRol,
  ): Promise<void> {
    await this.permisoRolRepository.replaceById(id, permisoRol);
  }

  @del('/permiso-rols/{id}')
  @response(204, {
    description: 'PermisoRol DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.permisoRolRepository.deleteById(id);
  }
}
