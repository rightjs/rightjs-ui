/**
 * RightJS UI Internationalization: Hungarian module
 *
 * Copyright (C) Arnold Mészáros
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            'Kész',
    Now:             'Most',
    Next:            'Következő hónap',
    Prev:            'Előző hónap',
    NextYear:        'Következő év',
    PrevYear:        'Előző év',

    dayNames:        $w('Vasárnap Hétfő Kedd Szerda Csütörtök Péntek Szombat'),
    dayNamesShort:   $w('Va Hé Ke Sze Csü Pé Szo'),
    dayNamesMin:     $w('V H K Sz Cs P Sz'),
    monthNames:      $w('Január Február Március Április Május Június Július Augusztus Szeptember Október November December'),
    monthNamesShort: $w('Jan Feb Már Ápr Máj Jún Júl Aug Szep Okt Nov Dec')
  });
  $ext(Calendar.Options, {
    firstDay:        1,
    format:          'HU'
  });
  $ext(Calendar.Formats, {
    HU:              '%Y.%m.%d'
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    CloseTitle: 'Bezár',
    PrevTitle:  'Előző kép',
    NextTitle:  'Következő kép'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    save:   "Save",
    cancel: "Cancel"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Kész'
  });
}
