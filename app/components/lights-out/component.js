// Ember-related packages
import Component from '@ember/component';
import { computed } from '@ember/object';
import ResponsiveMixin from 'lights-out/mixins/responsive';

// D3-related packages
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';

export default Component.extend(ResponsiveMixin, {
    /*************************************************************************************

        Initialize the component

    *************************************************************************************/
    init() {
        this._super(...arguments);

        // Set game properties
        this.set('numButtons', {x: 5, y: 5});
        this.set('numMoves', 0);

        // Create an array of buttons
        //
        //        j  ->                                        (x)
        //     --------------------------------------------------------
        //  i  |          |          |          |          |          |
        //     |  (0, 0)  |  (0, 1)  |  (0, 2)  |  (0, 3)  |  (0, 4)  |
        //  |  |          |          |          |          |          |
        //  V  --------------------------------------------------------
        //     |          |          |          |          |          |
        //     |  (1, 0)  |  (1, 1)  |  (1, 2)  |  (1, 3)  |  (1, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //     |          |          |          |          |          |
        //     |  (2, 0)  |  (2, 1)  |  (2, 2)  |  (2, 3)  |  (2, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //     |          |          |          |          |          |
        //     |  (3, 0)  |  (3, 1)  |  (3, 2)  |  (3, 3)  |  (3, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //     |          |          |          |          |          |
        // (y) |  (4, 0)  |  (4, 1)  |  (4, 2)  |  (4, 3)  |  (4, 4)  |
        //     |          |          |          |          |          |
        //     --------------------------------------------------------
        //
        let buttons = [];

        for (let i = 0; i < this.get('numButtons.y'); i++) {
            let rowOfButtons = [];

            for (let j = 0; j < this.get('numButtons.x'); j++) {
                rowOfButtons.push({
                    coordinates: {x: j, y: i},
                    isLightOn: false
                });
            }

            buttons.push(rowOfButtons);
        }

        this.set('buttons', buttons);
    },

    didInsertElement() {
        this.drawGame();

        this._super(...arguments);
    },

    // Place points from left to right in the physical space
    scaleX: computed('numButtons.x', 'width', function() {
        return scaleLinear()
            .domain([0, this.get('numButtons.x')])
            .range([0, this.get('width')]);
    }),

    // Place points from top to bottom in the physical space
    scaleY: computed('numButtons.y', 'height', function() {
        return scaleLinear()
            .domain([0, this.get('numButtons.y')])
            .range([0, this.get('height')]);
    }),


    /*************************************************************************************

        Draw the game

    *************************************************************************************/
    drawGame() {
        this.createContainer();
        this.createGradients();
        this.createButtons();
    },

    createContainer() {
        // Clear the DOM
        this.$(this.get('elementIdentifier'))[0].innerHTML = '';

        // Get visual properties
        const containerWidth  = this.get('containerWidth');
        const containerHeight = this.get('containerHeight');
        const margin          = this.get('margin');

        // Create an SVG container
        let lightsOutContainer = select(this.get('elementIdentifier'))
            .append('svg')
            .attr('class', 'container')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
            .attr('preserveAspectRatio', 'xMidYMin');

        this.set('lightsOutContainer', lightsOutContainer);

        // Create a board inside the container
        let lightsOutBoard = lightsOutContainer
            .append('g')
            .attr('class', 'board')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        this.set('lightsOutBoard', lightsOutBoard);
    },

    createGradients() {
        // Create light-off effect
        let linearGradient = this.get('lightsOutBoard')
            .append('defs')
            .append('linearGradient')
            .attr('id', 'linear-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        linearGradient.append('stop')
            .attr('offset', '5%')
            .attr('stop-color', '#9688cc');

        linearGradient.append('stop')
            .attr('offset', '90%')
            .attr('stop-color', '#806fbc');

        // Create light-on effect
        let radialGradient = this.get('lightsOutBoard')
            .append('defs')
            .append('radialGradient')
            .attr('id', 'radial-gradient');

        radialGradient.append('stop')
            .attr('offset', '5%')
            .attr('stop-color', '#eb71dc');

        radialGradient.append('stop')
            .attr('offset', '90%')
            .attr('stop-color', '#e64182');
    },

    createButtons() {
        // Get visual properties
        const buttonSize = this.get('buttonSize');
        const scaleX     = this.get('scaleX');
        const scaleY     = this.get('scaleY');

        // Add a buttons group inside the board
        this.get('lightsOutBoard')
            .append('g')
            .attr('class', 'buttons');

        // It's easier to work with 1D data in D3. Convert the 2D array to an 1D array.
        const buttons = this.get('buttons').reduce((accumulator, rowOfButtons) => accumulator.concat(rowOfButtons), []);

        // Create buttons inside the buttons group
        let buttonGroup = select('.buttons')
            .selectAll('rect')
            .data(buttons);

        // Draw buttons
        buttonGroup
            .enter()
            .append('rect')
            .attr('class', button => `button-id_${button.coordinates.x}_${button.coordinates.y}`)
            .attr('x', button => scaleX(button.coordinates.x))
            .attr('y', button => scaleY(button.coordinates.y))
            .attr('width', buttonSize)
            .attr('height', buttonSize)
            .attr('fill', button => button.isLightOn ? 'url(#radial-gradient)' : 'url(#linear-gradient)')
            .attr('stroke', '#cbd0d3')
            .attr('stroke-width', 0.075 * buttonSize);
    },
});