# frozen_string_literal: true

lib = File.expand_path("lib", __dir__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "decidim/devtools/version"

Gem::Specification.new do |spec|
  spec.name = "decidim-devtools"
  spec.version = Decidim::Devtools.version
  spec.required_ruby_version = ">= 3.0"
  spec.authors = ["Antti Hukkanen"]
  spec.email = ["antti.hukkanen@mainiotech.fi"]
  spec.metadata["rubygems_mfa_required"] = "true"

  spec.summary = "Module for extra development tools for Decidim."
  spec.description = "Adds extra development tools to Decidim UI."
  spec.homepage = "https://github.com/mainio/decidim-module-devtools"
  spec.license = "AGPL-3.0"

  spec.files = Dir[
    "{app,config,lib}/**/*",
    "LICENSE-AGPLv3.txt",
    "Rakefile",
    "README.md"
  ]

  spec.require_paths = ["lib"]

  spec.add_dependency "decidim-core", Decidim::Devtools.decidim_version

  spec.add_development_dependency "decidim-dev", Decidim::Devtools.decidim_version
end
