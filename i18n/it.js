/**
 * RightJS UI Internationalization: Italian module
 *
 * Copyright (C) Nikolay Nemshilov
 */
RightJS.Object.each({

  Calendar: {
    Done:           'Fatto',
    Now:            'Oggi',
    NextMonth:      'Mese successivo',
    PrevMonth:      'Mese precedente',
    NextYear:       'Anno seguente',
    PrevYear:       'Anno precedente',

    dayNames:        'Domenica Lunedi Martedi Mercoledi Giovedi Venerdi Sabato'.split(' '),
    dayNamesShort:   'Dom Lun Mar Mer Gio Ven Sab'.split(' '),
    dayNamesMin:     'Do Lu Ma Me Gi Ve Sa'.split(' '),
    monthNames:      'Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre'.split(' '),
    monthNamesShort: 'Gen Feb Mar Apr Mag Giu Lug Ago Set Ott Nov Dic'.split(' ')
  },

  Lightbox: {
    Close: 'Chiudi',
    Prev:  'Immagine precedente',
    Next:  'Immagine seguente'
  },

  InEdit: {
    Save:   "Salva",
    Cancel: "Abbandona"
  },

  Colorpicker: {
    Done: 'Fatto'
  },

  Dialog: {
    Ok:       'Ok',
    Close:    'Close',
    Cancel:   'Cancel',
    Help:     'Help',
    Expand:   'Expand',
    Collapse: 'Collapse',

    Alert:    'Warning!',
    Confirm:  'Confirm',
    Prompt:   'Enter'
  }

}, function(module, i18n) {
  if (self[module]) {
    RightJS.$ext(self[module].i18n, i18n);
  }
});