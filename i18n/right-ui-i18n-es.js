/**
 * RightJS UI Internationalization: Spanish module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Hecho',
    Now:            'Ahora',
    Next:           'Mes siguiente',
    Prev:           'Mes precedente',
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
    CloseTitle: 'Cerrar',
    PrevTitle:  'Imagen precedente',
    NextTitle:  'Imagen siguiente'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    save:   "Guardar",
    cancel: "Borrar"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Hecho'
  });
}
