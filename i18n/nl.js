/**
 * RightJS UI Internationalization: Dutch module
 *
 * Copyright (C) Douwe Maan
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:           'Klaar',
    Now:            'Nu',
    NextMonth:      'Volgende maand',
    PrevMonth:      'Vorige maand',
    NextYear:       'Volgend jaar',
    PrevYear:       'Vorig jaar',

    dayNames:        $w('Zondag Maandag Dinsdag Woensdag Donderdag Vrijdag Zaterdag'),
    dayNamesShort:   $w('Zo Ma Di Wo Do Vr Za'),
    dayNamesMin:     $w('Zo Ma Di Wo Do Vr Za'),
    monthNames:      $w('Januari Februari Maart April Mei Juni Juli Augustus September Oktober November December'),
    monthNamesShort: $w('Jan Feb Maa Apr Mei Juni Juli Aug Sept Okt Nov Dec')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Sluiten',
    Prev:  'Vorige afbeelding',
    Next:  'Volgende afbeelding'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Opslaan",
    Cancel: "Annuleren"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Klaar'
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
