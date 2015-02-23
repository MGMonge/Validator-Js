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
