/**
 * RightJS UI Internationalization: Spanish module
 *
 * Copyright (C) Nikolay Nemshilov
 */
RightJS.Object.each({

  Calendar: {
    Done:           'Hecho',
    Now:            'Ahora',
    NextMonth:      'Mes siguiente',
    PrevMonth:      'Mes precedente',
    NextYear:       'Año siguiente',
    PrevYear:       'Año precedente',

    dayNames:        'Domingo Lunes Martes Miércoles Jueves Viernes Sábado'.split(' '),
    dayNamesShort:   'Dom Lun Mar Mié Jue Vie Sab'.split(' '),
    dayNamesMin:     'Do Lu Ma Mi Ju Vi Sa'.split(' '),
    monthNames:      'Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'.split(' '),
    monthNamesShort: 'Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic'.split(' ')
  },

  Lightbox: {
    Close: 'Cerrar',
    Prev:  'Imagen precedente',
    Next:  'Imagen siguiente'
  },

  InEdit: {
    Save:   "Guardar",
    Cancel: "Borrar"
  },

  Colorpicker: {
    Done: 'Hecho'
  },

  Dialog: {
    Ok:       'Ok',
    Close:    'Cerrar',
    Cancel:   'Cancelar',
    Help:     'Ayuda',
    Expand:   'Expandir',
    Collapse: 'Plegar',

    Alert:    'Aviso!',
    Confirm:  'Confirmar',
    Prompt:   'Entrar'
  }

}, function(module, i18n) {
  if (self[module]) {
    RightJS.$ext(self[module].i18n, i18n);
  }
});