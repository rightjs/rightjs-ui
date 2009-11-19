/**
 * RightJS UI Internationalization: French module
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
if (self.Calendar) {
  $ext(Calendar.i18n, {
    Done:            "Fait",
    Now:             "Maintenant",
    Next:            "Mois prochain",
    Prev:            "Mois précédent",
    NextYear:        "L'année prochain",
    PrevYear:        "L'année précédent",

    dayNames:        $w('Dimanche Lundi Mardi Mercredi Jeudi Vendredi Samedi'),
    dayNamesShort:   $w('Dim Lun Mar Mer Jeu Ven Sam'),
    dayNamesMin:     $w('Di Lu Ma Me Je Ve Sa'),
    monthNames:      $w('Janvier Février Mars Avril Mai Juin Juillet Août Septembre Octobre Novembre Décembre'),
    monthNamesShort: $w('Jan Fév Mar Avr Mai Juin Juil Août Sept Oct Nov Déc')
  });
}

if (self.Lightbox) {
  $ext(Lightbox.i18n, {
    CloseTitle: 'Fin',
    PrevTitle:  'Image précédente',
    NextTitle:  'Prochaine image'
  });
}
