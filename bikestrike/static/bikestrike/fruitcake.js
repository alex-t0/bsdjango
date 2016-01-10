define("fruitcake", ["jquery", "physicsjs"], function($, physics) {
          return {
            jquery: $,
            JQuery: $,
            $: $,
            physics: physics,
            run: function(bikestrike){
              bikestrike.physics(function (world) {
                  var $viewport = bikestrike.$("#viewport");

                  // bounds of the window
                  var viewportBounds = bikestrike.physics.aabb(0, 0, $viewport.width(), $viewport.height()),
                      edgeBounce,
                      renderer;

                  // create a renderer
                  renderer = bikestrike.physics.renderer('canvas', {
                      el: $viewport.attr('id')
                  });

                  // add the renderer
                  world.add(renderer);
                  // render on each step
                  world.on('step', function () {
                      world.render();
                  });

                  // constrain objects to these bounds
                  edgeBounce = bikestrike.physics.behavior('edge-collision-detection', {
                      aabb: viewportBounds,
                      restitution: 0.2,
                      cof: 0.8
                  });

                  // resize events
                  window.addEventListener('resize', function () {
                      // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
                      viewportBounds = bikestrike.physics.aabb(0, 0, renderer.width, renderer.height);
                      // update the boundaries
                      edgeBounce.setAABB(viewportBounds);

                  }, true);

                  // some fun colors
                  var colors = [
                      '#b58900',
                      '#cb4b16',
                      '#dc322f',
                      '#d33682',
                      '#6c71c4',
                      '#268bd2',
                      '#2aa198',
                      '#859900'
                  ];

                  // for constraints
                  var rigidConstraints = bikestrike.physics.behavior('verlet-constraints', {
                      iterations: 3
                  });

                  // the "fruitcake"
                  var spacing = 50;
                  var fruitcake = [];
                  for ( var row = 0, l = 4; row < l; ++row ){
                      for ( var col = 0, lcol = 10; col < lcol; ++col ){

                          var r = (Math.random() * 10 + 10)|0;

                          if ( row === 0 ||
                              col === 0 ||
                              row === l - 1 ||
                              col === lcol - 1
                             ){
                              r = 10;
                          }

                          if ( (row === 0 || row === l - 1) &&
                              (col === 2 || col === lcol - 3)
                             ){
                              r = 30;
                          }

                          fruitcake.push(
                              bikestrike.physics.body('circle', {
                                  x: spacing * col + renderer.width / 2 - 100
                                  ,y: spacing * row + renderer.height / 2
                                  ,radius: r
                                  ,restitution: 0.9
                                  ,styles: {
                                      fillStyle: colors[ fruitcake.length % colors.length ]
                                      ,angleIndicator: r === 30 ? 'rgba(0,0,0,0.6)' : false
                                  }
                              })
                          );

                          if (col > 0){
                              // horizontal
                              rigidConstraints.distanceConstraint(fruitcake[ lcol * row + col - 1 ], fruitcake[ lcol * row + col ], 0.7);
                          }

                          if (row > 0){

                              // vertical
                              rigidConstraints.distanceConstraint(fruitcake[ lcol * row + col ], fruitcake[ lcol * (row - 1) + col ], 0.7);

                              if ( col > 0 ){
                                  // diagonals
                                  rigidConstraints.distanceConstraint(fruitcake[ lcol * (row - 1) + col - 1 ], fruitcake[ lcol * row + col ], 0.7, Math.sqrt(2) * spacing);
                                  rigidConstraints.distanceConstraint(fruitcake[ lcol * (row - 1) + col ], fruitcake[ lcol * row + col - 1 ], 0.7, Math.sqrt(2) * spacing);
                              }
                          }
                      }
                  }

                  // render
                  world.on('render', function( data ){

                      var constraints = rigidConstraints.getConstraints().distanceConstraints,
                          c;

                      for (var i = 0, l = constraints.length; i < l; ++i ){
                          c = constraints[i];
                          renderer.drawLine(c.bodyA.state.pos, c.bodyB.state.pos, 'rgba(200, 200, 200, 0.2)');
                      }
                  });

                  // add things to world
                  world.add( fruitcake );
                  world.add( rigidConstraints );

                  // add some fun interaction
                  var attractor = bikestrike.physics.behavior('attractor', {
                      order: 0,
                      strength: 0.002
                  });

                  var square = bikestrike.physics.body('rectangle', {
                      x: 250,
                      y: 250,
                      width: 50,
                      height: 50
                  });
                  world.add(square);

                  world.on({
                      'interact:poke': function( pos ){
                          world.wakeUpAll();
                          attractor.position( pos );
                          world.add( attractor );
                      }
                      ,'interact:move': function( pos ){
                          attractor.position( pos );
                      }
                      ,'interact:release': function(){
                          world.wakeUpAll();
                          world.remove( attractor );
                      }
                  });

                  world.on('collisions:detected', function( data ){
                      console.log("collision occured");
                  });

                  // add things to the world
                  world.add([
                      bikestrike.physics.behavior('interactive', { el: renderer.container }),
                      bikestrike.physics.behavior('constant-acceleration'),
                      bikestrike.physics.behavior('body-impulse-response'),
                      edgeBounce,
                      bikestrike.physics.behavior('body-collision-detection')
                  ]);

                  // subscribe to ticker to advance the simulation
                  bikestrike.physics.util.ticker.on(function( time ) {
                      world.step( time );
                  });
              });
            }
          };
    }
);
