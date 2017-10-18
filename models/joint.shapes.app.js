(function(joint) {
    
        'use strict';

        joint.shapes.html = {};
        joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
            defaults: joint.util.deepSupplement({
                type: 'html.Element',
                attrs: {
                    rect: { stroke: 'none', 'fill-opacity': 0 }
                }
            }, joint.shapes.basic.Rect.prototype.defaults)
        });

        // Create a custom view for that element that displays an HTML div above it.
        // -------------------------------------------------------------------------


        joint.shapes.html.ElementView = joint.dia.ElementView.extend({

            template: [
                '<div class="html-element">',
                '<div class="html-element-wrapper">',
                '<div class="dropdown">',
                '<button class="html-element-options-btn dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-option-vertical"></span></button>',
                '<ul class="dropdown-menu">',
                '<li><button class="btn-nostyle" role="button">btn</button></li>',
                '<li><button class="btn-nostyle" role="button">btn</button></li>',
                '<li><button class="btn-nostyle" role="button">btn</button></li>',
                '</ul>',
                '</div>',
                '<input pattern="[a-z]+" type="text" value="Head" />',
                '<div contenteditable="true" class="html-rect-props"></div>',
                '</div>',
                '</div>'
            ].join(''),

            initialize: function () {
                function getContentFromContentEditableDiv(html) {
                    return html
                        .replace(/<\/(div|p|br|)>/gi, '\n')
                        .replace(/<(div|p|br)[^<]*?>/gi, '\n')
                        .replace(/<([(i|a|b|u)^>]+)>(.*?)<\/\1>/gim,
                        function (v) { return '' + escape(v) + ''; })
                        .replace(/\n\s*\n/gim, '\n')
                        .trim();
                }


                _.bindAll(this, 'updateBox');
                joint.dia.ElementView.prototype.initialize.apply(this, arguments);

                this.$box = $(_.template(this.template)());
                // Prevent paper from handling pointerdown.
                this.$box.find('input,select').on('mousedown click', function (evt) {
                    evt.stopPropagation();
                });
                // This is an example of reacting on the input change and storing the input data in the cell model.
                this.$box.find('input').on('input', _.bind(function (evt) {
                    this.model.set('input', $(evt.target).val().replace(/[^a-z]/gmi, ''));
                    $(evt.target).val(this.model.get('input'));
                    console.log($(evt.target).val());
                }, this));

                // The rect propshtml content is based on html. To get the props, convert propshtml to text
                this.model.set('props', getContentFromContentEditableDiv(this.model.get('propshtml')));
                this.$box.find('.html-rect-props').on('keyup', _.bind(function (evt) {
                    var html = $(evt.target).html();
                    this.model.set('propshtml', html);
                    var content = getContentFromContentEditableDiv(html);
                    this.model.set('props', content);

                    console.log(content);
                }, this));

                this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
                // Update the box position whenever the underlying model changes.
                this.model.on('change', this.updateBox, this);
                // Remove the box when the model gets removed from the graph.
                this.model.on('remove', this.removeBox, this);

                this.updateBox();
            },
            render: function () {
                joint.dia.ElementView.prototype.render.apply(this, arguments);
                this.paper.$el.prepend(this.$box);
                this.updateBox();
                return this;
            },
            updateBox: function () {
                // Set the position and dimension of the box so that it covers the JointJS element.
                var bbox = this.model.getBBox();
                // Example of updating the HTML with a data stored in the cell model.
                this.$box.find('input').val(this.model.get('input'));
                if (this.$box.find('.html-rect-props').html() !== this.model.get('propshtml'))
                    this.$box.find('.html-rect-props').html(this.model.get('propshtml'))
                this.$box.css({
                    width: bbox.width,
                    height: bbox.height,
                    left: bbox.x,
                    top: bbox.y,
                    transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
                });
            },
            removeBox: function (evt) {
                this.$box.remove();
            }
        });
    
        joint.shapes.app = joint.shapes.app || {};
    
        joint.shapes.app.CircularModel = joint.shapes.devs.Model.extend({
    
            defaults: _.defaultsDeep({
                type: 'app.CircularModel',
                ports: {
                    groups: {
                        'in': {
                            markup: '<circle class="port-body" r="10"/>',
                            attrs: {
                                '.port-body': {
                                    fill: '#61549C',
                                    'stroke-width': 0
                                },
                                '.port-label': {
                                    'font-size': 11,
                                    fill: '#61549C',
                                    'font-weight': 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 0,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        },
                        'out': {
                            markup: '<circle class="port-body" r="10"/>',
                            attrs: {
                                '.port-body': {
                                    fill: '#61549C',
                                    'stroke-width': 0
                                },
                                '.port-label': {
                                    'font-size': 11,
                                    fill: '#61549C',
                                    'font-weight': 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 180,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        }
                    }
                }
    
            }, joint.shapes.devs.Model.prototype.defaults)
        });
    
        joint.shapes.app.RectangularModel = joint.shapes.devs.Model.extend({
    
            defaults: _.defaultsDeep({
                type: 'app.RectangularModel',
                ports: {
                    groups: {
                        'in': {
                            markup: '<circle class="port-body" r="10"/>',
                            attrs: {
                                '.port-body': {
                                    fill: '#61549C',
                                    'stroke-width': 0
                                },
                                '.port-label': {
                                    'font-size': 11,
                                    fill: '#61549C',
                                    'font-weight': 800
                                }
                            },
                            label: {
                                position: {
                                    name: 'left',
                                    args: {
                                        y: 0
                                    }
                                }
                            }
                        },
                        'out': {
                            markup: '<circle class="port-body" r="10"/>',
                            attrs: {
                                '.port-body': {
                                    fill: '#61549C',
                                    'stroke-width': 0
                                },
                                '.port-label': {
                                    'font-size': 11,
                                    fill: '#61549C',
                                    'font-weight': 800
                                }
                            },
                            label: {
                                position: {
                                    name: 'right',
                                    args: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    }
                }
            }, joint.shapes.devs.Model.prototype.defaults)
        });
    
        joint.shapes.app.Link = joint.dia.Link.extend({
    
            defaults: _.defaultsDeep({
                type: 'app.Link',
                router: {
                    name: 'normal'
                },
                connector: {
                    name: 'normal'
                },
                attrs: {
                    '.tool-options': {
                        'data-tooltip-class-name': 'small',
                        'data-tooltip': 'Click to open Inspector for this link',
                        'data-tooltip-position': 'left'
                    },
                    '.marker-source': {
                        d: 'M 10 0 L 0 5 L 10 10 z',
                        stroke: 'transparent',
                        fill: '#222138',
                        transform: 'scale(0.001)'
                    },
                    '.marker-target': {
                        d: 'M 10 0 L 0 5 L 10 10 z',
                        stroke: 'transparent',
                        fill: '#222138',
                        transform: 'scale(1)'
                    },
                    '.connection': {
                        stroke: '#222138',
                        'stroke-dasharray': '0',
                        'stroke-width': 1
                    }
                }
            }, joint.dia.Link.prototype.defaults)
        });
    
    })(joint);