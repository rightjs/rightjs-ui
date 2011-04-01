/**
 * The drag-n-drop module patch so it was possible
 * to use dnd and resizable at the same time
 *
 * NOTE: to make it work, the DND module should be
 *       included _before_ the resizable widget!
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
if ('Draggable' in RightJS) {
  RightJS.Draggable.include({
    /**
     * Overloading the method so that it didn't trigger
     * the drag process if the click is happened on
     * a resizable unit handle
     *
     * @return void
     */
    dragStart: function(event) {
      if (!event.target.hasClass('rui-resizable-handle')) {
        this.$super(event);
      }
    }
  });
}