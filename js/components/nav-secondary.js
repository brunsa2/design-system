// Secondary Nav

var $nav_secondary = $('[data-object="nav-secondary"]'),

  // The majority of this function is used courtesty of
  // Brad Frost's responsive design patterns:
  // https://bradfrost.github.io/this-is-responsive/patterns.html
  // Specifically, the Priority+ Alt pattern.
  navSecondaryToggleMenuItems = function () {
    var nav_width = 0,
      $menu = $nav_secondary.find('.usajobs-nav-secondary__menu'),
      $more_menu = $menu.find('.more'),
      $more_container = $nav_secondary.find($nav_secondary.attr('data-target')),
      more_width = $more_menu.outerWidth(true),
      available_space,
      last_item,
      first_more_el;

    $menu.find('> li:not(.more)').each(function () {
      nav_width += $(this).outerWidth( true );
    });

    available_space = $nav_secondary.outerWidth(true) - more_width;

    if (nav_width > available_space) {
      $menu.each(function () {
        last_item = $menu.find('> li:not(.more)').last();
        last_item.attr('data-width', last_item.outerWidth(true));
        last_item.prependTo($more_container);
        navSecondaryToggleMenuItems();
      });
    } else {
      first_more_el = $more_menu.find('li').first();

      if (nav_width + first_more_el.data('width') < available_space) {
        first_more_el.insertBefore($more_menu);
      }
    }

    if ($more_menu.find('li').length > 0) {
      $more_menu.css('display','inline-block');
    } else {
      $more_menu.css('display','none');
    }
  };

// Toggle Secondary Nav items on load
if ($nav_secondary !== undefined && $nav_secondary.length > 0) {
  navSecondaryToggleMenuItems();
}

// Toggle Secondary Nav items on resize
$(window).resize( $.throttle( 250, function() {
  if ($nav_secondary !== undefined && $nav_secondary.length > 0) {
    navSecondaryToggleMenuItems();
  }
}));

$nav_secondary.on('click', '[data-behavior]', function (event) {
  var $el = $(this),
    $object = $el.closest('[data-object="nav-secondary"]'),
    behavior = $el.attr('data-behavior'),
    $target = $object.find($object.attr('data-target')),
    state = $target.attr('data-state');

  event.preventDefault();
  $el.blur(); // Removes focus

  // Each behavior attached to the element should be triggered
  $.each(behavior.split(' '), function (idx, action) {
    $el.trigger(action, { el: $el, object: $object, state: state, target: $target });
  });
});

$nav_secondary.on('nav-secondary.toggle', function(event, opts) {
  event.preventDefault();

  if (opts.state === 'is-closed') {
    opts.object.trigger('nav-secondary.open', opts);
  } else if (opts.state === 'is-open') {
    opts.object.trigger('nav-secondary.close', opts);
  }
});

$nav_secondary.on('nav-secondary.open', function(event, opts) {
  opts.target.attr('data-state', 'is-open');
});

$nav_secondary.on('nav-secondary.close', function(event, opts) {
  opts.target.attr('data-state', 'is-closed');
});
