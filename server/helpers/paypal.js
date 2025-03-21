const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AQtG1ctR5FxzziBhwgE5ALkLh8Tt7HzUf6RfhkP7xpDxYYaWXFdrYIQElKqE7T_tA4XdHzQn_7ZaGEEi",
  client_secret: "EEG4UjYqwvCfzXoarQGjvXvXepE_8JnvFbAOm0uHSOXICtM6iIY3BHnofaa3FImiAaVnKV5wGxjInE7K",
});

module.exports = paypal;
