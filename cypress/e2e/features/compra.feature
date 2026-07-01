@compra @smoke
Feature: Flujo de compra E2E - SauceDemo
  Como usuario autenticado de SauceDemo
  Quiero agregar productos al carrito y completar una compra
  Para validar el flujo principal y sus variantes alternas

  Background:
    Given el usuario ha iniciado sesion en SauceDemo

  @happy-path @P1
  Scenario: Compra completa con dos productos
    When agrega el producto "sauce-labs-backpack" al carrito
    And agrega el producto "sauce-labs-bike-light" al carrito
    And va al carrito de compras
    Then el carrito muestra el producto "Sauce Labs Backpack"
    And el carrito muestra el producto "Sauce Labs Bike Light"
    When procede al checkout
    And completa los datos de envio con nombre "Usuario", apellido "Prueba" y codigo postal "110111"
    And continua al resumen de la compra
    Then el resumen muestra el producto "Sauce Labs Backpack"
    And el resumen muestra el producto "Sauce Labs Bike Light"
    When finaliza la compra
    Then se muestra el mensaje "Thank you for your order!"
    And el carrito queda vacio

  @alterno @P2
  Scenario: El contador del carrito se actualiza al agregar productos
    Then el contador del carrito no es visible
    When agrega el producto "sauce-labs-backpack" al carrito
    Then el contador del carrito muestra "1"
    When agrega el producto "sauce-labs-bike-light" al carrito
    Then el contador del carrito muestra "2"

  @alterno @P2
  Scenario: Eliminar un producto del carrito antes de finalizar la compra
    When agrega el producto "sauce-labs-backpack" al carrito
    And agrega el producto "sauce-labs-bike-light" al carrito
    And va al carrito de compras
    And elimina el producto "sauce-labs-backpack" del carrito
    Then el carrito no muestra el producto "Sauce Labs Backpack"
    And el carrito muestra el producto "Sauce Labs Bike Light"
    And el contador del carrito muestra "1"

  @alterno @P2
  Scenario: Checkout con el carrito vacio
    When va al carrito de compras
    Then el carrito esta vacio
    When procede al checkout
    Then el usuario llega al formulario de datos de envio

  @alterno @P2
  Scenario Outline: Ordenar productos por precio
    When ordena los productos por "<criterio>"
    Then los precios quedan ordenados de forma "<orden>"

    Examples:
      | criterio | orden       |
      | lohi     | ascendente  |
      | hilo     | descendente |

  @alterno @P2
  Scenario: Cancelar el checkout y volver al carrito
    When agrega el producto "sauce-labs-backpack" al carrito
    And va al carrito de compras
    And procede al checkout
    And cancela el checkout
    Then el usuario regresa al carrito de compras
    And el carrito muestra el producto "Sauce Labs Backpack"

  @alterno @validacion @P2
  Scenario Outline: Validacion de campos obligatorios en el checkout
    When agrega el producto "sauce-labs-backpack" al carrito
    And va al carrito de compras
    And procede al checkout
    And completa los datos de envio con nombre "<nombre>", apellido "<apellido>" y codigo postal "<codigoPostal>"
    And continua al resumen de la compra
    Then se muestra el mensaje de error de checkout "<mensaje>"
    And el usuario permanece en el formulario de datos de envio

    Examples:
      | nombre | apellido | codigoPostal | mensaje                      |
      |        | Perez    | 110111       | Error: First Name is required |
      | Juan   |          | 110111       | Error: Last Name is required  |
      | Juan   | Perez    |              | Error: Postal Code is required |

  @alterno @P2
  Scenario: Cerrar sesion desde el menu lateral
    When cierra sesion desde el menu lateral
    Then el usuario es redirigido a la pagina de login
