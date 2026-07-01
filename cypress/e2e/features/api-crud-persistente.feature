@api @collections @persistencia
Feature: CRUD persistente de usuarios usando Colecciones de reqres.in
  Como QA quiero validar que un usuario creado se persiste realmente
  (a diferencia de /api/users que solo simula la respuesta)
  Para poder probar un flujo de creacion, consulta, edicion y eliminacion end to end


  @happy-path @P1
  Scenario: Crear, consultar, editar y eliminar un usuario de forma persistente
    When crea un registro en la coleccion "users" con nombre "Test User" y cargo "Automation Engineer"
    Then el codigo de respuesta de la coleccion debe ser 201
    And el registro creado contiene el "name" igual a "Test User" y el "job" igual a "Automation Engineer"

    When consulta el registro creado en la coleccion "users"
    Then el codigo de respuesta de la coleccion debe ser 200
    And el registro consultado coincide con los datos creados

    When edita el registro creado en la coleccion "users" con nombre "Test User Editado" y cargo "QA Lead"
    Then el codigo de respuesta de la coleccion debe ser 200
    And el registro editado contiene el "name" igual a "Test User Editado" y el "job" igual a "QA Lead"

    When elimina el registro creado en la coleccion "users"
    Then el codigo de respuesta de la coleccion debe ser 204

    When consulta el registro eliminado en la coleccion "users"
    Then el codigo de respuesta de la coleccion debe ser 404

  @alterno @negativo @P2
  Scenario: Editar un registro que no existe
    When edita un registro inexistente en la coleccion "users" con id "id-que-no-existe"
    Then el codigo de respuesta de la coleccion debe ser 404

  @alterno @negativo @P2
  Scenario: Eliminar un registro que ya fue eliminado
    When crea un registro en la coleccion "users" con nombre "Usuario Temporal" y cargo "QA"
    Then el codigo de respuesta de la coleccion debe ser 201
    When elimina el registro creado en la coleccion "users"
    Then el codigo de respuesta de la coleccion debe ser 204
    When elimina el registro creado en la coleccion "users"
    Then el codigo de respuesta de la coleccion debe ser 404
