/**
 * RightJS UI Internationalization: German module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Erledigt',
    Now:            'Jetzt',
    Next:           'Nächster Monat',
    Prev:           'Vorhergehender Monat',
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
    CloseTitle: 'Schliessen',
    PrevTitle:  'Vorhergehendes Bild',
    NextTitle:  'Nächstes Bild'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    save:   "Speichern",
    cancel: "Abbruch"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Erledigt'
  });
}
