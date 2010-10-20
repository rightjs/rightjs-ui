/**
 * RightJS UI Internationalization: Italian module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Fatto',
    Now:            'Oggi',
    NextMonth:      'Mese successivo',
    PrevMonth:      'Mese precedente',
    NextYear:       'Anno seguente',
    PrevYear:       'Anno precedente',

    dayNames:        $w('Domenica Lunedi Martedi Mercoledi Giovedi Venerdi Sabato'),
    dayNamesShort:   $w('Dom Lun Mar Mer Gio Ven Sab'),
    dayNamesMin:     $w('Do Lu Ma Me Gi Ve Sa'),
    monthNames:      $w('Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre'),
    monthNamesShort: $w('Gen Feb Mar Apr Mag Giu Lug Ago Set Ott Nov Dic')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Chiudi',
    Prev:  'Immagine precedente',
    Next:  'Immagine seguente'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Salva",
    Cancel: "Abbandona"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Fatto'
  });
}

if (self.Dialog) {
  $ext(Dialog.i18n, {
    Ok:       'Ok',
    Close:    'Close',
    Cancel:   'Cancel',
    Help:     'Help',
    Expand:   'Expand',
    Collapse: 'Collapse',

    Alert:    'Warning!',
    Confirm:  'Confirm',
    Prompt:   'Enter'
  })
}

