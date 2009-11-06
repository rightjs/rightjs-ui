/**
 * RightJS UI Internationalization: German module
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Getan',
    Now:            'Jetzt',
    Next:           'Nächste Monat',
    Prev:           'Vorhergehende Monat',
    NextYear:       'Nächste Jahr',
    PrevYear:       'Vorhergehende Jahr',

    dayNames:        $w('Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag'),
    dayNamesShort:   $w('Son Mon Die Mit Don Fre Sam'),
    dayNamesMin:     $w('So Mo Di Mi Do Fr Sa'),
    monthNames:      $w('Januar Februar März April Mai Juni Juli August September Oktober November Dezember'),
    monthNamesShort: $w('Jan Feb Mär Apr Mai Jun Jul Aug Sep Okt Nov Dez')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    CloseTitle: 'Abschluss',
    PrevTitle:  'Vorhergehende Abbildung',
    NextTitle:  'Folgende Abbildung'
  });
}
