require "test_helper"

class Volundir::LayoutTest < ActionView::TestCase
  test "renders navbar correctly" do
    render template: "volundir/layouts/application"  # ou o caminho que você definir para o layout da sua engine
    assert_includes rendered, "Menu"  # verifica se o conteúdo inclui, por exemplo, o título "Menu"
  end

  test "renders navbar partial correctly" do
    get root_url  # ou qualquer URL que utilize o layout
    assert_select 'nav', 1  # Verifica se há uma tag <nav> no HTML
  end
end
