/**
 * RightJS UI Internationalization: French module
 *
 * Copyright (C) Nikolay Nemshilov
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            "Fait",
    Now:             "Maint.",
    Next:            "Mois prochain",
    Prev:            "Mois précédent",
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
    CloseTitle: 'Fermer',
    PrevTitle:  'Image précédente',
    NextTitle:  'Image suivante'
  });
}

if (self.InEdit) {
  $ext(InEdit.i18n, {
    save:   "Enregistrer",
    cancel: "Annuler"
  });
}

if (self.Colorpicker) {
  $ext(Colorpicker.i18n, {
    Done: 'Fait'
  });
}
