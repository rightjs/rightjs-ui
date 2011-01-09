/**
 * Stripe visual effects class
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Billboard.Fx.Stripe = new Class(Billboard.Fx, {

  directions: ['down', 'up', 'left', 'right'],

  /**
   * Breaking the original element onto sripes in here
   *
   * @param {Element} old LI element
   * @param {Element} new LI element
   * @return void
   */
  prepare: function(old_item, new_item) {
    this.$super(old_item, new_item);

    var length    = this.element.options.stripes,
        width     = this.element.items()[0].size().x / length,
        delay     = 100,
        direction = this.directions.shift();

    this.directions.push(direction);
    this.container.clean();

    for (var i=0; i < length; i++) {
      var stripe = $E('div', {
        'class': 'rui-billboard-stripe',
        'style': {
          width: width + 1 + 'px',
          left:  i * width + 'px'
        }
      }).insert(old_item.clone().setStyle({
        width: width * length + 'px',
        left: - i * width  + 'px'
      }));

      this.container.append(stripe);
      var options = {
        duration: this.options.duration
      };

      if (direction !== 'right' && i === (length - 1) || (direction === 'right' && i === 0)) {
        options.onFinish = R(this.finish).bind(this, true);
      }

      switch (direction) {
        case 'up':
          R(function(stripe, options) {
            stripe.setHeight(stripe.size().y);
            stripe.morph({height: '0px'}, options);
          }).bind(this, stripe, options).delay(i * delay);
          break;

        case 'down':
          stripe.setStyle('top: auto; bottom: 0px');
          R(function(stripe, options) {
            stripe.setHeight(stripe.size().y);
            stripe.morph({height: '0px'}, options);
          }).bind(this, stripe, options).delay(i * delay);
          break;

        case 'left':
          R(function(stripe, options) {
            stripe.morph({width: '0px'}, options);
          }).bind(this, stripe, options).delay(i * delay);
          break;

        case 'right':
          R(function(stripe, options) {
            stripe.morph({width: '0px'}, options);
          }).bind(this, stripe, options).delay((length - i -1) * delay);
          break;

        default:
          this.finish(true);
      }
    }
  },


  /**
   * Stubbing the finish method so it didn't finish prematurely
   *
   * @return Fx this
   */
  finish: function(for_sure) {
    if (for_sure) {
      this.$super();
    }
    return this;
  }

});