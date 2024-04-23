# frozen_string_literal: true

module Decidim
  module Devtools
    # This concern adds extra development tools to Decidim.
    module NeedsDevelopmentTools
      extend ActiveSupport::Concern

      included do
        before_action :apply_devtools
      end

      private

      def apply_devtools
        return unless respond_to?(:snippets)

        snippets.add(:head, helpers.stylesheet_pack_tag("decidim_devtools"))
        snippets.add(:foot, helpers.javascript_pack_tag("decidim_devtools", defer: false))
      end
    end
  end
end
