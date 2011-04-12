/**
 * RightJS UI Internationalization: Finnish module
 *
 * Copyright (C) Juho Vepsäläinen
 * Source: http://www.csc.fi/sivut/kotoistus/suositukset/vahv_kalenterit_cldr1_4.htm
 */
RightJS.Object.each({

  Calendar: {
    Done:            "OK",
    Now:             "Tänään",
    NextMonth:       "Seuraava kuukausi",
    PrevMonth:       "Edellinen kuukausi",
    NextYear:        "Seuraava vuosi",
    PrevYear:        "Edellinen vuosi",

    dayNames:        'Sunnuntai Maanantai Tiistai Keskiviikko Torstai Perjantai Lauantai'.split(' '),
    dayNamesShort:   'Su Ma Ti Ke To Pe La'.split(' '),
    dayNamesMin:     'S M T K T P L'.split(' '),
    monthNames:      'Tammikuu Helmikuu Maaliskuu Huhtikuu Toukokuu Kesäkuu Heinäkuu Elokuu Syyskuu Lokakuu Marraskuu Joulukuu'.split(' '),
    monthNamesShort: 'Tammi Helmi Maalis Huhti Touko Kesä Heinä Elo Syys Loka Marras Joulu'.split(' ')
  },

  Lightbox: {
    Close: 'Sulje',
    Prev:  'Edellinen kuva',
    Next:  'Seuraava kuva'
  },

  InEdit: {
    Save:   "Tallenna",
    Cancel: "Peruuta"
  },

  Colorpicker: {
    Done: 'OK'
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