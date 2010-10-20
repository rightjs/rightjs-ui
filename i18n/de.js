/**
 * RightJS UI Internationalization: German module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Erledigt',
    Now:            'Jetzt',
    NextMonth:      'Nächster Monat',
    PrevMonth:      'Vorhergehender Monat',
    NextYear:       'Nächstes Jahr',
    PrevYear:       'Vorhergehendes Jahr',

    dayNames:        $w('Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag'),
    dayNamesShort:   $w('So Mo Di Mi Do Fr Sa'),
    dayNamesMin:     $w('So Mo Di Mi Do Fr Sa'),
    monthNames:      $w('Januar Februar März April Mai Juni Juli August September Oktober November Dezember'),
    monthNamesShort: $w('Jan Feb Mär Apr Mai Jun Jul Aug Sep Okt Nov Dez')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Schliessen',
    Prev:  'Vorhergehendes Bild',
    Next:  'Nächstes Bild'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Speichern",
    Cancel: "Abbruch"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Erledigt'
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

