/**
 * RightJS UI Internationalization: Spanish module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Hecho',
    Now:            'Ahora',
    NextMonth:      'Mes siguiente',
    PrevMonth:      'Mes precedente',
    NextYear:       'Año siguiente',
    PrevYear:       'Año precedente',

    dayNames:        $w('Domingo Lunes Martes Miércoles Jueves Viernes Sábado'),
    dayNamesShort:   $w('Dom Lun Mar Mié Jue Vie Sab'),
    dayNamesMin:     $w('Do Lu Ma Mi Ju Vi Sa'),
    monthNames:      $w('Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre'),
    monthNamesShort: $w('Ene Feb Mar Abr May Jun Jul Ago Sep Oct Nov Dic')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Cerrar',
    Prev:  'Imagen precedente',
    Next:  'Imagen siguiente'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Guardar",
    Cancel: "Borrar"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Hecho'
  });
}

if (self.Dialog) {
  $ext(Dialog.i18n, {
    Ok:       'Ok',
    Close:    'Cerrar',
    Cancel:   'Cancelar',
    Help:     'Ayuda',
    Expand:   'Expandir',
    Collapse: 'Plegar',

    Alert:    'Aviso!',
    Confirm:  'Confirmar',
    Prompt:   'Entrar'
  })
}

