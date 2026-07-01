@login @smoke
Feature: Inicio de sesion en SauceDemo
  Como usuario de SauceDemo
  Quiero iniciar sesion en la aplicacion
  Para poder acceder al catalogo de productos

  Background:
    Given el usuario esta en la pagina de login de SauceDemo

  @happy-path @P1
  Scenario: Login exitoso con credenciales validas
    When el usuario ingresa el usuario "standard_user" y la contrasena valida
    And hace clic en el boton de login
    Then el usuario es redirigido a la pagina de productos
    And el titulo de la pagina muestra "Products"

  @alterno @negativo @P1
  Scenario: Login fallido con contrasena incorrecta
    When el usuario ingresa el usuario "standard_user" y la contrasena "wrong_password"
    And hace clic en el boton de login
    Then se muestra el mensaje de error de login "Epic sadface: Username and password do not match any user in this service"
    And el usuario permanece en la pagina de login

  @alterno @validacion @P2
  Scenario Outline: Validacion de campos obligatorios
    When el usuario ingresa el usuario "<usuario>" y la contrasena "<contrasena>"
    And hace clic en el boton de login
    Then se muestra el mensaje de error de login "<mensaje>"

    Examples:
      | usuario       | contrasena   | mensaje                                   |
      |               |              | Epic sadface: Username is required        |
      | standard_user |              | Epic sadface: Password is required        |
      |               | secret_sauce | Epic sadface: Username is required        |

  @alterno @negativo @P2
  Scenario: Login con usuario bloqueado
    When el usuario ingresa el usuario "locked_out_user" y la contrasena valida
    And hace clic en el boton de login
    Then se muestra el mensaje de error de login "Epic sadface: Sorry, this user has been locked out."
    And el usuario permanece en la pagina de login
