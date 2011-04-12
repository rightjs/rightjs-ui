/**
 * RightJS UI Internationalization: German module
 *
 * Copyright (C) Nikolay Nemshilov
 */
RightJS.Object.each({

  Calendar: {
    Done:           'Erledigt',
    Now:            'Jetzt',
    NextMonth:      'Nächster Monat',
    PrevMonth:      'Vorhergehender Monat',
    NextYear:       'Nächstes Jahr',
    PrevYear:       'Vorhergehendes Jahr',

    dayNames:        'Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag'.split(' '),
    dayNamesShort:   'So Mo Di Mi Do Fr Sa'.split(' '),
    dayNamesMin:     'So Mo Di Mi Do Fr Sa'.split(' '),
    monthNames:      'Januar Februar März April Mai Juni Juli August September Oktober November Dezember'.split(' '),
    monthNamesShort: 'Jan Feb Mär Apr Mai Jun Jul Aug Sep Okt Nov Dez'.split(' ')
  },

  Lightbox: {
    Close: 'Schliessen',
    Prev:  'Vorhergehendes Bild',
    Next:  'Nächstes Bild'
  },

  InEdit: {
    Save:   "Speichern",
    Cancel: "Abbruch"
  },

  Colorpicker: {
    Done: 'Erledigt'
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