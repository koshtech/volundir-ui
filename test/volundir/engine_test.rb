require "test_helper"

module Volundir
  class EngineTest < ActiveSupport::TestCase
    test "engine should be a Rails engine" do
      assert_kind_of ::Rails::Engine, Volundir::Engine
    end
  end
end
