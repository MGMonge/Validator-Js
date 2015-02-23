# Validator-Js
Javascript validator forms inspired by the validator of Laravel Framework

Read this in other languages: [English](https://github.com/MGMonge/Validator-Js/blob/master/README.md), [Spanish](https://github.com/MGMonge/Validator-Js/blob/master/README.es.md)

If you're used to Form Validator of Laravel Framework maybe this library written in javascript is of your interest.

Basically I tried to bring the simplicity of Laravel Validator to the client side. Let's go with a little example of How it works:


## Rules 

**required:** The field under validation must be present in the input data.

**email:** The field under validation must be formatted as an e-mail address.

**min:** The field under validation must have a minimum characters 

**max:** The field under validation must be less than or equal to a maximum characters.

**confirmed:** The field under validation must have a matching field of *foo_confirmation*. For example, if the field under validation is *password*, a matching *password_confirmation* field must be present in the input.


```javascript
var rules = {
    'first_name' : 'required',
    'last_name' : 'required',
    'username' : 'required|min:4',
    'email' : 'required|email|confirmed'
};
```

## Custom Error Messages 
The custom message are optional, these messages are in Spanish but there are a English messages by default.

```javascript
var messages = {
    'required' : 'El campo :attribute es requerido.',
    'email' : 'El campo :attribute tiene un formato inválido.',
    'min' : 'El campo :attribute debe tener al menos :min caracteres.'
};
```

## Bind form
The form receive 3 params: the first is the **form selector**, the second one is the the **rules  object** and the third one (optional) is the **messages object**

```javascript
var validator = new Validator('#form-foo', rules, messages);
```

## Listen events 
When the field is invalid
```javascript
validator.listen('field:error', function(error) {
    // get error.element
    // get error.message
    // print message into div.error element 
});
```
When the field is valid
```javascript
validator.listen('field:success', function(element) {
    // get error.element
    // remove message into div.error element
});
```
## Other interesting things 
In Laravel Validator we can add custom rules and custom replacements on messages and of course, we can do the same here.
## Custom Validation Rules
```javascript
// add custom rule to object rules
var rules = {
    'first_name' : 'required|foo:bar,baz' // we pass two params [bar, baz]
};

// We create the new rule: if the value is equal to 123 the field is valid
validator.addValidationRule('foo', function(attribute, value, parameters) {
    if (value == '123') {
        return true;
    }

    return false;
});
```
## Custom Replacements on messages
```javascript
// add custom error message to custom rule
var messages = {
    'foo': 'name: :attribute, rule: :rule, paremeter 1: :paremeter1 and paremeter 2: :paremeter2'
};

// We create the new replacement
validator.addReplacement('foo', function(message, attribute, rule, parameters) {
    return message.replace(':attribute', attribute)
        .replace(':rule', rule)
        .replace(':paremeter1', parameters[0])
        .replace(':paremeter2', parameters[1]);
});

// print >>> name: first_name, rule:foo, paremeter 1: bar and paremeter 2: baz

```
# Basic Usage
The library don't have any dependency.
```html
<!doctype html>
<html>
<head>
    <title>Validator JS</title>
    <style>
        .error {
            color : #93000a;
        }
    </style>
</head>
<body>
    <form id="form-foo" action="" method="POST">
        <p>
            <label for="first_name">First Name</label>
            <input id="first_name" type="text" name="first_name" />
            <span class="error"></span>
        </p>
        <p>
            <label for="last_name">Last Name</label>
            <input id="last_name" type="text" name="last_name" />
            <span class="error"></span>
        </p>
        <p>
            <label for="username">Username</label>
            <input id="username" type="text" name="username" />
            <span class="error"></span>
        </p>
        <p>
            <label for="email">Email</label>
            <input id="email" type="text" name="email" />
            <span class="error"></span>
        </p>
        <p>
            <label for="email_confirmation">Email Confirmation</label>
            <input id="email_confirmation" type="text" name="email_confirmation" />
            <span class="error"></span>
        </p>
        <p>
            <input type="submit" value="Submit"/>
        </p>
    </form>
    <script src="validator.js"></script>
    <script type="text/javascript">

        var rules = {
            'first_name': 'required|foo:bar,baz',
            'last_name': 'required',
            'username': 'required|min:4',
            'email': 'required|email|confirmed'
        };

        var messages = {
            'required': 'El campo :attribute es requerido.',
            'email': 'El campo :attribute tiene un formato inválido.',
            'min': 'El campo :attribute debe tener al menos :min caracteres.',
            'foo': 'name: :attribute, rule: :rule, paremeter 1: :paremeter1 and paremeter 2: :paremeter2'
        };

        var validator = new Validator('#form-foo', rules, messages);

        validator.addValidationRule('foo', function(attribute, value, parameters) {
            if (value == '123') {
                return true;
            }

            return false;
        });

        validator.addReplacement('foo', function(message, attribute, rule, parameters) {
            return message.replace(':attribute', attribute)
                .replace(':rule', rule)
                .replace(':paremeter1', parameters[0])
                .replace(':paremeter2', parameters[1]);
        });

        validator.listen('field:error', function(error) {
            error.element.parentNode.getElementsByClassName('error')[0].text(error.message);
        });

        validator.listen('field:success', function(element) {
            element.parentNode.getElementsByClassName('error')[0].text("");
        });

    </script>
</body>
</html>
```
