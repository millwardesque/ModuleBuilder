var tree = null;

$(document).ready(function() {
  tree = load_default_content($('.main'));

  $('.main .application').html(tree.render());
});

/**
 * Test function for triggering a zoom-out.
 * Probably won't be re-used, but here temporarily for the sake of documentation
 *
 * @ToDo Remove.
 */
function test_zoom_out() {
  $('.main .application').animate({
    width: 0,
    height: 0,
    "font-size": 0,
  }, 1000, function() {
    $('.main .application').hide();
  });

}
/**
 * Loads default content into the application
 *
 * @param container
 *  A jQuery object representing the container for the whole application
 */
function load_default_content(container) {
  var root = new Entity("root", "root", "Root Object", null, null);
  var code_entity_1 = new CodeEntity("CodeEntity1", root, "Code #1");
  var code_entity_2 = new CodeEntity("CodeEntity2", root, "Code #2");
  var code_entity_3 = new CodeEntity("CodeEntity3", root, "Code #3");

  var tree = new EntityTreeController(root);
  return tree;
}

/**
 * Creates a <ul> element from an array of items
 *
 * @param items
 *  An array of HTML items to create as <li> elements
 *
 * @return A jQuery object representing a <ul> element
 */
function create_ul(items) {
  var ul = $('<ul></ul>');

  for (var i = 0; i < items.length; ++i) {
    var item = items[i];
    var li = $('<li></li>');
    
    if (typeof item == "object") {
      li.append(create_ul(item));
    }
    else {
      li.append(item);
    }
    ul.append(li);
  }

  return ul;
}