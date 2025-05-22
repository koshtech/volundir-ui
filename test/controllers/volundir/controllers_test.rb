# test/controllers/volundir/controllers_test.rb
require 'test_helper'

class Volundir::ControllersTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get volundir_path
    assert_response :success
  end
end
