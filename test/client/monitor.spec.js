import VisSense from "../../src/entry.js";

describe('VisSense.Monitor', () => {
    var clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });
    afterEach(() => {
        clock.restore();
    });

    var monitorMock;

    beforeEach(() => {
        monitorMock = {
            update: VisSense.Utils.noop,
            visobj: () => {
                return {
                    referenceWindow: () => window
                };
            }
        };
    });


    describe('VisMon', () => {
        var element, visobj;

        beforeEach(() => {
            fixture.set('<div id="element" style="height: 100px; width: 100px; display: none;"></div>');
            element = document.getElementById('element');
            visobj = new VisSense(element);
        });

        it('should create VisMon objects', () => {
            var vismon = visobj.monitor();

            expect(vismon).to.be.ok;

            var vismon2 = visobj.monitor({
                update: VisSense.Utils.noop,
                hidden: VisSense.Utils.noop,
                visible: VisSense.Utils.noop,
                fullyvisible: VisSense.Utils.noop,
                percentagechange: VisSense.Utils.noop,
                visibilitychange: VisSense.Utils.noop
            });

            expect(vismon2).to.be.ok;
        });

        it('should get the observed VisSense object', () => {
            var vismon = visobj.monitor();
            expect(vismon.visobj()).to.be.eql(visobj);
        });

        it('should be able to start and stop a monitor with a smooth syntax', () => {
            var config = {
                update: () => {
                }
            };

            sinon.spy(config, 'update');

            var vismon = visobj.monitor(config);

            expect(vismon.start().stop()).to.be.eql(undefined);

            expect(config.update.callCount).to.be.eql(1);

            clock.tick(5);

            expect(config.update.callCount).to.be.eql(1);

            vismon.stop();
        });

        it('should be able to start a monitor asynchronously', () => {
            var config = {
                update: () => {
                }
            };

            sinon.spy(config, 'update');

            var vismon = visobj.monitor(config).start({async: true});

            expect(config.update.callCount).to.be.eql(0);

            clock.tick(5);

            expect(config.update.callCount).to.be.eql(1);

            expect(vismon.stop()).to.be.eql(undefined);
        });

        it('should be able to start and stop an async monitor before executing', () => {
            var config = {
                update: () => {
                }
            };

            sinon.spy(config, 'update');

            var vismon = visobj.monitor(config);

            expect(vismon.startAsync().stop()).to.be.eql(undefined);

            clock.tick(5);

            expect(config.update.callCount).to.be.eql(0);

            expect(vismon.startAsync().startAsync().stop()).to.be.eql(undefined);

            clock.tick(5);

            expect(config.update.callCount).to.be.eql(0);

        });

        it('should not fire start/stop events if already started/stopped', () => {
            var config = {
                start: () => {
                },
                stop: () => {
                }
            };

            sinon.spy(config, 'start');
            sinon.spy(config, 'stop');

            var vismon = visobj.monitor(config);

            expect(vismon.start()
                .start()
                .start()
                .start()
                .start()
                .stop()
            ).to.be.eql(undefined);

            expect(vismon.stop()).to.be.eql(undefined);
            expect(vismon.stop()).to.be.eql(undefined);
            expect(vismon.stop()).to.be.eql(undefined);
            expect(vismon.stop()).to.be.eql(undefined);

            expect(config.start.callCount).to.be.eql(1);
            expect(config.stop.callCount).to.be.eql(1);

            clock.tick(5);

            expect(config.start.callCount).to.be.eql(1);
            expect(config.stop.callCount).to.be.eql(1);

        });

        it('should update verify that first update() argument is a monitor', () => {
            var vismon = null;
            var config = {
                update: monitor => {
                    expect(monitor).to.equal(vismon);
                }
            };

            sinon.spy(config, 'update');

            vismon = visobj.monitor(config);
            vismon.start();

            expect(config.update.callCount).to.be.eql(1);

            vismon.stop();
        });

        it('should verify that default interval is 1000ms', () => {
            fixture.set('<div id="element" style="display:none;"></div>');

            var config = {
                update: () => {
                },
                hidden: () => {
                },
                visible: () => {
                }
            };

            sinon.spy(config, 'update');
            sinon.spy(config, 'hidden');
            sinon.spy(config, 'visible');

            var vismon = VisSense.of(document.getElementById('element')).monitor(config).start();

            expect(config.update.callCount).to.be.eql(1);
            expect(config.hidden.callCount).to.be.eql(1);
            expect(config.visible.callCount).to.be.eql(0);

            clock.tick(1001);
            vismon.stop();

            expect(config.update.callCount).to.be.eql(2);
            expect(config.hidden.callCount).to.be.eql(1);
            expect(config.visible.callCount).to.be.eql(0);
        });

        it('should verify that state instances are cached if nothing changes', () => {
            var vismon = visobj.monitor();

            expect(vismon.state()).to.be.eql({});

            vismon.start();

            var firstState = vismon.state();
            expect(firstState).to.be.eql({
                code: 0,
                state: 'hidden',
                percentage: 0,
                hidden: true,
                visible: false,
                fullyvisible: false,
                previous: {}
            });

            vismon.update();

            var cachedState = vismon.state();
            expect(cachedState.previous).to.be.ok;

            expect(cachedState).to.be.eql({
                code: 0,
                state: 'hidden',
                percentage: 0,
                hidden: true,
                visible: false,
                fullyvisible: false,
                previous: {
                    code: 0,
                    state: 'hidden',
                    percentage: 0,
                    hidden: true,
                    visible: false,
                    fullyvisible: false
                }
            });

            vismon.update();

            expect(vismon.state() === cachedState).to.be.eql(true);

            vismon.stop();
        });

        it('start/stop without a strategy', () => {
            var config = {
                strategy: [],
                update: () => {
                }
            };

            sinon.spy(config, 'update');

            var vismon = visobj.monitor(config);

            expect(vismon.state()).to.be.eql({});
            expect(config.update.callCount).to.be.eql(0);

            vismon.start();

            var firstState = vismon.state();
            expect(firstState).to.be.ok;
            expect(firstState.previous).to.be.eql({});
            expect(config.update.callCount).to.be.eql(1);

            vismon.update();

            var secondState = vismon.state();
            expect(secondState).to.be.ok;
            expect(secondState.hidden).to.be.ok;
            expect(secondState.previous).not.to.be.eql({});
            expect(config.update.callCount).to.be.eql(2);

            vismon.stop();

            expect(config.update.callCount).to.be.eql(2);
        });

        it('should return unregister function when registering a listener', () => {
            var vismon = visobj.monitor();

            var unregister = vismon.on('some-event', VisSense.Utils.noop);

            expect(unregister).to.be.ok;
            expect(unregister()).to.be.eql(true);
        });


        describe('Builder', () => {
            it('should build a VisMon object', () => {
                var vismon = null;

                VisSense.VisMon.Builder(visobj)
                    .set('async', false)
                    .strategy(new VisSense.VisMon.Strategy.PollingStrategy({interval: 1000}))
                    .strategy(new VisSense.VisMon.Strategy.EventStrategy({debounce: 30}))
                    .on('percentagechange', (monitor, newValue) => {
                        console.log(newValue + '%');
                    })
                    .build(monitorByBuilder => {
                        vismon = monitorByBuilder;
                    });

                expect(vismon).to.be.ok;
            });

            it('should build a VisMon object without strategies', () => {
                var vismon = VisSense.VisMon.Builder(visobj)
                    .set('strategy', false)
                    .build();

                expect(vismon).to.be.ok;
            });
        });

        describe('Events', () => {

            beforeEach(() => {
                fixture.set(
                    '<div id="element" style="position: absolute; height: 10px; width: 10px; display: none;"></div>'
                );
                element = document.getElementById('element');
                visobj = new VisSense(element);
            });

            it('should be possible to unregister a listener when it is fired', () => {
                var config = {
                    strategy: [],
                    update: () => {
                    }
                };
                sinon.spy(config, 'update');
                /*.and.callThrough();*/

                var cancelOnVisibleEvent = VisSense.Utils.noop;

                var observer = {
                    onVisible: () => {
                        cancelOnVisibleEvent();
                    }
                };
                sinon.spy(observer, 'onVisible');
                /*.and.callThrough();*/


                var monitor = visobj.monitor(config);

                cancelOnVisibleEvent = monitor.on('visible', observer.onVisible);

                monitor.start();

                expect(config.update.callCount).to.be.eql(1);
                expect(observer.onVisible.callCount).to.be.eql(0);

                element.style.display = 'block'; // set visible

                monitor.update();

                expect(config.update.callCount).to.be.eql(2);
                expect(observer.onVisible.callCount).to.be.eql(1); // <- unregistered here

                element.style.display = 'none'; // set hidden

                monitor.update();

                expect(config.update.callCount).to.be.eql(3);
                expect(observer.onVisible.callCount).to.be.eql(1);

                element.style.display = 'block'; // set visible again

                monitor.update();

                expect(config.update.callCount).to.be.eql(4);
                expect(observer.onVisible.callCount).to.be.eql(1);

                monitor.stop();
            });

            it('should verify that fullyvisible is fired after visible', () => {
                var model = {state: '?'};
                var config = {
                    strategy: [],
                    visible: () => {
                        model.state = 'visible';
                    },
                    fullyvisible: () => {
                        model.state = 'fullyvisible';
                    },
                    hidden: () => {
                        model.state = 'hidden';
                    },
                    update: () => {
                    }
                };

                sinon.spy(config, 'visible');
                /*.and.callThrough();*/
                sinon.spy(config, 'fullyvisible');
                /*.and.callThrough();*/
                sinon.spy(config, 'update');
                /*.and.callThrough();*/
                sinon.spy(config, 'hidden');
                /*.and.callThrough();*/

                var vismon = visobj.monitor(config).start();

                expect(config.update.callCount).to.be.eql(1);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(0);
                expect(config.fullyvisible.callCount).to.be.eql(0);

                expect(model.state).to.be.eql('hidden');

                element.style.display = 'block'; // set visible

                vismon.update();

                expect(config.update.callCount).to.be.eql(2);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.fullyvisible.callCount).to.be.eql(1);

                expect(model.state).to.be.eql('fullyvisible');

                vismon.stop();
            });


            it('should verify that provided listeners can stop the monitor immediately', () => {
                element.style.display = 'block'; // set visible

                var config = {
                    visible: monitor => monitor.stop(),
                    start: () => {
                    },
                    stop: () => {
                    }
                };

                sinon.spy(config, 'start');
                /*.and.callThrough();*/
                sinon.spy(config, 'visible');
                /*.and.callThrough();*/
                sinon.spy(config, 'stop');
                /*.and.callThrough();*/

                var vismon = visobj.monitor(config).start();

                expect(vismon._started).to.be.eql(false);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(1);

                clock.tick(10000);

                element.style.display = 'none'; // set hidden

                clock.tick(10000);

                element.style.display = 'block'; // set hidden

                clock.tick(10000);

                expect(vismon._started).to.be.eql(false);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(1);
            });

            it('should verify event chain initially hidden -> visible -> fullyvisible -> visible -> hidden', () => {
                var model = {state: '?'};
                var config = {
                    start: () => {
                    },
                    stop: () => {
                    },
                    update: () => {
                    },
                    visible: () => {
                    },
                    fullyvisible: () => {
                    },
                    hidden: () => {
                    },
                    visibilitychange: monitor => model.state = monitor.state().state,
                    percentagechange: () => {
                    }
                };

                sinon.spy(config, 'start');
                /*.and.callThrough();*/
                sinon.spy(config, 'stop');
                /*.and.callThrough();*/
                sinon.spy(config, 'update');
                /*.and.callThrough();*/
                sinon.spy(config, 'hidden');
                /*.and.callThrough();*/
                sinon.spy(config, 'visible');
                /*.and.callThrough();*/
                sinon.spy(config, 'fullyvisible');
                /*.and.callThrough();*/
                sinon.spy(config, 'visibilitychange');
                /*.and.callThrough();*/
                sinon.spy(config, 'percentagechange');
                /*.and.callThrough();*/

                var vismon = visobj.monitor({
                    strategy: new VisSense.VisMon.Strategy.PollingStrategy({interval: 100})
                });

                vismon.on('start', config.start);
                vismon.on('stop', config.stop);
                vismon.on('update', config.update);
                vismon.on('hidden', config.hidden);
                vismon.on('visible', config.visible);
                vismon.on('fullyvisible', config.fullyvisible);
                vismon.on('visibilitychange', config.visibilitychange);
                vismon.on('percentagechange', config.percentagechange);

                expect(config.start.callCount).to.be.eql(0);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(0);
                expect(config.hidden.callCount).to.be.eql(0);
                expect(config.visible.callCount).to.be.eql(0);
                expect(config.fullyvisible.callCount).to.be.eql(0);
                expect(config.visibilitychange.callCount).to.be.eql(0);
                expect(config.percentagechange.callCount).to.be.eql(0);

                expect(model.state).to.be.eql('?');

                vismon.start();

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(1);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(0);
                expect(config.fullyvisible.callCount).to.be.eql(0);
                expect(config.visibilitychange.callCount).to.be.eql(1);
                expect(config.percentagechange.callCount).to.be.eql(1);

                expect(model.state).to.be.eql('hidden');

                clock.tick(100);

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(2);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(0);
                expect(config.fullyvisible.callCount).to.be.eql(0);
                expect(config.visibilitychange.callCount).to.be.eql(1);
                expect(config.percentagechange.callCount).to.be.eql(1);

                expect(model.state).to.be.eql('hidden');

                clock.tick(100);

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(3);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(0);
                expect(config.fullyvisible.callCount).to.be.eql(0);
                expect(config.visibilitychange.callCount).to.be.eql(1);
                expect(config.percentagechange.callCount).to.be.eql(1);

                expect(model.state).to.be.eql('hidden');

                element.style.display = 'block'; // set visible

                clock.tick(100);

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(4);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.fullyvisible.callCount).to.be.eql(1);
                expect(config.visibilitychange.callCount).to.be.eql(2);
                expect(config.percentagechange.callCount).to.be.eql(2);

                expect(model.state).to.be.eql('fullyvisible');

                element.style.left = '-5px'; // 50% visible

                clock.tick(100);

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(5);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.fullyvisible.callCount).to.be.eql(1);
                expect(config.visibilitychange.callCount).to.be.eql(3);
                expect(config.percentagechange.callCount).to.be.eql(3);

                expect(model.state).to.be.eql('visible');

                element.style.left = '-9px'; // 10% visible

                clock.tick(100);

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(6);
                expect(config.hidden.callCount).to.be.eql(1);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.fullyvisible.callCount).to.be.eql(1);
                expect(config.visibilitychange.callCount).to.be.eql(3);
                expect(config.percentagechange.callCount).to.be.eql(4);

                expect(model.state).to.be.eql('visible');

                element.style.left = '-10px'; // 0% visible

                clock.tick(100);

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(0);
                expect(config.update.callCount).to.be.eql(7);
                expect(config.hidden.callCount).to.be.eql(2);
                expect(config.visible.callCount).to.be.eql(1);
                expect(config.fullyvisible.callCount).to.be.eql(1);
                expect(config.visibilitychange.callCount).to.be.eql(4);
                expect(config.percentagechange.callCount).to.be.eql(5);

                expect(model.state).to.be.eql('hidden');

                vismon.stop();

                expect(config.start.callCount).to.be.eql(1);
                expect(config.stop.callCount).to.be.eql(1);

            });


            it('should be possible to publish custom events', () => {
                var consumer = {
                    onEvent: () => {
                    }
                };

                sinon.spy(consumer, 'onEvent');
                /*.and.callThrough();*/

                var config = {
                    strategy: []
                };

                var monitor = visobj.monitor(config);

                monitor.on('myEvent', consumer.onEvent);

                expect(consumer.onEvent.callCount).to.be.eql(0);

                monitor.publish('myEvent', []);

                expect(consumer.onEvent.callCount).to.be.eql(1);

                monitor.stop();
            });

            it('should throw an error if an internal event is published', () => {
                var consumer = {
                    onInternalEvent: () => {
                    }
                };

                sinon.spy(consumer, 'onInternalEvent');
                /*.and.callThrough();*/

                var monitor = visobj.monitor({
                    strategy: []
                });

                monitor.on('visible', consumer.onInternalEvent);

                expect(consumer.onInternalEvent.callCount).to.be.eql(0);

                var expectedError = 'Cannot publish internal event "visible" from external scope.';
                expect(() => {
                    monitor.publish('visible', []);
                }).to.throw(expectedError);

                expect(consumer.onInternalEvent.callCount).to.be.eql(0);
            });

            it('should be able to publish events asynchronously', () => {
                var consumer = {
                    onEvent: () => {
                    }
                };

                sinon.spy(consumer, 'onEvent');
                /*.and.callThrough();*/

                var monitor = new VisSense(element).monitor({
                    strategy: [],
                    async: true
                });

                monitor.on('myEvent', consumer.onEvent);

                expect(consumer.onEvent.callCount).to.be.eql(0);

                monitor.publish('myEvent', []);

                expect(consumer.onEvent.callCount).to.be.eql(0);

                clock.tick(1);

                expect(consumer.onEvent.callCount).to.be.eql(1);

            });

            it('should be able to cancel asynchronously published events', () => {
                var consumer = {
                    onEvent: () => {
                    }
                };

                sinon.spy(consumer, 'onEvent');
                /*.and.callThrough();*/

                var monitor = new VisSense(element).monitor({
                    strategy: [],
                    async: true
                });

                monitor.on('myEvent', consumer.onEvent);

                expect(consumer.onEvent.callCount).to.be.eql(0);

                var cancel = monitor.publish('myEvent', []);

                expect(consumer.onEvent.callCount).to.be.eql(0);

                cancel();

                clock.tick(1000);

                expect(consumer.onEvent.callCount).to.be.eql(0);

            });
        });
    });
});
