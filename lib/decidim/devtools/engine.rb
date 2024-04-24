# frozen_string_literal: true

module Decidim
  module Devtools
    # This is an engine that adds extra development tools to Decidim.
    class Engine < ::Rails::Engine
      isolate_namespace Decidim::Devtools
      engine_name "decidim_devtools"

      initializer "decidim_devtools.tools" do
        # Disable if the boost performance mode is enabled
        next if Rails.application.config.try(:boost_performance)

        if Rails.env.start_with?("development") || ENV.fetch("DECIDIM_DEV_ENGINE", nil) || ENV.fetch("DECIDIM_DEVTOOLS", nil)
          ActiveSupport.on_load(:action_controller) { include Decidim::Devtools::NeedsDevelopmentTools }
        end
      end

      initializer "decidim_devtools.csp" do
        next unless Decidim.respond_to?(:content_security_policies_extra)

        config.after_initialize do
          csp = Decidim.content_security_policies_extra
          csp["connect-src"] ||= []
          csp["connect-src"] << "https://validator.w3.org"
        end
      end
    end
  end
end
