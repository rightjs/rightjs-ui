/**
 * RightJS UI Internationalization: Dutch module
 *
 * Copyright (C) Douwe Maan, Jeffrey Gelens <jeffrey@noppo.pro>
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
    Close:    'Sluiten',
    Cancel:   'Annuleren',
    Help:     'Help',
    Expand:   'Uitklappen',
    Collapse: 'Inklappen',

    Alert:    'Let op!',
    Confirm:  'Bevestigen',
    Prompt:   'Enter'
  },

  Rte: {
    Clear:       'Clear',
    Save:        'Bewaar',
    Source:      'Bron',
    Bold:        'Vetgedrukt',
    Italic:      'Schuingedrukt',
    Underline:   'Onderstreept',
    Strike:      'Doorhalen',
    Ttext:       'Typetekst',
    Header:      'Kop',
    Cut:         'Knippen',
    Copy:        'Kopieren',
    Paste:       'Plakken',
    Left:        'Links uitlijnen',
    Center:      'Centreren',
    Right:       'Rechts uitlijnen',
    Justify:     'Uitlijnen',
    Undo:        'Ongedaan maken',
    Redo:        'Opnieuw',
    Code:        'Code block',
    Quote:       'Blokcitaat',
    Link:        'Link toevoegen',
    Image:       'Plaatje toevoegen',
    Video:       'Video toevoegen',
    Dotlist:     'Lijst met punten',
    Numlist:     'Genummerde lijst',
    Indent:      'Inspringen',
    Outdent:     'Uitspringen',
    Forecolor:   'Tekstkleur',
    Backcolor:   'Achtergrond kleur',
    Select:      'Selecteren',
    Remove:      'Verwijderen',
    Format:      'Formaat',
    Fontname:    'Lettertype',
    Fontsize:    'Lettergrootte',
    Subscript:   'Subscript',
    Superscript: 'Superscript',
    UrlAddress:  'URL'
  }

}, function(module, i18n) {
  if (self[module]) {
    RightJS.$ext(self[module].i18n, i18n);
  }
});
