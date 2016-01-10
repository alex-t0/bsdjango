requirejs(['bikestrike', 'navigationCanvas1'],
  function   (bikestrike, navigationCanvas) {
    var count = 0;
    bikestrike.physics(function(world){
      var $gameplay = bikestrike.$("#gameplay");

      var worldWidth = 4*$gameplay.width(),
          worldHeight = 1.05*$gameplay.height();

      // bounds of the window
      var viewportBounds = bikestrike.physics.aabb(0, 0, worldWidth, worldHeight),
          renderer;

      var square = bikestrike.physics.body('rectangle', {
              x: 250,
              y: 250,
              vx: 0.01,
              vy: -0.005,
              width: 50,
              height: 50,
              restitution: 0.5,
              mass: 0.5,
              cof: 0.5
          });

      world.add(square);

      // create a renderer
      renderer = bikestrike.physics.renderer('navigationCanvas1', {
          el: $gameplay.attr('id'),
          bordered: true/*,
          follow: square,
          offset: "center"*/
      });

      // debugger
      // add the renderer
      world.add(renderer);
      // renderer.addLayer("otherLayer", $gameplay.find("canvas").get(0));
      // render on each step
      world.on('step', function () {
          world.render();
      });

      // bikestrike.createBoundRectangles(bikestrike.physics,
      //   { x: worldWidth, y: worldHeight, viewportX: $gameplay.width() - 100,  viewportY: $gameplay.height() - 100, thickness: 50 },
      //   world);

      // constrain objects to these bounds
      // var edgeBounce = bikestrike.physics.behavior('edge-collision-detection', {
      //     aabb: viewportBounds,
      //     restitution: 0.2,
      //     cof: 0.8
      // });
      // world.add(edgeBounce);

      var polygon = bikestrike.physics.body('convex-polygon', {
          x: 400,
          y: 200,
          vx: -0.02,
          restitution: 0.3,
          cof: 10000,
          mass: 1,
          vertices: [
              {x: 0, y: 80},
              {x: 80, y: 0},
              {x: 0, y: -80},
              {x: -30, y: -30},
              {x: -30, y: 30}
          ]
      });
      world.add(polygon);

      world.add(bikestrike.physics.behavior('constant-acceleration'));
      world.add(bikestrike.physics.behavior('interactive', { el: renderer.container }));
      world.add(bikestrike.physics.behavior('body-collision-detection'));
      world.add(bikestrike.physics.behavior('sweep-prune'));
      world.add(bikestrike.physics.behavior('body-impulse-response'));

      bikestrike.$("#render").click(function (){
          // alert('from-render');
          world.render();
      });

      bikestrike.physics.util.ticker.on(function( time ) {
            world.step( time );
      });
      // bikestrike.physics.util.ticker.stop();
    });
});
