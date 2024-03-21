/**
 * Possible modes of the NestJS application
 */
export enum ApplicationMode {
  SERVER = 'SERVER', // start and listen on a port
  TEST = 'TEST', // init without listening on a port
  SWAGGER = 'SWAGGER', // start, generate the OpenAPI specification and stop
}
