/**
 * RightJS UI Internationalization: Dutch module
 *
 * Copyright (C) Douwe Maan
 */
RightJS.Object.each({

  Calendar: {
    Done:           'Klaar',
    Now:            'Nu',
    NextMonth:      'Volgende maand',
    PrevMonth:      'Vorige maand',
    NextYear:       'Volgend jaar',
    PrevYear:       'Vorig jaar',

    dayNames:        'Zondag Maandag Dinsdag Woensdag Donderdag Vrijdag Zaterdag'.split(' '),
    dayNamesShort:   'Zo Ma Di Wo Do Vr Za'.split(' '),
    dayNamesMin:     'Zo Ma Di Wo Do Vr Za'.split(' '),
    monthNames:      'Januari Februari Maart April Mei Juni Juli Augustus September Oktober November December'.split(' '),
    monthNamesShort: 'Jan Feb Maa Apr Mei Juni Juli Aug Sept Okt Nov Dec'.split(' ')
  },

  Lightbox: {
    Close: 'Sluiten',
    Prev:  'Vorige afbeelding',
    Next:  'Volgende afbeelding'
  },

  InEdit: {
    Save:   "Opslaan",
    Cancel: "Annuleren"
  },

  Colorpicker: {
    Done: 'Klaar'
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