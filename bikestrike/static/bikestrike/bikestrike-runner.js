requirejs(['bikestrike'],
  function   (bikestrike) {
        bikestrike.physics(function (world) {

        var viewport = bikestrike.$("#viewport").get(0);

        // bounds of the window
        var viewportBounds = bikestrike.physics.aabb(0, 0, viewport.innerWidth, viewport.innerHeight)
            ,edgeBounce
            ,renderer;

        // create a renderer
        renderer = bikestrike.physics.renderer('canvas', {
            el: 'viewport'
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
            restitution: 0.99,
            cof: 0.8
        });

        // resize events
        window.addEventListener('resize', function () {

            // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
            viewportBounds = bikestrike.physics.aabb(0, 0, renderer.width, renderer.height);
            // update the boundaries
            edgeBounce.setAABB(viewportBounds);

        }, true);

        // create some bodies
        world.add( bikestrike.physics.body('circle', {
            x: 300// renderer.width / 2
            ,y: 150 //renderer.height / 2 - 40
            //,vx: -0.15
            ,mass: 1
            ,radius: 30
            ,styles: {
                fillStyle: '#cb4b16'
                ,angleIndicator: '#72240d'
            }
        }));

        world.add( bikestrike.physics.body('circle', {
            x: 500 //renderer.width / 2
            ,y: 150 //renderer.height / 2
            ,radius: 50
            ,mass: 20
            //,vx: 0.007
            // ,vy: 0
            ,styles: {
                fillStyle: '#6c71c4'
                ,angleIndicator: '#3b3e6b'
            }
        }));

        // add some fun interaction
        var attractor = bikestrike.physics.behavior('attractor', {
            order: 0,
            strength: .002
        });
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

        // add things to the world
        world.add([
            //bikestrike.physics.behavior('interactive', { el: renderer.container }),
            bikestrike.physics.behavior('newtonian', { strength: .5 }),
            //bikestrike.physics.behavior('body-impulse-response'),
            edgeBounce
        ]);

        // subscribe to ticker to advance the simulation
        bikestrike.physics.util.ticker.on(function( time ) {
            world.step( time );
        });
    });
});
