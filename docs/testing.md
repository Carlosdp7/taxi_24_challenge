# TESTING

Para el testing se creo una coleccion en Postman, esta coleccion se divide en diferentes carpetas: Drivers, Passengers y Trips.

Cada una de estas carpetas tienen request que a su vez pueden tener ejemplos de casos especificos con el fin de hacer las pruebas con mayor facilidad.

## Caso 1: Creacion de Driver

### Success

Para esta primera prueba vamos a crear un driver utilizando el ejemplo llamado Case 1 que se encuentra en el request Create New Driver.

Si este request funciona correctamente deberiamos de poder ver la data agregada a la tabla de drivers.

### Error

Este endpoint cuenta con validacion de datos, es decir que si enviamos una estructura no deseada nos deberia de arrojar un error 400.

## Caso 2: Obtencion de TODOS los Drivers

### Success

En esta prueba debemos de llamar al request Get All Drivers el cuál nos deberia de responder con el Driver que se añadió en el Caso 1.

## Error

Este endpoint no cuenta con una respuesta de error, en el caso de que no exista algun Driver, este deberia de responder con un arreglo vacio.

## Caso 3: Obtencion de un Driver en especifico

### Success

En este caso debemos de utilizar el request Get Driver donde podemos enviarle por parametros el id del driver que queremos encontrar.

Sabemos que la columna id es autoincremental entonces al haber creado un driver anteriormente deberiamos de tenerlo con el id 1.

Como resultado la respuesta nos deberia de entregar la informacion del Driver con el id esperado.

### Error

En caso de que no exista el id el resultado deberia de ser un 404.

## Caso 5: Obtencion de los Drivers DISPONIBLES (Parte 1)

### Success

Hasta este punto contamos con un Driver que esta disponible. Al momento de llamar el request Get Available Drivers nos deberia de traer este Driver agregado anteriormente.

Mas adelante en el CASO 10 haremos la prueba donde exista un Driver que no este disponible en la base de datos

## Error

Este endpoint no cuenta con una respuesta de error, en el caso de que no exista algun Driver, este deberia de responder con un arreglo vacio.

## Caso 6: Creación de un Pasajero

### Success

Utilizando el request Create New Passenger deberiamos de obtener como respuesta los datos del pasajero insertado.

## Error

Este endpoint cuenta con validacion de datos, es decir que si enviamos una estructura no deseada nos deberia de arrojar un error 400.

## Caso 7: Obtención de TODOS los Pasajeros

### Success

En este punto al utilizar el request Get All Passengers nos deberia de responder con el pasajero de nombre John Doe.

### Error

Este endpoint no cuenta con una respuesta de error, en el caso de que no exista algun Passenger, este deberia de responder con un arreglo vacio.

## Caso 8: Obtencion de un Pasajero en especifico

### Success

Al igual que el de obtencion de un driver, a este endpoint podemos enviarle un parametro id, en este caso con el id 1 deberiamos de obtener al pasajero de nombre John Doe.

### Error

En caso de que no exista el id el resultado deberia de ser un 404.

## Caso 9: Creación de un Viaje

### Success

Utilizando el request Create New Trip deberiamos de obtener una respuesta 200 con todos los datos del viaje.

Este endpoint actualiza el campo isAvailable del Driver y del Pasajero a false, lo cual significa que mientras el trip este activo estos no estan disponibles.

### Error

Si el passengerId o el driverId no existen en la base de datos, el endpoint va a arrojar una respuesta con codigo 404.

Si el pasajero o el driver no estan disponibles va a retornar un error 404.

En caso de que no se cumpla con la estructura deseada deberia de responder con un error 4000.

## Caso 10: Obtencion de los Drivers DISPONIBLES (Parte 2)

### Success

En este punto de las pruebas el Driver que existe en la base de datos esta en un viaje, es por esto que al momento de obtener los Drivers disponibles deberiamos de tener un arreglo vacío.

## Error

Este endpoint no cuenta con una respuesta de error, en el caso de que no exista algun Driver, este deberia de responder con un arreglo vacio.

## Caso 11: Completar un Viaje

### Success

En este enpoint podemos enviar por parametros el id del viaje que en este caso seria 1. Al utilizar el request Complete Trip deberiamos de obtener una respuesta de codigo 200.

Este endpoint actualiza los campos isAvailable del Driver y del Pasajero. Tambien crea un registro en la tabla invoice el cual contiene el monto a pagar por el pasajero.

### Error

En el caso de que no existe el trip entonces deberia de retornar un error 404. En este caso tambien retorna este codigo de error si es que el trip ya fue marcado como completado anteriormente.

En dado caso de que el passenger o el driver no existan entonces va a retornar un error 404.

## Caso 12: Obtencion de los Drivers DISPONIBLES (Parte 3)

### Success

En el momento de que completamos el viaje, el driver existente en la base de datos deberia de estar disponible nuevamente.

## Error

Este endpoint no cuenta con una respuesta de error, en el caso de que no exista algun Driver, este deberia de responder con un arreglo vacio.

## Caso 13: Obtener viajes completados

### Success

Al llamar el request Get Completed Trips deberiamos de obtener el viaje que creamos anteriormente con el isCompleted en true.

### Error

Este endpoint no cuenta con una respuesta de error, en el caso de que no exista algun viaje completado, este deberia de responder con un arreglo vacio.

## Caso 14: Obtener Drivers en un radio de 3km en base a una ubicacion en especifico

Para esta prueba vamos a crear otros Drivers utilizando el Case 2, 3 y 4 del request Create New Driver.

Luego de realizar esto podemos utilizar el request Get Drivers By Radio en donde tenemos que pasarle las queries latitude y longitude.

Con el fin de hacer las pruebas mas sencillas, este request ya cuenta con una latitude y longitude las cuales son 28.535989664525733 y -81.37246239812623 respectivamente.

Los Drivers insertados tambien cuentan con latitudes y longitudes controladas, las cuales son:

John Doe Case 1 tiene una longitud y latitud de 28.532426667896694, -81.36939582360586. Este se encuentra a una distancia de 497m con respecto al punto dado.

John Doe Case 2 tiene una longitud y latitud de 28.50344568892073, -81.40690682887701. Este se encuentra a una distancia de 4947m con respecto al punto dado.

John Doe Case 3 tiene una longitud y latitud de 28.535430036923547, -81.37156430218083. Este se encuentra a una distancia de 108m con respecto al punto dado.

John Doe Case 4 tiene una longitud y latitud de 28.541244330283188, -81.3710348261409. Este se encuentra a una distancia de 601 con respecto al punto dado.

Sabiendo esto, el Driver John Doe Case 2 estaria fuera del radio de 3km por lo cual deberiamos de estar recibiendo una respuesta con los Drivers restantes.

## Caso 15: Obtener los tres Drivers mas cercanos a una ubicacion dada

Tomando en cuenta los datos del caso anterior, al momento de llamar al request Get Nearest Drivers no deberiamos de recibir al driver John Doe Case 2, ya que es el que se encuentra mas alejado.
