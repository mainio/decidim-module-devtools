# Decidim::Devtools

This module adds extra development tools to Decidim UI during development in
order to help developers avoid basic mistakes.

Currently this provides only an HTML validator.

## Installation

Add this line to your application's Gemfile:

```ruby
group :development
  # ...

  # Use the devtools during development but disable it after the validation
  # process is completed in order to keep the development environment faster and
  # in order to prevent excess load for the external validation service.
  gem "decidim-devtools", github: "mainio/decidim-module-devtools", branch: "main" # Comment out this line after the validation process is completed.
end
```

> [!NOTE]
> It is important to add this only to the `development` group which should not
> be installed on live instances, such as production, staging, testing, etc.
> Including the module in the `development` group ensures it is only loaded
> while developing the application.
>
> It is also suggested to comment out the line while not doing validation work
> In order to make the development environment faster and prevent excess load
> for the external validation service.

And then execute:

```bash
$ bundle
```

## Usage

Install and go.

Once this module is installed, you will see a badge at the bottom right corner
of the page when running in the development mode. The badge indicates whether
the HTML of the page is valid or not.

Note that this tool is built to **help** the HTML validation process but not to
do all the work in that regard. Please note the following:

1. It is still important to validate the actual server responses separately
   because most browsers try to automatically correct the developer's mistakes
   e.g. regarding missing closing tags.
2. The tool only reports `error` type issues which means that some other
   suggestions and warnings may be unnoticed without external validation.

These kinds of issues may be left unnoticed without validating the actual source
code returned by the server. This tool validates the DOM as it is presented by
the JavaScript APIs, i.e. after the DOM has been parsed in the front-end.

When using the tool, also note the following:

- This tool is Rails and Decidim specific and it will automatically filter out
  some HTML validation errors that the normal validation process would produce
  for Rails/Decidim applications. The goal of the tool is only meant to
  include errors that can be fixed in the context of Rails and Decidim.
- The validation process has a slight delay after the page has loaded in order
  to give time for the other JavaScript to process the page and make their
  changes to the DOM (e.g. the UI framework).

Once you are done validating your application, it is suggested to disable this
tool in order to make the development environment work quicker and also not to
cause any unnecessary excess load on the external W3C validator.

## Contributing

See [Decidim](https://github.com/decidim/decidim).

### Developing

To start contributing to this project, first:

- Install the basic dependencies (such as Ruby and PostgreSQL)
- Clone this repository

Decidim's main repository also provides a Docker configuration file if you
prefer to use Docker instead of installing the dependencies locally on your
machine.

You can create the development app by running the following commands after
cloning this project:

```bash
$ bundle
$ DATABASE_USERNAME=<username> DATABASE_PASSWORD=<password> bundle exec rake development_app
```

Note that the database user has to have rights to create and drop a database in
order to create the dummy test app database.

Then to test how the module works in Decidim, start the development server:

```bash
$ cd development_app
$ DATABASE_USERNAME=<username> DATABASE_PASSWORD=<password> bundle exec rails s
```

In case you are using [rbenv](https://github.com/rbenv/rbenv) and have the
[rbenv-vars](https://github.com/rbenv/rbenv-vars) plugin installed for it, you
can add the environment variables to the root directory of the project in a file
named `.rbenv-vars`. If these are defined for the environment, you can omit
defining these in the commands shown above.

#### Vendorized assets

This module ships with some vendorized assets in order to apply some workarounds
to make them work in the browser context. These vendorized assets are stored to
`app/packs/src/vendor` and they can be updated by running the following commands
that will update the vendorized builds:

```bash
$ npm update
$ npm run vendorize
```

#### Code Styling

Please follow the code styling defined by the different linters that ensure we
are all talking with the same language collaborating on the same project. This
project is set to follow the same rules that Decidim itself follows.

[Rubocop](https://rubocop.readthedocs.io/) linter is used for the Ruby language.

You can run the code styling checks by running the following commands from the
console:

```
$ bundle exec rubocop
```

To ease up following the style guide, you should install the plugin to your
favorite editor, such as:

- Sublime Text - [Sublime RuboCop](https://github.com/pderichs/sublime_rubocop)
- Visual Studio Code - [Rubocop for Visual Studio Code](https://github.com/misogi/vscode-ruby-rubocop)

### Testing

To run the tests run the following in the gem development path:

```bash
$ bundle
$ DATABASE_USERNAME=<username> DATABASE_PASSWORD=<password> bundle exec rake test_app
$ DATABASE_USERNAME=<username> DATABASE_PASSWORD=<password> bundle exec rspec
```

Note that the database user has to have rights to create and drop a database in
order to create the dummy test app database.

In case you are using [rbenv](https://github.com/rbenv/rbenv) and have the
[rbenv-vars](https://github.com/rbenv/rbenv-vars) plugin installed for it, you
can add these environment variables to the root directory of the project in a
file named `.rbenv-vars`. In this case, you can omit defining these in the
commands shown above.

### Test code coverage

If you want to generate the code coverage report for the tests, you can use
the `SIMPLECOV=1` environment variable in the rspec command as follows:

```bash
$ SIMPLECOV=1 bundle exec rspec
```

This will generate a folder named `coverage` in the project root which contains
the code coverage report.

## License

See [LICENSE-AGPLv3.txt](LICENSE-AGPLv3.txt).
