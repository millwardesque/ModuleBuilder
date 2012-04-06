/**
 * Controller for an entity tree
 */
function EntityTreeController(root) {
  var that = this;
  var my_root = root;
  var active_entity = root;

  /**
   * Zooms up a level in the hierarchy
   */
  this.ascend_level = function() {
    var parent = active_entity.get_parent();

    if (parent) {
      active_entity = parent;
    }

    this.rerender();
  }

  /**
   * Descends a level in the tree
   *
   * @param index
   *   An index of the child to mark as active.  Defaults to zero
   */
  this.descend_level = function(index) {
    if (!index) {
      index = 0;
    }

    // Set the child
    var children = active_entity.get_children();
    if (children.length == 0) { // If no children exist, return
      return;
    }
    if (children.length > index) {  // If it exists, use the supplied index
      active_entity = children[index];
    }
    else {  // If the index doesn't exist, use the last one in the array
      active_entity = children[children.length - 1];
    }

    this.rerender();
  }

  /**
   * Moves the active entity to its next sibling
   */
  this.next_sibling = function() {
    if (!active_entity.has_next_sibling()) {
      return false;
    }

    var active_index = -1; // Index of the active entity in its parent's list of children
    var siblings = active_entity.get_parent().get_children(); // My parent's children
    
    // Find me in my parent's children    
    for (var i = 0; i < siblings.length; ++i) {
      if (siblings[i] == active_entity) {
        active_index = i;
      }
    }

    // If I'm not the last  / only child, then I have a next sibling
    if (0 <= active_index && active_index < siblings.length - 1) {
      active_entity = siblings[active_index + 1];
    }

    this.rerender();
  }

    /**
   * Moves the active entity to its previous sibling
   */
  this.previous_sibling = function() {
    if (!active_entity.has_previous_sibling()) {
      return false;
    }

    var active_index = -1; // Index of the active entity in its parent's list of children
    var siblings = active_entity.get_parent().get_children(); // My parent's children
    
    // Find me in my parent's children    
    for (var i = 0; i < siblings.length; ++i) {
      if (siblings[i] == active_entity) {
        active_index = i;
      }
    }

    // If I'm not the first / only child, then I have a previous sibling
    if (0 < active_index && active_index < siblings.length) {
      active_entity = siblings[active_index - 1];
    }

    this.rerender();
  }

  /**
   * Re-renders the tree
   */
  this.rerender = function() {
    $('.main .application').html(that.render());
  }

  /**
   * Sets the active entity if it exists in the tree
   *
   * @param entity
   *  The entity to set as active.
   */
  this.set_active = function(entity) {
    if (my_root.has_descendent(entity)) {
      active_entity = entity;
      this.rerender();
    }
  }

  /**
   * Renders the entity tree
   *
   * @param context_override
   *   Overrides the default context behaviour
   */
  this.render = function(context_override) {
    // Determine the context to use
    var context = "focus";
    if (context_override) {
      context = context_override;
    }

    // Render the appropriate tree level
    var output = ''
    if (null != active_entity) {
    
      output = active_entity.render(context);

      var action_links = $('<div class="entity-actions"></div>');
      var descend = null;
      if (active_entity.get_children().length > 0) {
        descend = $('<a href="#">Descend</a>');
        descend.click(function() {
          that.descend_level();
        });
      }
      else {
        descend = $('<span>Descend</span>');
      }
      action_links.append(descend);

      var ascend = null;
      if (active_entity.get_parent()) {
        ascend = $('<a href="#">Ascend</a>');
        ascend.click(function() {
          that.ascend_level();
        });
        action_links.append(ascend);
      }
      else {
        ascend = $('<span>Ascend</span>');
      }
      action_links.append(ascend);

      var next = null;
      if (active_entity.has_next_sibling()) {
        next = $('<a href="#">Next</a>');
        next.click(function() {
          that.next_sibling();
        });
        action_links.append(next);
      }
      else {
        next = $('<span>Next</span>');
      }
      action_links.append(next);

      var previous = null;
      if (active_entity.has_previous_sibling()) {
        previous = $('<a href="#">Previous</a>');
        previous.click(function() {
          that.previous_sibling();
        });
        action_links.append(previous);
      }
      else {
        previous = $('<span>Previous</span>');
      }
      action_links.append(previous);

      output.append(action_links);
    }

    return output;
  }

}

/**
 * Entity object
 *
 * @param entity_parent
 *   Parent of the entity
 *
 * @param type
 *   Type of the entity
 */
