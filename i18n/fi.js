/**
 * RightJS UI Internationalization: Finnish module
 *
 * Copyright (C) Juho Vepsäläinen
 * Source: http://www.csc.fi/sivut/kotoistus/suositukset/vahv_kalenterit_cldr1_4.htm
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            "OK",
    Now:             "Tänään",
    NextMonth:       "Seuraava kuukausi",
    PrevMonth:       "Edellinen kuukausi",
    NextYear:        "Seuraava vuosi",
    PrevYear:        "Edellinen vuosi",

    dayNames:        $w('Sunnuntai Maanantai Tiistai Keskiviikko Torstai Perjantai Lauantai'),
    dayNamesShort:   $w('Su Ma Ti Ke To Pe La'),
    dayNamesMin:     $w('S M T K T P L'),
    monthNames:      $w('Tammikuu Helmikuu Maaliskuu Huhtikuu Toukokuu Kesäkuu Heinäkuu Elokuu Syyskuu Lokakuu Marraskuu Joulukuu'),
    monthNamesShort: $w('Tammi Helmi Maalis Huhti Touko Kesä Heinä Elo Syys Loka Marras Joulu')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Sulje',
    Prev:  'Edellinen kuva',
    Next:  'Seuraava kuva'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Tallenna",
    Cancel: "Peruuta"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'OK'
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

