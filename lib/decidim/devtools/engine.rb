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
    end
  end
end
