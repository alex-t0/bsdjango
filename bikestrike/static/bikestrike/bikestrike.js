requirejs.config({
    baseUrl: 'static/bikestrike/bower_components',
    paths: {
        jquery: 'jquery/dist/jquery',
        physicsjs: 'PhysicsJS/dist/physicsjs-full'
    }
});

/*requirejs(['jquery'],
  function   ($) {
    if ($)
      alert('jquery seems loaded');
    $('body').css("background-color","yellow");
});*/

define("bikestrike", ["jquery", "physicsjs"], function($, physics) {
          // if ($) alert('jquery defined');
          // if (physics) alert('physics defined');
          return {
            jquery: $,
            JQuery: $,
            $: $,
            physics: physics
          };
    }
);
