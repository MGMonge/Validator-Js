/*!
 * Validator JavaScript Library
 * Maximiliano Gabriel Monge - <maxi@sneekdigital.co.uk>
 * Version 1.0.0 - built Fri Feb 22 2015 19:41:37
 * MIT Licensed
 *
 */
function Validator(form, rules, messages) {

    this.form = form = document.querySelectorAll(form)[0];
    this.rules = rules;

    this._events = {};
    this._errors = [];
    this._failFields = [];

    this._bindSubmit();

    this.messages = this.merge({
        'required': 'The :attribute field is required.',
        'email': 'The :attribute format is invalid.',
        'min': 'The :attribute must be at least :min characters.',
        'max': 'The :attribute may not be greater than :max characters.',
        'confirmed': 'The :attribute confirmation does not match.'
    }, messages);

    this.validationRules = {
        required : function(attribute, value, parameters) {
            return value != "" ? true : false;
        },
        email : function(attribute, value, parameters) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        },
        min : function(attribute, value, parameters) {
            return value.length >= parameters[0] ? true : false;
        },
        max : function(attribute, value, parameters) {
            return value.length <= parameters[0] ? true : false;
        },
        confirmed : function(attribute, value, parameters) {
            return form.querySelectorAll('[name=' + attribute + '_confirmation]')[0].value == value;
        }
    };

    this.replacements = {
        required : function(message, attribute, rule, parameters) {
            return message.replace(':attribute', attribute);
        },
        email : function(message, attribute, rule, parameters) {
            return message.replace(':attribute', attribute);
        },
        min : function(message, attribute, rule, parameters) {
            return message.replace(':attribute', attribute).replace(':min', parameters[0]);
        },
        max : function(message, attribute, rule, parameters) {
            return message.replace(':attribute', attribute).replace(':max', parameters[0]);
        },
        confirmed : function(message, attribute, rule, parameters) {
            return message.replace(':attribute', attribute);
        }
    };

    return this;
}

Validator.prototype.validate = function() {
    this._errors = [];
    this._failFields = [];

    for (var fieldName in this.rules) {
        this.validateField(fieldName);
    };
};

Validator.prototype.validateField = function(fieldName) {
    var rules = this.rules[fieldName].split('|');
    var validator = this;

    rules.forEach(function(rule) {
        var field = validator.form.querySelectorAll("[name=" + fieldName + "]"),
            ruleName = rule.split(':')[0],
            parameters = rule.split(':')[1] || false,
            parameters = parameters ? parameters.split(',') : [];

        validator._applyRule(ruleName, field, parameters);
    });
};

Validator.prototype._applyRule = function(ruleName, field, parameters) {
    if (! (ruleName in this.validationRules) ) {
        return false;
    }

    var fieldName = field[0].name;
    // if the field already has an error, stop checking
    if (this.isFieldFailed(fieldName)) {
        return false;
    }

    if (!this.validationRules[ruleName](fieldName, field[0].value, parameters)) {
        var message = ruleName;

        if ( ruleName in this.messages ) {
            if ( ruleName in this.replacements ) {
                message = this.replacements[ruleName](
                    this.messages[ruleName],
                    fieldName,
                    ruleName,
                    parameters
                );
            } else {
                message = this.messages[ruleName];
            }
        }

        var error = {
            element : field[0],
            message : message
        };

        this._failFields.push(fieldName);
        this._errors.push(error);

        this.fire("field:error", [error]);
    } else {
        this.fire("field:success", [field[0]]);
    }
};

Validator.prototype.isFieldFailed = function(fieldName) {
    for(var i = 0; i < this._failFields.length; i++) {
        if (this._failFields[i] === fieldName) {
            return true;
        }
    }
    return false;
};

Validator.prototype._bindSubmit = function() {
    var validator = this;

    validator.form.onsubmit = function() {
        validator.validate();

        if (validator.errors().length > 0) {
            return false;
        }

        return true;
    }
};

Validator.prototype.addValidationRule = function(name, callback) {
    this.validationRules[name] = callback;
}

Validator.prototype.addReplacement = function(ruleName, callback) {
    this.replacements[ruleName] = callback;
};

Validator.prototype.errors = function() {
    return this._errors;
}

Validator.prototype.merge = function( obj1, obj2 ) {
    var obj3 = {};
    for (var attr in obj1) { obj3[attr] = obj1[attr]; }
    for (var attr in obj2) { obj3[attr] = obj2[attr]; }
    return obj3;
}

Validator.prototype.listen = function(eventName, callback) {
    var events = this._events,
        callbacks = events[eventName] = events[eventName] || [];
    callbacks.push(callback);
};

Validator.prototype.fire = function(eventName, args) {
    var callbacks = this._events[eventName] || [];
    for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].apply(null, args);
    }
}