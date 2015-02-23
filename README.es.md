# Validator-Js

Validador javascript de formularios inspirado en el Validador del framework Laravel

Leer esto en otros lenguajes: [Inglés](https://github.com/MGMonge/Validator-Js/blob/master/README.md), [Español](https://github.com/MGMonge/Validator-Js/blob/master/README.es.md)

Si estas acostumbrado al Validador del framework Laravel, tal vez esta librería escrita en javascript sea de tu interés.

Básicamente intenté traer la simplicidad del Validador de Laravel al lado del cliente. Vamos a ver un pequeño ejemplo de como funciona:

## Reglas 

**required:** El campo bajo validación no debe estar vacío.

**email:** El campo bajo validación debe tener el formato de una dirección de e-mail.

**min:** El campo bajo validación debe tener un mínimo de caracteres.

**max:** El campo bajo validación debe ser menor o igual a un máximo de caracteres.

**confirmed:** El campo bajo validación debe ser igual a *foo_confirmation*. Por ejemplo, si el campo bajo validación es *password*, deberá tener el mismo valor que el campo *password_confirmation*.


```javascript
var reglas = {
    'nombre' : 'required',
    'apellido' : 'required',
    'usuario' : 'required|min:4',
    'email' : 'required|email|confirmed'
};
```

## Mensajes de error personalizados 
Los mensajes personalizados son opcionales, Estos mensajes están en español, pero hay mensajes en inglés por defecto.

```javascript
var mensajes = {
    'required' : 'El campo :attribute es requerido.',
    'email' : 'El campo :attribute tiene un formato inválido.',
    'min' : 'El campo :attribute debe tener al menos :min caracteres.'
};
```

## Bindear formulario
El formulario recibe 3 parametros: el primero es el **selector del formulario**, el segundo es el **objeto de reglas** y el tercero (opcional) es el **objeto de mensajes**
```javascript
var validador = new Validator('#form-foo', reglas, mensajes);
```

## Escuchar eventos 
Cuando el campo es inválido
```javascript
validador.listen('field:error', function(error) {
    // obtengo error.element
    // obtengo error.message
    // muestro el mensaje de error en el elemento div.error 
});
```
Cuando el campo es válido
```javascript
validador.listen('field:success', function(elemento) {
    // obtengo elemento
    // remuevo el mensaje del elemento div.error
});
```
## Otras cosas interesantes 
En el validador de Laravel nosotros podemos añadir reglas personalizadas y reemplazos personalizados, y por su puesto, También podemos hacerlo aquí
## Reglas de validación personalizadas
```javascript
// añadimos la regla personalizada al objeto de reglas
var reglas = {
    'nombre' : 'required|foo:bar,baz' // pasamos 2 parámetros [bar, baz]
};

// Creamos la nueva regla: El campo es válido si su valor es igual a 123
validador.addValidationRule('foo', function(atributo, valor, parametros) {
    if (valor == '123') {
        return true;
    }

    return false;
});
```
## Creamos reemplazos personalizados en mensajes
```javascript
// añadimos un mensaje de error personalizado al objeto de mensajes
var mensajes = {
    'foo': 'nombre: :atributo, regla: :regla, parámetro 1: :parametro1 y parámetro 2: :parametro2'
};

// Creamos el nuevo reemplazo
validador.addReplacement('foo', function(mensaje, atributo, regla, parametros) {
    return mensaje.replace(':atributo', atributo)
        .replace(':regla', regla)
        .replace(':parametro1', parametros[0])
        .replace(':parametro2', parametros[1]);
});

// imprime >>> nombre: nombre, regla: foo, parámetro 1: bar y parámetro 2: baz

```
# Uso básico
La librería no tiene ninguna dependencia.
```html
<!doctype html>
<html>
<head>
    <title>Validador JS</title>
    <style>
        .error {
            color : #93000a;
        }
    </style>
</head>
<body>
    <form id="form-foo" action="" method="POST">
        <p>
            <label for="nombre">Nombre</label>
            <input id="nombre" type="text" name="nombre" />
            <span class="error"></span>
        </p>
        <p>
            <label for="apellido">Apellido</label>
            <input id="apellido" type="text" name="apellido" />
            <span class="error"></span>
        </p>
        <p>
            <label for="usuario">Usuario</label>
            <input id="usuario" type="text" name="usuario" />
            <span class="error"></span>
        </p>
        <p>
            <label for="email">Email</label>
            <input id="email" type="text" name="email" />
            <span class="error"></span>
        </p>
        <p>
            <label for="email_confirmation">Confirmación de email</label>
            <input id="email_confirmation" type="text" name="email_confirmation" />
            <span class="error"></span>
        </p>
        <p>
            <input type="submit" value="Enviar"/>
        </p>
    </form>
    <script src="validator.js"></script>
    <script type="text/javascript">

        var reglas = {
            'nombre': 'required|foo:bar,baz',
            'apellido': 'required',
            'usuario': 'required|min:4',
            'email': 'required|email|confirmed'
        };

        var mensajes = {
            'required': 'El campo :attribute es requerido.',
            'email': 'El campo :attribute tiene un formato inválido.',
            'min': 'El campo :attribute debe tener al menos :min caracteres.',
            'foo': 'nombre: :atributo, regla: :regla, parámetro 1: :parametro1 y parámetro 2: :parametro2'
        };

        var validador = new Validator('#form-foo', reglas, mensajes);

        validador.addValidationRule('foo', function(atributo, valor, parametros) {
            if (valor == '123') {
                return true;
            }

            return false;
        });

        validador.addReplacement('foo', function(mensaje, atributo, regla, parametros) {
            return mensaje.replace(':atributo', atributo)
                .replace(':regla', regla)
                .replace(':parametro1', parametros[0])
                .replace(':parametro2', parametros[1]);
        });

        validador.listen('field:error', function(error) {
            error.element.parentNode.getElementsByClassName('error')[0].text(error.message);
        });

        validador.listen('field:success', function(elemento) {
            elemento.parentNode.getElementsByClassName('error')[0].text("");
        });

    </script>
</body>
</html>
```
