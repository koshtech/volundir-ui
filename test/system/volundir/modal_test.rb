# test/system/volundir/modal_test.rb
require 'application_system_test_case'

class Volundir::ModalTest < ApplicationSystemTestCase
  test "modal opens when clicked" do
    visit root_url
    click_on "Open Modal"
    assert_selector ".modal", visible: true
  end
end