function Entity(type, subtype, name, parent) {
  // Private variables
  var my_id = Entity.next_id;
  var my_type = type;
  var my_subtype = subtype;
  var my_name = name;
  var my_parent = parent;
  var my_children = [];

  // Add this to my parent
  if (my_parent) {
    my_parent.add_child(this);
  }

  // Update the entity
  Entity.next_id++;

  /**
   * Gets the ID of the entity
   */
  this.get_id = function() {
    return my_id;
  }

  /**
   * Gets the type of the entity
   */
  this.get_type = function() {
    return my_type;
  }

  /**
   * Gets the subtype of the entity
   */
  this.get_subtype = function() {
    return my_subtype;
  }

  /**
   * Gets the name of the entity
   */
  this.get_name = function() {
    return my_name;
  }

  this.set_parent = function(parent) {
    my_parent = parent;

    // Add this to my parent
    if (my_parent) {
      my_parent.add_child(this);
    }
  }

  /**
   * Gets the parent of this entity
   */
  this.get_parent = function() {
    return my_parent;
  }

  /**
   * Checks if I have a next sibling
   */
  this.has_next_sibling = function() {
    var parent = this.get_parent();
    if (!parent) {
      return false;
    }

    var my_index = -1; // Index of me in my parent's list of children
    var siblings = parent.get_children(); // My parent's children
    
    // Find me in my parent's children    
    for (var i = 0; i < siblings.length; ++i) {
      if (siblings[i] == this) {
        my_index = i;
      }
    }

    // If I'm not the last  / only child, then I have a sibling
    if (0 <= my_index && my_index < siblings.length - 1) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Checks if I have a previous sibling
   */
  this.has_previous_sibling = function() {
    var parent = this.get_parent();
    if (!parent) {
      return false;
    }

    var my_index = -1; // Index of me in my parent's list of children
    var siblings = parent.get_children(); // My parent's children
    
    // Find me in my parent's children    
    for (var i = 0; i < siblings.length; ++i) {
      if (siblings[i] == this) {
        my_index = i;
      }
    }

    // If I'm not the first / only child, then I have a previous sibling
    if (0 < my_index && my_index < siblings.length) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Checks to see if I have a give descendent
   *
   * @param entity
   *  The entity to search for
   *
   * @return True if the entity is my descendent, else false
   */
  this.has_descendent = function(entity) {
    if (this == entity) { // If I'm the entity, return true
      return true;
    }
    else if (my_children.length == 0) { // If I'm not the entity and I don't have any children, return false
      return false;
    }

    // Check my children for the entity
    for (var i = 0; i < my_children.length; ++i) {
      if (true == my_children[i].has_descendent(entity)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Adds a child to the entity
   */
  this.add_child = function(child) {
    if (child) {
      my_children.push(child);
    }
  }

  /**
   * Gets the children
   * @ToDo: Return a copy of the children array
   */
  this.get_children = function() {
    return my_children;
  }

  /**
   * Renders the entity
   */
  this.render = function(context) {
    var output = $('<div class="entity"></div>');

    if ("focus" == context) {
      var header = $('<h1>' + name + '</h1>');
      var body = $('<div></div>');

      var children = this.get_children();
      for (var i = 0; i < children.length; ++i) {
        body.append(children[i].render('preview'));
      }
      output.append(header);
      output.append(body);
    }
    else if ("preview" == context) {
      output.append("<p>Preview: " + type + " : " + subtype + " : " + name + "</p>");
    }

    return output;
  }
}
// Controls the next available ID.  @ToDo make this private
Entity.next_id = 1;

/**
 * CodeEntity
 */ 
function CodeEntity(name, parent, code) {
  var that = this;
  var type = "code";
  var subtype = "code";
  var my_code = code;

  // Create the base object
  var base = new Entity(type, subtype, name, null);
  var new_code_entity = Object.create(base);
  new_code_entity.set_parent(parent)

  /**
   * Gets the code in the CodeEntity
   */
  new_code_entity.get_code = function() {
    return my_code;
  }

  /**
   * Sets the code for the CodeEntity
   */
  new_code_entity.set_code = function(new_code) {
    my_code = new_code;
  }

  /**
   * Renders the entity
   */
  new_code_entity.render = function(context) {
    var output = $('<div class="entity code ' + context + '"></div>');

    if ("focus" == context) {
      var header = $("<h2>Focus: " + this.get_name() + "</h2>");
      var code = $("<pre>" + this.get_code() + "</pre>");
      output.append(header);
      output.append(code);
    }
    else if ("preview" == context) {
      var header = $("<h2>Preview: " + this.get_name() + "</h2>");
      var code = $("<pre>" + this.get_code() + "</pre>");
      var activate = $('<a href="#">Activate</a>');
      activate.click(function() {
        tree.set_active(new_code_entity);
      })
      output.append(header);
      output.append(code);
      output.append(activate);
    }

    return output;
  }

  return new_code_entity;
}