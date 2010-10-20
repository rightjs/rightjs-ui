/**
 * RightJS UI Internationalization: French module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            "Fait",
    Now:             "Maint.",
    NextMonth:       "Mois prochain",
    PrevMonth:       "Mois précédent",
    NextYear:        "L'année prochain",
    PrevYear:        "L'année précédente",

    dayNames:        $w('Dimanche Lundi Mardi Mercredi Jeudi Vendredi Samedi'),
    dayNamesShort:   $w('Dim Lun Mar Mer Jeu Ven Sam'),
    dayNamesMin:     $w('Di Lu Ma Me Je Ve Sa'),
    monthNames:      $w('Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Décembre'),
    monthNamesShort: $w('Jan Fév Mar Avr Mai Juin Juil Août Sept Oct Nov Déc')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    Close: 'Fermer',
    Prev:  'Image précédente',
    Next:  'Image suivante'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    Save:   "Enregistrer",
    Cancel: "Annuler"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Fait'
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

