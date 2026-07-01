@api @smoke
Feature: API de gestion de usuarios - reqres.in
  Como consumidor de la API de reqres.in
  Quiero crear y consultar usuarios
  Para validar el correcto funcionamiento de los endpoints

  @happy-path @P1
  Scenario: Crear un usuario y consultarlo exitosamente
    When se envia una peticion POST a "/collections/users/records" con el siguiente cuerpo:
      """
      {"data": {"name": "Test User", "job": "Automation Engineer"}}
      """
    Then el codigo de respuesta debe ser 201
    And la respuesta contiene el "name" igual a "Test User" y el "job" igual a "Automation Engineer"
    When se realiza una peticion GET al usuario recien creado
    Then el codigo de respuesta debe ser 200
    And el usuario consultado tiene el mismo "name" y "job" enviados en la creacion

  @alterno @negativo @P2
  Scenario: Crear un usuario enviando el cuerpo vacio
    When se envia una peticion POST a "/collections/users/records" con el siguiente cuerpo:
      """
      {"data": {}}
      """
    Then el codigo de respuesta debe ser 201
    And la respuesta contiene un "id" y una fecha de creacion "createdAt"

  @alterno @negativo @P2
  Scenario: Consultar un usuario que no existe
    When se realiza una peticion GET al endpoint "/users/9999"
    Then el codigo de respuesta debe ser 404

  @alterno @P2
  Scenario Outline: Crear usuarios con diferentes cargos
    When se envia una peticion POST a "/collections/users/records" con nombre "<nombre>" y cargo "<cargo>"
    Then el codigo de respuesta debe ser 201
    And la respuesta contiene el "name" igual a "<nombre>" y el "job" igual a "<cargo>"

    Examples:
      | nombre       | cargo             |
      | Maria Lopez  | QA Lead           |
      | Juan Perez   | Backend Developer |
